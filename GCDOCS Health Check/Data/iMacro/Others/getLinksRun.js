hcCommon.sysLog("Start HealthCheckRun.js");
(function() {
	hcCommon.sysLog("Start HealthCheckRun.js anonymous function");
	var lTabName = "mainListOfServers";
	var lCSVFile = "mainRun.csv"
	var lStartingAddress = window.location.href;

	function doContinue(aServer, aClientData) {
		hcCommon.sysLog("Start HealthCheckRun.doContinue:" + aServer);
		var lMax = 0;
		$.each(aServer, function(key, value) {
			hcCommon.sysLog("Start HealthCheckRun.doContinue.each:" + key + " & " + value);
			/*iimSet("VAR0", hcCommon.getCleanIMacroPath());
			iimSet("VAR1", lCSVFile);

			//set up all the variables - there are 7, tarting at 2 (1 is not yest used, will be in future version - system name)
			iimSet("VAR2", aClientData.UserName); //var 2 is asp username
			iimSet("VAR3", aClientData.aspEmail); //var 3 is asp E-MAIL
			iimSet("VAR4", aClientData.encryptedPassword); //var 4 is encrypted password

			// VARS USED FOR FILE UPLOAD
			iimSet("VAR7", hcCommon.getEscapedSpaces(hcCommon.getCleanIMacroPath()) + "\\\\"); // var 7 is file path
			iimSet("VAR8", "HealthCheck.txt"); // var 8 is filename

			//system specific vars are next
			iimSet("VAR5", value.address); // var 5 is URL
			iimSet("VAR6", value.helpdiv); // var 6 is HelpDiv - this changes if you have custom slices
			iimSet("VAR9", value.name); // var 9 is system name - becomes var 1 in IIM scripts since var is taken by filename above

			lMax = lMax + 1; //so we know how many we ultimatly need

			//EXECUTE THAT SUCCER!
			//iimPlay(getPathForIMacro() + "/Data/iMacro/BuildMasterCSV.iim");*/
			window.location.href=value.address;
		})

		//start the first instance of iim script, passing in the required vars
		/*iimSet("VAR0", hcCommon.getCleanIMacroPath() + "\\" + lCSVFile); //data source
		iimSet("VAR1", 1); //datasource line (usually current index +1 )
		iimSet("VAR2", 'file://' + hcCommon.getRealPath() + 'gotoNext.html?next=' + 1 + "&max=" + lMax +
			"&nextScript=HealthCheckContinue&lastPage=" + lStartingAddress +
			"&CSVFile=" + lCSVFile + "&IIM=HealthCheckMainRunner");

		iimPlay(getPathForIMacro() + "/Data/iMacro/HealthCheckMainRunner.iim");*/

		// our story continues in another .js file...
	}

	// get the cheked items
	var lItemsToCheck = hcCommon.getCheckedServers(lTabName);

	//save them
	hcCommon.saveCheckedServers(lItemsToCheck, lTabName);

	//load the JSON file and get going
	hcCommon.loadCheckedServerData(lItemsToCheck, doContinue)

	hcCommon.sysLog("End HealthCheckRun.js anonymous function");
})();
hcCommon.sysLog("End HealthCheckRun.js");