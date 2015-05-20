/**
 * In order to run the tests, you will need to download problem files and unpack them
 * in the following directories:
 * 
 * - test/oil-blending
 * http://www.ibm.com/software/analytics/docloud/resources/demo/zip/Oil-blending-demo.zip
 * 
 * - test/sport-scheduling
 * http://www.ibm.com/software/analytics/docloud/resources/demo/zip/Sport-scheduling-demo.zip 
 * 
 * - test/warehouse-location
 * http://www.ibm.com/software/analytics/docloud/resources/demo/zip/Warehouse-location-demo.zip 
 * 
 * You also need to define the following variables:
 * - URL: the base URL of the DOcloud service
 * - KEY: the API key (client ID)
 * 
 **/

var docloud = require('../index.js');
var fs = require('fs');
var client = docloud({
	  url : process.env.URL,
	  clientId : process.env.KEY
	})
	
console.log('Using DOcloud URL: ',process.env.URL)

//it ('load tests', function(done){
//	
//	this.timeout(3*60 * 1000);
//	for (var i=0; i < 5; i++) {
//		client.execute({			
//			attachments : [
//		        {name : '.oplproject', 
//		    	 stream : fs.createReadStream('test/sport-scheduling/.oplproject')},
//		        {name : 'Sport-scheduling.dat', 
//			     stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.dat')},
//			    {name : 'Sport-scheduling.mod', 
//				 stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.mod')},
//				{name : 'Sport-scheduling.ops', 
//				 stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.ops')},
//		    ]})
//		   .on('created', function(jobid){console.log(jobid+" created")})
//		   .on('processed', function(jobid){
//			   console.log(jobid+" processed");
//			   client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/sport-scheduling/solution.json'))
//			         .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/sport-scheduling/solution.log'))})
//			         .then(function () {done()})  
//		   })
//		   .on('interrupted', function(jobid){done("should not be interrupted")})
//		   .on('failed', function(jobid){done("should not fail")})
//		   .on('error', function(error){done(error)})
//   }
//});

it ('warehouse-location', function(done){
	
	this.timeout(3*60 * 1000);	
	client.execute({
		logstream : process.stdout,
		attachments : [
	        {name : '.oplproject', 
	    	 stream : fs.createReadStream('test/warehouse-location/.oplproject')},
	        {name : 'warehouse_cloud.dat', 
		     stream : fs.createReadStream('test/warehouse-location/warehouse_cloud.dat')},
		    {name : 'warehouse_cloud.mod', 
			 stream : fs.createReadStream('test/warehouse-location/warehouse_cloud.mod')},
			{name : 'warehouse_data.mod', 
			 stream : fs.createReadStream('test/warehouse-location/warehouse_data.mod')},
	    ]})
	   .on('created', function(jobid){console.log(jobid+" created")})
	   .on('processed', function(jobid){
		   console.log(jobid+" processed");
		   client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/warehouse-location/solution.json'))
		         .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/warehouse-location/solution.log'))})
		         .then(function () {done()})  
	   })
	   .on('interrupted', function(jobid){done("should not be interrupted")})
	   .on('failed', function(jobid){done("should not fail")})
	   .on('error', function(error){done(error)})
	  	
});

it ('sport scheduling', function(done){
	
	this.timeout(3*60 * 1000);	
	client.execute({
		logstream : process.stdout,
		attachments : [
	        {name : '.oplproject', 
	    	 stream : fs.createReadStream('test/sport-scheduling/.oplproject')},
	        {name : 'Sport-scheduling.dat', 
		     stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.dat')},
		    {name : 'Sport-scheduling.mod', 
			 stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.mod')},
			{name : 'Sport-scheduling.ops', 
			 stream : fs.createReadStream('test/sport-scheduling/Sport-scheduling.ops')},
	    ]})
	   .on('created', function(jobid){console.log(jobid+" created")})
	   .on('processed', function(jobid){
		   console.log(jobid+" processed");
		   client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/sport-scheduling/solution.json'))
		         .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/sport-scheduling/solution.log'))})
		         .then(function () {done()})  
	   })
	   .on('interrupted', function(jobid){done("should not be interrupted")})
	   .on('failed', function(jobid){done("should not fail")})
	   .on('error', function(error){done(error)})
	  	
});

it ('oil-blending test', function(done){
	
	this.timeout(3*60 * 1000);
	client.execute({
		attachments : [{name : 'oil-blending.lp', stream : fs.createReadStream('test/oil-blending/oil-blending.lp')}],
		parameters : { "oaas.TIME_LIMIT" : 3*60*1000},
	    logstream : process.stdout
	}).on('created', function(jobid){console.log(jobid+" created")})
	  .on('processed', function(jobid){
		   console.log(jobid+" processed");
		   client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/solution.json'))
		         .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/solution.log'))})
		         .then(function() {return client.getJob(jobid)})
            	 .then(function(job) {console.log(job)})
		         .then(function () {done()})  
	   })
	  .on('interrupted', function(jobid){done("should not be interrupted")})
	  .on('failed', function(jobid){done("should not be interrupted")})
	  .on('error', function(error){done(error)})
});
