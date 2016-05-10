var _ = require("../")

var ua="https://api.twitter.com/1.1/statuses/mentions_timeline.json"

//_.http(ua).stdout().done()
_.testserver(function(){
    console.log("calling back   ")
    _.http("http://localhost:3000").stdout().done()
}).done()
