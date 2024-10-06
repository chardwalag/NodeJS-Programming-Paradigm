
var assert = require( 'assert' );
var mp3dat = require( '../index.js' );
var testFile = 'Bruno Mars - Thats What I Like Official Video.mp3';

assert( mp3dat, 'mp3dat failed to load' );
assert( mp3dat.stat, 'there should be a stat method' );
assert( mp3dat.stat instanceof Function, 'stat should be a Function' );

mp3dat.stat(
    testFile,
    ( err, stats ) => {
        assert.ifError( err );
        assert( stats.duration, 'should be a thuthy duration property' );
        assert( stats.bitrate, 'should be a thuthy bitrate property' );
        assert( stats.filesize, 'should be a thuthy filesize property' );
        assert( stats.timestamp, 'should be a thuthy timestamp property' );
        assert( stats.timesig, 'should be a thuthy timesig property' );

        assert.equal( typeof stats.duration, 'object', 'duration should be an object type' );        
        assert( stats.duration instanceof Object, 'duration should be an instance of Object' );
        assert( !isNaN( stats.bitrate ), 'bitrate should be a number' );
        assert( !isNaN( stats.filesize ), 'filesize should be a number' );
        assert( !isNaN( stats.timestamp ), 'timestamp should be a number' );

        assert( stats.timesig.match( /^\d+:\d+:\d+$/ ), 'timesig should be in HH:MM:SS format' );

        assert.notStrictEqual( stats.duration.hours, undefined, 'should be a duration.hours property' );
        assert.notStrictEqual( stats.duration.minutes, undefined, 'should be a duration.minutes property' );
        assert.notStrictEqual( stats.duration.seconds, undefined, 'should be a duration.seconds property' );
        assert.notStrictEqual( stats.duration.milliseconds, undefined, 'should be a duration.milliseconds property' );

        assert( !isNaN( stats.duration.hours ), 'duration.hours should be a number' );
        assert( !isNaN( stats.duration.minutes ), 'duration.minutes should be a number' );
        assert( !isNaN( stats.duration.seconds ), 'duration.seconds should be a number' );
        assert( !isNaN( stats.duration.milliseconds ), 'duration.milliseconds should be a number' );

        assert( stats.duration.minutes < 60, 'duration.minutes should no greater than 59' );
        assert( stats.duration.seconds < 60, 'duration.seconds should no greater than 59' );
        assert( stats.duration.milliseconds < 1000, 'duration.milliseconds should no greater than 999' );
        assert( stats.duration.minutes < 60, 'duration.minutes should no greater than 59' );

        console.log( 'All tests passed' );
    }
);

