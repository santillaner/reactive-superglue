var _=require("../")

var express=require("express")
var app=express()
var proto = _().constructor.prototype

proto.join=function(str){
    return this.map((x)=>x.join(str))
}
proto.parse_request=function(strict){
    if(strict)
        return this.split().collect().join("").map((x)=>x.trim()==""?null:x).compact().map(JSON.parse)
    else return this.split().map((x)=>x.trim()==""?null:x).compact().map(JSON.parse)
}

var db = _.mongodb("mongodb://localhost/test")

var db= _.mongo("mongodb://localhost/test")

app.post("/:collection", function(req, res){
    var col=req.params.collection
    console.log("col is", col)
    var ppl=_(req).parse_request().upsert(db.collection(req.params.collection)).stringify().stdout()
    ppl.observe().errors((err, push)=>{
        console.log("error", err)
        ppl.destroy()
        res.status(500).end();
    })
    ppl.done(()=>{
        res.status(200).end();
    })
})

app.listen(3000, ()=>{
    console.log("Started. Let's test it:");
    _([{ts: new Date(), a:1}])
        .doto((x)=>console.log(`sending ${JSON.stringify(x)}`))
        .stringify()
        .post("http://localhost:3000/a").done(()=> {
            console.log("done!!")
        })
})