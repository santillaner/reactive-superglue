var _ = require("highland")
var proto=_().constructor.prototype


//Fix _.done() to allow for null callback
proto.old_done=proto.done;
proto.done=function(f){
    if(!f) f=function(){}
    return this.old_done(f)
}

var timers={};
proto.timer_start=function(name){
    if(timers[name]) throw "Cannot use the same timer name '"+name+"' more than once"
    timers[name]={pending:[],
        stats: {count:0, sum:0, max: Number.MIN_VALUE, min: Number.MAX_VALUE, createdAt: new Date()}};
    return this.map(function(x){
        timers[name].pending.push(new Date())
        return x;
    });

}
proto.timer_end=function(name){
    return this.map(function(x){
        var end=new Date()
        var start=timers[name].pending.pop()
        timers[name].stats=updateStats(timers[name].stats, (end-start))
        console.log(timers[name].stats)
        return x;
    });
}

function updateStats(stats, duration){
    console.log("starts", stats, "d", duration)
    stats.count++;
    stats.sum+=duration;
    stats.avg=stats.sum/stats.count
    stats.max=Math.max(stats.max, duration)
    stats.min=Math.min(stats.min, duration)
    stats.cummulative_time=new Date()-stats.createdAt;
    return stats;
}