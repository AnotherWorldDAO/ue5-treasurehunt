// SPDX-License-Identifier: MIT

//
// MockERC20.sol (standard erc-20)
//

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MockERC20 is ERC20, Ownable {

    constructor() ERC20("MockApeCoin", "MAPE") {
        _mint(msg.sender, 10 ** 9 * 10 ** 18);
    }
}
