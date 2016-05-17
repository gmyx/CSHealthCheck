(function() {
	function doContinue(aServer, aClientData) {
		window.console.log("now here");
		$.each(aServer, function(key, value) {

		})

		//try to hide the modal box
		hcCommon.closeModals();
	}

	//get the settings data and save

	//setup
	// var0 is path
	// var1 is file name
	// var2 is username
	// var3 is encrypted password
	// var4 is email
	iimSet("VAR0", hcCommon.getCleanIMacroPath());
	iimSet("VAR1", "settings.csv");
	iimSet("VAR2", $("#aspUserName").val());
	iimSet("VAR3", $("#encryptedPassword").val());
	iimSet("VAR4", $("#aspEmail").val());

	//execute
	iimPlay(getPathForIMacro() + "/Data/iMacro/SaveSettings.iim");
})();