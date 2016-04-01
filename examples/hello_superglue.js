var _=require("../")
var samples=[{name:"reactive", surname:"superglue"}]


var hello=function(){
    _(samples) //highland converts array to stream
        .to_json() //use a json transform
        .to_stdout() //use console for output
}

var hello2=function(){
    _(samples) //highland converts array to stream
        .map(user => "Hello "+user.name+" "+user.surname+"\n") //apply a mapping function using new ES6 syntax
        .to_stdout() //use console for output
}

console.log("hello world!")
hello()
hello2()
