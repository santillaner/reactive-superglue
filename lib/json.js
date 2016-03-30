var _ = require("./file")

module.exports = _;
_.from_jsonfile=_jsonfile;
_.from_json=_json;

function _json(file, opts){
    return _.from_file(file, opts).collect().map(lines=>lines.join()).map(JSON.parse)
}
/**
 * jsonfile is a a file in which each line is a json document.
 * documents cannot contain any '\n': neither in their formatting nor in their string fields
  */
function _jsonfile(file, opts, sep){
    sep=sep||"\n"
    return _.file(file, opts).splitBy(sep).map(JSON.parse)
}

var proto=_().constructor.prototype

proto.to_json=function(path, opts){
    var tojs=this.map(x=>JSON.stringify(x)+"\n")
    if(path){
        return tojs.to_file(path, opts);
    }
    return tojs;
}
