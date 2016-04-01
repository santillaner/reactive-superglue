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
            .find({})
            .json().stdout()
            .done(function(){
                db.close()
            })
}

