"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  HistoryFormattedItem,
  selectGroupRowsByDate,
} from "@/store/accountHistory";
import { AppState } from "@/store/store";
import GroupTotalProfitLoss from "../GroupTotalProfitLoss";
import Switch from "../Switch";
import { POSITION_COMISSION } from "@/types";

export default function DetailedTable() {
  const groups = useSelector((state: AppState) => selectGroupRowsByDate(state));
  const groupkeys = useMemo(() => {
    return Object.keys(groups).reverse().reverse();
  }, [groups]);

  return (
    <>
      {groupkeys.map((date: string, i: number) => {
        return <DayTable date={date} items={groups[date]} key={i} />;
      })}
    </>
  );
}

const DayTable = ({
  items,
  date,
}: {
  items: Array<HistoryFormattedItem>;
  date: string;
}) => {
  const [showCommission, setShowCommission] = useState(false);
  const rows: Array<HistoryFormattedItem> = items.filter(
    (row: HistoryFormattedItem) => {
      if (row.POSITION == POSITION_COMISSION && !showCommission) {
        return false;
      }

      return true;
    }
  );
  const wins = rows.filter((row) => row.PROFIT_LOSS > 0);
  const losses = rows.filter((row) => {
    if (row.POSITION == POSITION_COMISSION) {
      return false;
    }

    return row.PROFIT_LOSS < 0;
  });
  const winsTotal = wins.length;
  const lossTotal = losses.length;

  return (
    <div className="bg-white shadow sm:rounded-lg mb-4" key={date}>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto mb-2">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Date: {date}
              </h1>
              <p className="text-base text-gray-900">
                P&L:{" "}
                <GroupTotalProfitLoss
                  rows={rows.filter((row) => {
                    if (row.POSITION == POSITION_COMISSION) {
                      return false;
                    }

                    return true;
                  })}
                />{" "}
                | W: {winsTotal} | L: {lossTotal}
              </p>
              <p className="text-base text-gray-900">
                Trades count:{" "}
                {
                  rows.filter((row) => {
                    if (row.POSITION == POSITION_COMISSION) {
                      return false;
                    }

                    return true;
                  }).length
                }
              </p>
            </div>
          </div>

          <div className="ml-auto mb-3">
            <Switch
              label="Show commission"
              value={showCommission}
              toggle={() => setShowCommission(!showCommission)}
            />
          </div>
        </div>

        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Symbol
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        P&L
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Position
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {rows.map((row: HistoryFormattedItem, i: number) => (
                      <tr
                        key={i}
                        className={`${
                          row.PROFIT_LOSS > 0 ? "bg-green-100" : ""
                        }${row.PROFIT_LOSS < 0 ? "bg-red-100" : ""}`}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {row.SYMBOL}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {row.PROFIT_LOSS}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {row.TIME.format("HH:mm:ss")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {row.POSITION}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
