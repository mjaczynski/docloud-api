var request = require('request');
var Promise = require('promise');
var zlib = require('zlib');
var util = require('util');

var client = new Object();


/**
 * Check for an error after calling an HTTP request.
 * 
 * @param call the call data
 * @param error the error info passed to the callback
 * @param response the HTTP response
 * @param body the HTTP body
 * @param codes the array of accepted response code
 * @param reject the promise reject call back to call in case of error
 */
var handleError = function(call, error, response, body, codes, reject) {
	  if (error) {
		  if (typeof error == 'string') {
			  var message = util.format("Unexpected error on %s %s, reason : %s",
					   call.method, call.uri, error);
			  util.log(message);
			  var exception = new Error(message);
			  exception.call = call;
			  reject(exception);
		  } else {
			  util.log(error);
			  reject(error);
		  }
		  return true;
	  } else if (codes.indexOf(response.statusCode) <0 ) {
		  var message;
		  if (body.message){
			  message = util.format("Unexpected response code %s on %s %s, reason : %s",
					  response.statusCode, call.method, call.uri, body.message);
		  } else {
			  message = util.format("Unexpected response code %s on %s %s",
					  response.statusCode, call.method, call.uri);
		  }
		  util.log(message);
		  var exception = new Error(message);
		  exception.call = call;
		  exception.reason = body;
		  reject(exception);
		  return true;
	  }
	  return false;
}

/**
 * Returns the list of jobs.
 */
client.listJobs = function () {
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'GET',	
		   uri : '/jobs' 
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[200], reject)){
				 util.log("All jobs deleted")
				 resolve(body)
			}			  
		})
	})
};

/**
 * Deletes all the jobs.
 */
client.deleteJobs = function () {	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'DELETE',	
		   uri : '/jobs'
		};
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[204], reject)){
				 util.log("All jobs deleted")
				 resolve()
			}			  
		})
	})
};

/**
 * Creates a new job.
 * @param data the creation parameters
 */
client.createJob = function (data) {
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'POST',	
		   uri : '/jobs',  
		   body : data	
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[201], reject)){
				var jobid = response.headers['location'].split('/').reverse()[0]
				  util.log("Job %s created",jobid)
				  resolve(jobid)
			}			  
		})
	})
};

/**
 * Returns a job.
 * @param jobid the job id
 */
client.getJob = function (jobid) {
	
	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'GET',	
		   uri : '/jobs/'+jobid   
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[200], reject)){
				 resolve(body)
			}			  
		})
	})
};

/**
 * Deletes a job.
 * @param jobid the job id
 */
client.deleteJob = function (jobid) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'DELETE',	
		   uri : '/jobs/'+jobid   
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[200], reject)){
				 util.log("Jobs %s deleted",jobid)
				 resolve(body)
			}			  
		})
	})
};

/**
 * Executes a job.
 * @param jobid the job id
 */
client.executeJob = function (jobid) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'POST',	
		   uri : '/jobs/'+jobid+'/execute'   
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[204], reject)){
				 util.log("Job %s submitted",jobid)
				 resolve(body)
			}			  
		})
	})
};

/**
 * Returns the job execution status.
 * @param jobid the job id
 */
client.getJobExecutionStatus = function (jobid) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'GET',	
		   uri : '/jobs/'+jobid+'/execute'   
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[200], reject)){
				 resolve(body)
			}			  
		})
	})

};


/**
 * Returns the log items
 * @param jobid the kob id
 * @param start the starting index
 * @params continuous continuous mode indicator
 */
client.getLogItems = function (jobid,start,continuous) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'GET',	
		   uri : '/jobs/'+jobid+'/log/items', 
		   qs : {
			   start : start,
			   continuous: continuous?true:false
		   }
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[200], reject)){
				 resolve(body)
			}			  
		})
	})	
};

function doPoll(client,jobid, resolve, reject){
	client.getJobExecutionStatus(jobid)
	.then(function (status){
		util.log("Job %s is %s",jobid,status.executionStatus)
		   if (status.executionStatus=='FAILED' || 
				   status.executionStatus=='PROCESSED' || 
				   status.executionStatus=='INTERRUPTED'){
			     resolve(status);
		       } else {		    	   
		    	   setTimeout(doPoll(client,jobid, resolve, reject), 2000);  
		       }
		   })
	.catch( function(error) {reject(error)})
};

