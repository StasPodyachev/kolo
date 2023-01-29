// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KoloToken is ERC20Votes, Ownable {
    uint256 public s_maxSupply = 1000000000000000000000000;
    mapping(address => bool) private _burnAccesses;

    constructor() ERC20("KoloToken", "KOLO") ERC20Permit("KoloToken") {
        _mint(msg.sender, s_maxSupply);
    }

    function setBurnAccess(address account, bool access) external onlyOwner {
        _burnAccesses[account] = access;
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }

    function burn(address account, uint256 amount) external {
        require(_burnAccesses[msg.sender], "KoloToken: No access");

        super._burn(account, amount);
    }
}
