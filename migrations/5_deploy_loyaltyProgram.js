const Token = artifacts.require("Token");
const LoyaltyProgram = artifacts.require("LoyaltyProgram");

module.exports = async function (deployer) {
  await deployer.deploy(Token);
  const token = await Token.deployed();
  await token.transfer('0xfb840FCd6c137C98FB003E5F73B2062E86C091C1', "1000000000000000");
  await deployer.deploy(LoyaltyProgram, token.address);  
};