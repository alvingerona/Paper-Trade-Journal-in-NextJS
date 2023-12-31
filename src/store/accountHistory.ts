import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import moment, { Moment } from "moment-timezone";
import { POSITION_COMISSION } from "@/types";

export interface HistoryRawItem {
  ACTION: string;
  BALANCE_AFTER: string;
  BALANCE_BEFORE: string;
  PROFIT_LOSS: string;
  TIME: string;
  // id: string; // id is generated from combination of all other fields
}

export interface HistoryFormattedItem {
  ACTION: string;
  BALANCE_AFTER: string;
  BALANCE_BEFORE: string;
  PROFIT_LOSS: number;
  TIME: Moment;
  DATE: string;
  SYMBOL: string;
  POSITION: string;
}

// Type for our state
export interface AccountHistoryState {
  rows: Array<HistoryRawItem>;
}

// Initial state
const initialState: AccountHistoryState = {
  rows: [],
};

// Actual Slice
export const accountHistorySlice = createSlice({
  name: "accountHistory",
  initialState,
  reducers: {
    setRows(
      state,
      action: {
        payload: Array<HistoryRawItem>;
      }
    ) {
      state.rows = action.payload.map((item) => {
        return {
          ...item,
          //  id: `${item.ACTION}-${item.BALANCE_AFTER}-${item.BALANCE_BEFORE}-${item.PROFIT_LOSS}-${item.TIME}`,
        };
      });
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.accountHistory,
      };
    },
  },
});

export const { setRows } = accountHistorySlice.actions;

export const selectRows = (state: AppState) => state.accountHistory.rows;
export const isHasRow = (state: AppState) =>
  state.accountHistory.rows.length > 0;
export const selectFormattedRows = (state: AppState) => {
  const hasRows = isHasRow(state);
  const rows = selectRows(state);

  if (!hasRows) {
    return [];
  }

  return rows.map((row) => {
    const orignalTime: Moment = moment.tz(
      row.TIME,
      "YYYY-MM-DD HH:mm:ss",
      "Asia/Manila"
    );

    const time = orignalTime.tz("America/New_York");
    const pattern = /symbol\s+([A-Z0-9:]+)/;

    const match = row.ACTION.match(pattern);
    let symbol = "N/A";

    if (match && match.length > 1) {
      symbol = match[1];
    }

    return {
      ...row,
      TIME: time,
      DATE: time.format("YYYY-MM-DD"),
      SYMBOL: symbol,
      PROFIT_LOSS: parseFloat(row.PROFIT_LOSS),
      POSITION: extractPositionAndCreateString(row.ACTION),
    };
  });
};
export const selectGroupRowsByDate = (state: AppState) => {
  const rows: Array<HistoryFormattedItem> = selectFormattedRows(state);
  const groupedData = rows.reduce((result: any, currentItem) => {
    const date = currentItem.DATE;

    if (!result[date]) {
      result[date] = [];
    }

    result[date].push(currentItem);

    return result;
  }, {});

  return groupedData;
};

export default accountHistorySlice.reducer;

function extractPositionAndCreateString(inputString: string) {
  const positionMatch = inputString.match(/\b(Long|Short)\b/i); // Match "Long" or "Short" case-insensitively
  const isComission =
    inputString.match("Commission for: Enter position for") ||
    inputString.match("Commission for:");

  if (isComission) {
    return POSITION_COMISSION;
  }

  if (positionMatch) {
    const position = positionMatch[0]; // Extract matched position ("Long" or "Short")
    const resultString = position.toLowerCase();
    return resultString;
  }

  return "Position not found in input string.";
}
