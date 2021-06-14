// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Strings.sol";
import "./HRC1155.sol";
import "./HRC1155MintBurn.sol";
import "./HRC1155Metadata.sol";
import "./MinterRole.sol";
import "./WhitelistAdminRole.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
	mapping(address => OwnableDelegateProxy) public proxies;
}

/**
 * @title HRC1155Tradable
 * HRC1155Tradable - HRC1155 contract that whitelists an operator address, 
 * has create and mint functionality, and supports useful standards from OpenZeppelin,
  like _exists(), name(), symbol(), and totalSupply()
 */
contract HRC1155Tradable is HRC1155, HRC1155MintBurn, HRC1155Metadata, Ownable, MinterRole, WhitelistAdminRole {
	using Strings for string;

	address proxyRegistryAddress;
	uint256 private _currentTokenID = 0;
	
	mapping(uint256 => address) public creators;
	mapping(uint256 => uint256) public tokenSupply;
	mapping(uint256 => uint256) public tokenMaxSupply;
  
	// Contract name
	string public name;
	// Contract symbol
	string public symbol;

	constructor(
		string memory _name,
		string memory _symbol,
		address _proxyRegistryAddress
	) public {
		name = _name;
		symbol = _symbol;
		proxyRegistryAddress = _proxyRegistryAddress;
	}

	function removeWhitelistAdmin(address account) public onlyOwner {
		_removeWhitelistAdmin(account);
	}

	function removeMinter(address account) public onlyOwner {
		_removeMinter(account);
	}

	function addMinter(address account) public override onlyOwner {
		_addMinter(account);
	}

	function uri(uint256 _id) public view override returns (string memory) {
		require(_exists(_id), "HRC721Tradable#uri: NONEXISTENT_TOKEN");
		return Strings.strConcat(baseMetadataURI, Strings.uint2str(_id));
	}

	/**
	 * @dev Returns the total quantity for a token ID
	 * @param _id uint256 ID of the token to query
	 * @return amount of token in existence
	 */
	function totalSupply(uint256 _id) public view returns (uint256) {
		return tokenSupply[_id];
	}

	/**
	 * @dev Returns the max quantity for a token ID
	 * @param _id uint256 ID of the token to query
	 * @return amount of token in existence
	 */
	function maxSupply(uint256 _id) public view returns (uint256) {
		return tokenMaxSupply[_id];
	}

	/**
	 * @dev Will update the base URL of token's URI
	 * @param _newBaseMetadataURI New base URL of token's URI
	 */
	function setBaseMetadataURI(string memory _newBaseMetadataURI) public onlyWhitelistAdmin {
		_setBaseMetadataURI(_newBaseMetadataURI);
	}

	/**
	 * @dev Creates a new token type and assigns _initialSupply to an address
	 * @param _maxSupply max supply allowed
	 * @param _initialSupply Optional amount to supply the first owner
	 * @param _uri Optional URI for this token type
	 * @param _data Optional data to pass if receiver is contract
	 * @return tokenId The newly created token ID
	 */
	function create(
		uint256 _maxSupply,
		uint256 _initialSupply,
		string calldata _uri,
		bytes calldata _data
	) external onlyWhitelistAdmin returns (uint256 tokenId) {
		require(_initialSupply <= _maxSupply, "Initial supply cannot be more than max supply");

		uint256 _id = _getNextTokenID();
		_incrementTokenTypeId();

		creators[_id] = msg.sender;
		if (bytes(_uri).length > 0) {
			emit URI(_uri, _id);
		}

		if (_initialSupply != 0) _mint(msg.sender, _id, _initialSupply, _data);
		tokenSupply[_id] = _initialSupply;
		tokenMaxSupply[_id] = _maxSupply;
		return _id;
	}

	/**
	 * @dev Mints some amount of tokens to an address
	 * @param _to          Address of the future owner of the token
	 * @param _id          Token ID to mint
	 * @param _quantity    Amount of tokens to mint
	 * @param _data        Data to pass if receiver is contract
	 */
	function mint(
		address _to,
		uint256 _id,
		uint256 _quantity,
		bytes memory _data
	) public onlyMinter {
		uint256 tokenId = _id;
		
		require(tokenSupply[tokenId] < tokenMaxSupply[tokenId], "Max supply reached");
		_mint(_to, _id, _quantity, _data);
		tokenSupply[_id] = tokenSupply[_id].add(_quantity);
	}

	/**
	 * @dev Burns some amount of tokens to an address
	 * @param _from          Address of the future owner of the token
	 * @param _id          Token ID to mint
	 * @param _quantity    Amount of tokens to mint
	 */
	function burn(
		address _from,
		uint256 _id,
		uint256 _quantity
	) public onlyMinter {
		uint256 tokenId = _id;
		require(tokenSupply[tokenId] > 0, "No token exists");
		_burn(_from, _id, _quantity);
		tokenSupply[_id] = tokenSupply[_id].sub(_quantity);
	}

	/**
	 * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-free listings.
	 */
	function isApprovedForAll(address _owner, address _operator) public view override returns (bool isOperator) {
		// Whitelist OpenSea proxy contract for easy trading.
		ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
		if (address(proxyRegistry.proxies(_owner)) == _operator) {
			return true;
		}

		return HRC1155.isApprovedForAll(_owner, _operator);
	}

	/**
	 * @dev Returns whether the specified token exists by checking to see if it has a creator
	 * @param _id uint256 ID of the token to query the existence of
	 * @return bool whether the token exists
	 */
	function _exists(uint256 _id) public view returns (bool) {
		return creators[_id] != address(0);
	}

	/**
	 * @dev calculates the next token ID based on value of _currentTokenID
	 * @return uint256 for the next token ID
	 */
	function _getNextTokenID() private view returns (uint256) {
		return _currentTokenID.add(1);
	}

	/**
	 * @dev increments the value of _currentTokenID
	 */
	function _incrementTokenTypeId() private {
		_currentTokenID ++;
	}
}
