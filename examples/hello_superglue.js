var _ = require("../")
var samples = [{name: "reactive", surname: "superglue"}]


var hello = function () {
    _(samples) //highland converts array to stream
        .to_json() //use a json transform
        .stdout() //use console for output
        .done()
}

var hello2 = function () {
    _(samples) //highland converts array to stream
        .map(user => "Hello there, " + user.name + " " + user.surname + "\n") //apply a mapping function using new ES6 syntax
        .stdout() //use console for output
        .done()
}

console.log("hello world!")
hello()
hello2()
