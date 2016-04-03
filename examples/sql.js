var _ = require("../")

var db = _.sql("mysql://localhost/test")
db
    .select("select * from test_table limit 10")
    .json()
    .stdout()
    .done(()=>db.end())