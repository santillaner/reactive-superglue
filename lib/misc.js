var _ = require("highland")
var proto=_().constructor.prototype


//Fix _.done() to allow for null callback
proto.old_done=proto.done;
proto.done=function(f){
    if(!f) f=function(){}
    //return this.observe().errors(f).old_done(f);
    return this.old_done(f);
}
_.through=function(fn){
    return function(err, x, push, next){
        if(err) return push(err, x)
        if(x===_.nil) return push(null, x)
        return fn(x, (err, res)=>{
            push(err, x)
            next()
        })
    }
}
proto.through=function(fn){
     var t=_.through(fn)
    return this.consume(t)
}
