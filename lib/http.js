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

_.http_duplex=function(u, method){
    var dir=url.parse(u)
    dir.method=method
    return _(function(push, next){
        var p = u.indexOf("https://") > -1 ? https : http
        var req=p.request(dir, function(res){
            var duplex={req: req, res: infer_type(res)}
            push(null, duplex)
        })
    })
}
_.http = function (u) {
    return _(function (push, next) {
        var p = u.indexOf("https://") > -1 ? https : http
        console.log("GET ", u)
        var req = p.get(u, (res)=> {
            console.log("RES", u)
            if (!res.headers["content-type"]) var type = undefined;
            else var type = res.headers["content-type"].split(";")[0]

            push(null, infer_type(type, res));
            push(null, _.nil)
        })
    }).flatten()
}
_.http.get = function (u) {
    return _.http(u)
}
_.http.server = server


function server(app) {
    if (!(this instanceof server)) return new server(app)
    this.app = app || express()
    if (!app) this.app.listen(3000)
    console.log("server started")
}
server.prototype.serve = function (route, stream) {
    if (!route) route = "/"
    else if (typeof route !== "string") stream = route
    var self = this;
    if (!stream) return {
        from: function (str) {
            return self.serve(route, str)
        }
    }
    var serve_fn = function (req, res) {
        console.log("processing request - GET ", route)
        var input = stream(req, res);
        var str = _(input).json().pipe(res);

        str.on("error", (err)=> {
            console.log("err", err.message)
            res.end();
        })
    }
    this.app.get(route, serve_fn)
    console.log("Route registered - serve", route)
}

server.prototype.duplex = function (route, responseReaderFn, requestWriterFn) {
    var streamFrom = responseReaderFn
    var streamInto = requestWriterFn
    if (!route) route = "/"
    else if (typeof route !== "string") responseReaderFn = route
    var self = this;
    if (!responseReaderFn) return {
        from: function (strO) {
            if (!requestWriterFn) {
                return {
                    into: function (strI) {
                        self.serve(route, strO, strI)
                    }
                }
            } else return self.serve(route, str0, requestWriterFn)
        }
    }
    if (!requestWriterFn) {
        return {
            into: function (strI) {
                self.serve(route, responseReaderFn, strI)
            }
        }
    }
    var duplex_fn = function (req, res) {
        console.log("processing request - GET ", route)
        var inputWriter = requestWriterFn(req, res);
        var outputReader = responseReaderFn(req, res);

        _(req).pipe(inputWriter)
        outputReader.pipe(res);

    }
    this.app.all(route, duplex_fn)
    console.log("Route registered - duplex", route)
}


server.prototype.receive = function (route, stream) {
    if (!route) route = "/"
    else if (typeof route !== "string") stream = route
    var self = this;
    if (!stream) return {
        into: function (str) {
            return self.receive(route, str)
        }
    }

    var rcv_fn = function (req, res) {
        console.log("POST ", route)

        var input = _(req);
        var output = stream(req)
        var str = input.pipe(output)
        if (output.done) output.done(()=>{
            res.end()
        })
        else {
            req.on("end", ()=> {
                console.log("end req")
                res.end()
            })
        }
        str.on("error", (err)=> {
            console.log("error", err)
            res.end(500)
        })
    }
    this.app.put(route, rcv_fn)
    this.app.post(route, rcv_fn)
    console.log("Route registered - receive", route)

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
    var res_str = _()
    var opts = url.parse(u)
    opts.method = "POST"
    var req = http.request(opts, function (res) {
        console.log("received res for", u, res.statusCode)
        res.pipe(res_str)
    })
    req.on("error", function (err) {
        throw err
    })
    //var str=this.pipe(req)
    var str = this.pipe(req);
    return res_str
}
