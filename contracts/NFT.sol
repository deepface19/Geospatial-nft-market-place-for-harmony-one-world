// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@harmony-one/HRC/hrc721/contracts/HRC721.sol";
import "@harmony-one/hrc1155/contracts/HRC1155/HRC1155.sol"

contract NFT is ERC721,HRC721,HRC1155 Ownable {
    address payable public _contractOwner;

    mapping (uint => uint) public price;
    mapping (uint => bool) public listedMap;

    event Purchase(address indexed previousOwner, address indexed newOwner, uint price, uint nftID, string uri);

    event Minted(address indexed minter, uint price, uint nftID, string uri);

    event PriceUpdate(address indexed owner, uint oldPrice, uint newPrice, uint nftID);

    event NftListStatus(address indexed owner, uint nftID, bool isListed);

    constructor() ERC721("_", "_") {
        _contractOwner = msg.sender;
    }
    constructor() HRC721("_", "_") {
        _contractOwner = msg.sender;
    }
    constructor() HRC1155("_", "_") {
        _contractOwner = msg.sender;
    }
    function mint(string memory _tokenURI, address _toAddress, uint _price) public returns (uint) {
        uint _tokenId = totalSupply() + 1;
        price[_tokenId] = _price;
        listedMap[_tokenId] = true;

        _safeMint(_toAddress, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        emit Minted(_toAddress, _price, _tokenId, _tokenURI);

        return _tokenId;
    }

    function buy(uint _id) external payable {
        _validate(_id);

        address _previousOwner = ownerOf(_id);
        address _newOwner = msg.sender;

        _trade(_id);

        emit Purchase(_previousOwner, _newOwner, price[_id], _id, tokenURI(_id));
    }

    function _validate(uint _id) internal {
        bool isItemListed = listedMap[_id];
        require(_exists(_id), "Error, wrong tokenId");
        require(isItemListed, "Item not listed currently");
        require(msg.value >= price[_id], "Error, the amount is lower");
        require(msg.sender != ownerOf(_id), "Can not buy what you own");
    }

    function _trade(uint _id) internal {
        address payable _buyer = payable(msg.sender);
        address payable _owner = payable(ownerOf(_id));

        _transfer(_owner, _buyer, _id);

        // 2.5% commission cut
        uint _commissionValue = price[_id] / 40 ;
        uint _sellerValue = price[_id] - _commissionValue;

        _owner.transfer(_sellerValue);
        _contractOwner.transfer(_commissionValue);

        // If buyer sent more than price, we send them back their rest of funds
        if (msg.value > price[_id]) {
            _buyer.transfer(msg.value - price[_id]);
        }

        listedMap[_id] = false;
    }

    function updatePrice(uint _tokenId, uint _price) public returns (bool) {
        uint oldPrice = price[_tokenId];
        require(msg.sender == ownerOf(_tokenId), "Error, you are not the owner");
        price[_tokenId] = _price;

        emit PriceUpdate(msg.sender, oldPrice, _price, _tokenId);
        return true;
    }

    function updateListingStatus(uint _tokenId, bool shouldBeListed) public returns (bool) {
        require(msg.sender == ownerOf(_tokenId), "Error, you are not the owner");

        listedMap[_tokenId] = shouldBeListed;

        emit NftListStatus(msg.sender, _tokenId, shouldBeListed);

        return true;
    }
}