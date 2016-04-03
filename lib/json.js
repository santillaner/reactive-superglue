var _ = require("./file")
var proto=_().constructor.prototype

module.exports = _;
_.from_jsonfile=_.from_json=from_jsonfile;
_.from_json_doc=from_json_doc;

function from_json_doc(file, opts){
    return _.file(file, opts).collect().map(lines=>lines.join()).map(JSON.parse)
}
/**
 * jsonfile is a a file in which each line is a json document.
 * documents cannot contain any '\n': neither in their formatting nor in their string fields
  */
function from_jsonfile(file, opts, sep){
    sep=sep||"\n"
    return _.file(file, opts).splitBy(sep).remove_blanks().from_json()
}


proto.from_json=function(){
    return this.map(JSON.parse);
}
proto.to_json=proto.json=function(path, opts){
    var stringify=function(x){
        return JSON.stringify(x).trim()+"\n"
    }
    var tojs=this.map(stringify)
    if(path){
        return tojs.to_file(path, opts);
    }
    return tojs;
}
