
var should = require( 'should' );
var mp3dat = require( '../index.js' );
var testFile = 'Bruno Mars - Thats What I Like Official Video.mp3';

should.exist( mp3dat );
mp3dat.should.have.property( 'stat' );
mp3dat.stat.should.be.a.Function;

mp3dat.stat(
    testFile,
    ( err, stats ) => {
        should.ifError( err );

        stats.should.have.property( 'duration' );
        stats.should.have.property( 'bitrate' );
        stats.should.have.property( 'filesize' );
        stats.should.have.property( 'timestamp' );
        stats.should.have.property( 'timesig' );

        stats.duration.should.be.an.Object;
        stats.bitrate.should.be.an.Number;
        stats.filesize.should.be.an.Number;
        stats.timestamp.should.be.an.Number;
        
        stats.timesig.should.match( /^\d+:\d+:\d+$/ );

        stats.duration.should.have.keys( 'hours', 'minutes', 'seconds', 'milliseconds' );

        stats.duration.hours.should.be.a.Number;
        stats.duration.minutes.should.be.below( 60 ).and.be.a.Number;
        stats.duration.seconds.should.be.below( 60 ).and.be.a.Number;
        stats.duration.milliseconds.should.be.below( 1000 ).and.be.a.Number;
        
        console.log( 'All tests passed' );
    }
);

