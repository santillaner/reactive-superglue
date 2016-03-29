# superglue
FRP (functional reactive programming) middleware for integrating diverse data sources and data sinks. 
It leverages [highland.js](http://highlandjs.org/) as the reactive framework. 

Simply put, you get a neat chained API thanks to the functional programming black magic that runs under the hood. 
Let's take a peek: 


##No fluff, just stuff
```javascript
var _=require("superglue")

//You can use mongodb without dealing with callback hell
var query=_.db("mongodb://localhost/my_db").collection("my_collection").find({type: "some_type"});
query.to_jsonfile("path/to/file").done()

var john_objects=db("mongodb://localhost/another_db").collection("john_objects")

//json files are simply files that contain one JSON-per-line. 
//Only JSONs without '\n' in their fields are valid. 
//json files are non-standard but very convenient for streaming large collections of objects. 
_.from_jsonfile("path/to/file").filter(obj => obj.name=="John").upsert(john_objects).done()



```
 
##The glued libraries
###mongodb
@@
####streaming queries from mongo, superglue-style
@@
####...and you can pipe to mongo too! 
###file
@@
###json and jsonfiles
@@
###csv
@@

##The underlying concepts
@@