// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

/**
 * @dev HRC-1155 interface for accepting safe transfers.
 */
interface IHRC1155TokenReceiver {

  /**
   * @notice Handle the receipt of a single HRC1155 token type
   * @dev An HRC1155-compliant smart contract MUST call this function on the token recipient contract, at the end of a `safeTransferFrom` after the balance has been updated
   * This function MAY throw to revert and reject the transfer
   * Return of other amount than the magic value MUST result in the transaction being reverted
   * Note: The token contract address is always the message sender
   * @param _operator  The address which called the `safeTransferFrom` function
   * @param _from      The address which previously owned the token
   * @param _id        The id of the token being transferred
   * @param _amount    The amount of tokens being transferred
   * @param _data      Additional data with no specified format
   * @return           `bytes4(keccak256("onHRC1155Received(address,address,uint256,uint256,bytes)"))`
   */
  function onHRC1155Received(address _operator, address _from, uint256 _id, uint256 _amount, bytes calldata _data) external returns(bytes4);

  /**
   * @notice Handle the receipt of multiple HRC1155 token types
   * @dev An HRC1155-compliant smart contract MUST call this function on the token recipient contract, at the end of a `safeBatchTransferFrom` after the balances have been updated
   * This function MAY throw to revert and reject the transfer
   * Return of other amount than the magic value WILL result in the transaction being reverted
   * Note: The token contract address is always the message sender
   * @param _operator  The address which called the `safeBatchTransferFrom` function
   * @param _from      The address which previously owned the token
   * @param _ids       An array containing ids of each token being transferred
   * @param _amounts   An array containing amounts of each token being transferred
   * @param _data      Additional data with no specified format
   * @return           `bytes4(keccak256("onHRC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
   */
  function onHRC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _amounts, bytes calldata _data) external returns(bytes4);

  /**
   * @notice Indicates whether a contract implements the `HRC1155TokenReceiver` functions and so can accept HRC1155 token types.
   * @param  interfaceID The HRC-165 interface ID that is queried for support.s
   * @dev This function MUST return true if it implements the HRC1155TokenReceiver interface and HRC-165 interface.
   *      This function MUST NOT consume more than 5,000 gas.
   * @return Wheter HRC-165 or HRC1155TokenReceiver interfaces are supported.
   */
  function supportsInterface(bytes4 interfaceID) external view returns (bool);

}
