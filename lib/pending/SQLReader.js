var mysql = require("mysql")
var stream = require("stream");
var util = require("util");
var sql_string = require("../node_modules/sequelize/lib/sql-string")
util.inherits(SQLReader, stream.Readable)
var utils = require("./utils")


function SQLReader(query, db_url, replacements, nestTables) {
    if (!db_url) throw new Error("db_url param is required")

    this.conn_data = utils.parseDb(db_url);
    this.query = {sql: query, nestTables: nestTables || false}
    this.replacements = replacements || {};
    this.opts = {objectMode: true};
    stream.Readable.call(this, this.opts);
    this._connect();
}
SQLReader.prototype._connect = function () {
    this.sql = mysql.createConnection(this.conn_data)
    this._query();
}
SQLReader.prototype._read = function () {
    if (this.sql && this.sql._socket) {
        this.sql.resume();
        if (this.paused) {
            this.paused = false;
        }
    }
}
SQLReader.prototype._query = function () {

    var self = this;
    var replacements = this.replacements
    var q = self.query.sql;
    var query = sql_string.formatNamedParameters(q, replacements, null, "mysql");
    var result = self.sql.query({sql: query, nestTables: self.query.nestTables});

    var end_fn = function () {
        self.push(null)
        self.sql.destroy()
    }

    var result_fn = function (row) {
        if (!self.push(row)) {
            self.sql.pause();
            self.paused = true;
        }
    }
    var fields_fn = function (fields) {
        self.fields = fields;
    }

    result.once("fields", fields_fn) //received headers
    result.on("result", result_fn) //received data
    result.once("end", end_fn)
    if (this.paused) this.sql.pause();
}


module.exports = SQLReader;