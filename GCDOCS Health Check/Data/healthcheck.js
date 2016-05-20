function trimString(s) {
	return s.replace(/^\s+/, "").replace(/\s+$/, "");
}

$(document).on("wb-ready.wb", function() {
	// callback(ish) function from iMacro
	$("#hiddenCauseCloseBox").click(function () {
		$("#hiddenCauseCloseBox").removeClass("show").addClass("hidden");
		$.magnificPopup.close();
	})

	//special magic happens here, this will turn control over to JS running inside of iMacro, which can save files
	$("#runHealthCheck").click(function () {
		//these scripts need to be in the iMacro folder, but any called scripts from there run from anywhere
		window.location.replace('imacros://run/?m=HealthCheckScripts/HealthCheckRunStub.js');
	})

	$("#runNotificionsSetUp").click(function () {
		//these scripts need to be in the iMacro folder, but any called scripts from there run from anywhere
		window.location.replace('imacros://run/?m=HealthCheckScripts/HealthCheckSetUpNotificationsStub.js');
	})

	$("#changePassword").submit(function (event) {
		$("#changePassword").validate();
		if ($("#changePassword").valid() === true) {
			setTimeout(function() { //need setTimeout to prevent submit, but still run.
				//these scripts need to be in the iMacro folder, but any called scripts from there run from anywhere
				window.location.replace('imacros://run/?m=HealthCheckScripts/HealthCheckPasswordChangerStub.js');
			}, 100);

			return false; // we do not want to post
		}

		return false;
	})

	//cancel buttons from popups
	$("#cancelGeneratePassword,#cancelCRGeneratePassword").click(function() {
		$.magnificPopup.close();
	});

	// others tab
	$("#getAdminLinks").click(function () {
		//these scripts need to be in the iMacro folder, but any called scripts from there run from anywhere
		window.location.replace('imacros://run/?m=HealthCheckScripts/GetAllItemsStub.js');
	})

	// apply crs functions
	function docontinueApplyCRs() {
		window.location.replace('imacros://run/?m=HealthCheckScripts/RunCRStub.js');
	}

	$("#applyCRs").click(function () {
		//see if this cr requires the admin password
		if ($("#AvailableCRs").find(':selected').attr('data-require-admin') === "true") {
			wb.doc.trigger( "open.wb-lbx", [[{
				src: "#centred-popup-modal-index-password",
				type: "inline"}
			], true]);

		} else {
			//these scripts need to be in the iMacro folder, but any called scripts from there run from anywhere
			docontinueApplyCRs();
		}
	})

	$("#doCRGeneratePassword").click(function () {
		$("#generateAdminIndexForm").validate();
		if ($("#generateAdminIndexForm").valid() === true) {
			// assing to a window var so that iMacro JS can access
			$("#hiddenEncPass").val(
				Rijndael.encryptString(
					trimString($("#adminindexPassword").val()),
					trimString($("#crMasterPassword").val())
				));

			$.magnificPopup.close();

			docontinueApplyCRs();
		}
	});

	//save function requires iMacro to do the save - JS can't
	$("#settings").submit(function() {
		$("#settings").validate();
		if ($("#settings").valid() === true) {
			setTimeout(function() { //need setTimeout to prevent submit, but still run.
				window.location.replace('imacros://run/?m=HealthCheckScripts/HealthCheckSaveSettingsStub.js');
			}, 100);

			return false; // we do not want to post
		}

		return false;
	});

	//modifyed from the iMacro password generation site
	$("#doGeneratePassword").click(function () {
		$("#generatePasswordForm").validate();
		if ($("#generatePasswordForm").valid() === true) {
			$("#encryptedPassword").val(
				Rijndael.encryptString(
					trimString($("#gcdocsPassword").val()),
					trimString($("#masterPassword").val())
				)
			);
			$.magnificPopup.close();
		}
	});

	// select the rows according to the option box
	$("#selectAll").click(function () {
		var lOption = $("#selectScope").val()

		$("#mainListOfServers tbody tr").each(function () {
			if (lOption === "0") {
				$(this).find("input").prop({"checked": true})
			} else if ($(this).find("td:eq(3)").text() === lOption) {
				$(this).find("input").prop({"checked": true})
			} else {
				$(this).find("input").prop({"checked": false})
			}
		});
	});

	// select the rows according to the option box, for tab 2
	$("#selectAllTab2").click(function () {
		var lOption = $("#selectScopeTab2").val()

		$("#passwordChangeListOfServers tbody tr").each(function () {
			if (lOption === "0") {
				$(this).find("input").prop({"checked": true})
			} else if ($(this).find("td:eq(3)").text() === lOption) {
				$(this).find("input").prop({"checked": true})
			} else {
				$(this).find("input").prop({"checked": false})
			}
		});
	});

	//load the to check file, and check the correct boxes
	$.ajax({
		url: "./Data/serversToCheck_mainListOfServers.csv",
		async: true,
		dataType: "text",
		success: function (data) {
			//data is less than optimal, but easy to clean up.
			var lData = /"(.*)"/g.exec(data)[1];
			var lItems = lData.split(",");

			$.each(lItems, function (key, value) {
				//find value in the tables and check it's box
				$("#mainListOfServers tbody tr td:contains('" + value + "')")
					.parent().find("td input").prop("checked", true)
			});
		}
	});

	// same for password, just a different file
	$.ajax({
		url: "./Data/serversToCheck_passwordChangeListOfServers.csv",
		async: true,
		dataType: "text",
		success: function (data) {
			//data is less than optimal, but easy to clean up.
			var lData = /"(.*)"/g.exec(data)[1];
			var lItems = lData.split(",");

			$.each(lItems, function (key, value) {
				//find value in the tables and check it's box
				$("#passwordChangeListOfServers tbody tr td:contains('" + value + "')")
					.parent().find("td input").prop("checked", true)
			});
		}
	});

	//load the settings.csv file
	$.ajax({
		url: "./Data/settings.csv",
		async: true,
		dataType: "text",
		success: function (csvd) {
			gSettings = $.csv.toArrays(csvd);
		},
		complete: function() {
			if (typeof gSettings !== 'undefined') {
				// call a function on complete
				$("#aspUserName").val(gSettings[0][0]);
				$("#encryptedPassword").val(gSettings[0][1]);
				$("#aspEmail").val(gSettings[0][2]);
			}
		},
		error: function (jqXHR, textStatus,  errorThrown) {
			// it failled to load, so go to this page
			console.log(jqXHR);
			console.log( " from " + textStatus + " : " + errorThrown);
			alert("You must fill out the settings tab before continuing.")
			$(".wb-tabs").trigger({ type: "wb-shift.wb-tabs", shiftto: 2 });
		}
	});
});

