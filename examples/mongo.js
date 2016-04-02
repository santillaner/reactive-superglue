var _ = require("../")
var samples = [
    {name: "reactive", surname: "superglue"}
]

//the connection
var db = _.mongodb("mongodb://localhost/test")

_(samples)//input
    .upsert(db.collection("users"))//upsert = replace
    .done(readMongo)//now read it

function readMongo(){
        db.collection("users")
            .find({}) //use same args as in the mongo api, without callback. You can use aggregate instead
            .json().stdout() //stringify and pipe to stdout
            .done(function(){
                db.close()
            })
}

