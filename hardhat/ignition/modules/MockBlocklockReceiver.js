const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MockBlocklockReceiverModule", (m) => {
  const filecoinCalibrationBlocklockSender = "0xF00aB3B64c81b6Ce51f8220EB2bFaa2D469cf702";

  try {
    const mockBlocklockReceiver = m.contract("MockBlocklockReceiver", [
      filecoinCalibrationBlocklockSender
    ]);

    return {
      mockBlocklockReceiver
    };
  } catch (error) {
    console.error("Deployment failed:", error);
  }
});
