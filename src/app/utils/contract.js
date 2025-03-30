import { ethers } from "ethers";

const usdtAddress = "0xCa647a34c855B1Dc2Be0105379f41004929D60bc"; // USDT contract address
const tokenContractAddress = "0x24C9299079A3D392227CE41993135A95bD0832b7"; // Your token contract address
const PUBLIC_RPC_URL = "https://rpc-amoy.polygon.technology"; // Replace with your RPC URL
const provider = new ethers.JsonRpcProvider(PUBLIC_RPC_URL);
const usdtABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
];

const myTokenABI = [
  "event LotteryEntered(uint256 lotteryId, address participant, uint256 amount)",
  "event LotteryCreated(uint256 indexed lotteryId, uint256 prizePool, uint256 entryFee)",
  "event LotteryResult(uint256 indexed lotteryId, address winner, uint amount)",
  "function owner() view returns (address)",
  "function lotteryCounter() view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function buyTokens(uint256 _amount) external",
  "function createLottery(uint256 _prizePool, uint _entryFee) external",
  "function enterLottery(uint256 _lotteryId, uint256 _amount) external",
  "function drawLottery(uint256 _lotteryId) external",
  "function withdrawUSDT(address _to, uint256 _amount) external",
  "function getLotteryData(uint256 _lotteryId) public view returns(uint256, uint256, uint256, bool)",
];

export const getContract = () => {
  return new ethers.Contract(tokenContractAddress, myTokenABI, provider);
};

//------------------------Get Owner Address----------------------------
export const getOwnerAddress = async () => {
  try {
    const contract = getContract();
    const ownerAddress = await contract.owner();
    console.log("Owner Address:", ownerAddress);
    return ownerAddress;
  } catch (error) {
    console.error("Error fetching owner address:", error);
    return null;
  }
};

//------------------------Get Lottery Counter----------------------------
export const getLotteryCounter = async () => {
  try {
    const contract = getContract();
    const lotteryCounter = await contract.lotteryCounter();
    console.log("Lottery Counter:", lotteryCounter.toString());
    return lotteryCounter.toString();
  } catch (error) {
    console.error("Error fetching lottery counter:", error);
    return null;
  }
};

//------------------------Get Lottery Info by Id----------------------------
export const getLotteryInfo = async (lotteryId = 1) => {
  try {
    const contract = getContract();
    const lotteryInfo = await contract.getLotteryData(lotteryId);

    const [id, prizePool, totalCollection, isActive] = lotteryInfo;

    const formattedData = {
      id: Number(id),
      prizePool: ethers.formatUnits(prizePool, 18),
      totalCollection: ethers.formatUnits(totalCollection, 18),
      isActive: Boolean(isActive),
    };

    console.log("Lottery Info Data:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching lottery counter:", error);
    return null;
  }
};

//------------------------Get All Lotteries created----------------------------
export const fetchActiveLotteries = async (previousBlock = 19018546) => {
  try {
    const contract = getContract();
    const latestBlock = await provider.getBlockNumber();
    const eventFilter = contract.filters.LotteryCreated();
    const events = await contract.queryFilter(
      eventFilter,
      previousBlock,
      latestBlock
    );

    const iface = new ethers.Interface(myTokenABI);
    const lotteries = events
      .map((event) => {
        if (!event.data) {
          console.warn("Skipping event due to missing data:", event);
          return null;
        }

        const decoded = iface.decodeEventLog(
          "LotteryCreated",
          event.data,
          event.topics
        );

        return {
          id: Number(decoded[0]),
          prizePool: ethers.formatUnits(decoded[1], 18),
          entryFee: ethers.formatUnits(decoded[2], 18),
        };
      })
      .filter((lottery) => lottery !== null);
    console.log("Lottery Data", lotteries);
    return lotteries;
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    return [];
  }
};

//------------------------Get All Lottery Entries----------------------------
export const fetchLotteryEntries = async (previousBlock = 19018546) => {
  try {
    const contract = getContract();
    const latestBlock = await provider.getBlockNumber();
    const eventFilter = contract.filters.LotteryEntered();
    const events = await contract.queryFilter(
      eventFilter,
      previousBlock,
      latestBlock
    );

    const iface = new ethers.Interface(myTokenABI);
    const entries = events
      .map((event) => {
        if (!event.data) {
          console.warn("Skipping event due to missing data:", event);
          return null;
        }

        const decoded = iface.decodeEventLog(
          "LotteryEntered",
          event.data,
          event.topics
        );

        return {
          lotteryId: Number(decoded[0]),
          participant: String(decoded[1]),
          amount: ethers.formatUnits(decoded[2], 18),
        };
      })
      .filter((entry) => entry !== null);

    console.log("Lottery Entries:", entries);
    return entries;
  } catch (error) {
    console.error("Error fetching lottery entries:", error);
    return [];
  }
};

