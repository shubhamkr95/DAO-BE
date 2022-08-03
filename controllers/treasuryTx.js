const { treasuryData } = require("../models/treasuryTxn");

const createTransactions = async (req, res, next) => {
 try {
  const txnHash = {
   treasury_hash: req.body.hash,
  };
  await treasuryData.create(txnHash);
  res.status(200).send("Deposit successfully");
 } catch (error) {
  res.status(500).send(error);
 }
 next();
};

const getTransaction = async (req, res, next) => {
 const data = await treasuryData.find();
 const result = data.map((item) => ({
  objId: item.id,
  hash: item.treasury_hash,
 }));
 res.status(200).json(result);
 next();
};

module.exports = { getTransaction, createTransactions };
