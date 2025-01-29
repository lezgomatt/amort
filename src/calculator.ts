const NUM_DECIMAL_PLACES = 2;

export function calculateSchedule(principal: number, numPeriods: number, addOnRate: number) {
    let totalInterest = round(principal * addOnRate * numPeriods);
    let totalPayment = principal + totalInterest;

    let paymentPerPeriod = round((principal / numPeriods) + (principal * addOnRate));
    let finalPayment = totalPayment - paymentPerPeriod * (numPeriods - 1);

    let f = (rate: number) => simulate(principal, numPeriods, paymentPerPeriod, finalPayment, totalInterest, rate);
    let range = [addOnRate / 2, addOnRate * 4] as const;

    let effectiveRate = findRoot(f, range);
    let schedule = [];

    let balance = principal;
    let interestAcc = 0;

    for (let i = 1; i <= numPeriods; i++) {
        let isLastPayment = i === numPeriods;
        let totalPayment = isLastPayment ? finalPayment : paymentPerPeriod;

        let interestPayment = isLastPayment ? round(totalInterest - interestAcc) : round(balance * effectiveRate);
        interestAcc += interestPayment;
        let principalPayment = totalPayment - interestPayment;

        schedule.push({
            month: i,
            startingBalance: balance,
            totalPayment: totalPayment,
            principalPayment: principalPayment,
            interestPayment: interestPayment,
            endingBalance: balance -= principalPayment,
        });
    }

    if (round(schedule[numPeriods - 1].endingBalance) === 0) {
        // Make sure it's positive
        schedule[numPeriods - 1].endingBalance = 0;
    }

    return { effectiveRate, schedule };
}

function simulate(principal: number, numPeriods: number, paymentPerPeriod: number, finalPayment: number, totalInterest: number, effectiveRate: number): number {
    let balance = principal;

    for (let i = 1; i <= numPeriods; i++) {
        let isLastPayment = i === numPeriods;
        let totalPayment = isLastPayment ? finalPayment : paymentPerPeriod;

        let interestPayment = round(balance * effectiveRate);
        let principalPayment = totalPayment - interestPayment;
        balance -= principalPayment;
    }

    return balance;
}

// Find the root using the bisection method
function findRoot(f: (x: number) => number, range: readonly [number, number], maxIterations = 100): number {
    let [low, high] = range;
    let guess = NaN;

    let triesLeft = maxIterations;
    while (true) {
        if (triesLeft-- <= 0) {
            return guess;
        }

        guess = (low + high) / 2;
        let y = f(guess);
        // favor positive balance, since we can just adjust the interest down for it
        if (y > 0 && (Math.abs(y) < 1e-12 || Math.abs(high - low) < 1e-16)) {
            return guess;
        } else if (y > 0) {
            high = guess;
        } else {
            low = guess;
        }
    }
}

function round(value: number): number {
    let factor = Math.pow(10, NUM_DECIMAL_PLACES);

    return Math.round(value * factor) / factor;
}