function doPollLog(client,jobid, resolve, reject,logstream,start){
	client.getLogItems(jobid,start,true)
	.then(function (items){		    
		    var next = start;
		    var stop =false;
			for (var i=0; i < items.length; i++){
				var item = items[i]
				for (var j =0; j < item.records.length; j++){					
				    var r = item.records[j]
				    var message = util.format("[%s] %s - %s",new Date(r.date).toISOString(),r.level,r.message)
				    logstream.write(message)
				}			   
			   	next= item.seqid+1;			   
			   	stop=item.stop;
			}	    	   
			if (stop) {
				resolve(jobid)
				return;
			}
		    setTimeout(doPollLog(client,jobid, resolve, reject,logstream,next), 2000);  
		       
		   })
	.catch( function(error) {reject(error)})
};

/**
 * Waits for completion of a job
 * @param jobid the job id
 * @param logstream optional logstream for live log
 */
client.waitForCompletion = function (jobid, logstream) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	if (!logstream) {
		return new Promise( function (resolve, reject){		
			doPoll(ctx,jobid, resolve,reject);		
		});
	} else {
		return new Promise( function (resolve, reject){		
			doPollLog(ctx,jobid, resolve,reject,logstream,0);		
		});
	}
};

/**
 * Aborts a job
 * @param jobid the job id
 * @param kill sets the abort mode to kill
 */
client.abortJob = function (jobid, kill) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	
    var ctx = this; 
	return new Promise( function (resolve, reject){
		var call =  {
		   method : 'DELETE',	
		   uri : '/jobs/'+jobid+'/execute',  
		   qs : {kill : kill?true:false }		
		}
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[204], reject)){
				 resolve(body)
			}			  
		})
	})	
};

/**
 * Upload an attachment, attachment will be compressed automatically.
 * @param jobid the job id
 * @param attid the attachment name
 * @param stream the stream to read from
 */
client.uploadAttachment = function (jobid, attid, stream) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	if (typeof attid !== 'string') throw new TypeError('attid is undefined or not a string')
	if (typeof stream !== 'object') throw new TypeError('jobid is undefined or not an object')
	
    var ctx = this; 
	var start = new Date()
	var call = {
		 method : 'PUT',	
		 uri : '/jobs/'+jobid+'/attachments/'+attid+'/blob',
		 headers : {
		   'content-type' : 'application/octet-stream',
			'Content-Encoding': 'gzip'
	    }
	}
	return new Promise( function (resolve, reject){
	  stream.pipe(zlib.createGzip()).pipe(
		ctx.caller( call, function (error, response, body){
			if (!handleError(call,error, response, body,[204], reject)){
				 var end = new Date()
                 util.log("Attachment '%s' of job %s uploaded in %s ms", attid, jobid,(end-start))	
				 resolve(jobid)
			}
		}))
	})
};


/**
 * Download an attachment
 * @param jobid the job id
 * @param attid the attachment name
 * @param stream the stream to write to
 */
client.downloadAttachment = function (jobid, attid, stream) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	if (typeof attid !== 'string') throw new TypeError('attid is undefined or not a string')
	if (typeof stream !== 'object') throw new TypeError('jobid is undefined or not an object')
	
    var ctx = this; 
	var start = new Date()
	var call = {
			method : 'GET',
			uri : '/jobs/'+jobid+'/attachments/'+attid+'/blob',
			headers : {
			 'accept' : 'application/octet-stream'
			}
	}
	// TODO: handle HTTP error
	return new Promise( function (resolve, reject){
		ctx.caller(call).pipe(stream)
		.on('error', function(){reject(new Error(error))})
		.on('finish', function(){
			 var end = new Date()
             util.log("Attachment '%s' of job %s downloaded in %s ms", attid, jobid,(end-start))			  
			 resolve(jobid)
		})
	})
};

/**
 * Download the log
 * @param jobid the job id
 * @param stream the to write to
 */
client.downloadLog = function (jobid, stream) {

	if (typeof jobid !== 'string') throw new TypeError('jobid is undefined or not a string')
	if (typeof stream !== 'object') throw new TypeError('jobid is undefined or not an object')
	
    var ctx = this; 
	var start = new Date()
	var call =  {
			   uri : '/jobs/'+jobid+'/log/blob',
			   headers : {
				 'accept' : 'application/octet-stream'
			   }
			}
	return new Promise( function (resolve, reject){
		ctx.caller(call).pipe(stream)
		.on('error', function(){reject(new Error(error))})
		.on('finish', function(){
			 var end = new Date()
             util.log("Log of job %s downloaded in %s ms",jobid,(end-start))			  
			 resolve(jobid)
		})
	})
};


module.exports = function (options){
   var c = Object.create(client);
   
   // sets the defaults that will apply to all HTTP requests
   c.caller = request.defaults({
             baseUrl : options.url, 
             headers : {
              'X-IBM-Client-Id' : options.clientId
             },
	        json : true,
	        gzip : true,
		});
   c.url = options.url;
   c.clientId = options.clientId;
   return c;
};
