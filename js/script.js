$( document ).ready(function() {


	var profileContainer = document.querySelector("#profile-container");
	var modal = document.querySelector("#modal");
	var modalContent = document.querySelector("#modalContent");

	var profilesPerPage = 12;

	var url = "https://randomuser.me/api/?results=" + profilesPerPage + "&nat=us" ;

	var infoArray = [];

	var currentId = 0;


	// Capitalize first letter of a string

	function capFirst(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Store data from the API request inside infoArray

	function storeInfo(response) {

		infoArray.push({
			firstName:response.name.first,
			lastName: response.name.last,
			username: response.login.username,
			photo:    response.picture.large,
			email:    response.email,
			phone:    response.phone,
			street:   response.location.street,
			city:     response.location.city,
			state:    response.location.state,
			country:  response.nat,
			postcode: response.location.postcode,
			dob:      response.dob
		});
	}

	// Create profile box for each employee and append to profileContainer

	function createProfileBox(i) {

		var profileBox = "";
		
		profileBox += "<div class='profilebox' id='" + i + "'>";
		profileBox += "<img src=" + infoArray[i].photo + ">";
		profileBox += "<div class='infobox'>";
		profileBox += "<h2>" + capFirst(infoArray[i].firstName) + " ";
		profileBox += capFirst(infoArray[i].lastName) + "</h2>";
		profileBox += "<p>" + infoArray[i].email + "</p>";
		profileBox += "<p>" + capFirst(infoArray[i].city) + "</p>";
	    profileBox += "</div>";
		profileBox += "</div>";

		$(profileContainer).append(profileBox);

	} // End createProfileBox function


	// XHR request fucntion

	(function () {

			var XHR = new XMLHttpRequest();
			var response = {};
	  
			XHR.onreadystatechange = function() {
			    if(XHR.readyState == 4 && XHR.status == 200) {

			    	for(var i = 0; i < profilesPerPage; i++) {

			    		response = JSON.parse(XHR.responseText).results[i];

			    		storeInfo(response);

			    		createProfileBox(i);
			    	}	
			    }
			};
			  
			XHR.open("GET", url);
			XHR.send();
			
	})(); // end request XHR function


	// Create the Modal Box

	function modalBoxFunction(info, id) {

		var modalBox = "";

		currentId = id;

		modalBox += "<p id='close'>&times;</p>";
	    modalBox += "<div class='modalBox'><img src=" + info.photo + ">";
	    modalBox += "<div class='outerName'><i id='leftBtn' class='fa fa-chevron-circle-left' aria-hidden='true'></i>";
	    modalBox += "<span class='innerName'>" + capFirst(info.firstName) + " ";
	    modalBox += capFirst(info.lastName) + "</span>";
	    modalBox += "<i id='rightBtn' class='fa fa-chevron-circle-right' aria-hidden='true'></i></h2></div>";
	    modalBox += "<p>" + info.username + "<p>";
	    modalBox += "<p>" + info.email + "<p><hr>";
	    modalBox += "<p>" + info.phone + "<p>";
	    modalBox += "<p>" + info.street.replace(/\b\w/g, function(l){ return l.toUpperCase() }) + " "; //Regex to capitalize first letter of every word
	    modalBox += info.city.replace(/\b\w/g, function(l){ return l.toUpperCase() }) + ", ";
	    modalBox += info.state.replace(/\b\w/g, function(l){ return l.toUpperCase() }) + " ";
	    modalBox += info.country + " " + info.postcode + "<p>";
	    modalBox += "<p> Birthday: " + info.dob.substring(0,10) + "<p>";
	    modalBox += "</div>";

	    $(modalContent).empty();

	    $(modalContent).append(modalBox);

	} // End modalBoxFunction

	// Display modal window

	$('#profile-container').on('click', '.profilebox', function(){

	    modal.style.display = 'flex';

	    var info = infoArray[this.id];
	    var id = this.id;

	    modalBoxFunction(info, id);

	    var close = document.getElementById("close");

	    // Close modal window

	    $(close).on("click", function() {
			modal.style.display = 'none';
			$(modalContent).empty();
	    });

	}); // End display modal window

	// Left button event listener

	$('#modalContent').on("click", '#leftBtn', function() {

		// Check to make sure a profile object exists
		if(currentId >= 1) {

			var info = infoArray[currentId - 1];

			var prevId = currentId - 1;

			modalBoxFunction(info, prevId);

			// Close modal window

			var close = document.getElementById("close");

		    $(close).on("click", function() {
				modal.style.display = 'none';
				$(modalContent).empty();
		    });
		} 

	}); // End left button event listener

	// Right button event listener

	$('#modalContent').on("click", '#rightBtn', function() {

		// Check to make sure a profile object exists
		if(currentId < (profilesPerPage - 1)) {

			var info = infoArray[(currentId - -1)]; // Add 1 to currentId

			var nextId = currentId - -1; // Add 1 to currentId

			modalBoxFunction(info, nextId);

			// Close modal window

			var close = document.getElementById("close");

		    $(close).on("click", function() {
				modal.style.display = 'none';
				$(modalContent).empty();
		    });
		} 

	}); // End right button event listener

	// Search

	$('#searchInput').on('keyup', function(){

		// Hide all profile boxes
		$('.profilebox').hide();

		// Declare variables to be used inside the for loop
		var searchTerm;

		// Obtain the value of the search input
		var filter = this.value.toLowerCase();

		// Loop over the employee list, and for each employee...

		for (i = 0; i < profilesPerPage; i++) {
			searchTerm = infoArray[i].firstName + " " + infoArray[i].lastName + " " + infoArray[i].username;

			if (searchTerm.indexOf(filter) > -1) {
				var profileBox = "";

				profileBox += "<div class='profilebox' id='" + i + "'>";
	    		profileBox += "<img src=" + infoArray[i].photo + ">";
	    		profileBox += "<div class='infobox'>";
		    	profileBox += "<h2>" + capFirst(infoArray[i].firstName) + " ";
		    	profileBox += capFirst(infoArray[i].lastName) + "</h2>";
		    	profileBox += "<p>" + infoArray[i].email + "</p>";
		    	profileBox += "<p>" + capFirst(infoArray[i].city) + "</p>";
	    	    profileBox += "</div>";
	    		profileBox += "</div>";

			    $(profileContainer).append(profileBox);
			}
		}
	}); // End Search

}); // End document.ready function




