// contracts/hrc1155.sol
// SPDX-License-Identifier: MIT

pragma solidity >0.7.0 <=0.8.5;

import "@harmony-one/hrc1155/contracts/HRC1155/HRC1155.sol";
import "./geospatial_location.sol";
import "hardhat/console.sol";

contract GeospatialNFTMarketplace is HRC1155, GeospatialLocations {

    // mapping from location (index in locations array) to location_owner's address
    mapping(uint256 => address) locationToOwner;

    constructor() HRC1155("") {
        console.log("Sender is %s", msg.sender);
        addTopLocations();
        for (uint i = 0; i < locations.length; i++) {
            locationToOwner[i] = msg.sender;
            _mint(msg.sender, i, 1, "");
        }
    }
    function getOwner(uint256 location_id) public view returns (address) {
        return locationToOwner[location_id];
    }
}