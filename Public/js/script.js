/* Author: I Plan Websites

*/



$(document).ready(function() {
	
	
	
	
	
	// MODEL CODE...

function initView(){
	//fadeIn animation
	$('#seo').remove();
	$('#cache').addClass('invisible').delay(1200).queue(function(next){
		$('#cache').remove(); //we remove the DOM node once anim is over...
		next();
	});
	
	sammy.run('/');
	
}






function scrollTop(){
	$('body').scrollTo({ top:0, left:0 }, 300);
}



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




	
	
sammy = Sammy('body', function () {
			this.use('Storage');
		//this.use('Cache');
		this.use(Sammy.Template, "html");
		this.use('Title');
		this.use(Sammy.JSON);
		this.use(Sammy.Haml); //default uses .template file ext for templates



		// LOAD ROUTE (homepage)
	this.get('/', function (context) {
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
		
		context.bob = context.$element('#main');
		
		// LOAD PAGE - Initial Load for Basic View
		context.render('/templates/footer.html', {title: "hello!"})
		   .replace(context.$element('footer')).then(function(content) {
					//alert('loaded footer');
			});
			context.render('/templates/header.html', {title: "hello!"})
			   .replace(context.$element('header')).then(function(content) {
						//alert('loaded footer');
				});
				
				/* It bugs because the JSON isn't loaded!!! */
				galleries = Gallery.all();
			//	alert("galleries = "+Gallery.count());
				context.render('/templates/home.html', {gal: galleries})
				   .replace(context.$element('section#home')).then(function(content) {
							//alert('loaded footer');
					});
					context.render('/templates/info.html', {title: "hello!"})
					   .replace(context.$element('section#info')).then(function(content) {
								//alert('loaded footer');
						});
	}); 


	this.get('/col', function (context) {
		//This Route shows the menu, but doesn't change the content!
		var col = this.params['col'];
		//alert("col = "+ col);
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
	}); 


	this.get('/col/:col', function (context) {
		var col = this.params['col'];
		//alert("col = "+ col);
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
		
	//	alert('GAL C ='+Gallery.count());
		var gal = Gallery.select(function() {
		  return this.attr("id") == col
		}).first();
		//alert(gal + "= gal");
		context.render('/templates/gal.html', {gal: gal}).replace(context.$element('#home .gallery')).then(function(content) {
				//FADE IMG on load...
					$(".gallery img").one('load', function() {
					  $(this).removeClass('loading');
					}).each(function() {
					  if(this.complete) $(this).load(); //fix caching event not firing
					});
			//FADE IMG on load...
					$(".gallery img").bind('click', function() {
						$.scrollTo(this, 300, {axis: 'x'});
					});


			});
		
		
	}); 

	this.get('/infos', function (context) {
		//alert("infos");
		$('body').removeClass('col');
		$('body').addClass('info');
		scrollTop();
	}); 





});//eo sammy routes


// WE LAOD DATA JSON, then call the init Route!

//if (Gallery.count() == 0){ //if it'S not in cache...
//alert('loading json');
	$.getJSON('data/gallery.json', function(data) { //cached...
	  $.each(data, function(key, val) {
		//	alert('each' +val );
			var gal = new Gallery(val);
			gal.save();
			//alert("galleries count = "+ Gallery.count());
	  }) //end of each...
		//alert('loaded json = ' + Gallery.count());
		
		// !!! Dispatch an Event that JSON is loaded!
		initView(); // starts sammy and fadeIn
	});//eo json init
//}//end if!


//sammy.run('/');


});//eo doc ready
















