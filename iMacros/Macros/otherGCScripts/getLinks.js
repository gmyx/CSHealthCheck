//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start HealthCheckRunStub.js")

function loadScriptFromURL(url) {
	tmpsysLog("Start HealthCheckRunStub.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End HealthCheckRunStub.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End HealthCheckRunStub.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start HealthCheckRunStub anonymous function")
	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]

	//load common scripts
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps();

	//chunt over to main scripts
	hcCommon.loadJS('file://' + realPath + '/Data/iMacro/Others/getLinksRun.js')
	tmpsysLog("End HealthCheckRunStub anonymous function")
})();
tmpsysLog("End HealthCheckRunStub.js")