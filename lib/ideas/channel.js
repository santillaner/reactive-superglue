var _=require("highland")
/*
* A channel is a 2-way stream, useful for duplex comms
*/

function channel(parse, format){
    var proto= {
        in: _(),
        out: _(),
        parse: function(f, m){
            m=m||"map"
            this.in=this.in[m](f)
            return this;
        },
        format: function(f, m){
            m=m||"map"
            this.out=this.out[m](f)
            return this;
        }
    }
    return proto;
}

function fromHttp(opts){
    var req=http(opts);
    var ch=channel()
    ch.in.scan(0, (prev, curr)=>{

    })
    ch.parse()
    ch.out.pipe(req)
    req.on("res", ()=>res.pipe(ch.in))
    return ch;
}
function fromReqRes(req, res, ch){
    ch.out.pipe(res)
    req.pipe(ch.in)
    return ch
}

function serverEcho() {
    var app = require("express")()
    app.listen(3000)
    var ch=channel()
    app.all("/", (req, res)=>{
        fromReqRes(req, res, ch)
    })
    return ch;
}

