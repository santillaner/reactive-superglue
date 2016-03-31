var _ = require("./file")

module.exports = _;
_.from_jsonfile=from_jsonfile;
_.from_json=from_json;

function from_json(file, opts){
    return _.from_file(file, opts).collect().map(lines=>lines.join()).map(JSON.parse)
}
/**
 * jsonfile is a a file in which each line is a json document.
 * documents cannot contain any '\n': neither in their formatting nor in their string fields
  */
function from_jsonfile(file, opts, sep){
    sep=sep||"\n"
    return _.file(file, opts).splitBy(sep).map(JSON.parse)
}

var proto=_().constructor.prototype

proto.from_json=function(){
    return this.map(JSON.parse);
}
proto.to_json=function(path, opts){
    var tojs=this.map(x=>JSON.stringify(x)+"\n")
    if(path){
        return tojs.to_file(path, opts);
    }
    return tojs;
}
