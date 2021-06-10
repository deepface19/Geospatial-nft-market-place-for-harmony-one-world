pragma solidity 0.6.12;

import './HRC1155/HRC1155Tradable.sol';

/**
 * @title HarmonyNFT
 * HarmonyNFT - Collect limited edition NFTs from Harmony
 */
contract HarmonyNFT is HRC1155Tradable {	
	constructor(address _proxyRegistryAddress) public HRC1155Tradable("HarmonyNFT", "HMY", _proxyRegistryAddress) { //use your own name, own symbol
		_setBaseMetadataURI("https://api.harmonyNFT.com/nfts/"); //use your own metadata uri
	}

	function contractURI() public view returns (string memory) { //use your own contract URI
		return "https://api.harmonyNFT.com/contract/harmonyNFT-HRC1155";
	}
}
