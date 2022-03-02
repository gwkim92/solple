// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
interface IERC721 {
    function transfer(address, uint) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;

    function safeTransferFrom(
        address,
        address,
        uint
    ) external;
}

contract Auction {
    
    IERC20 public token;
    IERC721 public nft;
    address public seller;
    constructor() {
        seller = msg.sender;
    }
 
    event NewNft(address owner,uint256 tokenId,string tokenUri);

    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    event Endedat(uint a);


    bool public started;
    bool public ended;
    bool public endAt;
    uint public highestBid;
    uint public highestBidder;

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

    function startAuction(uint nftId, address owner, uint _startingBid) public {

         auction[nftId].nftId = nftId;
         auction[nftId].owner = owner;
         auction[nftId].started = true;
         auction[nftId].highestBid = _startingBid;
         nft.transferFrom(owner, address(this), nftId);
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
    }

    function withdraw(address addr, uint nftId) public {
        uint bal = bids[nftId][addr];
        bids[nftId][addr] = 0;
        token.transferFrom(address(this), addr , bal);
       
        emit Withdraw(addr, bal);
    }

    function end(uint nftId) public {
        // address nftOwner = ownerOf(nftId);
        // require(nftOwner == msg.sender, "Caller is not nft token owner.");

        require(auction[nftId].started, "not started");
        require(block.timestamp >= auction[nftId].endAt, "not ended");
        require(!auction[nftId].ended, "ended");
        //컨트렉트 소유 경우//
        auction[nftId].ended = true;
        if (auction[nftId].highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), auction[nftId].highestBidder, nftId);
            token.transferFrom(address(this), auction[nftId].owner, auction[nftId].highestBid);
        } else {
            nft.safeTransferFrom(address(this), auction[nftId].owner, nftId);
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

}