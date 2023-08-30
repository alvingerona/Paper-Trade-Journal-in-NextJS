import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import moment, { Moment } from "moment-timezone";

export interface HistoryRawItem {
  ACTION: string;
  BALANCE_AFTER: string;
  BALANCE_BEFORE: string;
  PROFIT_LOSS: string;
  TIME: string;
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
    // Action to set the accountHistory status
    setRows(state, action) {
      state.rows = action.payload;
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

export const useSelectRows = (state: AppState) => state.accountHistory.rows;
export const useHasRow = (state: AppState) =>
  state.accountHistory.rows.length > 0;
export const useSelectFormattedRows = (state: AppState) => {
  const hasRows = useHasRow(state);
  const rows = useSelectRows(state);

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
      PROFIT_LOSS: parseInt(row.PROFIT_LOSS),
      POSITION: extractPositionAndCreateString(row.ACTION),
    };
  });
};
export const useGroupRowsByDate = (state: AppState) => {
  const rows: Array<HistoryFormattedItem> = useSelectFormattedRows(state);
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

  if (positionMatch) {
    const position = positionMatch[0]; // Extract matched position ("Long" or "Short")
    const resultString = position.toLowerCase();
    return resultString;
  } else {
    return "Position not found in input string.";
  }
}
