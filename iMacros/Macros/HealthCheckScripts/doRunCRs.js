//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start doRunCRs.js")

function loadScriptFromURL(url) {
	tmpsysLog("Start doRunCRs.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End doRunCRs.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End doRunCRs.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start doRunCRs anonymous function")

	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]

	//load common scripts
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps(true); //we need csv loaded

	//chunt over to CR script
	window.alert("here");
	//hcCommon.loadJS('file://' + realPath + '/Data/iMacro/RunCRs.js');
	tmpsysLog("End doRunCRs anonymous function");
})();
tmpsysLog("End doRunCRs.js")