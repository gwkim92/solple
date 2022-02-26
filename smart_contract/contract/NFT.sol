// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //이벤트로 가져와야 될 값
    // 민팅
    // 판매
    // 옥션 시작
    // 옥션 끝
    // 옥션 현재가
    // 출금
    // 종료
    event NewNft(address owner,uint256 tokenId,string tokenUri);

    mapping (uint256 => uint256) public NFTPrice;

    constructor() public ERC721("Test", "TEST") {}

    function mintNFT (string memory tokenURI) public returns (uint256){

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit NewNft(msg.sender,newItemId,tokenURI);
        return newItemId;
    }
}