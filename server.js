const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { dbConnect } = require("./connections/database");
const { proposalData } = require("./models/proposals");
const cors = require("cors");
const { ethers } = require("ethers");
const { proposalDetails } = require("./models/proposalDetails");

const app = express();
app.use(cors());

app.get("/api/proposalHash", async (req, res, next) => {
 const dataID = await proposalData.find();
 res.status(200).json(dataID);

 next();
});

app.post("/api/create", async (req, res, next) => {
 const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");

 const txnHash = {
  proposal_hash: req.body,
 };

 await proposalData.create(txnHash);

 const events = await provider.getTransactionReceipt(dataID[0].proposal_hash);
 const logs = events.logs[0].data;
 const decodeData = ethers.utils.defaultAbiCoder.decode(
  ["uint256", "address", "address[]", "uint256[]", "string[]", "bytes[]", "uint256", "uint256", "string"],
  logs
 );

 const proposerAddress = decodeData[1];
 const ID = decodeData[0].toString();
 const desc = decodeData[8];
 const startBlock = decodeData[6].toString();
 const endBlock = decodeData[7].toString();

 const ProposalData = {
  proposer_address: proposerAddress,
  proposal_id: ID,
  proposal_description: desc,
  startBlock: startBlock,
  endBlock: endBlock,
 };

 try {
  await proposalDetails.create(ProposalData);
  res.status(200).send("Proposal hash has been stored to DB");
 } catch (error) {
  res.status(500).send(error);
 }

 next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
 console.error(`Connected to port ${port}`);
});
