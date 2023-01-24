// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

interface INotary {
    function deposit() external;

    function withdraw() external;

    function vote() external;

    function penalty() external;

    function chooseNotary() external;
}
