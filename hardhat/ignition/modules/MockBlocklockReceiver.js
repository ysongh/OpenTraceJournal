const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockBlocklockReceiverModule", (m) => {
  const filecoinCalibrationBlocklockSender = "0xF00aB3B64c81b6Ce51f8220EB2bFaa2D469cf702";
  const baseSepoliaBlocklockSender = "0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e";

  try {
    const mockBlocklockReceiver = m.contract("MockBlocklockReceiver", [
      baseSepoliaBlocklockSender
    ]);

    return {
      mockBlocklockReceiver
    };
  } catch (error) {
    console.error("Deployment failed:", error);
  }
});
