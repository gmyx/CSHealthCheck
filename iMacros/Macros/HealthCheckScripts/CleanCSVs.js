//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start CleanCSVs.js")

function loadScriptFromURL(url) {
	tmpsysLog("Start CleanCSVs.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End CleanCSVs.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End CleanCSVs.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start CleanCSVs anonymous function")

	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]

	//load common scripts
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps();

	// do all 4 known CSVs
	hcCommon.clearMasterCSV("passwordChange.csv");
	hcCommon.clearMasterCSV("mainRun.csv");
	hcCommon.clearMasterCSV("notificaitonSetUp.csv");
	hcCommon.clearMasterCSV("CRsRun.csv");
	tmpsysLog("End CleanCSVs anonymous function");
})();
tmpsysLog("End CleanCSVs.js")