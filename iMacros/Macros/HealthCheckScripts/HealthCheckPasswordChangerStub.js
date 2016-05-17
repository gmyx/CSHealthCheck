//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start HealthCheckPasswordChangerStub.js")

function loadScriptFromURL(url) {
	tmpsysLog("Start HealthCheckPasswordChangerStub.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End HealthCheckPasswordChangerStub.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End HealthCheckPasswordChangerStub.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start HealthCheckPasswordChangerStub anonymous function")
	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]


	//load common scripts
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps(true); //also loads the encryption JS

	//shunt over to main scripts
	hcCommon.loadJS('file://' + realPath + '/Data/iMacro/HealthCheckPasswordChanger.js');
	tmpsysLog("End HealthCheckPasswordChangerStub anonymous function")
})();
tmpsysLog("End HealthCheckPasswordChangerStub.js")