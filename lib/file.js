var _ = require("highland")
var fs=require("fs")

module.exports = _;
_.from_file=_file;

function _file(path, opts) {
    return _(fs.createReadStream(path, opts))
}

var proto=_().constructor.prototype

proto.to_file=function(file, opts){
    var forked=this.fork()
    forked.pipe(fs.createWriteStream(file, opts))
    return this;
}

