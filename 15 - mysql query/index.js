
// to run the mysqld:
//   navigate to the mysql bin directory and enter in the CLI
//     mysqld.exe -u root --skip-grant-tables
//   to test, open a new CLI at the same directory and enter mysql

const mysql = require( 'mysql' );


const connection = mysql.createConnection(
    {
        user: 'root',
        password: 'root'
    }
);

connection.query( 'CREATE DATABASE quotes' );
connection.changeUser( { database: 'quotes' } );

const ignore = [ mysql.ERROR_DB_CREATE_EXISTS, mysql.ERROR_TABLE_EXISTS_ERROR ];
connection.on(
    'error',
    err => {
        if ( -1 !== ignore.indexOf( err.number ) )
            return;
        
        throw err;
    }
);

connection.query(
    'CREATE TABLE quotes.quotes (' +
    'id INT NOT NULL AUTO_INCREMENT, ' +
    'author VARCHAR( 128 ) NOT NULL, ' +
    'quote TEXT NOT NULL, PRIMARY KEY ( id )' +
    ')'
);

const params = {
    author: process.argv[ 2 ],
    quote : process.argv[ 3 ]
};
if ( params.author && params.quote )
    connection.query(
        'INSERT INTO quotes.quotes (' +
        'author, quote)' +
        'VALUES (?, ?);',
        [ params.author, params.quote ]
    );
if ( params.author )
    connection.query(
        'SELECT * FROM quotes WHERE ' +
        'author LIKE ' + connection.escape( params.author )
    ).on(
        'result',
        rec => {
            console.log( '%s: %s \n', rec.author, rec.quote );
        }
    );
connection.end();

