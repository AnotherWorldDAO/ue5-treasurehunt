// SPDX-License-Identifier: MIT
//
// GamePrize.sol
//
// v1: Players who triggerred in-game events will receive airdrop/drip prizes.
//

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract BaseErc20 {
    function balanceOf(address account) public virtual returns (uint256);
    function transfer(address recipient, uint256 amount) public virtual;
}

contract GamePrize is Ownable {
    event Received(address, uint);
    event Drip(address, address, uint256);
    event NewPrizeOperator(address);
    event NewAmount(address, uint256);
    event OwnerWithdrawErc20(address, address, uint256);

    BaseErc20 private token20;
    address public prizeOperator;

    mapping(address => uint256) public amount; // different tokens can have custom drip amount

    constructor() {
        prizeOperator = msg.sender; // server operator
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function setPrizeOperator(address newPrizeOperator) public onlyOwner {
        prizeOperator = newPrizeOperator;
        emit NewPrizeOperator(prizeOperator);
    }

    function setAmount(
        address erc20Address,
        uint256 newAmount
    ) public onlyOwner {
        amount[erc20Address] = newAmount;
        emit NewAmount(erc20Address, amount[erc20Address]);
    }

    function drip(address erc20Address, address to) external {
        require(prizeOperator == msg.sender, "invalid operator"); // only prizeOperator can airdrop
        token20 = BaseErc20(erc20Address); // erc-20 address
        token20.transfer(to, amount[erc20Address]);
        emit Drip(erc20Address, to, amount[erc20Address]);
    }

    function withdrawErc20(address erc20Address) external onlyOwner {
        require(erc20Address != address(0), "invalid erc20 address");
        token20 = BaseErc20(erc20Address);
        require(token20.balanceOf(address(this)) > 0, "already empty");
        uint256 withdrawAmount = token20.balanceOf(address(this));
        token20.transfer(msg.sender, withdrawAmount);
        emit OwnerWithdrawErc20(msg.sender, erc20Address, withdrawAmount);
    }

    function withdraw() external payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
}
