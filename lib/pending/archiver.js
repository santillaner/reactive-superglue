var _=require("highland")
var archiver=require("archiver")
var zlib=require("zlib")

var proto=_().constructor.prototype

_.unzip=function(path, opts){}
_.untar=function(path, opts){}
proto.gunzip=function(){}
proto.gzip=function(){}
proto.deflate=function(){}
proto.inflate=function(){}

proto.zip=function(path, opts) {}
proto.tar=function(path, opts){}
