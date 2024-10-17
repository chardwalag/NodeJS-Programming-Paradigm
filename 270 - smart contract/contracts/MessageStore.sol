// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageStore {
  struct Message {
    string content;
    address sender;
  }

  Message[] public messages;

  function sendMessage(string memory _content) public {
    messages.push(Message(_content, msg.sender));
  }

  function getMessages() public view returns (Message[] memory) {
    return messages;
  }
}
