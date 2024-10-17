require( 'dotenv' ).config()

const express = require( 'express' ),
cors = require( 'cors' ),
bodyParser = require( 'body-parser' ),
{ ethers } = require( 'ethers' ),
fs = require( 'fs' ),
path = require( 'path' ),
{ CompileFailedError, compileSol } = require( 'solc-typed-ast' ),


app = express(),
PORT = process.env.PORT || 3000

app.use( cors())
app.use( bodyParser.json())
app.use( express.static( path.join( __dirname, '../public'))),

compileAndDeployContract = async () => {
  const contractPath = path.resolve( __dirname, '../contracts/MessageStore.sol' ),
  source = fs.readFileSync( contractPath, 'utf8' )
  
  let result

  try {
    result = await compileSol( source, "auto", [])
    console.log( "Compilation successful!" )
  } catch ( err ) {
    if ( err instanceof CompileFailedError ) {
      console.error( "Compile errors encountered:" )
      for ( const failure of err.failures ) {
        console.error( `Solc ${ failure.compilerVersion }:` )
        for ( const err of failure.errors ) console.error( err )
      }
    }
    else console.error( err.message )
    return
  }

  const abi = result.data.contracts[ contractPath ][ 'MessageStore' ].abi,
  bytecode = result.data.contracts[ contractPath ][ 'MessageStore' ].evm.bytecode.object,
  factory = new ethers.ContractFactory( abi, bytecode, wallet ),
  contract = await factory.deploy()
  await contract.waitForDeployment()
  console.log( `Contract deployed at address: ${ await contract.getAddress()}` )

  return contract
},

init = async () => {
  provider = new ethers.providers.AlchemyProvider( 'goerli', process.env.ALCHEMY_API_KEY )
  wallet = new ethers.Wallet( process.env.PRIVATE_KEY, provider )
  contract = await compileAndDeployContract()
}

let provider, wallet, contract;

app.post( '/send', async ( req, res ) => {
  const { message } = req.body;
  try {
    const tx = await contract.sendMessage( message )
    await tx.wait()
    res.status( 200 ).send({ success: true })
  } catch ( err ) {
    res.status( 500 ).send({ error: err.message })
  }
})

app.get( '/messages', async ( req, res ) => {
  try {
    const messages = await contract.getMessages()
    res.status( 200 ).send( messages )
  } catch ( err ) {
      res.status( 500 ).send({ error: err.message })
  }
})

app.listen( PORT, async () => {
  console.log( `Server is running on http://localhost:${ PORT }` )
  await init()
})