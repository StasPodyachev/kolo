// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KoloToken is ERC20Votes, Ownable, AccessControl {
    bytes32 public constant BURNABLE_ROLE = keccak256("BURNABLE_ROLE");
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() ERC20("KoloToken", "KOLO") ERC20Permit("KoloToken") {
        _mint(msg.sender, s_maxSupply);
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

    function burn(address account, uint256 amount)
        external
        onlyRole(BURNABLE_ROLE)
    {
        super._burn(account, amount);
    }
}
