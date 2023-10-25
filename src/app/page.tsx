"use client";

import DetailedTable from "@/components/DetailedTable";
import HistoryUpload from "@/components/HistoryUpload";
import { isHasRow } from "@/store/accountHistory";
import { AppState } from "@/store/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Home() {
  const hasRow = useSelector((state: AppState) => isHasRow(state));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-6 md:pt-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://geronaalvin.com/logo.svg"
              alt="Alvin Gerona"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="md:w-full md:max-w-5xl md:w-full">
        <div className="mb-4 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left md:grid-cols-2">
          <HistoryUpload />
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
          {hasRow ? <DetailedTable /> : null}
        </div>
      </div>
    </main>
  );
}
