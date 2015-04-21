

var docloud = require('../index.js');
var fs = require('fs');
var client = docloud({
	  url : process.env.URL,
	  clientId : process.env.KEY
	})
	
console.log('URL ',process.env.URL)

it ('stream log test', function(done){
	
	this.timeout(60 * 1000);
	
	var jobid;
	client.deleteJobs()
	  .then(function() {return client.createJob({attachments : [{name : 'oil-blending.lp'}]})})	   
	  .then(function(id) {jobid=id;})
	  .then(function() {return client.uploadAttachment(jobid,'oil-blending.lp',fs.createReadStream('test/oil-blending.lp'))})
	  .then(function() {return client.executeJob(jobid)})
	  .then(function() {return client.getJob(jobid)})
	  .then(function(job) {console.log(job)})
	  .then(function() {return client.getJobExecutionStatus(jobid)})
	  .then(function(status) { console.log(status)})
	  .then(function() {return client.waitForCompletion(jobid, process.stdout)})
	  .then(function () {return client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/solution.json'))})	  
	  .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/solution.log'))})	  
	  .then(function() {return client.deleteJob(jobid)})
	  .then(function(){done();})
	  .catch(function (error) {done(error)})	
});

it ('basic test', function(done){
	
	this.timeout(60 * 1000);
			
	var jobid;
	client.deleteJobs()
	  .then(function() {return client.createJob({attachments : [{name : 'oil-blending.lp'}]})})	   
	  .then(function(id) {jobid=id;})
	  .then(function() {return client.uploadAttachment(jobid,'oil-blending.lp',fs.createReadStream('test/oil-blending.lp'))})
	  .then(function() {return client.executeJob(jobid)})
	  .then(function() {return client.getJob(jobid)})
	  .then(function(job) {console.log(job)})
	  .then(function() {return client.getJobExecutionStatus(jobid)})
	  .then(function(status) { console.log(status)})
	  .then(function() {return client.waitForCompletion(jobid)})
	  .then(function () {return client.downloadAttachment(jobid,'solution.json',fs.createWriteStream('test/solution.json'))})	  
	  .then(function () {return client.downloadLog(jobid,fs.createWriteStream('test/solution.log'))})	  
	  .then(function() {return client.deleteJob(jobid)})
	  .then(function(){done();})
	  .catch(function (error) {done(error)})
	
});

it ('abort test', function(done){
	
	this.timeout(60 * 1000);
		
	var jobid;
	client.createJob({attachments : [{name : 'oil-blending.lp'}]})
	  .then(function(id) {jobid=id;})
	  .then(function() {return client.uploadAttachment(jobid,'oil-blending.lp',fs.createReadStream('test/oil-blending.lp'))})
	  .then(function() {return client.executeJob(jobid)})
	  .then(function() {return client.abortJob(jobid)})
	  .then(function() {return client.waitForCompletion(jobid)})
	  .then(function() {return client.getJobExecutionStatus(jobid)})
	  .then(function(status) { console.log(status)})
	  .then(function(){done();})
	  .catch(function (error) { console.log(error); done(error)})
	  	
});

it ('kill test', function(done){
	
	this.timeout(60 * 1000);
		
	var jobid;
	client.createJob({attachments : [{name : 'oil-blending.lp'}]})
	  .then(function(id) {jobid=id;})
	  .then(function() {return client.uploadAttachment(jobid,'oil-blending.lp',fs.createReadStream('test/oil-blending.lp'))})
	  .then(function() {return client.executeJob(jobid)})
	  .then(function() {return client.abortJob(jobid,true)})
	  .then(function() {return client.waitForCompletion(jobid)})
	  .then(function() {return client.getJobExecutionStatus(jobid)})
	  .then(function(status) { console.log(status)})
	  .then(function(){done();})
	  .catch(function (error) { console.log(error); done(error)})
	  
	
});