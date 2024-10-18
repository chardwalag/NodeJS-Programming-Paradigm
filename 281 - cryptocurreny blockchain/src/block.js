const SHA256 = require( 'crypto-js/sha256' )

class Block {
  constructor( index, previousHash, timestamp, data, proof ) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.proof = proof;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256( this.index + this.previousHash + this.timestamp + JSON.stringify( this.data ) + this.proof ).toString()
  }
}


module.exports = Block