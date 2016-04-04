var _ = require("../")

var db = _.sql("mysql://localhost/test")
var samples=[
    {name: "john", surname: "smith"},
    {name: "joe", surname: "satriani"}
]


_(samples).insert(db.table("test")).done(function(){
    db
        .select("select * from test")
        .json()
        .stdout()
        .done(()=>db.end())
})