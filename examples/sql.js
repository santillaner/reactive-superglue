var _ = require("../")

var db = _.sql("mysql://localhost/test")
db
    .select("select * from app_usage limit 10")
    .json()
    .stdout()
    .done(()=>db.end())