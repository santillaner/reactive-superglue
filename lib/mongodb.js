var _ = require("highland")
var proto=_().constructor.prototype

var mongo = require("mongodb").MongoClient

module.exports = _;
_.mongo= _.mongodb= _db;

/**
 * Creates a mongodb object from a URL or from an existing connection.
 * This object gets a collection method attached and some API methods that "lift" the native driver
 * methods.
 *
 * The connection object gets cached so that the db object can be used multiple times:
 * var db=_db("mongodb://localhost/mydb")
 * db.collection("collection1").find().done()
 * db.collection("collection2).aggregate([{$match: {name: "John"}},...], {allowDiskUse: true}).done()
 *
 * The writer methods are "pass-through", so that you can continue to process the data:
 * db.collection("col1")
 *  .find().map(x=>x.name).upsert(db.collection("log_all_names"))
 *  .where({name: "John"}).upsert(db.collection("log_john_occurences"))
 *  .reduce(0, (a,b)=>a+b).map(count => {name: "John", count: count}).insert(db.collection("log_counts"))
 * @param db
 * @returns {_db}
 * @private
 */
function _db(db) {
    if(!(this instanceof _db)) return new _db(db)
    var self = this;
    if (typeof db == "string"){
        this.db = _([db])
            .flatMap(_.wrapCallback(mongo.connect))
            .doto(fn)
    }
    else{
        this.db = _([db]).doto(fn)
    }
    function fn(db){
        self.db = _([db])
        self.close=function(){db.close()}
    }
}
/**
 * Creates a collection wrapper, superglue style.
 * Currently supported methods are find, aggregate and mapReduce for sources
 * and insert, upsert and remove for writing.
 * The global stream object gets convenience methods attached, so that you can pipe to
 * it directly. For instance, this copies (with upsert semantics)
 * all objects from collection "source" with counter == 3 to "destination".
 *
 * db.collection("source").where({x.counter:3}).upsert(db.collection("destination"))
 * @param name
 * @returns {*}
 */
_db.prototype.collection = function (name) {
    if (!this.db._reading) {
        var s = this.db.map((x) => (x.collection(name)));
        this.db._reading = true
    } else {
        var s = this.db.observe().map((x) => (x.collection(name)));
    }

    ["find", "aggregate", "mapReduce"].forEach(function (m) {
        s[m] = function () {
            return mapDbReadOperation(s, m, arguments)
        }
    });

    ["insert", "remove"].forEach(function (m) {
        s[m] = function () {
            return mapDbWriteOperation(s, m, arguments)
        }
    });

    s.update = s.upsert = function () {
        return mapDbWriteOperation(s, "update", arguments, true)
    }
    return s;
}


function mapDbReadOperation(stream, operation, args) {
    args = Array.prototype.slice.call(args)
    return stream.flatMap(function (x) {
        return _(x[operation]
            .apply(x, args).stream())
    }).flatten()
}
function mapDbWriteOperation(s, m, args, upsert) {
    args = Array.prototype.slice.call(args)
    var col, counter=0;
    return function (err, x, push, next) {
        var do_op = function (x, push, next) {
            var push_n_next=function(err,res){
                push(err, x) //to make it pass-through
                next();

            }
                if (upsert) {
                    return col[m].apply(col, [x, x, {upsert: true}, push_n_next])
                }
                else {
                    return col[m].apply(col, [x].concat(args).push(push_n_next))
                }
            }

        if (err) {
            return push(err)
        }
        if (x === _.nil) {
            if (push) return push(null, x)
        }

        if (!col) {
            s.each(function (s_col) {
                col = s_col
                do_op(x, push, next)
                //console.log("colll", col.insert)
            })
        } else do_op(x,push, next)
    }
}

proto.upsert=function(collection){
    return this.consume(collection.upsert())
}
proto.insert=function(collection){
    return this.consume(collection.insert())
}
proto.remove=function(collection){
    return this.consume(collection.remove())
}
