
var React = require('react');

module.exports = {

			runAsync: function (thatAsyncData, successFunction, errorFunction) {
						/*
						 //Expected format of async data
						 asyncData= {
						 Online: {scriptName: 'Campaign.GetAllLeadsForUser',
						 args: [argument]
						 }
						 */
						var asyncData = thatAsyncData;
						var dataString = '';
						for (var i = 0; i < asyncData.args.length; i++) {
									var key = Object.keys(asyncData.args[i])[0];
									if (key !== undefined) {
												dataString += '&' + key + '=' + encodeURIComponent(asyncData.args[i][key]);
									}
						}
						var url = 'fq/?FMLItemName=' + asyncData.scriptName + '&campaignManagerId=' + systemObj.managerId + dataString;
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

};

