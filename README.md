# reactive-superglue
FRP (functional reactive programming) middleware for integrating diverse data sources and data sinks / endpoints. 

We leverage [highland.js](http://highlandjs.org) to provide a light and robust data processing framework, but we are team players, it should work seamlessly with whatever frameworks you are currently using (please report issues!).

**reactive-superglue** is designed to simplify dealing with real-world data that  is on the move. You can call it streams, monoids, observables, but at the end of the day, it usually boils down to read from here, do stuff, write there. 

##hello superglue

```javascript

var _=require("superglue") // _ is just a name for a variable
//create a connection (it connects when we call "done()"). 
var db=_.mongodb("mongodb://localhost/test")

//Read from here
db.collection("users") 
  //do some stuff 
  .find({active: true}, {id_: false, name:true}) //Filter and project, delegated to mongodb
  //some more stuff
  .uniq() //Filter some more, this time, inside node.js, thanks to highland.js
  //Write there
  .upsert(db.collection("unique_user_names")) //merges into existing values.
  //tell highland to start 
  .done() //This trigger the pulling of data from the underlying stream sources
``` 

Simply put, you get a neat chained API and can use all the `map`, `reduce`, `scan`, ... processing APIs of highland.js together with superglue's reading and writing connectors. Some more examples:


##No fluff, just stuff

```javascript
var _=require("reactive-superglue")

//You can use mongodb without dealing with callback hell
var query=_.db("mongodb://localhost/my_db")
    .collection("my_collection")
    .find({type: "some_type"});

query.to_jsonfile("path/to/file").done()

var name_is_john_collection=db("mongodb://localhost/another_db").collection("name_is_john_collection")

//json files are simply files that contain one JSON-per-line. 
//Only JSONs without '\n' in their fields are valid. 
//json files are non-standard but very convenient for streaming large collections of objects. 
_.from_jsonfile("path/to/file")
    .filter(obj => obj.name=="John")
    .upsert(name_is_john_collection)
    .done()

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

//Stream a query to stdout. 
//Propagates arguments to mongo (query, projection and options) 
collection.find()
  .map(JSON.stringify)
  .pipe(process.stdout)

collection.find({field1: "somevalue"}, {_id: 0, field1: 1})
  .map(JSON.stringify)
  .pipe(process.stdout)

//Aggregation also supported. 
db.collection("some_collection")
    .aggregate([{$group: {_id: null, count: {$sum: 1}}}], {allowDiskUse: true})
    .to_jsonfile("my/file.json") //just pipe the jsons to file, one-per-line.
    
    


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
//Stream the array directly to db (insert / upsert / remove)
_(data)
  .insert(db.collection("reactive-superglue"))
  .done()
_(data)
  .upsert(db.collection("reactive-superglue"))
  .done()
_(data)
  .remove(db.collection("reactive-superglue"))
  .done()    

````

####reading from mongodb
A factory function is registered under the `_` namespace for each data source. In mongodb's case: `_.db(mongo_url)` does the trick, by returning a lazy connection to the database. The `mongo_url` must be a valid mongodb connection string url:  `mongodb://server_name:port/database`

####transforming the data flow
You can use all the transforms from [highland.js](http://highlandjs.org/#Transforms). A couple of examples:

* `map(fn)` applies `fn` to each element:

````javascript
_.db("mongodb://localhost/test")
    .collection("col")
    .find()
    .map(function(x){return x.some_number}) 
    .map(x => x+2) //you can use ES6 syntax
    .each(x => console.log("received x=", x)
````
* `reduce(memo, fn)` acummulates the result of `fn` 

````javascript
_.db("mongodb://localhost/test")
    .collection("col")
    .find()
    .map(function(x){return x.some_number}) 
    .reduce(0, (a,b) => a+b) //sum the some_number for all the objects
    .each(x => console.log("sum of  x.some_number", x) //
````



####consuming the data flow
Note that streams are lazy, so you need to pull from them in order to get the data flowing. 

* There are several ways to do this: 
* `.done(fn)` consumes the stream and calls fn once finished. 

````javascript
_([{a:1, b:2}, {a:5, b:7}]) //Array that gets treated as a stream
    .insert(collection("col")) //each doc is inserted in collection col
    .done()    //triggers the stream
````

* `.each(fn)` consumes the stream by calling fn with each item in the stream
* `.toArray(fn)` consumes the stream converting it to an array
* `.pipe(writable)` consumes the stream by piping it to a standard node.js [stream.Writable](https://nodejs.org/api/stream.html#stream_class_stream_writable), including http responses, files, process.stdout, and so on (although we provide convenience mix-ins
for the most common ones). 

This is just  [highland.js](http://highlandjs.org/) syntax, so be sure to take a look at its docs. 
  

###file
@@
###json and jsonfiles
@@
###csv
@@

##The underlying concepts
@@