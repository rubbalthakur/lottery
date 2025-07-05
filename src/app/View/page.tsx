"use client";

import { useState, useEffect } from "react";
import { fetchLotteryEntries } from "../../app/utils/contract";
import Link from "next/link";
import Image from "next/image";
// import { FaSearch, FaUser } from "react-icons/fa";

interface LotteryEntry {
  lotteryId: number;
  participant: string;
  amount: string;
}

export default function LotteryEntries() {
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await fetchLotteryEntries();
      setEntries(data);
      setLoading(false);
    };
    loadEntries();
  }, []);

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="logo">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="BetX"
                width={120}
                height={50}
              />
            </Link>
          </div>
          <nav className="main-nav">
            <ul className="flex space-x-6">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/BuyToken">Buy Token</Link>
              </li>
              <li>
                <Link href="/Admin">Admin Functions</Link>
              </li>
              <li>
                <Link href="/Winners">Winners</Link>
              </li>
              <li>
                <Link href="/View" className="active">
                  Lottery Entries
                </Link>
              </li>
            </ul>
          </nav>
          <div className="header-right flex items-center space-x-4">
            {/* <div className="search-icon text-xl cursor-pointer">
              <FaSearch />
            </div>
            <div className="user-icon text-xl cursor-pointer">
              <FaUser />
            </div> */}
            <div className="sign-buttons flex space-x-2">
              {/* <Link
                href="/signin"
                className="sign-in bg-blue-500 text-white px-4 py-2 rounded"
              >
                Connect wallet
              </Link> */}
            </div>
          </div>
        </div>
      </header>

      <div className="lottery-container">
        <h2>Lottery Entries</h2>
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No lottery entries found.</p>
        ) : (
          <ul className="lottery-list">
            {entries.map((entry) => (
              <li
                className="lottery-item"
                key={`${entry.lotteryId}-${entry.participant}`}
              >
                <p className="lottery-id">
                  Lottery ID: <span>{entry.lotteryId}</span>
                </p>
                <p className="lottery-participant">
                  Participant:{" "}
                  <span>
                    {entry.participant.length > 6
                      ? `${entry.participant.substring(
                          0,
                          3
                        )}...${entry.participant.substring(
                          entry.participant.length - 3
                        )}`
                      : entry.participant}
                  </span>
                </p>
                <p className="lottery-amount">
                  Amount: <span>{entry.amount} Lotto</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
