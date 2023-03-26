// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Lottery{
    address public owner;
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address) public lotteryHistory;

    constructor(){
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable{
        require(msg.value > .01 ether, "msg.value should be greater than or equal to 0.01 ether");
        players.push(payable(msg.sender));
    }

    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function getRandomNumberV2() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function getRandomNumberV3() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(blockhash(block.number -1), block.timestamp)));
    }

    function pickWinner() public onlyOwner {
        uint256 index = getRandomNumber() % players.length;

        //address payable은 address에 저장가능. 반대는 불가. address > address payable
        lotteryHistory[lotteryId] = players[index];
        lotteryId++;

        (bool success, ) = players[index].call{value: address(this).balance}("");
        require(success, "Failed to send Ether");

        players = new address payable[](0);
    }

    //재사용을 위해 modifier로 분리
    modifier onlyOwner {
        require(msg.sender == owner, "you`re not owner");
        _; //modifier를 실행 후 함수를 실행시키는 구문
    }
}