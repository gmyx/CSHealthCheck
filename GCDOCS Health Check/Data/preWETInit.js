/* all of these need to happenbefore WET is initialized */
(function() {
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType)
			{
				xhr.overrideMimeType("application/json");
			}
		}
	});

	// populate the CRs list
	$.getJSON("./Data/CRs.json", function (data) {
		/*var lCRs = [];

		$.each(data.CRs, function (key, val) {
			if (lCRs.indexOf(val.id) === -1) {
				// add it
				lCRs.push(val.id);
			}
		})

		//resort the groups into a natural order
		lCRs = lCRs.sort(naturalCompare);*/

		//build a bunch of options
		//populate the select all boxes based on the server file

		$("#AvailableCRs").empty().each(function (lMasterKey, lMasterValue) {
			$.each(data.CRs, function(lSubKey, lSubValue) {
				$(lMasterValue).append($("<option></option>")
					.attr("value", lSubValue.id)
					.attr("data-require-admin", lSubValue.needAdminIndexPWD)
					.text(lSubValue.id));
			})
		});
	})

	// populate the servers list
	$.getJSON( "./Data/servers.json", function( data ) {
		var lGroups = [];

		$.each(data.servers, function (key, val) {
			if (lGroups.indexOf(val.portfolio) === -1) {
				// add it
				lGroups.push(val.portfolio);
			}
		})

		//resort the groups into a natural order
		lGroups = lGroups.sort(naturalCompare);

		//build a bunch of options
		//populate the select all boxes based on the server file
		$("#selectScope,#selectScopeTab2,#selectScopeOthers").each(function (lMasterKey, lMasterValue) {
			$.each(lGroups, function(lSubKey, lSubValue) {
				$(lMasterValue).append($("<option></option>")
					.attr("value", lSubValue).text(lSubValue));
			})
		});
	});

	window[ "wb-tables" ] = {
		rowCallback: function( row, data, index ) {
			var lId = $(this).parent().attr("id") //this will yield our table id with an extra _wrapper
			var lPrefix;
			if (lId === "mainListOfServers_wrapper") {
				lPrefix = "tab1"
			} else if (lId === "passwordChangeListOfServers_wrapper") {
				lPrefix = "tab2"
			} else if (lId === "otherListOfServers_wrapper") {
				lPrefix = "tab4" // may become tab 4?
			}
			$('td:eq(0)', row).html( '<input id="' + lPrefix + 'row' + index + '" type="checkbox" />' );
			$('td:eq(1)', row).html( '<label for="' + lPrefix + 'row' + index + '">' + data.name + '</label>' );
			$('td:eq(2)', row).html( '<a href="' + data.address + '">' + data.address + '</a>' );
		}
	};

	// from: http://stackoverflow.com/questions/15478954/sort-array-elements-string-with-numbers-natural-sort
	function naturalCompare(a, b) {
		var ax = [], bx = [];

		a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
		b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });

		while(ax.length && bx.length) {
			var an = ax.shift();
			var bn = bx.shift();
			var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
			if(nn) return nn;
		}

		return ax.length - bx.length;
	}
})();