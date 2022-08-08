const { proposalData } = require("../models/proposals");
const { ethers } = require("ethers");
const { proposalDetails } = require("../models/proposalDetails");
const mongoose = require("mongoose");

const getProposal = async (req, res, next) => {
 const data = await proposalDetails.find();
 const result = data.map((item) => ({
  objId: item._id,
  address: item.proposer_address,
  id: item.proposal_id,
  desc: item.proposal_description,
  startBlock: item.startBlock,
  endBlock: item.endBlock,
 }));
 res.status(200).json(result);
 next();
};

const getProposalDetails = async (req, res, next) => {
 try {
  const objId = mongoose.Types.ObjectId(req.params.id.trim());
  const result = await proposalDetails.findById(objId);
  res.status(200).json(result);
 } catch (error) {
  res.status(500).send(error);
  next();
 }
};

const createProposal = async (req, res, next) => {
 const txnHash = {
  proposal_hash: req.body.hash,
 };
 await proposalData.create(txnHash);

 try {
  const infuraAPI = process.env.INFURA_API;
  const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infuraAPI}`);

  const dataID = await proposalData.find().limit(1).sort({ $natural: -1 });

  const events = await provider.getTransactionReceipt(dataID[0].proposal_hash);
  const logs = events.logs[0].data;
  const decodeData = ethers.utils.defaultAbiCoder.decode(
   ["uint256", "address", "address[]", "uint256[]", "string[]", "bytes[]", "uint256", "uint256", "string"],
   logs
  );

  const proposerAddress = decodeData[1];
  const ID = decodeData[0].toString();
  const callDataID = decodeData[5];
  const values = decodeData[3];
  const targets = decodeData[2];
  const desc = decodeData[8];
  const startBlock = decodeData[6].toString();
  const endBlock = decodeData[7].toString();

  const ProposalData = {
   proposer_address: proposerAddress,
   proposal_id: ID,
   proposal_description: desc,
   startBlock: startBlock,
   endBlock: endBlock,
   calldata: callDataID[0],
   values: values[0],
   targetContract: targets[0],
  };

  const result = await proposalDetails.create(ProposalData);
  console.log(result);
  res.status(200).send("Proposal hash has been stored to DB");
 } catch (error) {
  res.status(500).send(error);
  next();
 }
};

module.exports = { getProposal, createProposal, getProposalDetails };
