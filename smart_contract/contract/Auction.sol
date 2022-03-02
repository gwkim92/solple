// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFT is ERC721URIStorage, Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    IERC20 public token;
//ERC721//
    event NewNft(address owner,uint256 tokenId,string tokenUri);

    uint [] public Alltokens;

///////auction////
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    event Endedat(uint a);

    address public seller = msg.sender;

    uint public nftId;

    bool public started;
    bool public ended;
    uint public endAt;
    uint public highestBid;
    address public highestBidder;
    address public nftowner;
    mapping(address => uint) public bids;

    uint256 [] public onBidNftArray;

    constructor() public ERC721("Test", "TEST") {}

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal
      override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(
        uint256 tokenId
    ) internal
      override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

  function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    function tokenURI(
        uint256 tokenId
    ) public view
      override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function mintNFT (string memory tokenURI) public returns (uint256){

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        Alltokens.push(newItemId);
        emit NewNft(msg.sender,newItemId,tokenURI);
        return newItemId;
    }

    function showAllToken() public view returns(uint){
        return Alltokens.length;
    }
    //////////////////////Auction////////////////////////
    function setToken (address tokenAddress) public returns (bool) {
            require(tokenAddress != address(0x0));
            token = IERC20(tokenAddress);
            return true;
        }

    function start(uint _nftId, uint startingBid) public {
        require(!started, "Already started!");
        require(msg.sender == seller, "You did not start the auction!");
        highestBid = startingBid;

        nftId = _nftId;
        nftowner = msg.sender;
        transferFrom(msg.sender, address(this), nftId);

        started = true;
        endAt = block.timestamp + 2 days;
        seller = msg.sender;
        emit Start();
    }

   function bid(uint nftId, uint amount) public {
        require(started, "Not started.");
        require(block.timestamp < endAt, "Ended!");
        require(amount > highestBid, "value < highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBid = amount;
        highestBidder = msg.sender;
        token.transferFrom(msg.sender, address(this), amount);
        emit Bid(highestBidder, highestBid);
    }

    function withdraw() public  {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
         token.transferFrom(address(this), msg.sender , bal);

        emit Withdraw(msg.sender, bal);
    }

    function end() public {
        require(nftowner == msg.sender, "Caller is not nft token owner.");
        require(started, "You need to start first!");
        require(block.timestamp >= endAt, "Auction is still ongoing!");
        require(!ended, "Auction already ended!");
        require(seller == msg.sender, "Caller is not nft token owner.");

        if (highestBidder != address(0)) {
            safeTransferFrom(address(this), highestBidder, nftId);
            token.transferFrom(address(this), nftowner, highestBid);
        } else {
            safeTransferFrom(address(this), nftowner, nftId);
        }

        ended = true;
        emit End(highestBidder, highestBid);
    }

}