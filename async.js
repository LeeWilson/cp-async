/* ***********
 var asyncData = {
 Online: {scriptName: 'News.GetActiveNewsItems',
 args: []
 },
 Offline:{offlineMockName:'pronews'}
 }
 async.callAsync(asyncData).then(function(response) {
 //success code
 }).catch(function(error) {
 //failure code
 });

 ***********/
var React = require('react');
var onlineData = false;
var dbas = require('../cp-dbas');

module.exports = {
			parseDataSet: function(dataSet,parseDataTableFunc){
						var returnObj = {};
						for (var b=0; b<dataSet.length; b++){
									returnObj[dataSet[b].name] =parseDataTableFunc(dataSet[b].dataTable)
						}
						return returnObj;
			},
			parseDataTable: function(data){
						var dataArray = [];
						var headers = data.headers;
						var headersToUse = [];
						for (var a = 0; a < headers.length; a++) {
									headersToUse.push(headers[a].columnTitle.charAt(0).toLowerCase() + headers[a].columnTitle.slice(1));
						}
						var dataToUse =data.data;
						for (var p = 0; p < dataToUse.length; p++) {
									var objectToPush = {};
									for (var l = 0; l < dataToUse[p].length; l++) {
												var keyToUse = headersToUse[l];
												objectToPush[keyToUse] = dataToUse[p][l];
									}
									dataArray.push(objectToPush)
						}

						return dataArray;
			},
			callAsync: function (thatAsyncData, successFunction, errorFunction) {
						/*
						 //Expected format of async data
						 asyncData= {
						 scriptName: 'Campaign.GetAllLeadsForUser',
						 args: [argument]
						 }
						 */
						var self = this;
						var asyncData = thatAsyncData;
						if (onlineData) {

									var payload = {
												uid: asyncData.scriptName,
												command: asyncData.scriptName,
												parameters:asyncData.args
									}
									$.ajax({
												url: systemObj.baseUrl + '/' + systemObj.serviceUrl,
												type: 'POST',
												dataType: 'json',
												data: {
															json: JSON.stringify({
																		managerId: systemObj.managerId,
																		commands: [payload]
															}),
															XToken: systemObj.securityToken
												},
												success: function (data) {
															//success function here
															if (successFunction) {
																		for (var key in data.data){
																					var type = data.data[key].data.type;
																					var returnData;
																					var startTime = new Date()
																					if( type ==='dataTable'){
																								returnData = self.parseDataTable(data.data[key].data);
																								console.log(key);
																								console.log(new Date() - startTime)
																								successFunction(returnData);
																					}else if(type ==='dataSet'){

																								returnData = self.parseDataSet(data.data[key].data.tables,self.parseDataTable);
																								console.log(key)
																								console.log(new Date() - startTime)
																								successFunction(returnData);
																					}else{
																								var message = 'Unknown DataType Returned:' + type;
																						 		console.log(new Date() - startTime);
																								return(data.data[key].data);
																					}
																		}
															}
												},
												error: function (err) {
															//error function here
															if (errorFunction) {
																		errorFunction(err)
															}
												}
									});
						} else {
									dbas.get(asyncData.scriptName, function (err, data) {

												if (err === null) {
															var returnData;
															if (data.length === undefined) {
																		returnData = $.extend(true, {}, data);
															} else {
																		returnData = $.extend(true, [], data);
															}
															if(successFunction) {
																		successFunction(returnData);
															}
												}
									});
						}
			}
};

