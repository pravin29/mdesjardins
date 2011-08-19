/* Author: I Plan Websites

*/



$(document).ready(function() {
	
	// MODEL CODE...

	//fadeIn animation
	$('#seo').remove();

	$('#cache').addClass('invisible').delay(1200).queue(function(next){
		$('#cache').remove(); //we remove the DOM node once anim is over...
		next();
	});






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


//if (Gallery.count() == 0){ //if it'S not in cache...
//alert('loading json');
	$.getJSON('data/gallery.json', function(data) { //cached...
	  $.each(data, function(key, val) {
		//	alert('each' +val );
			gal = new Gallery(val);
			gal.save();
	  }) //end of each...
		//alert('loaded json = ' + Gallery.count());
	});//eo json init
//}//end if!



	
	
sammy = Sammy('body', function () {
			this.use('Storage');
		//this.use('Cache');
		this.use(Sammy.Template, "html");
		this.use('Title');
		this.use(Sammy.JSON);
		this.use(Sammy.Haml); //default uses .template file ext for templates



		// LOAD ROUTE (homepage)
	this.get('/', function (context) {
		
		
		context.bob = context.$element('#main');
		
		// LOAD PAGE - Initial Load for Basic View
		context.render('templates/footer.html', {title: "hello!"})
		   .appendTo(context.$element('footer')).then(function(content) {
					//alert('loaded footer');
			});
			context.render('templates/header.html', {title: "hello!"})
			   .replace(context.$element('header')).then(function(content) {
						//alert('loaded footer');
				});
				
				context.render('templates/home.html', {title: "hello!"})
				   .replace(context.$element('section#home')).then(function(content) {
							//alert('loaded footer');
					});
					
	}); 


	this.get('/col', function (context) {
		//This Route shows the menu, but doesn't change the content!
		var col = this.params['col'];
		alert("col = "+ col);
		$('body').removeClass('infos');
		$('body').addClass('col');
	}); 


	this.get('/col/:col', function (context) {
		var col = this.params['col'];
		alert("col = "+ col);
		$('body').removeClass('infos');
		$('body').addClass('col');
	}); 

	this.get('/infos', function (context) {
		alert("infos");
		$('body').removeClass('col');
		$('body').addClass('infos');
	}); 





});//eo sammy routes

sammy.run('/');


});//eo doc ready
















