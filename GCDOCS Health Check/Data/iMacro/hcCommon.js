(function() {
	function trimString(s) {
		return s.replace(/^\s+/, "").replace(/\s+$/, "");
	}

	function loadScriptFromURL(url) {
		hcCommon.sysLog("Start loadScriptFromURL: " + url);
		var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
			async = false;
		request.open('GET', url, async);
		request.send();
		if (request.status !== 200) {
			var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
			iimDisplay(message);
			hcCommon.sysLog("End loadScriptFromURL: false");
			return false;
		}
		eval(request.response);
		hcCommon.sysLog("End loadScriptFromURL: true");
		return true;
	};

	function getSystemRealPath() {
		hcCommon.sysLog("Start getSystemRealPath");
		//get our system path
		var lPath = window.document.location.pathname;
		var lPattern = /\/.*\//g;
		var realPath = lPattern.exec(lPath)[0];

		hcCommon.sysLog("End getSystemRealPath");
		return realPath
	}

	function appendClientData(aForwardTo, aForwardData1, aForwardData2) {
		hcCommon.sysLog("Start appendClientData");
		//load the settings.csv file
		$.ajax({
			url: 'file://' + getSystemRealPath() + "/Data/settings.csv",
			async: true,
			success: function (csvd) {
				hcCommon.sysLog("Start appendClientData.ajax.success");
				gSettings = $.csv.toArrays(csvd);
				hcCommon.sysLog("End appendClientData.ajax.success");
			},
			dataType: "text",
			complete: function () {
				hcCommon.sysLog("Start appendClientData.ajax.complete");
				// call a function on complete
				var lOut = {
					"UserName": gSettings[0][0],
					"encryptedPassword": gSettings[0][1],
					"aspEmail": gSettings[0][2]
				};

				aForwardTo(aForwardData1, lOut, aForwardData2);

				hcCommon.sysLog("End appendClientData.ajax.complete");
				return false;
			}
		});
		hcCommon.sysLog("End appendClientData");
	}

	function getPathForIMacro() {
		hcCommon.sysLog("Start getPathForIMacro");
		var lPath = getSystemRealPath();
		lPath = /\/(.*)/g.exec(lPath)[1];
		lPath = lPath.replace(/%20/g, " ");
		//lPath = lPath.replace(/\//g, "\\\\");

		hcCommon.sysLog("End getPathForIMacro");
		return lPath;
	}

	function filterInt(value) {
		hcCommon.sysLog("Start filterInt: " + value);
		if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
			hcCommon.sysLog("End filterInt");
			return Number(value);
		}
		hcCommon.sysLog("End filterInt");
		return NaN;
	};

	hcCommon = {
		sysLog: function(aMSG)  {
			if (gDebug !== undefined) {
				if (gDebug === true) {
					window.console.log(aMSG);
				}
			}
		},
		getRealPath: getSystemRealPath,
		getCleanPathForIMacro: getPathForIMacro,
		loadJS: loadScriptFromURL,
		getNumber: function(value){ return filterInt(value)},
		getCleanIMacroPath: function () {
			hcCommon.sysLog("Start hcCommon.getCleanIMacroPath");
			//convert the path to a usable path by iMacro
			var lVar0 =  getSystemRealPath().replace(/\//g, "\\\\");
			lVar0 =  lVar0.replace(/%20/g, " ");
			var lFilter = /\\\\(.*)/g;
			lVar0 = (lFilter.exec(lVar0)[1]) + "Data";
			hcCommon.sysLog("Start end.getCleanIMacroPath");

			return lVar0
		},
		getEscapedSpaces: function (aPath) {
			hcCommon.sysLog("Start/End hcCommon.getEscapedSpaces: " + aPath);
			return aPath.replace(/ /g, "<SP>");
		},
		loadDeps: function(aIncludeENC) {
			hcCommon.sysLog("Start hcCommon.loadDeps: " + aIncludeENC);
			getPathForIMacro();
			// load JQuery - editted version. all instances of setTimout prepended with window.
			loadScriptFromURL('file://' + getSystemRealPath() + '/js/jquery/2.1.4/jquery.min.js');
			$ = window.$,
			JQuery = window.JQuery;

			// load csv handler -- not use
			loadScriptFromURL('file://' + getSystemRealPath() + '/Data/jquery.csv.js');
			$.csv = window.$.csv;

			if (aIncludeENC !== undefined) {
				if (aIncludeENC === true) {
					loadScriptFromURL('file://' + getSystemRealPath() + '/Data/rijndael.js');
					Rijndael = window.Rijndael
				}
			}
			hcCommon.sysLog("End hcCommon.loadDeps");
		},
		getCheckedServers: function(aTab) {
			hcCommon.sysLog("Start hcCommon.getCheckedServers: " + aTab);
			// get the cheked items
			var lItemsToCheck = [];
			//$("#" + aTab + " tbody tr td ").each(function() {sysLog($(this).text())});
			$("#" + aTab + " tbody tr td:first-child input").each(function() {
				var lPatt = /.*row(\d+)/;
				var lId = $(this).prop("id");
				lId = lPatt.exec(lId)[1];
				hcCommon.sysLog("lID: " + lId);
				hcCommon.sysLog("lPatt.exec: " + lPatt.exec(lId));
				hcCommon.sysLog("hcCommon.getCheckedServer: checking " +
					$("#" + aTab + " tr:eq(" + (filterInt(lId) + 1) +") td:eq(1)" ).text())
				if ($(this).prop("checked") == true) {
					//add this one to the list, the name is in the next cell
					lItemsToCheck.push($("#" + aTab + " tr:eq(" + (filterInt(lId) + 1) +") td:eq(1)" ).text());
				}
			});

			hcCommon.sysLog("End hcCommon.getCheckedServers");
			return lItemsToCheck;

		},
		loadCRData: function(aCallback) {
			hcCommon.sysLog("Start hcCommon.loadCRData" );

			//load the JSON file and get going
			$.getJSON( "file://" + getSystemRealPath() + "/Data/CRs.json", function( data ) {
				hcCommon.sysLog("Start hcCommon.loadCRData.getJSON: " + data);
				var lCRs = [];

				$.each(data.CRs, function (key, val) {
					// see if we need this data
					//if (aCheckedItems.indexOf(val.id) > -1) {
						// add this server to the list
						lCRs.push(val);
					//}
				})

				// append client data and then foward to the final destination
				aCallback(lCRs);

				hcCommon.sysLog("End hcCommon.loadCRData.getJSON");
			});

			hcCommon.sysLog("End hcCommon.loadCRData");
		},
		loadCheckedServerData: function(aCheckedItems, aCallback, aForwardData2) {
			hcCommon.sysLog("Start hcCommon.loadCheckedServerData: " + aCheckedItems);

			//load the JSON file and get going
			$.getJSON( "file://" + getSystemRealPath() + "/Data/servers.json", function( data ) {
				hcCommon.sysLog("Start hcCommon.loadCheckedServerData.getJSON: " + data);
				var lServerData = [];

				$.each(data.servers, function (key, val) {
					// see if we need this data
					if (aCheckedItems.indexOf(val.name) > -1) {
						// add this server to the list
						lServerData.push(val);
					}
				})

				// append client data and then foward to the final destination
				appendClientData(aCallback, lServerData, aForwardData2);

				hcCommon.sysLog("End hcCommon.loadCheckedServerData.getJSON");
			});

			hcCommon.sysLog("End hcCommon.loadCheckedServerData");
		},
		saveCheckedServers: function(aServers, aTab) {
			hcCommon.sysLog("Start hcCommon.saveCheckedServers: " + aServers + " & " + aTab);
			//build up a savable file
			var lCSV = aServers.join();

			//setup
			// var0 is path
			// var1 is file name
			// var2 is data
			iimSet("VAR0", hcCommon.getCleanIMacroPath());
			iimSet("VAR1", "serversToCheck_" + aTab + ".csv");
			iimSet("VAR2", lCSV);

			//execute
			iimPlay(getPathForIMacro() + "/Data/iMacro/SaveData.iim");
			hcCommon.sysLog("End hcCommon.saveCheckedServers");
		},
		closeModals: function () {
			hcCommon.sysLog("Start/End hcCommon.closeModals");
			iimPlay(getPathForIMacro() + "/Data/iMacro/CloseModalBox.iim");
		},
		clearMasterCSV: function (aName) {
			hcCommon.sysLog("Start hcCommon.clearMasterCSV:" + aName);
			iimSet("VAR0", hcCommon.getCleanIMacroPath());
			iimSet("VAR1", aName);
			iimPlay(getPathForIMacro() + "/Data/iMacro/ClearMasterCSV.iim");
			hcCommon.sysLog("End hcCommon.clearMasterCSV");
		},
		encrypt: function (aStringToEncrypt, aPassword) {
			hcCommon.sysLog("Start/End hcCommon.encrypt");
			return Rijndael.encryptString(
				trimString(aStringToEncrypt),
				trimString(aPassword)
			)
		}
	}

	return hcCommon;
})();