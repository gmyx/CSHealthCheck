hcCommon.sysLog("Start RunCRs.js");
(function() {
	hcCommon.sysLog("Start RunCRs.js anonymous function");
	var lTabName = "otherListOfServers";
	var lCSVFile = "CRsRun.csv"
	var lStartingAddress = window.location.href;

	function doContinueLast(aServer, aClientData, aCRData, aCRSubData) {
		hcCommon.sysLog("Start RunCRs.doContinueLast:" + aServer);
		var lMax = 0;
		$.each(aServer, function(key, value) {
			hcCommon.sysLog("Start RunCRs.doContinueLast.each:" + key + " & " + JSON.stringify(value));
			iimSet("VAR0", hcCommon.getCleanIMacroPath());
			iimSet("VAR1", lCSVFile);

			//set up all the variables - there are 7, tarting at 2 (1 is not yest used, will be in future version - system name)
			iimSet("VAR2", aClientData.UserName); //var 2 is asp username
			iimSet("VAR3", aClientData.aspEmail); //var 3 is asp E-MAIL
			iimSet("VAR4", aClientData.encryptedPassword); //var 4 is encrypted password

			//CR specific varialbes - var 6
			if (aCRSubData.col6 !== undefined) {
				// see if col6 has server in it
				$.each (aCRSubData.col6, function(aSubKey, aSubvalue) {
					//window.alert (aSubKey + " .. " + aSubvalue.Name + " .. "  + JSON.stringify(aSubvalue))
					if (value.name == aSubvalue.Name) {
						iimSet("VAR6", aSubvalue.Value); //var 6
					}
				});
			}

			//CR specific varialbes - var 7
			if (aCRSubData.col7 !== undefined) {
				// see if col6 has server in it
				$.each (aCRSubData.col7, function(aSubKey, aSubvalue) {
					//window.alert (aSubKey + " .. " + aSubvalue.Name + " .. "  + JSON.stringify(aSubvalue))
					if (value.name == aSubvalue.Name) {
						iimSet("VAR7", aSubvalue.Value); //var 7
					}
				});
			}

			//iimSet("VAR7", 'file://' + hcCommon.getRealPath() + 'Data/iMacro/CRs/' + aCRData[0].script);
			iimSet("VAR8", $("#hiddenEncPass").val()); // encrypted admin index password

			//system specific vars are next
			iimSet("VAR5", value.address); // var 5 is URL
			iimSet("VAR9", value.name); // var 9 is system name - becomes var 1 in IIM scripts since var is taken by filename above

			lMax = lMax + 1; //so we know how many we ultimatly need

			//EXECUTE THAT SUCCER!
			iimPlay(getPathForIMacro() + "/Data/iMacro/BuildMasterCSV.iim");
		})

		//start the first instance of iim script, passing in the required vars
		iimSet("VAR0", hcCommon.getCleanIMacroPath() + "\\" + lCSVFile); //data source
		iimSet("VAR1", 1); //datasource line (usually current index +1 )
		iimSet("VAR2", 'file://' + hcCommon.getRealPath() + 'gotoNext.html?next=' + 1 + "&max=" + lMax +
			"&nextScript=HealthCheckContinue&lastPage=" + lStartingAddress +
			"&CSVFile=" + lCSVFile + "&IIM=CRS/" + aCRData[0].script);

		iimPlay(getPathForIMacro() + "/Data/iMacro/CRs/" + aCRData[0].script);

		// our story continues in another .js file...
	}

	function doContinueWithSubData(aData, aCRData) {
		hcCommon.sysLog("Start RunCRs.doContinueWithSubData");

		// get the cheked items
		var lItemsToCheck = hcCommon.getCheckedServers(lTabName);

		//save them
		hcCommon.saveCheckedServers(lItemsToCheck, lTabName);

		//load the servers JSON file and get going
		hcCommon.loadCheckedServerData(lItemsToCheck, doContinueLast, aCRData, aData);

		hcCommon.sysLog("End RunCRs.doContinueWithSubData");
	}

	// we have the base CR data
	function doContinueFirst(aCRData) {
		hcCommon.sysLog("Start RunCRs.doContinueFirst");

		//see if cr has data to be merged
		if (aCRData[0].data !== undefined) {
			hcCommon.loadCRSubData(aCRData[0].data, doContinueWithSubData, aCRData);
		} else {
			doContinueWithSubData("", aCRData[0]);
		}
		hcCommon.sysLog("End RunCRs.doContinueFirst");
	}

	// get CRs
	hcCommon.loadCRData(doContinueFirst, $("#AvailableCRs").val());

	hcCommon.sysLog("End RunCRs.js anonymous function");
})();
hcCommon.sysLog("End RunCRs.js");