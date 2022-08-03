const express = require("express");
const { getProposal, getProposalDetails, createProposal } = require("../controllers/proposalTx");
const { getTransaction, createTransactions } = require("../controllers/treasuryTx");
const router = express.Router();

router.get("/", getProposal);

router.get("/views/:id", getProposalDetails);

router.post("/create", createProposal);

router.post("/treasury", createTransactions);

router.get("/transactions", getTransaction);

module.exports = router;
