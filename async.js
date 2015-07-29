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

module.exports = {

			callAsync: function (thatAsyncData, successFunction, errorFunction) {
						/*
						 //Expected format of async data
						 asyncData= {
						 Online: {scriptName: 'Campaign.GetAllLeadsForUser',
						 args: [argument]
						 }
						 */
						var asyncData = thatAsyncData;
						var self = this;
						if (dbas) {
									var dataString = '';
									for (var i = 0; i < asyncData.Online.args.length; i++) {
												var key = Object.keys(asyncData.Online.args[i])[0];
												if (key !== undefined) {
															dataString += '&' + key + '=' + encodeURIComponent(asyncData.Online.args[i][key]);
												}
									}
									var url = 'fq/?FMLItemName=' + asyncData.Online.scriptName + '&campaignManagerId=' + systemObj.managerId + dataString;
									$.ajax({
												url: url,
												type: 'POST',
												contentType: 'application/json',
												context: document.body,
												dataType: 'text',
												beforeSend: function beforeSend(xhr) {
															xhr.setRequestHeader('X-Token', systemObj.securityToken);
												},
												success: function (data){
															if(successFunction) {
																		successFunction(JSON.parse(data));
															}
												},
												error : function (err) {
															if(errorFunction) {
																		errorFunction(err);
															}
												}
									});
						}
			}
};

