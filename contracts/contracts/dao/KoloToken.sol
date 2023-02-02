// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KoloToken is ERC20Votes, Ownable, AccessControl {
    bytes32 public constant TOKEN_ADMIN_ROLE = keccak256("TOCKEN_ADMIN_ROLE");
    bytes32 public constant BURNABLE_ROLE = keccak256("BURNABLE_ROLE");
    bytes32 public constant MINTABLE_ROLE = keccak256("MINTABLE_ROLE");

    uint256 public s_maxSupply = 1000000000000000000000000;

    uint256 public _depositDeadline;
    uint256 public _lockDuration;

    /// Withdraw amount exceeds sender's balance of the locked token
    error ExceedsBalance();
    /// Withdraw is not possible because the lock period is not over yet
    error LockPeriodOngoing();

    constructor() ERC20("KoloToken", "KOLO") ERC20Permit("KoloToken") {
        _mint(address(this), s_maxSupply);

        _setRoleAdmin(TOKEN_ADMIN_ROLE, TOKEN_ADMIN_ROLE);
        _setRoleAdmin(BURNABLE_ROLE, TOKEN_ADMIN_ROLE);
        _setRoleAdmin(BURNABLE_ROLE, TOKEN_ADMIN_ROLE);
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

    /// @dev Withdraw tokens after the end of the locking period or during the deposit period
    /// @param amount The amount of tokens to withdraw
    function withdraw(uint256 amount, address wallet) public onlyOwner {
        if (block.timestamp < _lockDuration) {
            revert LockPeriodOngoing();
        }
        if (balanceOf(msg.sender) < amount) {
            revert ExceedsBalance();
        }

        ERC20.transfer(wallet, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }

    function test(address wallet) external onlyRole(MINTABLE_ROLE) {
        // get amount
        uint256 amount = 1;
        _mint(wallet, amount);
    }

    function burn(address account, uint256 amount)
        external
        onlyRole(BURNABLE_ROLE)
    {
        super._burn(account, amount);
    }
}
