//var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var ip = require('ip');
//var Client = require('node-rest-client').Client;
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var app = express();


var connectionString = "mongodb://52.38.229.254," + "52.40.173.246," 
+ "52.40.175.213:27017" 
+ "/cmpe281" + "?readPreference=secondary&" + "w=2";
var options = {
	server: {
		reconnectInterval:50,
		reconnectTries:5,
      socketOptions: {
        connectTimeoutMS: 500
      }
    },
	replSet: {
		reconnectWait :1000,
		rs_name:'cmpe281',
	}
}

app.get("/insert",function(req,res){
	
	//res.setHeader('Content-Type', 'text/html');
    //res.writeHead(200);
	
	MongoClient.connect(connectionString, options, function(err, db) {
        assert.equal(null, err);
        assert.ok(db != null);

		db.collection('imran').insertOne( {
		"key" : "Hello World #1",
		}, function(err,result){
			assert.equal(err,null);
			console.log("Inserted document successfully");
			res.send(result);
		});
    });
	
});


app.get("/show",function(req,res){
	
	//res.setHeader('Content-Type', 'text/html');
    //res.writeHead(200);
	body = fs.readFileSync('./index.html');
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
	MongoClient.connect(connectionString, options, function(err, db) {
        assert.equal(null, err);
        assert.ok(db != null);

		db.collection('imran').find({"key":"Hello World #1"}).toArray(function(err, docs){
			
			//res.send(docs);
			data = docs[0];
			name = data.key;
			var html_body = "" + body ;
            var html_body = html_body.replace("{message}", name );
            var html_body = html_body.replace("{messageTwo}", ip.address());
            res.end( html_body );
		});
		
    });
	
});




app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});