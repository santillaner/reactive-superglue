# superglue
FRP (functional reactive programming, like rx.js ([rx.js](http://rx.org))) middleware for integrating diverse data sources and data sinks. 

Simply put, you get a neat chained API thanks to the functional programming black magic that runs under the hood. 
Let's take a peek: 


##No fluff, just stuff
Some examples:

```javascript
var _=require("reactive-superglue")

//You can use mongodb without dealing with callback hell
var query=_.db("mongodb://localhost/my_db")
    .collection("my_collection").find({type: "some_type"});

query.to_jsonfile("path/to/file").done()

var john_objects=db("mongodb://localhost/another_db").collection("john_objects")

//json files are simply files that contain one JSON-per-line. 
//Only JSONs without '\n' in their fields are valid. 
//json files are non-standard but very convenient for streaming large collections of objects. 
_.from_jsonfile("path/to/file").filter(obj => obj.name=="John").upsert(john_objects).done()

```
 
##The glued libraries
###mongodb
The mongodb integration provides a Query Builder API and registers (aka mixes in) convenience methods
to the stream for writing to mongodb. 

````javascript
var _=require("reactive-superglue")

//Fetch the db. No bloody cb's. The "db" object can get reused (and possibly should)
var db=_.db("mongodb://localhost/test")

//Fetch the collection:
var collection=db.collection("reactive-superglue-collection")

//Stream a query to stdout. Propagates arguments to mongo (query, projection and options) 
collection.find().map(JSON.stringify).pipe(process.stdout)
collection.find({field1: "somevalue"}, {_id: 0, field1: 1}).map(JSON.stringify).pipe(process.stdout)
collection.aggregate([{$group: {_id: null, count: {$sum: 1}}}], {allowDiskUse: true}).map(JSON.stringify).pipe(process.stdout): 

//We can use stream processing methods to manipulate the data flow: 
db.collection("reactive-superglue-collection")
    .find()
    .map(x => x.variable)
    .reduce(0, (a, b) => a+b)
    .map(x => "result is"+x)
    .each(function(item){
        console.log("Printing result -->", item)
    }
    

//Insert some data
var data=[{a:1}, {b:2}]
//Stream the array (that's what _() does: transforms node streams or arrays to a highland.js stream)
//Data input can come from other collections, files, or other sources if there is a connector
//We currently provide 3 mongo input options: insert, upsert and remove. 
_(data).insert(db.collection("reactive-superglue")).done()
_(data).upsert(db.collection("reactive-superglue")).done()
_(data).remove(db.collection("reactive-superglue")).done()    

````
####reading from mongodb
A factory function is registered under the `_` namespace for each datasource. In mongodb's case: `_.db(mongo_url)` does the trick, by returning a lazy connection to the database. The `mongo_url` must be a valid mongodb connection string mongodb://server_name:port/database 



####consuming the data flow
Note that streams are lazy, so you need to pull from them in order to get the data flowing. 

* There are several ways to do this: 
* `.done(fn)` consumes the stream and calls fn once finished. 
* `.each(fn)` consumes the stream by calling fn with each item in the stream
* `.toArray(fn)` consumes the stream converting it to an array
* `.pipe(writable)` consumes the stream by piping it to a standard node.js [stream.Writable](https://nodejs.org/api/stream.html#stream_class_stream_writable)

This is just  [highland.js](http://highlandjs.org/) syntax, so be sure to take a look at its docs. 
  

###file
@@
###json and jsonfiles
@@
###csv
@@

##The underlying concepts
@@