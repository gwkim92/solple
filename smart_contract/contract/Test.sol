// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Test is ERC721Enumerable {
    constructor() ERC721("test", "Test") {}

    mapping(uint256 => uint256) public TestTypes;

    function mintNft() public {
        uint256 testTokenId = totalSupply() + 1;
        uint256 TestType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, testTokenId))) % 5 + 1;
        TestTypes[testTokenId] = TestType;
        _mint(msg.sender, testTokenId);
    }
}