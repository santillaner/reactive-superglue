var _=require("./file")
var flatten=require("flat")
module.exports=_
_.csv=function(path, opts){
    _.file(path, opts).from_csv()
}
var proto=_().constructor.prototype

/**
 * Transforms de incoming message to csv
 * @param path
 */
proto.to_csv=function(separator, path, opts){
    var csv=this.scan(0, function(headers, x){
        if(!headers){
            //write headers
            return Object.keys(flatten(x, {safe:true})).join(separator)
        }
        else {
            //write row
            //TODO => type inference for CSV serialization, specially dates
            var flat=flatten(x, {safe:true})
            return Object.keys(flat).map(x=>flat[x]).join(separator)
        }
    })
    if(!path) return csv;
    return csv.to_file(path, opts)
}
proto.from_csv=function(separator, headers){
    //TODO
    return this.split().map(function(line){
        var row=line.split(separator);
        var obj={}
        for(var i=0;i<headers.length; i++){
            obj[headers[i]]=row[i]
        }
    })
}

