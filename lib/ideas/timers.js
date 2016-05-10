var _ = require("highland")
var proto=_().constructor.prototype

var timers={};
proto.stats_triggerup=function(name){
    if(timers[name] && timers[name].length>0) throw "Cannot use the same timer name '"+name+"' more than once"
    return this.doto(function(x){
        timers[name]=[
            {count:0, sum:0, max: Number.MIN_VALUE, min: Number.MAX_VALUE, createdAt: new Date()}];
    });
}
proto.timer_triggerdown=function(name){
    return this.map(function(x){
        var end=new Date()
        var stats=timers[name].pending.pop()
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
    stats.avg_cumm_time=stats.cummulative_time/stats.count;
    return stats;
}