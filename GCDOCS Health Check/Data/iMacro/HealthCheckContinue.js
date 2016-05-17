nextScript = {
	nextScriptExecute: function(lCurrent, lMax, lNextScript, lLastScript, lCSVFile, lIIM) {
		hcCommon.sysLog("Start HealthCheckPasswordChangerContinue.nextScriptExecute: " + lCurrent + ' & ' +
			lMax + " & " + lNextScript + " & " + lLastScript + " & " + lCSVFile);

		var lNextId = hcCommon.getNumber(lCurrent) + 1;

		if (lNextId <= hcCommon.getNumber(lMax)) {
			//start the first instance of iim script, passing in the required vars
			iimSet("VAR0", hcCommon.getCleanIMacroPath() + "\\" + lCSVFile); //data source
			iimSet("VAR1", lNextId); //datasource line (usually current index +1 )
			iimSet("VAR2", 'file://' + hcCommon.getRealPath() + 'gotoNext.html?next=' + lNextId + "&max=" + lMax + "&nextScript=" +
				lNextScript + "&lastPage=" + lLastScript + "&CSVFile=" + lCSVFile + "&IIM=" + lIIM);

			window.console.log(getPathForIMacro() + "/Data/iMacro/" + lIIM + ".iim")
			iimPlay(getPathForIMacro() + "/Data/iMacro/" + lIIM + ".iim");
		} else {
			//send back to first url
			hcCommon.clearMasterCSV(lCSVFile);
			window.location.href = lLastScript;
		}

		hcCommon.sysLog("End HealthCheckPasswordChangerContinue.nextScriptExecute");
	}
}