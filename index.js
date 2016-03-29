var _=require("highland")

module.exports=_

//load all the mixins in the lib folder (only top-level):
var require_all=require("require-all")
require_all({
    dirname:  __dirname + '/lib',
    recursive: false});




//parsers:
//csv, json, xml
//encoders & decoders: zip, tgz, snappy, ciphers, ...
//db's: mongo, sql, cassandra, level, couch
//http: client stream, server input stream, server output stream
//middleware: http(client-in, client-out, server-in, server-out), websockets, smtp, s3, activemq, cics, tcp, udp, ftp, ...
//geo: to_geojson, from_geojson, distance-operators, geo-filters, ...
//signal processing: fir & iir, median, mean, max-min, node-gsl integration...
//other ideas: seedlink, aws lambda integration