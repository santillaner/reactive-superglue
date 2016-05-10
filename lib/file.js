var _ = require("highland")
var proto = _().constructor.prototype

var fs = require("fs")

module.exports = _;
_.file = function (path, opts) {
    return _(fs.createReadStream(path, opts))
}
_.stdin = function () {
    return _(process.stdin)
}

proto.trim = function () {
    return this.map(x=>x ? x.trim() : "")
}
proto.remove_blanks = function () {
    return this.trim().filter(function (x) {
        return x !== ""
    })
}
proto.join_lines = function (join_str) {
    return this.map(function (x) {
        return x + join_str
    });
}
proto.to_file = function (file, opts) {
    var forked = this.fork()
    forked.pipe(fs.createWriteStream(file, opts))
    return this;
}

proto.stdout = proto.to_stdout = function () {
     return this.consume(publish(process.stdout))

    var forked = this.observe()
    forked
        .map(x=> {
            if (typeof x !== "string" && !(x instanceof Buffer)) {
                return JSON.stringify(x) + "\n"
            }
            return x;
        })
        .pipe(process.stdout)
    return this;

}


proto.stderr = proto.to_stderr = function () {
    var res = this.consume(publish(process.stderr))

    return res;

    var forked = this.observe()
    forked.pipe(process.stderr)
    return this;
}


function publish(dest) {
    return function (err, x, push, next) {
        if (err) {
            push(err)
            return next()

        }
        if (x === _.nil) {
            return push(null, x)
        }
        if (typeof x !== "string" && !(x instanceof Buffer)) {
            x = JSON.stringify(x) + "\n"
        }
        push(null, x)
        var push_n_next = function () {
            push(null, x) //to make it pass-through
            next();
        }

        dest.write(x)
        push_n_next()
    }
}