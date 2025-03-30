"use client";

interface Lottery {
  id: number;
  winner: string;
  amount: string;
}
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchWinnerDrawn } from "../../app/utils/contract";

export default function Home() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLotteries = async () => {
      const data = await fetchWinnerDrawn();
      console.log("Data", data);
      setLotteries(data);
      setLoading(false);
    };
    loadLotteries();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
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
                <Link href="/Winners" className="active">
                  Winners
                </Link>
              </li>
              <li>
                <Link href="/View">Lottery Entries</Link>
              </li>
            </ul>
          </nav>
          <div className="header-right flex items-center space-x-4">
            <div className="search-icon text-xl cursor-pointer">
              <FaSearch />
            </div>
            <div className="user-icon text-xl cursor-pointer">
              <FaUser />
            </div>
            <div className="sign-buttons flex space-x-2">
              <Link
                href="/signin"
                className="sign-in bg-blue-500 text-white px-4 py-2 rounded"
              >
                Connect wallet
              </Link>
              {/* <Link href="/signup" className="sign-up bg-green-500 text-white px-4 py-2 rounded">Sign Up</Link> */}
            </div>
          </div>
        </div>
      </header>

      {/*   */}

      <div className="lottery-container">
        <h2>Active Lotteries</h2>
        {loading ? (
          <p>Loading...</p>
        ) : lotteries.length === 0 ? (
          <p>No Winners found.</p>
        ) : (
          <ul className="lottery-list">
            {lotteries.map((lottery) => (
              <li className="lottery-item" key={lottery.id}>
                <p className="lottery-id">
                  ID: <span>{lottery.id}</span>
                </p>
                <p className="lottery-prize">
                  Winner:{" "}
                  <span>
                    {lottery.winner.length > 6
                      ? `${lottery.winner.substring(
                          0,
                          3
                        )}...${lottery.winner.substring(
                          lottery.winner.length - 3
                        )}`
                      : lottery.winner}
                  </span>
                </p>
                <p className="lottery-prize">
                  Winning Amount: <span>{lottery.amount} Lotto</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
