var url = require("url")
var _http = require("http")
var _https = require("https")
var http = {}
var express = require("express")
var stream = require("stream")
var _=require("highland")

module.exports = http

http.get = function (u) {
    var h=_http
    if(u.indexOf("https")==0) h=_https;
    var result={writable: _(), readable:_() }
    var req=h.get(u, function(res){
        res.pipe(result.readable)
    })
    result.writable.pipe(req)
    return result;

}
var server = http.server = function (app) {
    if (app) this.app = app;
    else {
        this.app = express()
        this.app.listen(3000)
    }
}
server.prototype.duplex = function (methods, route, reader, writer) {
    if (!methods) methods = ["get", "post", "put", "delete"]
    if(!reader) reader=function(){}
    if(!writer) reader=function(){}
    methods.forEach(m => {
        app[m](route, function (req, res) {
            var r = reader, w = writer
            if (typeof r == "function") {
                r = r(req, res, m)
            }
            if (typeof w == "function") {
                w = w(req, res, m)
            }

            if (r) req.pipe(r)
            if (w) w.pipe(res)
        })
    })
}

server.prototype.receive = function (route, writer) {
    writer.on("finish", ()=> {
        res.status(200)
        res.end()
    })
    writer.on("error", ()=> {
        res.status(500)
        res.end()
    })

    return this.duplex(["post", "put"], route, null, writer)
}

server.prototype.serve = function (route, reader) {
    return this.duplex(["get"], route, reader, null)
}

function inferType(req){
    //TODO return a stream that correctly parses content
    return req
}
