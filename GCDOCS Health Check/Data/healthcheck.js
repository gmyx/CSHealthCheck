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
			console.log(lData);

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
		success: function (csvd) {
			gSettings = $.csv.toArrays(csvd);
		},
		dataType: "text",
		complete: function () {
			// call a function on complete
			$("#aspUserName").val(gSettings[0][0])
			$("#encryptedPassword").val(gSettings[0][1])
			$("#aspEmail").val(gSettings[0][2])
		}
	});
});

