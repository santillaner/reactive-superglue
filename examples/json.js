var _=require("../")


var samples=[{a:1, b:2}, {a:3, b:4}, {a:5, b:10}]
var path="/tmp/rsg.json"
_(samples)
        .to_json(path)
        .done(function(){
            _.from_json(path)
            .reduce({a:0, b:0}, (previous, current) => ({a:previous.a+current.a, b: previous.b+current.b}))
            .each(function(reduced){
                    console.log("reduced: ", reduced)
                })
        })