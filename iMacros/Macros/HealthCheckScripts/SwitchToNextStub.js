//imacros-js:showsteps no
var gDebug = true;//must be either true or false.
function tmpsysLog(aMSG) {
	if (gDebug !== undefined) {
		if (gDebug === true) {
			window.console.log(aMSG);
		}
	}
}
tmpsysLog("Start SwitchToNextStub.js")

// from http://jquery-howto.blogspot.ca/2009/09/get-url-parameters-values-with-jquery.html
function getUrlVars()
{
	tmpsysLog("Start getUrlVars")
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	tmpsysLog("End getUrlVars")
	return vars;
}

function loadScriptFromURL(url) {
	tmpsysLog("Start SwitchToNextStub.loadScriptFromURL: " + url)
	var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
	request.open('GET', url, async);
	request.send();
	if (request.status !== 200) {
		var message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
		iimDisplay(message);
		tmpsysLog("End SwitchToNextStub.loadScriptFromURL")
		return false;
	}
	eval(request.response);
	tmpsysLog("End SwitchToNextStub.loadScriptFromURL")
	return true;
};

//do just enough to load new scripts
(function() {
	tmpsysLog("Start SwitchToNextStub anonymous function")
	//get our system path
	var lPath = window.document.location.pathname
	var lPattern = /\/.*\//g
	var realPath = lPattern.exec(lPath)[0]
	var gSettings;

	//load common scripts
	window.console.log('file://' + realPath + '/Data/iMacro/hcCommon.js')
	loadScriptFromURL('file://' + realPath + '/Data/iMacro/hcCommon.js');
	hcCommon.loadDeps();

	//determine which script to foward to
	var lVars = getUrlVars()
	window.console.log(lVars)
	tmpsysLog("End SwitchToNextStub anonymous function")

	//load that file
	hcCommon.loadJS('file://' + realPath + '/Data/iMacro/' + lVars.nextScript + '.js');

	//send execution that that file.
	nextScript.nextScriptExecute(lVars.next, lVars.max, lVars.nextScript, lVars.lastPage, lVars.CSVFile, lVars.IIM) // that script needs to know what to do
})();