//------------------------Get Lottery Winner----------------------------
export const fetchWinnerDrawn = async () => {
  try {
    const contract = getContract();
    const latestBlock = await provider.getBlockNumber();
    const eventFilter = contract.filters.LotteryResult();

    const events = await contract.queryFilter(
      eventFilter,
      19018546,
      latestBlock
    );

    const iface = new ethers.Interface(myTokenABI);
    const results = events.map((event) => {
      if (!event.data) {
        console.warn("Skipping event due to missing data:", event);
        return null;
      }

      // Decode the event log
      const decoded = iface.decodeEventLog(
        "LotteryResult",
        event.data,
        event.topics
      );

      return {
        id: Number(decoded[0]),
        winner: decoded[1],
        amount: ethers.formatUnits(decoded[2], 18),
      };
    });

    // Filter out null results
    const filteredResults = results.filter((result) => result !== null);

    console.log("Winner Results:", filteredResults);
    return filteredResults;
  } catch (error) {
    console.error("Error fetching LotteryResult events:", error);
    return [];
  }
};

//------------------------Provider Function----------------------------
export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.error("Error initializing provider:", error);
      return null;
    }
  } else {
    alert("MetaMask not detected! Please install metamask");
    console.error("MetaMask not detected!");
    throw new Error("metamask not detected");
  }
};

//------------------------Get USDT Contract----------------------------
export const getUSDTContract = async () => {
  const provider = getProvider();
  if (!provider) {
    console.error("No provider found. Please connect MetaMask.");
    return null;
  }

  const signer = await provider.getSigner();
  return new ethers.Contract(usdtAddress, usdtABI, signer);
};

//------------------------Get MyToken Contract----------------------------
export const getMyTokenContract = async () => {
  const provider = getProvider();
  if (!provider) return null;

  const signer = await provider.getSigner();
  return new ethers.Contract(tokenContractAddress, myTokenABI, signer);
};

//------------------------Approve USDT ----------------------------
export const approveUSDT = async (amount) => {
  try {
    if (!amount) {
      console.error("Amount is undefined or empty!");
      return;
    }

    const usdtContract = await getUSDTContract(); // Now it uses a signer
    if (!usdtContract) return;

    const amountInWei = ethers.parseUnits(amount.toString(), 18); // For ethers v6
    const tx = await usdtContract.approve(tokenContractAddress, amountInWei);
    await tx.wait();

    console.log("Approval successful!");
  } catch (error) {
    console.error("Approval failed:", error);
  }
};

//------------------------Buy Tokens ----------------------------
export const buyTokens = async (amount) => {
  try {
    if (!amount) {
      console.error("Amount is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract(); // Now it uses a signer
    if (!myTokenContract) return;

    const tx = await myTokenContract.buyTokens(amount);
    await tx.wait();

    console.log("Tokens purchased successfully!");
  } catch (error) {
    console.error("Token purchase failed:", error);
  }
};

//------------------------Approve Token ----------------------------
export const approveMyToken = async (amount) => {
  try {
    if (!amount) {
      console.error("Amount is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract(); // Now it uses a signer
    if (!myTokenContract) return;

    const amountInWei = ethers.parseUnits(amount.toString(), 18); // For ethers v6
    const tx = await myTokenContract.approve(tokenContractAddress, amountInWei);
    await tx.wait();

    console.log("Approval successful!");
  } catch (error) {
    console.error("Approval failed:", error);
  }
};

//---------------------Create Lottery---------------------
export const createLottery = async (prize, entryFee) => {
  try {
    if (!prize) {
      console.error("prize is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract(); // Now it uses a signer
    if (!myTokenContract) return;

    const prizeInWei = ethers.parseUnits(prize.toString(), 18); // For ethers v6
    const entryInWei = ethers.parseUnits(entryFee.toString(), 18); // For ethers v6
    const tx = await myTokenContract.createLottery(prizeInWei, entryInWei);
    await tx.wait();

    console.log("Lottery Created!");
  } catch (error) {
    console.error("lottery creation failed:", error);
  }
};

//---------------------Enter Lottery---------------------
export const enterLottery = async (lotteryId, entry) => {
  try {
    if (!entry) {
      console.error("entry is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract(); // Now it uses a signer
    if (!myTokenContract) return;

    const entryInWei = ethers.parseUnits(entry.toString(), 18); // For ethers v6
    const tx = await myTokenContract.enterLottery(lotteryId, entryInWei);
    await tx.wait();

    console.log("Entered in Lottery!");
  } catch (error) {
    console.error("lottery creation failed:", error);
  }
};

//---------------------Draw Lottery---------------------
export const drawLottery = async (lotteryId) => {
  try {
    if (!lotteryId) {
      console.error("entry is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract();
    if (!myTokenContract) return;

    const tx = await myTokenContract.drawLottery(lotteryId);
    await tx.wait();

    console.log("Lottery Drawn!");
  } catch (error) {
    console.error("lottery creation failed:", error);
  }
};

//---------------------WithDraw Usdt---------------------
export const withdrawUSDT = async (amount) => {
  try {
    if (!amount) {
      console.error("amount is undefined or empty!");
      return;
    }
    const ownerAddress = await getOwnerAddress();
    if (!ownerAddress) {
      console.error("Owner Address is undefined or empty!");
      return;
    }

    const myTokenContract = await getMyTokenContract();
    if (!myTokenContract) return;

    const amountInWei = ethers.parseUnits(amount.toString(), 18);
    const tx = await myTokenContract.withdrawUSDT(ownerAddress, amountInWei);
    await tx.wait();

    console.log("USDT Withdrawn!");
  } catch (error) {
    console.error("Withdrawl Failed", error);
  }
};
