const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DecentralizedJournalModule", (m) => {
  const baseSepoliaBlocklockSender = "0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e";
  const mockBlocklockReceiver = m.contract("MockBlocklockReceiver", [baseSepoliaBlocklockSender]);
  
  try {
    const decentralizedJournal = m.contract("DecentralizedJournal", [
      "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      mockBlocklockReceiver
    ]);

    return {
      decentralizedJournal
    };
  } catch (error) {
    console.error("Deployment failed:", error);
  }
});
