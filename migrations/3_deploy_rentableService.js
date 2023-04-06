const RentableService = artifacts.require("ERC4907_RentableService");

module.exports = function (deployer) {
  deployer.deploy(RentableService);
};