# Notice


[IBM Decision Optimization on Cloud](http://www.ibm.com/software/analytics/docloud/) or DOcloud for short is a service that lets you solve CPLEX and OPL problems on the Cloud. You can access the interactive service called DropSolve or you can use use the API to integrate the service into your application. Here is a quick [introduction](http://www.mycloudtips.com/2015/04/docloud.html) with useful links. This module provides a wrapper over the REST API using Promises.

Example
-------

In this following example, we submit an OPL project made of several files. The execute function takes an object to configure how the job will
be created and monitored. This object provides the client with the list of attachments to create (attachments property) and where to get their streams. It also 
indicates if the live log must be streamed (logstream property) and to which stream. Additional parameters can be declared as well (parameters property).
The execute function will create the job, upload the attachments, and monitor the execution asynchronously. It will fire events when the job is created, processed, interrupted, failed, or if an error occurred. 

```
var docloud = require('docloud-api');
var fs = require('fs');
var client = docloud({
	  url : process.env.URL,
	  clientId : process.env.KEY
	})
	
client.execute({
		logstream : process.stdout,
		parameters : { "oaas.TIME_LIMIT" : 3*60*1000},
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
	   })
	   .on('interrupted', function(jobid){console.log("job was interrupted")})
	   .on('failed', function(jobid){console.log("job failed")})
	   .on('error', function(error){console.log(error)})
	   		
```


Status
------
Under development, module API can change without notice.








