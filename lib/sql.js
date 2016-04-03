var _=require("highland")
var mysql = require("mysql")
var url=require("url")
module.exports=_

_.sql= _db;

//TODO include connection pooling and support databases different from mysql

function _db(db) {
    if(!(this instanceof _db)) return new _db(db)
    var self = this;
    if (typeof db == "string") {
        this.db = mysql.createConnection(parseDb(db));
    }
    else this.db=db;

    this.close=this.end=function(){this.db.end()}
}
_db.prototype.select=function(query){
    var q={sql: query, nestTables: true}
    return _(this.db.query(q).stream())
}


function parseDb(db_url){
    if(!db_url) throw "Bad url: '"+db_url+"'"

    var  options = {connection_string: db_url};
    var urlParts = url.parse(db_url);

    if (urlParts.pathname) {
        options.database = urlParts.pathname.replace(/^\//, '');
    }

    options.dialect = urlParts.protocol.replace(/:$/, '');
    options.host = urlParts.hostname;

    if (urlParts.port) {
        options.port = urlParts.port;
    }
    var parts=urlParts.auth.split(':');
    options.user = parts?parts[0]?parts[0]:null:null;
    options.password = parts?parts[1]? parts[1]: null:null;
    if(!options.user) delete options.user;
    if(!options.password) delete options.password;
    return options
}
