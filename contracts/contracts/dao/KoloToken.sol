// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract KoloToken is ERC20Votes, Ownable, AccessControl {
    bytes32 public constant TOKEN_ADMIN_ROLE = keccak256("TOCKEN_ADMIN_ROLE");
    bytes32 public constant BURNABLE_ROLE = keccak256("BURNABLE_ROLE");
    bytes32 public constant AIRDROP_ROLE = keccak256("AIRDROP_ROLE");
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    uint256 public constant FIRST_MINT_SUPPLY = 1e6 ether;
    uint256 public constant YEAR = 365 days;
    uint256 public constant HALF_YEAR = 0.5 * 365 days;
    uint256 public constant AIRDROP_FACTOR = 1 ether;

    uint256 public immutable _dateStart;
    uint256 public _nextUnlockTime;
    uint256[] public PERIOD_UNLOCKED;

    constructor() ERC20("KoloToken", "KOLO") ERC20Permit("KoloToken") {
        _setRoleAdmin(TOKEN_ADMIN_ROLE, TOKEN_ADMIN_ROLE);
        _setRoleAdmin(BURNABLE_ROLE, TOKEN_ADMIN_ROLE);
        _setRoleAdmin(AIRDROP_ROLE, TOKEN_ADMIN_ROLE);
        _setupRole(TOKEN_ADMIN_ROLE, address(this));

        _grantRole(AIRDROP_ROLE, msg.sender);

        PERIOD_UNLOCKED = new uint256[](3);
        PERIOD_UNLOCKED[0] = (FIRST_MINT_SUPPLY * 3) / 100; // 0 - 182 days = 30%
        PERIOD_UNLOCKED[1] = (FIRST_MINT_SUPPLY * 3) / 100; // 182 - 365 days = 30%
        PERIOD_UNLOCKED[2] =
            FIRST_MINT_SUPPLY -
            PERIOD_UNLOCKED[0] -
            PERIOD_UNLOCKED[1]; // 1 year++ 40%
        _dateStart = block.timestamp;
        _nextUnlockTime = block.timestamp + HALF_YEAR;

        _mint(address(this), FIRST_MINT_SUPPLY);
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
    function withdraw(uint256 amount) public onlyRole(WITHDRAW_ROLE) {
        uint256 period = (block.timestamp - _dateStart) / HALF_YEAR;

        if (period >= PERIOD_UNLOCKED.length)
            period = PERIOD_UNLOCKED.length - 1;

        if (block.timestamp > _nextUnlockTime) {
            _nextUnlockTime += HALF_YEAR;
            PERIOD_UNLOCKED[period] += PERIOD_UNLOCKED[period - 1];
        }

        require(
            amount < PERIOD_UNLOCKED[period],
            "KoloToken: Tokens exhausted for a period"
        );

        PERIOD_UNLOCKED[period] -= amount;
        ERC20.transfer(msg.sender, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Votes)
    {
        super._burn(account, amount);
    }

    // 0 - 182 days = 1 KOLO
    // 182 - 365 days = 0.5 KOLO
    // 365++ days = 0 KOLO
    function currentAirdropFactor() external view returns (uint256 val) {
        uint256 delta = block.timestamp - _dateStart;
        val = delta >= YEAR
            ? 0
            : AIRDROP_FACTOR - 0.5 ether * (delta / HALF_YEAR);
    }

    function airdrop(address wallet) external onlyRole(AIRDROP_ROLE) {
        uint256 amount = this.currentAirdropFactor();

        if (amount > 0) {
            _mint(wallet, amount);
        }
    }

    function burn(address account, uint256 amount)
        external
        onlyRole(BURNABLE_ROLE)
    {
        super._burn(account, amount);
    }
}
