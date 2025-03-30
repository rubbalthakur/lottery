"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser } from "react-icons/fa";
import { enterLottery, buyTokens, approveUSDT } from "../../app/utils/contract";

export default function BuyPage() {
  const [amount, setAmount] = useState("");
  const [lotteryId, setLotteryId] = useState("");
  const [entry, setEntry] = useState("");

  const handleBuy = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid number");
      return;
    }
    await approveUSDT(amount);
    await buyTokens(amount);
    alert(`You have bought ${amount} tokens`);
  };

  const handleEntry = async () => {
    if (!lotteryId || !entry || isNaN(Number(entry)) || Number(entry) <= 0) {
      alert("Please enter valid lottery ID and entry amount");
      return;
    }
    await enterLottery(lotteryId, entry);
  };

  return (
    <div className="buytokenhere">
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
                <Link href="http://localhost:3000/">Home</Link>
              </li>
              <li>
                <Link href="/BuyToken" className="active">
                  Buy Token
                </Link>
              </li>
              <li>
                <Link href="/Admin">Admin Functions</Link>
              </li>
              <li>
                <Link href="/Winners">Winners</Link>
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

      <div className="buy-page">
        <h1>Buy MyToken with USDT</h1>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="button-group">
          {/* <button onClick={handleApproval}>Approve USDT</button> */}
          <button onClick={handleBuy}>Buy Tokens</button>
        </div>

        <h1>Enter Lottery</h1>
        <input
          type="number"
          placeholder="Enter lottery id"
          value={lotteryId}
          onChange={(e) => setLotteryId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter entry amount"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleEntry}>Enter in Lottery</button>
        </div>
      </div>
    </div>
  );
}
