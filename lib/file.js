var _ = require("highland")
var fs=require("fs")

module.exports = _;
_.file=function (path, opts) {
    return _(fs.createReadStream(path, opts))
}
_.stdin=function(){
    return _(process.stdin)
}


var proto=_().constructor.prototype

proto.old_done=proto.done;
proto.done=function(f){
    if(!f) f=function(){}
    return this.old_done(f)
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


