<script lang="ts">
  import {
    ButtonGroup, Input, InputAddon, Label,
    Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell,
  } from "flowbite-svelte";
  import "./app.css";

  import { calculateSchedule } from "./calculator.ts";

  let inputPrincipalAmount: string = $state("100000.00");
  let inputLoanTerm: string = $state("6");
  let inputMonthlyAddOn: string = $state("1.00");
  let { effectiveRate, schedule } = $derived(calculateSchedule(
    Number(inputPrincipalAmount),
    Number(inputLoanTerm),
    Number(inputMonthlyAddOn) / 100,
  ));

  let numFormat = new Intl.NumberFormat(navigator.language, { style: "currency", currency: "PHP" });
</script>

<main class="m-12 p-6 border rounded max-w-7xl bg-gray-100">
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-4">
      <div class="max-w-xs">
        <Label for="principalAmount" class="mb-1 text-md font-semibold">Principal amount</Label>
        <ButtonGroup class="w-full">
          <InputAddon>PHP</InputAddon>
          <Input type="text" id="principalAmount" class="text-right" required bind:value={inputPrincipalAmount} />
        </ButtonGroup>
      </div>

      <div class="max-w-xs">
        <Label for="loanTerm" class="mb-1 text-md font-semibold">Loan term</Label>
        <ButtonGroup class="w-full">
          <Input type="text" id="loanTerm" class="text-right" required bind:value={inputLoanTerm} />
          <InputAddon>month(s)</InputAddon>
        </ButtonGroup>
      </div>

      <div class="max-w-xs">
        <Label for="monthlyAddOn" class="mb-1 text-md font-semibold">Monthly add-on</Label>
        <ButtonGroup class="w-full">
          <Input type="text" id="monthlyAddOn" class="text-right" required bind:value={inputMonthlyAddOn} />
          <InputAddon>%</InputAddon>
        </ButtonGroup>
      </div>

      <div class="max-w-xs">
        <Label for="effectiveRate" class="mb-1 text-md font-semibold">Effective rate</Label>
        <ButtonGroup class="w-full">
          <Input type="text" id="effectiveRate" class="text-right" readonly value={effectiveRate * 100} />
          <InputAddon>%</InputAddon>
        </ButtonGroup>
      </div>
    </div>

    <Table>
      <TableHead>
        <TableHeadCell class="text-right">Month</TableHeadCell>
        <TableHeadCell class="text-right">Starting balance</TableHeadCell>
        <TableHeadCell class="text-right">Payment</TableHeadCell>
        <TableHeadCell class="text-right">Principal</TableHeadCell>
        <TableHeadCell class="text-right">Interest</TableHeadCell>
        <TableHeadCell class="text-right">Ending balance</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each schedule as s}
          <TableBodyRow>
            <TableBodyCell class="text-right">{s.month}</TableBodyCell>
            <TableBodyCell class="text-right">{numFormat.format(s.startingBalance)}</TableBodyCell>
            <TableBodyCell class="text-right">{numFormat.format(s.totalPayment)}</TableBodyCell>
            <TableBodyCell class="text-right">{numFormat.format(s.principalPayment)}</TableBodyCell>
            <TableBodyCell class="text-right">{numFormat.format(s.interestPayment)}</TableBodyCell>
            <TableBodyCell class="text-right">{numFormat.format(s.endingBalance)}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</main>
