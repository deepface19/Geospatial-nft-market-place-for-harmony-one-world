pragma solidity ^0.7.0;

import "@OpenZeppelin/contracts/token/ERC721/ERC721.sol";
import "@OpenZeppelin/contracts/utils/Counters.sol";

contract GeospatialNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => uint256) private salePrice;
    constructor() ERC721("Geospatial-NFT", "GNFT") {}

    function mintNft(address receiver, string memory tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        _setTokenURI(newNftTokenId, tokenURI);
        return newNftTokenId;
    }

    function setPrice(uint256 tokenId, uint256 price) public {
    address owner = ownerOf(tokenId);
        require(owner != address(0), "setPrice: there is no token existed");
        require(owner == msg.sender, "setPrice: you are not the owner of that NFT");
    salePrice[tokenId] = price;
  }
    function buyNft(uint256 tokenId) public payable {
    uint256 price = salePrice[tokenId];
        require(price != 0, "buyNft: the owner didn't set the price yet");
        require(msg.value == price, "buyNft: please set the correct price");
    address payable owner = address(uint160(ownerOf(tokenId)));
    salePrice[tokenId] = 0; // not for sale anymore
    transferFrom(owner, msg.sender, tokenId);
        owner.transfer(msg.value); // send the ETH to the seller/owner
    }
    function getPrice(uint256 tokenId) public view returns (uint256) {
    return salePrice[tokenId];
  }
}