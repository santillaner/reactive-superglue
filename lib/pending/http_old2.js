var _ = require("highland")
var http = require("http")
var https = require("https")
var proto = _().constructor.prototype
var url = require("url")
var express = require("express")

module.exports = _


//cases:
//_.http(req, res) //=>infers type. Pasando
//_.http("http://www.google.es") //=> parses and infers type, returning the appropriate stream
//some_stream().post("some url", "text/csv") //converts and sends a continuous post stream
//_.ingest("route, defaults to /", optional_express_app) //infers the incoming data and passes a formatted stream


//
//some_stream().post("some url", "ndjson") //stringifies and sends a continuous post stream
//some_stream().post("some url", "text/plain") //sends a continuous post stream

(http("http://myserver/samples/last1000")
    .filter(lib_signal.lpf, x=>x.value) //processor, replacement
    .save(db.collection(""))

(db.collection("samples").aggregate([]).post("http://someendpoint/samples"))
(db.collection("$collection").aggregate([]).post("http://someendpoint/$collection"))
//(db.collection("$collection").aggregate("$aggregate").serve("/$collection/$aggregate"))
http.serve("/$collection/$start/$end").from(p => db.collection(p.collection).find({start: p.start}))
http.get("http://localhost/a") //=> url -> stream
http.receive("/$collection").into(p => db.collection(p.collection))




_.http = function (u) {
    return _(function (push, next) {
        var p = u.indexOf("https://") > -1 ? https : http
        var req = p.get(u, (res)=> {
            if (!res.headers["content-type"]) var type = undefined;
            else var type = res.headers["content-type"].split(";")[0]
            push(null, infer_type(type, res));
        })
    }).flatten()
}
_.http.get=function(u){return _.http(u)}
_.http.server=server


function server(app){
    if(!(this instanceof server)) return new server(app)
    this.app=app||express()
    if(!app) this.app.listen(3000)
}
server.prototype.serve=function(route, from){
    if(!route) route="/"
    else if(typeof route!=="string") from = route
    var self=this;
    if(!from) return {
        from: function(stream){return self.serve(route, stream)}
    }
    this.app.all(route, function(req, res, next){
        var input=from(req);
        input.pipe(res);
    })
}


server.prototype.receive=function(route, into){
    if(!route) route="/"
    else if(typeof route!=="string") into = route
    var self=this;
    if(!into) return {
        into: function(stream){return self.serve(route, stream)}
    }
    this.app.put(route, function(req, res){
        var input=req;
        input.pipe(into(req))
    })
}

_.testserver = function (cb) {
    var cfg = {
        port: 3000,
        route: "/",
        ingester: function (req, res, next) {
            console.log("req!")
            var samples = [{a: 1, b: 2}, {a: 2, b: 4}]
            var str = _(samples).json().pipe(res)
            str.on("finish", ()=>res.end())
        }
    }
    return _.ingest(cfg, cb)
}
_.ingest = function (config, cb) {
    console.log("cb", cb)
    if (!config) {
        config = {port: 3000, route: "/", app: express(), ingester: ingester}
    }
    if (!config.app) {
        config.app = express()
        config.app.listen(config.port);
    }
    setImmediate(cb)
    return _(function (push, next) {
        config.app.all(config.route, config.ingester)
    }).flatten()
    function ingester(req, res, express_next) {
        var type = req.get("content-type")
        var str = infer_type(type, req)
        str.fork().done(function () {
            res.end()
        })
        push(null, str)
        next()
    }

}
function infer_type(type, res) {
    switch (type) {
        case "application/json":
            res.setEncoding("utf-8")
            var lines = ""
            var result = _(res).split().scan("", (prev, line) => {
                try {
                    lines += line
                    if (!line.trim().endsWith("}") && !line.trim().endsWith("]")) { //to speed it up a bit
                        return null;
                    }
                    var result = JSON.parse(lines);
                    lines = ""

                    return result
                } catch (err) {
                    console.log(err)
                    return null;
                }
            }).compact()
            return result;
            break;
        default:
            return _(res)
    }
}

proto.post = function (u) {
    var req=http.request(u, function(res){
        console.log("received res for", u, res.statusCode)
    })
    req.on("error", function(err){
        throw err
    })
    var forked=this.fork();
    var str=forked.pipe(req)
    return this;
}
/*

 _.http=function(obj, encoding){
 if(obj instanceof http.IncomingMessage ||obj instanceof http.ClientRequest){
 return infer_stream(obj).flatten()
 }
 if(typeof obj=="string"){
 return _(function (push, next){
 var req=http.get(obj, (res)=>{
 if(!encoding) res.setEncoding("utf8")
 else res.setEncoding(encoding)
 push(null, infer_stream(req, res))
 })
 }).flatten()
 }
 return _(function(push, next){
 var req=http.request(obj, (res)=>{
 if(!encoding) res.setEncoding("utf8")
 else res.setEncoding(encoding)
 push(null, {req:req, res: res});
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

 */