hcCommon.sysLog("Start HealthCheckSetupNotifications.js");
(function() {
	hcCommon.sysLog("Start HealthCheckSetupNotifications.js anonymous function");
	var lTabName = "mainListOfServers";
	var lCSVFile = "notificaitonSetUp.csv"
	var lStartingAddress = window.location.href;

	function doContinue(aServer, aClientData) {
		hcCommon.sysLog("Start HealthCheckSetupNotifications.doContinue:" + aServer);
		var lMax = 0;
		$.each(aServer, function(key, value) {
			hcCommon.sysLog("Start HealthCheckSetupNotifications.doContinue.each:" + key + " & " + value);
			iimSet("VAR0", hcCommon.getCleanIMacroPath());
			iimSet("VAR1", lCSVFile);

			//set up all the variables - there are 7, tarting at 2 (1 is not yest used, will be in future version - system name)
			iimSet("VAR2", aClientData.UserName); //var 2 is asp username
			iimSet("VAR3", aClientData.aspEmail); //var 3 is asp E-MAIL
			iimSet("VAR4", aClientData.encryptedPassword); //var 4 is encrypted password

			//system specific vars are next
			iimSet("VAR5", value.address); // var 5 is URL
			iimSet("VAR9", value.name); // var 9 is system name - becomes var 1 in IIM scripts since var is taken by filename above

			lMax = lMax + 1; //so we know how many we ultimatly need

			//EXECUTE THAT SUCCER!
			iimPlay(getPathForIMacro() + "/Data/iMacro/BuildMasterCSV.iim");
			hcCommon.sysLog("End HealthCheckSetupNotifications.doContinue.each");
		})

		//start the first instance of iim script, passing in the required vars
		iimSet("VAR0", hcCommon.getCleanIMacroPath() + "\\" + lCSVFile); //data source
		iimSet("VAR1", 1); //datasource line (usually current index +1 )
		iimSet("VAR2", 'file://' + hcCommon.getRealPath() + 'gotoNext.html?next=' + 1 + "&max=" + lMax +
			"&nextScript=HealthCheckContinue&lastPage=" + lStartingAddress +
			"&CSVFile=" + lCSVFile + "&IIM=HealthCheckSetupNotificationsRunner");

		iimPlay(getPathForIMacro() + "/Data/iMacro/HealthCheckSetupNotificationsRunner.iim");

		// our story continues in another .js file...

		hcCommon.sysLog("End HealthCheckSetupNotifications.doContinue");
	}

	// get the cheked items
	var lItemsToCheck = hcCommon.getCheckedServers(lTabName);

	//save them
	hcCommon.saveCheckedServers(lItemsToCheck, lTabName);

	//load the JSON file and get going
	hcCommon.loadCheckedServerData(lItemsToCheck, doContinue)

	hcCommon.sysLog("End HealthCheckSetupNotifications.js anonymous function");
})();
hcCommon.sysLog("End HealthCheckSetupNotifications.js");