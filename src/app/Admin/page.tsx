"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { FaSearch, FaUser } from "react-icons/fa";
import {
  createLottery,
  drawLottery,
  withdrawUSDT,
} from "../../app/utils/contract";

export default function BuyPage() {
  const [amount, setAmount] = useState("");
  const [prize, setPrize] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [drawId, setDrawId] = useState("");

  const handleWithdraw = async () => {
    if (!amount) {
      alert("please enter amount");
      return;
    }
    try {
      await withdrawUSDT(amount);
      alert(`You have withdrawn: ${amount}`);
    } catch {}
  };

  const handleDraw = async () => {
    if (!drawId) {
      alert("please enter id");
      return;
    }
    try {
      await drawLottery(drawId);
      alert("lottery drawn");
    } catch {}
  };

  const handleCreateLottery = async () => {
    if (!prize || isNaN(Number(prize)) || Number(prize) <= 0) {
      alert("Please enter a valid lottery prize amount");
      return;
    }
    try {
      await createLottery(prize, entryFee);
      alert(`Lottery created with prize: ${prize}`);
    } catch {}
  };

  return (
    <div className="admin-container">
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
                <Link href="/Admin" className="active">
                  Admin Functions
                </Link>
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
              {/* <Link href="/signup" className="sign-up bg-green-500 text-white px-4 py-2 rounded">Sign Up</Link> */}
            </div>
          </div>
        </div>
      </header>

      <div className="buy-page">
        <h1>Draw Lottery</h1>
        <input
          type="number"
          placeholder="Enter lottery id"
          value={drawId}
          onChange={(e) => setDrawId(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleDraw}>Draw Lottery</button>
        </div>

        <h1>Lottery Creation</h1>
        <input
          type="number"
          placeholder="Enter amount"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
        />
        <input
          type="number"
          placeholder="Set Entry Fee"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleCreateLottery}>Create Lottery</button>
        </div>

        <h1>Withdraw USDT</h1>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleWithdraw}>WithDraw USDT</button>
        </div>
      </div>
    </div>
  );
}
