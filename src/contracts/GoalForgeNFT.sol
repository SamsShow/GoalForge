// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGoalForgeTypes.sol";

contract GoalForgeNFT is ERC721, Ownable {
    struct NFTMetadata {
        IGoalForgeTypes.HabitType habitType;
        uint256 mintedAt;
        uint256 daysCompleted;
    }
    
    mapping(uint256 => NFTMetadata) public tokenMetadata;
    uint256 private _nextTokenId;

    event NFTMinted(
        address indexed user, 
        uint256 tokenId, 
        IGoalForgeTypes.HabitType habitType
    );

    constructor() ERC721("GoalForge NFT", "GNFT") Ownable(msg.sender) {}

    function mint(
        address to, 
        IGoalForgeTypes.HabitType habitType, 
        uint256 daysCompleted
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        
        tokenMetadata[tokenId] = NFTMetadata({
            habitType: habitType,
            mintedAt: block.timestamp,
            daysCompleted: daysCompleted
        });

        emit NFTMinted(to, tokenId, habitType);
        return tokenId;
    }

    function getTokenMetadata(uint256 tokenId) external view returns (NFTMetadata memory) {
        return tokenMetadata[tokenId];
    }
}
