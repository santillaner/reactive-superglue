var es = require("elasticsearch")
var _ = require("highland")
var proto = _().constructor.prototype

var _db = function (u) {
    this.client = new es.Client(u)

}
_db.prototype.index = index.bind(_db)

function index(idx_name, idx_type) {
    var self = this;
    return function (data, cb) {
        if (!Array.isArray(data)) data = [data]
        var commands = []
        data.forEach((item)=> {
            var cmd = {index: {_index: idx_name, _type: idx_type}}
            if (item._id) {
                cmd.index._id = item._id

            }
            commands.push(cmd)
            commands.push(item)
        })
        self.bulk(commands, cb)
    }
}


proto.index = function (index_fn) {
    return this.batchWithTimeOrCount(100, 100).consume(consume_fn)

    function consume_fn(err, x, push, next) {
        if (err) return push(err)
        if (x === _.nil) return push(null, x)
        return index_fn(x, (err, res)=> {
            push(err, x)
            if (!err) next()
        })
    }
}