var _ = require("./file")
var flatten = require("flat")
var moment = require("moment")
var numeral = require("numeral")
var proto = _().constructor.prototype

module.exports = _

_.csv = function (path, opts) {
    _.file(path, opts).from_csv()
}


var spanish_config = {
    separator: ";",
    number_format: "0,00",
    date_format: "DD-MM-YYYY",
    user_headers: undefined //implies inferred from object
}

var default_csv_config = {
    separator: ",",
    number_format: "0.00",
    date_format: "YYYY-MM-DD",
    user_headers: undefined //implies inferred from object
}


/**
 * Transforms de incoming message to csv
 * @param path
 */
proto.to_csv = function (config, path, opts) {
    var csv = this.scan(0, function (headers, x) {
        if (!headers) {
            //write headers
            if (config.user_headers) return config.user_headers.join(config.separator || ",");
            else return Object.keys(flatten(x, {safe: true})).join(config.separator || ",")
        }
        else {
            //write row
            var flat = flatten(x, {safe: true})
            return Object.keys(flat).map(x=>serialize(config, flat[x])).join(config.separator || ",")
        }
    })
    if (!path) return csv;
    return csv.to_file(path, opts)
}
proto.from_csv = function (config) {
    var headers = config.user_headers || [];
    return this.split().map(function (previous, line) {
        if (!line) return;
        var row = line.split(config.separator || ",");

        if (!headers.length) {
            headers = row;
            return headers;
        }
        var obj = {}
        for (var i = 0; i < headers.length; i++) {
            obj[headers[i]] = parse(config, row[i])
        }
        return obj;
    })
}

function parse(config, x) {
    //TODO
    return x
}

function serialize(config, x) {
    if (!x) return "";
    if (x instanceof Date) {
        var df = config.date_format || "YYYY-MM-DD"
        return moment(x).format(df);
    }
    if (isNumeric(x)) {
        var nf = config.number_format || "0,00"
        return numeral(x).format(nf);
    }
    return x.toString();
}

function isNumeric(n) {
    return (typeof n == "number" && !isNaN(n));
}