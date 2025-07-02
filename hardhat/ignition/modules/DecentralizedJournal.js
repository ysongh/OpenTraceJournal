const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DecentralizedJournalModule", (m) => {
  const decentralizedJournal = m.contract("DecentralizedJournal", [
    "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    0,
    "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
  ]);

  return {
    decentralizedJournal
  };
});
