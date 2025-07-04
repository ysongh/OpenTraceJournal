// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DecentralizedJournal
 * @dev A smart contract for minting academic papers as NFTs in a decentralized journal
 * Authors can mint papers by paying a fee
 * Paper metadata is stored on-chain with IPFS hash for full content
 */
contract DecentralizedJournal is ERC721, ERC721URIStorage, ReentrancyGuard {    
    address public immutable owner;

    // Token counter for unique paper IDs
    uint256 private _tokenIdCounter;
    
    // Paper metadata structure
    struct PaperMetadata {
        string title;
        string abstractText;
        string ipfsHash;
        address author;
        uint256 timestamp;
        string[] keywords;
        string field; // e.g., "synthetic biology", "computer science"
    }
    
    // Mapping from token ID to paper metadata
    mapping(uint256 => PaperMetadata) public papers;
    
    // Mapping from author to their paper IDs
    mapping(address => uint256[]) public authorPapers;
    
    // Events
    event PaperMinted(
        uint256 indexed paperId,
        address indexed author,
        string ipfsHash,
        string title,
        uint256 timestamp
    );
    
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    
    // Modifiers
    modifier validMetadata(string memory title, string memory abstractText, string memory ipfsHash) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(abstractText).length > 0, "Abstract cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        _;
    }

    modifier onlyOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }
    
    constructor(
        address _owner
    ) ERC721("DecentralizedJournal", "DJNL") {
        owner = _owner;
    }
    
    /**
     * @dev Mint a new paper NFT
     * @param title The paper's title
     * @param abstractText The paper's abstract
     * @param ipfsHash IPFS hash containing the full paper content
     * @param keywords Array of keywords for the paper
     * @param field The academic field (e.g., "synthetic biology")
     * @param tokenURI URI for the NFT metadata (optional, can be empty)
     */
    function mintPaper(
        string memory title,
        string memory abstractText,
        string memory ipfsHash,
        string[] memory keywords,
        string memory field,
        string memory tokenURI
    ) external nonReentrant validMetadata(title, abstractText, ipfsHash) {
        // Get next token ID
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        
        // Set token URI if provided
        if (bytes(tokenURI).length > 0) {
            _setTokenURI(tokenId, tokenURI);
        }
        
        // Store paper metadata
        papers[tokenId] = PaperMetadata({
            title: title,
            abstractText: abstractText,
            ipfsHash: ipfsHash,
            author: msg.sender,
            timestamp: block.timestamp,
            keywords: keywords,
            field: field
        });
        
        // Add to author's paper list
        authorPapers[msg.sender].push(tokenId);
        
        // Emit event
        emit PaperMinted(tokenId, msg.sender, ipfsHash, title, block.timestamp);
    }
    
    /**
     * @dev Get paper metadata by token ID
     * @param tokenId The paper's token ID
     */
    function getPaper(uint256 tokenId) external view returns (PaperMetadata memory) {
        return papers[tokenId];
    }
    
    /**
     * @dev Get all paper IDs by author
     * @param author The author's address
     */
    function getPapersByAuthor(address author) external view returns (uint256[] memory) {
        return authorPapers[author];
    }
    
    /**
     * @dev Get paper keywords by token ID
     * @param tokenId The paper's token ID
     */
    function getPaperKeywords(uint256 tokenId) external view returns (string[] memory) {
        return papers[tokenId].keywords;
    }
    
    /**
     * @dev Get total number of papers minted
     */
    function getTotalPapers() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // DAO Governance Functions

    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
