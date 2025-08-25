// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";

/**
 * @title DecentralizedJournal
 * @dev A smart contract for minting academic papers as NFTs in a decentralized journal
 * Authors can mint papers and earn from citations
 * Users pay authors to cite their papers with on-chain proof
 */
contract DecentralizedJournal is ReentrancyGuard, AbstractBlocklockReceiver {    
    address public immutable owner1;

    uint256 public requestId;
    TypesLib.Ciphertext public encryptedValue;
    string public plainTextValue;

    // Token counter for unique paper IDs
    uint256 private _tokenIdCounter;
    
    // Citation counter for unique citation IDs
    uint256 private _citationIdCounter;
    
    // Paper metadata structure
    struct PaperMetadata {
        string title;
        string abstractText;
        string ipfsHash;
        address author;
        uint256 timestamp;
        string[] keywords;
        string field; // e.g., "synthetic biology", "computer science"
        uint256 citationCount;
        uint256 totalEarnings; // Total earnings from citations
    }
    
    // Citation structure for on-chain proof
    struct Citation {
        uint256 citationId;
        uint256 citedPaperId; // Paper being cited
        address citer; // Who is citing
        string citerTitle; // Title of the citing work
        string citerAuthorName; // Name of the citing author
        uint256 paymentAmount; // Amount paid for citation
        uint256 timestamp;
    }
    
    // Mapping from token ID to paper metadata
    mapping(uint256 => PaperMetadata) public papers;
    
    // Mapping from author to their paper IDs
    mapping(address => uint256[]) public authorPapers;
    
    // Mapping from citation ID to citation data
    mapping(uint256 => Citation) public citations;
    
    // Mapping from paper ID to all its citations
    mapping(uint256 => uint256[]) public paperCitations;
    
    // Mapping from citer address to their citations
    mapping(address => uint256[]) public citerCitations;
    
    // Citation pricing (can be set per paper or globally)
    mapping(uint256 => uint256) public citationPrices; // paperId => price in wei
    uint256 public defaultCitationPrice = 0.01 ether; // Default price
    
    // Events
    event PaperMinted(
        uint256 indexed paperId,
        address indexed author,
        string ipfsHash,
        string title,
        uint256 timestamp
    );
    
    event CitationPaid(
        uint256 indexed citationId,
        uint256 indexed citedPaperId,
        address indexed citer,
        string citerTitle,
        string citerAuthorName,
        uint256 paymentAmount,
        uint256 timestamp
    );
    
    event CitationPriceSet(
        uint256 indexed paperId,
        uint256 price
    );
    
    // Modifiers
    modifier validMetadata(string memory title, string memory abstractText, string memory ipfsHash) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(abstractText).length > 0, "Abstract cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        _;
    }

    modifier onlyOwner1() {
        require(msg.sender == owner1, "Not the Owner");
        _;
    }
    
    modifier paperExists(uint256 paperId) {
        require(paperId < _tokenIdCounter, "Paper does not exist");
        _;
    }
    
    constructor(
        address _owner,
        address blocklockContract
    )
        AbstractBlocklockReceiver(blocklockContract)
    {
        owner1 = _owner;
    }
    
    /**
     * @dev Mint a new paper NFT
     * @param title The paper's title
     * @param abstractText The paper's abstract
     * @param ipfsHash IPFS hash containing the full paper content
     * @param keywords Array of keywords for the paper
     * @param field The academic field (e.g., "synthetic biology")
     */
    function mintPaper(
        string memory title,
        string memory abstractText,
        string memory ipfsHash,
        string[] memory keywords,
        string memory field
    ) external nonReentrant validMetadata(title, abstractText, ipfsHash) {
        // Get next token ID
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        
        // Store paper metadata
        papers[tokenId] = PaperMetadata({
            title: title,
            abstractText: abstractText,
            ipfsHash: ipfsHash,
            author: msg.sender,
            timestamp: block.timestamp,
            keywords: keywords,
            field: field,
            citationCount: 0,
            totalEarnings: 0
        });
        
        // Add to author's paper list
        authorPapers[msg.sender].push(tokenId);
        
        // Set default citation price
        citationPrices[tokenId] = defaultCitationPrice;
        
        // Emit event
        emit PaperMinted(tokenId, msg.sender, ipfsHash, title, block.timestamp);
    }
    
    /**
     * @dev Pay to cite a paper - creates on-chain proof of citation
     * @param paperId The paper being cited
     * @param citerTitle Title of the work that is citing
     * @param citerAuthorName Name of the author who is citing
     */
    function payCitation(
        uint256 paperId,
        string memory citerTitle,
        string memory citerAuthorName
    ) external payable nonReentrant paperExists(paperId) {
        require(bytes(citerTitle).length > 0, "Citer title cannot be empty");
        require(bytes(citerAuthorName).length > 0, "Citer author name cannot be empty");
        
        uint256 citationPrice = getCitationPrice(paperId);
        require(msg.value >= citationPrice, "Insufficient payment for citation");
        
        // Get citation ID
        uint256 citationId = _citationIdCounter;
        _citationIdCounter += 1;
        
        // Create citation record
        citations[citationId] = Citation({
            citationId: citationId,
            citedPaperId: paperId,
            citer: msg.sender,
            citerTitle: citerTitle,
            citerAuthorName: citerAuthorName,
            paymentAmount: msg.value,
            timestamp: block.timestamp
        });
        
        // Add to paper's citations
        paperCitations[paperId].push(citationId);
        
        // Add to citer's citations
        citerCitations[msg.sender].push(citationId);
        
        // Update paper metadata
        papers[paperId].citationCount += 1;
        papers[paperId].totalEarnings += msg.value;
        
        uint256 authorPayment = msg.value;
        
        // Pay the author
        address payable author = payable(papers[paperId].author);
        (bool success, ) = author.call{value: authorPayment}("");
        require(success, "Payment to author failed");
        
        // Keep platform fee in contract (owner can withdraw)
        
        // Emit event
        emit CitationPaid(
            citationId,
            paperId,
            msg.sender,
            citerTitle,
            citerAuthorName,
            msg.value,
            block.timestamp
        );
    }
    
    /**
     * @dev Set citation price for a specific paper (only paper owner)
     * @param paperId The paper ID
     * @param price New citation price in wei
     */
    function setCitationPrice(uint256 paperId, uint256 price) 
        external 
        paperExists(paperId)
    {
        citationPrices[paperId] = price;
        emit CitationPriceSet(paperId, price);
    }

    function createTimelockRequestWithDirectFunding(
        uint32 callbackGasLimit,
        bytes calldata condition,
        TypesLib.Ciphertext calldata encryptedData
    ) external payable returns (uint256, uint256) {
        // create timelock request
        (uint256 _requestId, uint256 requestPrice) =
            _requestBlocklockPayInNative(callbackGasLimit, condition, encryptedData);
        // store request id
        requestId = _requestId;
        // store Ciphertext
        encryptedValue = encryptedData;
        return (requestId, requestPrice);
    }
    
    /**
     * @dev Get citation price for a paper
     * @param paperId The paper ID
     */
    function getCitationPrice(uint256 paperId) public view returns (uint256) {
        uint256 price = citationPrices[paperId];
        return price > 0 ? price : defaultCitationPrice;
    }
    
    /**
     * @dev Get all citations for a paper
     * @param paperId The paper ID
     */
    function getPaperCitations(uint256 paperId) external view returns (uint256[] memory) {
        return paperCitations[paperId];
    }
    
    /**
     * @dev Get all citations made by a user
     * @param citer The citer's address
     */
    function getCiterCitations(address citer) external view returns (uint256[] memory) {
        return citerCitations[citer];
    }
    
    /**
     * @dev Get citation details
     * @param citationId The citation ID
     */
    function getCitation(uint256 citationId) external view returns (Citation memory) {
        return citations[citationId];
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
     * @dev Get total number of papers minted
     */
    function getTotalPapers() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Get total number of citations made
     */
    function getTotalCitations() external view returns (uint256) {
        return _citationIdCounter;
    }

    /**
     * @dev Withdraw platform fees (only owner)
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner1).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function _onBlocklockReceived(uint256 _requestId, bytes calldata decryptionKey) internal override {
        require(requestId == _requestId, "Invalid request id");
        plainTextValue = abi.decode(_decrypt(encryptedValue, decryptionKey), (string));
    }
}