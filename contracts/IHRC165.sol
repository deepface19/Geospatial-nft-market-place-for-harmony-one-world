// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
/**
 * @title HRC165
 * @dev https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md
 */
interface IHRC165 {

    /**
     * @notice Query if a contract implements an interface
     * @dev Interface identification is specified in HRC-165. This function
     * uses less than 30,000 gas
     * @param _interfaceId The interface identifier, as specified in HRC-165
     */
    function supportsInterface(bytes4 _interfaceId)
    external
    view
    returns (bool);
}
