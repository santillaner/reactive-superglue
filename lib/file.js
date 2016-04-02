var _ = require("highland")
var proto=_().constructor.prototype

var fs=require("fs")

module.exports = _;
_.file=function (path, opts) {
    return _(fs.createReadStream(path, opts))
}
_.stdin=function(){
    return _(process.stdin)
}

proto.trim=function(){
    return this.map(x=>x?x.trim():"")
}
proto.remove_blanks=function(){
    return this.trim().filter(function(x){
        return x!==""
    })
}
proto.join_lines=function(join_str){
    return this.map(function(x){
        return x+join_str
    });
}
proto.to_file=function(file, opts){
    var forked=this.fork()
    forked.pipe(fs.createWriteStream(file, opts))
    return this;
}

proto.stdout=proto.to_stdout=function(){
    var forked=this.observe()
    forked.pipe(process.stdout)
    return this;

}
proto.stderr=proto.to_stderr=function(){
    var forked=this.observe()
    forked.pipe(process.stderr)
    return this;
}


