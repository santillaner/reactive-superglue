var _=require("../")
var db= _.mongodb("mongodb://localhost/test")


var http2mongo=function(){
    _.http("http://www.google.es")
      .json()
      .insert(db.collection("objects"))
      .done();
}


function runTest(){loadSampleData(test)}
function loadSampleData(cb){
    var data=[
        {a:1, b:2},
        {a:1, b:5, c:7}
    ]
    _().insert(db.collection("test")) //todo add module name
}
