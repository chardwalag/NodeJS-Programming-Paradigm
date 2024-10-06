const { google } = require( 'googleapis' ),
fs = require( 'fs' ),


// Load client secrets from a local file.
credentials = JSON.parse( fs.readFileSync( 'path/to/credentials.json' )),

sheets = google.sheets( 'v4' ),
scopes = [ 'https://www.googleapis.com/auth/spreadsheets' ],
spreadsheetId = 'SPREADSHEET_ID',

getAuthClient = async () => {
  const auth = new google.auth.GoogleAuth({ credentials, scopes })
  authClient = await auth.getClient();
},

readSpreadsheet = async () => {
  if ( !authClient ) await getAuthClient()
  
  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId,
    range: 'test!A1:H10', // Adjust range as needed
  })
  console.log( 'Data from spreadsheet:', response.data.values )
},

writeSpreadsheet = async () => {
  if ( !authClient ) await getAuthClient()
  
  const response = await sheets.spreadsheets.values.update({
    auth: authClient,
    spreadsheetId,
    range: 'test!A1:D1', // Adjust range as needed
    valueInputOption: 'RAW',
    resource: { values: [[ '1', '2', '3', '4' ]]},
  })
  console.log( 'Cells updated:', response.data.updatedCells )
}

let authClient

// readSpreadsheet().catch( console.error )
writeSpreadsheet().catch( console.error )