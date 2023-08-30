"use client";

import useloadFromCSV from "@/hooks/useloadFromCSV";
import React, { useState } from "react";

export default function HistoryUpload() {
  const loadCSV = useloadFromCSV();
  const [file, setFile] = useState<undefined | File>();
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFile(
      e.target.files && e.target.files.length > 0
        ? e.target.files[0]
        : undefined
    );
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (file) {
      await loadCSV.mutation.mutateAsync({
        file: file,
      });
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Upload History CSV
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Upload a exported CSV from TradingView history.</p>
        </div>
        <form className="mt-5 sm:flex sm:items-center" onSubmit={onSubmit}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="email" className="sr-only">
              CSV File
            </label>
            <input
              type="file"
              name="file"
              id="file"
              className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={onFileChange}
              accept=".csv"
            />
          </div>
          <button
            type="submit"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:ml-3 sm:mt-0 sm:w-auto"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
