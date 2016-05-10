var _ = require("../")

var ua="https://api.twitter.com/1.1/statuses/mentions_timeline.json"

//_.http(ua).stdout().done()
/**
_.testserver(function(){
    console.log("calling back   ")
    _.http("http://localhost:3000").stdout().done()
}).done()
**/

var server= _.http.server()

server.serve("/get").from(()=>_([{a:1}]))

server.receive("/post").into(()=> {
    var str=_().stdout()
    return str;
})

function get() {
    _.http("http://localhost:3000/get").stdout().done(()=> {
        console.log("done!")
        get()
    })
}
//get()

function post(){
    _(["hola"]).post("http://localhost:3000/post").stdout().done(()=> {
        console.log("rvced!!")
        post()
    })

}
post()