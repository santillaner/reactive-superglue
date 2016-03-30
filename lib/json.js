var _ = require("./file")

module.exports = _;
_.from_jsonfile=_jsonfile;
_.from_json=_json;

function _json(file, opts){
    return _.from_file(file, opts).collect().map(lines=>lines.join()).map(JSON.parse)
}
function _jsonfile(file, opts, sep){
    sep=sep||"\n"
    return _.file(file, opts).splitBy(sep).map(JSON.parse)
}

var proto=_().constructor.prototype

proto.to_json=function(path, opts){
    var tojs=this.map(x=>JSON.stringify(x)+"\n")
    return tojs;
    //TODO write to file
}
proto.to_jsonfile=function(path, opts){}
