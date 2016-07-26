Meteor.subscribe("theDestSearched");

Template.groupCampPost.helpers({
	setUp: function(){
		Session.set("notCompleteAlertNeeded", false);
	},

	trips:function(){
		return GroupCampTrips.find();
	},

	getUserName: function() {return Meteor.user().userName;},

	notCompleteAlertNeeded: function() {
		if (Session.get("notCompleteAlertNeeded"))
			return true;
		else
			return false;
	}
})

Template.groupCampPost.events({
	"click .js-submit": function(event){
		event.preventDefault();

		author = Meteor.user().userName;
		timestamp = new Date();

		title = $(".js-title").val();
		message = $(".js-message").val();
		description = $(".js-description").val();
		rawTags = $(".js-tags").val();
		tags = [];

		destination = $(".js-destination").val();
		From = $(".js-from").val();
		to = $(".js-to").val();
		deadline = $(".js-deadline").val();

		travelers = [];
		threshold = $(".js-threshold").val();

		cost = $(".js-cost").val();
		link = $(".js-link").val();
		picture = $(".js-picture").val();


		complete = true;


		// TITLE
		if (!title){	// Required
			complete = false;
			$(".js-titleGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-titleGroup").removeClass('has-error').addClass('has-success');
		}

		// MESSAGE
		if (!message){
			$(".js-messageGroup").removeClass('has-success').addClass('has-warning');
		}
		else {
			$(".js-titleGroup").removeClass('has-warning').addClass('has-success');
		}

		// DESCRIPTION
		if (!description){
			$(".js-descriptionGroup").removeClass('has-success').addClass('has-warning');
		}
		else {
			$(".js-descriptionGroup").removeClass('has-warning').addClass('has-success');
		}

		// TAGS
		if (!rawTags){
			$(".js-tagsGroup").removeClass('has-success').addClass('has-warning');
		}
		else {
			tags = $(".js-tags").val().split(",");
			for (i = 0; i < tags.length; i++) 	{tags[i] = tags[i].trim();}
			tags = tags.sort();
			$(".js-tagsGroup").removeClass('has-warning').addClass('has-success');
		}

		// DESTINATION
		if (!destination){	// Required
			complete = false;
			$(".js-destinationGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-destinationGroup").removeClass('has-error').addClass('has-success');
		}

		// FROM
		if (!From || isNaN(Date.parse(From)) || new Date(From) < new Date()){	// Required
			complete = false;
			$(".js-fromGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-fromGroup").removeClass('has-error').addClass('has-success');
		}

		// TO
		if (!to || isNaN(Date.parse(to)) || new Date(to) < new Date(From) || new Date(to) < new Date()){	// Required
			complete = false;
			$(".js-toGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-toGroup").removeClass('has-error').addClass('has-success');
		}

		//DEADLINE
		if (!deadline || isNaN(Date.parse(deadline)) || new Date(deadline) > new Date(From) || new Date(deadline) < new Date()){	// Required
			complete = false;
			$(".js-deadlineGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-deadlineGroup").removeClass('has-error').addClass('has-success');
		}

		// THRESHOLD
		if (!threshold || threshold < 1 || Math.floor(threshold) != threshold){	// Required
			complete = false;
			$(".js-thresholdGroup").removeClass('has-success').addClass('has-error');
		}
		else {
			$(".js-thresholdGroup").removeClass('has-error').addClass('has-success');
		}

		// COST
		if (!cost || !$.isNumeric(cost) || cost < 0 || (Math.floor(cost) != cost && cost.length != cost.indexOf('.') + 3)){
			$(".js-costGroup").removeClass('has-success').addClass('has-warning');
			cost = null;
		}
		else {
			$(".js-costGroup").removeClass('has-warning').addClass('has-success');
		}

		// LINK
		if (!link){
			$(".js-linkGroup").removeClass('has-success').addClass('has-warning');
		}
		else {
			$(".js-linkGroup").removeClass('has-warning').addClass('has-success');
		}

		// PICTURE
		if (!picture){
			$(".js-pictureGroup").removeClass('has-success').addClass('has-warning');
		}
		else {
			$(".js-pictureGroup").removeClass('has-warning').addClass('has-success');
		}



		if (complete){
			GroupCampTrips.insert({author, timestamp, title, message, description, tags: tags, destination, from: From, to, deadline, travelers, threshold, cost, link, picture, chat: []});
			Router.go("groupCampSearch");
		}
		else{
			Session.set("notCompleteAlertNeeded", true);
		}
	}
})
