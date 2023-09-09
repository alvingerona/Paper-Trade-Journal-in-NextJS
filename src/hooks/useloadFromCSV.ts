"use client";

import { setRows } from "@/store/accountHistory";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import * as csvParse from "csv-parse";

type ParseItem = {
  Action: string;
  "Balance After": string;
  "Balance Before": string;
  "P&L": string;
  Time: string;
};

const useLoadFromCSV = () => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const reader = new FileReader();

      // Define what to do when the reader finishes reading
      reader.onload = function (event: any) {
        const fileContents = event.target.result; // The contents of the file

        csvParse.parse(
          fileContents,
          {
            columns: true,
          },
          (parseErr: any, records: Array<any>) => {
            if (parseErr) {
              console.error("Error parsing CSV:", parseErr);
              return;
            }

            const rows = records.map((item: ParseItem) => {
              return {
                ACTION: item.Action,
                BALANCE_AFTER: item["Balance After"],
                BALANCE_BEFORE: item["Balance Before"],
                PROFIT_LOSS: item["P&L"],
                TIME: item.Time,
              };
            });

            dispatch(setRows(rows));
          }
        );
      };

      // Start reading the file as text
      reader.readAsText(file);
    },
  });

  return {
    mutation,
  };
};

export default useLoadFromCSV;
