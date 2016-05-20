//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start LoadCRStub.js")

function loadScriptFromURL(url) {
	tmpsysLog("Start LoadCRStub.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End LoadCRStub.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End LoadCRStub.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start LoadCRStub anonymous function")

	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]

	//load common scripts
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps(true); //true == we need CSV

	//shunt over to the CR IIM
	window.alert("{{!VAR1}}");
	window.alert(window.location.href)
	//iimSet("VAR8", $("#hiddenEncPass").val()); // encrypted admin index password
	//iimPlay(getPathForIMacro() + "/Data/iMacro/BuildMasterCSV.iim");

	tmpsysLog("End LoadCRStub anonymous function");
})();
tmpsysLog("End LoadCRStub.js")