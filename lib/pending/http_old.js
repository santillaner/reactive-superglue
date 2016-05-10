var _=function(){}
var http=require("http")
var https=require("https")
var proto=_().constructor.prototype
var url=require("url")
var _express=require("express")

http.IncomingMessage.prototype.stream=function(){
    return _(this)
}
http.ClientRequest.prototype.stream=function(){
    return _(this)
}

module.exports=_

_.http=function(obj, encoding){
    if(obj instanceof http.IncomingMessage ||obj instanceof http.ClientRequest){
        return obj.stream()
    }
    if(typeof obj=="string"){
        return _(function (push, next){
            var req=http.get(obj, (res)=>{
                if(!encoding) res.setEncoding("utf8")
                else res.setEncoding(encoding)
                push(null, res.stream())
            })
        }).flatten()
    }
    return _(function(push, next){
        var req=http.request(obj, (res)=>{
            if(!encoding) res.setEncoding("utf8")
            else res.setEncoding(encoding)
            req.res=res
            push(null, req);
        })
    })
}

_.http_server=function(config){
    if(!config || config.port) {
        var app=express()
        app.listen(app.port||3000)
        return app;
    } else throw "Bad argument"
}

proto.post=function(u){
    var opts=url.parse(u)
    opts.method="POST"
    var response;
    http.request(opts, function(res){
        response=res;
        response.write(x, pending.next)
    })
    var pending;
    return function(err, x, push, next){
        if(err) return push(err)
        return push(null, x)

        if(x!==_.nil && response) {
            response.write(x, next);
        }
        else {
            pending.x=x
            pending.push=push
            pending.next=next
        }
    }
}

var writer=_.http({})