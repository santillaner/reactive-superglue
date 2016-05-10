var _ = require("highland")
var mysql = require("mysql")
var url = require("url")
var proto = _().constructor.prototype


module.exports = _

_.sql = _db;

//TODO include connection pooling and support databases different from mysql
//TODO support more advanced insertion and update patterns

function _db(db) {
    if (!(this instanceof _db)) return new _db(db)
    var self = this;
    if (typeof db == "string") {
        this.db = mysql.createConnection(parseDb(db));
    }
    else this.db = db;

    this.close = this.end = function () {
        this.db.end()
    }
}
_db.prototype.select = function (query, nestTables) {

    var q = {sql: query, nestTables: (nestTables == false) || true}
    return _(this.db.query(q).stream())
}
_db.prototype.table = function (name) {
    var self=this
    var table = {
        insert: function () {
            var q = "insert into " + name + " set ?"
            return sql_sink(self.db, q)
        },
        upsert: function (record) {
            throw "unsupported operation"
        },
        remove: function (record) {
            throw "unsupported operation"
        }
    }
    return table;
}

proto.upsert = function (table) {
    return this.consume(table.upsert())
}
proto.insert = function (table) {
    return this.consume(table.insert())
}
proto.remove = function (table) {
    return this.consume(table.remove())
}

function parseDb(db_url) {
    if (!db_url) throw "Bad url: '" + db_url + "'"

    var options = {connection_string: db_url};
    var urlParts = url.parse(db_url);

    if (urlParts.pathname) {
        options.database = urlParts.pathname.replace(/^\//, '');
    }

    options.dialect = urlParts.protocol.replace(/:$/, '');
    options.host = urlParts.hostname;

    if (urlParts.port) {
        options.port = urlParts.port;
    }
    if(urlParts.auth){
        var parts = urlParts.auth.split(':');
        options.user = parts ? parts[0] ? parts[0] : null : null;
        options.password = parts ? parts[1] ? parts[1] : null : null;
    }
    if (!options.user) delete options.user;
    if (!options.password) delete options.password;
    return options
}
function sql_sink(db, query) {
    return function (err, x, push, next) {
        if (err) {
            return push(err)
        }
        if (x === _.nil) {
            if (push) return push(null, x)
        }
        var push_n_next = function (err, res) {
            push(err, x) //to make it pass-through
            next();

        }
        db.query(query, x, push_n_next);
    }
}
