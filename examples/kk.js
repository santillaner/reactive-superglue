var _=require("highland")
var express=require("express")
var stream=require("stream")

var app=express()
app.listen(3000)

app.route("/", function(req, res){})

function serve(route, channel){
    var server=
    ["get", "post", "put", "delete"].forEach((m)=>{
            app[m](route, function(req, res){
                var ch=channel(req, res);
                req.pipe(channel)
                channel.pipe(res)
            })
    })
    return server;
}

function channel(i, o){
    if(!i)i=_()
    if(!o)o=_()
    var ch=o;
    ch.pipe=i.pipe.bind(i)
    ch.in=i
    ch.out=o;
    return ch;
}

function AController(app, route){
    //get => autodetect files and json, returns a readable
    //to serve the response and provides access to response headers
    //post & put => Designed to accept data, and ACK it to client

    var controller={
        get: app.get(route, function (req, res){}),
        post: app.get(route, function (req, res){}),
        put: app.get(route, function (req, res){}),
        delete: app.get(route, function (req, res){}),
    }
}
function serve(req, res){

}