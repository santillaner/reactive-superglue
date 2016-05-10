var _ = require("../")

_.listen().each(function (reqres) {
    _(reqres.req).stdout()
    reqres.res.end("hola")
})

_.http("http://localhost:8000/").stdout().done()


//get something and pipe it:
_.http(url).stdout().done();

//post one-request-per-object
_([]).post_each(url).done()
//post one-per-line
_([]).post(url).done()

//put should be similar, but with url builder. Not doing it yet

//servers:
//express
//special content types: application/json, application/x-ndjson

app.get("/", function (req, res) {
    var db = _.db("db")
    db.collection("").find().json().pipe(res);
})
app.post("/", function (req, res) {
    if (req.get("content-type") == "application/json")
        req.stream().split().json().insert(db.collection("col")).done(function () {
            res.end(200);
        })
})

_.http().get("/").jsonstream() //uses application/json or x-ndjson to use one or other
_.http().duplex("/", function(input, output){

})
_.http().websocket("/").duplex(function(input, output){

})
//routes == pipes
app.pipe("/")
    .in(req=> {
        req.stream().split.json.insert(db.collection("col"))
    })
    .out(stream_out);


_http().ingest("/")



