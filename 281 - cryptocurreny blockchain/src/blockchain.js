const Block = require( './block' )


class Blockchain {
  constructor() {
    this.chain = [ this.createGenesisBlock()]
    this.currentTransactions = []
  }

  createGenesisBlock() {
    return new Block( 0, "0", Date.now(), "Genesis Block", 0 )
  }

  getLatestBlock() {
    return this.chain[ this.chain.length - 1 ]
  }

  addBlock( newBlock ) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push( newBlock )
  }

  createTransaction( sender, recipient, amount ) {
    this.currentTransactions.push({ sender, recipient, amount })
  }

  // simulate block mining
  createRandomBlock() {
    const randomData = {
      sender: `User${ Math.floor( Math.random() * 100 )}`,
      recipient: `User${ Math.floor( Math.random() * 100 )}`,
      amount: Math.floor( Math.random() * 100 ) + 1 // Random amount between 1 and 100
    },
    
    proof = Math.floor( Math.random() * 100000 ), // Random proof for simplicity
    newBlock = new Block( this.chain.length, this.getLatestBlock().hash, Date.now(), randomData, proof )
    this.addBlock( newBlock )
  }
}


module.exports = Blockchain