
const xml2js   = require( 'xml2js' );
let profiles = require( './profiles' );


const builder = new xml2js.Builder( { rootName: 'profiles' } );
profiles = builder.buildObject( profiles );
profiles = profiles.replace( /name/g, 'fullname' );
console.log( profiles );

xml2js.parseString(
    profiles,
    {
        explicitArray: false,
        explicitRoot: false
    },
    ( err, obj ) => {
        profiles = obj;
        console.log( profiles );
    }
);
