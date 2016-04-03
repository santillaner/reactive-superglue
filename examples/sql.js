var _ = require("../")

var db = _.sql("mysql://weplan:weplan%2315@db-history.weplan-app.com/weplan_partis_history")
db
    .select("select * from app_usage limit 10")
    .json()
    .stdout()
    .done(()=>db.end())