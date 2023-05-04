// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC4907.sol";


contract RentableNft is ERC4907, ERC2771Context {
  using Counters for Counters.Counter;
  address private _marketplaceContract;
  Counters.Counter private _tokenIds;

  constructor(MinimalForwarder forwarder, address marketplaceContract) ERC4907("RentableNft", "RNFT") ERC2771Context(address(forwarder)) {
    _marketplaceContract = marketplaceContract;
  }

  function mint(string memory _tokenURI) public {
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(_msgSender(), newTokenId);
    setApprovalForAll(_marketplaceContract, true);
    _setTokenURI(newTokenId, _tokenURI);
  }

  function burn(uint256 tokenId) public {
    _burn(tokenId);
  }

  function _msgSender() internal view override(Context, ERC2771Context) returns(address) {
    return ERC2771Context._msgSender();
  } 

  function _msgData() internal view override(Context, ERC2771Context) returns(bytes calldata) {
    return ERC2771Context._msgData();
  }
}