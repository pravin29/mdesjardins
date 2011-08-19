/* Author: I Plan Websites

*/



$(document).ready(function() {
	
	// MODEL CODE...

Gallery = Model("gallery", function() {
	  this.persistence(Model.localStorage);
		this.extend({
	    activate: function(name) {
				alert('this galery is active!');
	     // return this.detect(function() {
	     //   return  this.attr("na").toLowerCase() == name.toLowerCase()
	     // })
	    }
	  }) // eo extend
}); // eo model gallery

if (Gallery.count() == 0){ //if it'S not in cache...
	$.getJSON('data/gallery.json', function(data) { //cached...
	  $.each(data, function(key, val) {
			var gal = new City(val);
			gal.save();
	  }) //end of each...
	});//eo json init
}//end if!



	
	
sammy = Sammy('body', function () {
		this.use(Sammy.Haml, 'haml'); //default uses .template file ext for templates
		this.use('Storage');
		//this.use('Cache');
		this.use('Title');
		this.use(Sammy.JSON);



		// LOAD ROUTE (homepage)
	this.get('/', function (context) {
		alert('tend');
		context.render('/templates/header.haml', {item: item})
		   .replace(context.$element('#main'));
	}); //end "get #/"


	this.get('/col/:col', function (context) {
		var col = this.params['col'];
		alert("col = "+ col);
	}); //end "get #/"

	this.get('/infos', function (context) {
		alert("infos");
	}); //end "get #/"





});//eo sammy routes

sammy.run('/');


});//eo doc ready
















