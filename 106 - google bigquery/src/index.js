const { BigQuery } = require( '@google-cloud/bigquery' ),
path = require( 'path' ),


keyFilePath = path.join( __dirname, '../service-account-file.json' ),
location = 'asia-southeast2',

queryClient = new BigQuery({ projectId: 'PROJECT_ID', keyFilename: keyFilePath }),

waitFor = sec => new Promise( res => setTimeout( res, sec * 1000 )),

start = async () => {
  const dsId = 'dataset101', tblId = 'product-101'
  dataset = queryClient.dataset( dsId ),
  [ exists ] = await dataset.exists()

  if ( !exists ) {
    await createDataset( dsId )
    await createTable( dsId, tblId )
  }
  await insertData( dsId, tblId )
  await queryData( dsId, tblId )
},

createDataset = async ( dsId ) => {
  const options = { location }
  try {
    const [ ds ] = await queryClient.createDataset( dsId, options )
    console.log( `Dataset ${ ds.id } created.` )
  } catch ( err ) {
    console.error( 'ERROR at createDataset', err )
  }
},

createTable = async ( dsId, tblId ) => {
  const schema = [
    { name: 'name', type: 'STRING' },
    { name: 'brand', type: 'STRING' },
    { name: 'manufacturer', type: 'STRING' },
  ],
  options = { schema: schema, location }

  try {
    const [ tbl ] = await queryClient.dataset( dsId ).createTable( tblId, options )
    console.log( `Table ${ tbl.id } created.` )
  } catch ( err ) {
    console.error( 'ERROR at createTable', err )
  }
},

insertData = async ( dsId, tblId ) => {
  const dataset = queryClient.dataset( dsId )

  // delay just to make sure dataset is ready to accept queries
  for ( let i = 0, exists, maxTries = 5; !exists; ++i ) {
    waitFor( 5 );
    [ exists ] = await dataset.exists()
    if ( i >= maxTries ) {
      console.log( 'Dataset is not ready for queries' )
      return
    }
  }

  const rows = [
    { name: 'ProdXXX0', brand: 'A', manufacturer: 'Alpha' },
    { name: 'ProdYYY0', brand: 'B', manufacturer: 'Beta' },
    { name: 'ProdZZZ0', brand: 'Z', manufacturer: 'Zeta' },
    { name: 'ProdXXX1', brand: 'C', manufacturer: 'Alpha' },
  ];

  try {
    await queryClient.dataset( dsId ).table( tblId ).insert( rows )
    console.log( 'Inserted rows:', rows )
  } catch ( err ) {
    console.error( 'ERROR at insertData', err )
  }
},

queryData = async ( dsId, tblId ) => {
  const sqlQuery = `SELECT * FROM \`${ dsId }.${ tblId }\``,
  options = { query: sqlQuery, location }

  try {
    const [ rows ] = await queryClient.query( options )
    console.log( 'Results:' )
    rows.forEach( row => console.log( row ))
  } catch ( err ) {
    console.error( 'ERROR at queryData', err )
  }
}

start().catch(console.error)