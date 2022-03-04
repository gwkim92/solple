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

    event NewNft(address owner,uint256 tokenId,string tokenUri);

    uint [] public Alltokens;

    ////////////////////
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    event Endedat(uint a);

    struct Auction {
            bool started;
            address owner;
            uint nftId;
            bool status;
            uint endAt;
            address highestBidder;
            uint highestBid;
            bool ended;
        }
    mapping(uint => Auction) auction;
    mapping(uint => mapping(address => uint)) public bids;
    uint256 [] public onBidNftArray;
    uint256 [] public onSaleImformation;
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

    ////////////////////////////////////////////
    function setToken (address tokenAddress) public returns (bool) {
            require(tokenAddress != address(0x0));
            token = IERC20(tokenAddress);
            return true;
        }


    function startAuction(uint nftId, address owner, uint _startingBid) public {

         auction[nftId].nftId = nftId;
         auction[nftId].owner = owner;
         auction[nftId].started = true;
         auction[nftId].highestBid = _startingBid;
         transferFrom(owner, address(this), nftId);
         auction[nftId].endAt = block.timestamp + 1 days;

         onBidNftArray.push(nftId);
         emit Start();
         emit Endedat(auction[nftId].endAt);
      }

    function bid(uint nftId, address buyer, uint amount) public {
        require(auction[nftId].started, "not started");
        require(block.timestamp < auction[nftId].endAt, "ended");
        require(amount > auction[nftId].highestBid, "value < highest");

        if (auction[nftId].highestBidder != address(0)) {
            bids[nftId][auction[nftId].highestBidder] += auction[nftId].highestBid;
        }
        token.transferFrom(buyer, address(this), amount);
        auction[nftId].highestBidder = buyer;
        auction[nftId].highestBid = amount;
       
        emit Bid(auction[nftId].highestBidder, auction[nftId].highestBid);
    }

    function withdraw(address addr, uint nftId) public {
        uint bal = bids[nftId][addr];
        bids[nftId][addr] = 0;
        token.transferFrom(address(this), addr , bal);
       
        emit Withdraw(addr, bal);
    }

    function end(uint nftId, address owner) public {
        address nftOwner = ownerOf(nftId);
        require(nftOwner == msg.sender, "Caller is not nft token owner.");

        require(auction[nftId].started, "not started");
        require(block.timestamp >= auction[nftId].endAt, "not ended");
        require(!auction[nftId].ended, "ended");
        //컨트렉트 소유 경우//
        auction[nftId].ended = true;
        approveSale(address(this));
        if (auction[nftId].highestBidder != address(0)) {
            safeTransferFrom(address(this), auction[nftId].highestBidder, nftId);
            token.transferFrom(address(this), auction[nftId].owner, auction[nftId].highestBid);
        } else {
            safeTransferFrom(address(this), auction[nftId].owner, nftId);
        }
        
        emit End(auction[nftId].highestBidder, auction[nftId].highestBid);
        //유저가 소유 하고 있는 경우//
        // auction[nftId].ended = true;
        // if (auction[nftId].highestBidder != address(0)) {
        //     safeTransferFrom(owner, auction[nftId].highestBidder, nftId);
        //     token.transferFrom(address(this), auction[nftId].owner, auction[nftId].highestBid);
        // } else {
        //     safeTransferFrom(owner, auction[nftId].owner, nftId);
        // }
        // emit End(auction[nftId].highestBidder, auction[nftId].highestBid);
    }

    function showAuctionToken() public view returns(uint){
        return onBidNftArray.length;
    }

    function approveSale(address receipent)  public {
            _setApprovalForAll(receipent, msg.sender, true);
        }
}