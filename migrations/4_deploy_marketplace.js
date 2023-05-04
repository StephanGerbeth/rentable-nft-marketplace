const RentableNft = artifacts.require("RentableNft");
const Marketplace = artifacts.require("Marketplace");
const MinimalForwarder = artifacts.require("MinimalForwarder");

module.exports = async function (deployer) {
  await deployer.deploy(MinimalForwarder);
  const minimalForwarder = await MinimalForwarder.deployed();
  await deployer.deploy(Marketplace, minimalForwarder.address);
  const marketplace = await Marketplace.deployed();
  await deployer.deploy(RentableNft, minimalForwarder.address, marketplace.address);
};