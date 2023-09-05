import { HistoryFormattedItem } from "@/store/accountHistory";

interface PropType {
  rows: Array<HistoryFormattedItem>;
}

export default function GroupTotalProfitLoss({ rows }: PropType) {
  const profits = rows
    .filter((row) => row.PROFIT_LOSS > 0)
    .reduce((partialSum, a) => partialSum + a.PROFIT_LOSS, 0);
  const losses = rows
    .filter((row) => row.PROFIT_LOSS < 0)
    .reduce((partialSum, a) => partialSum + a.PROFIT_LOSS, 0);

  const total = profits - Math.abs(losses);

  return (
    <>
      {total > 0 ? "+$" + total.toFixed(2) : "-$" + Math.abs(total).toFixed(2)}
    </>
  );
}
