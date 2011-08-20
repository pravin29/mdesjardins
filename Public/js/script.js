/* Author: I Plan Websites .com  */
$(document).ready(function() {

/////////////// UTILS - not project specefic


$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 100); //throttle: time to wait after the resize is done...
});




///////////// init + misc view functions
function initView(){
	//fadeIn animation
	$('#seo').remove();
	$('#cache').addClass('invisible').delay(1200).queue(function(next){
		$('#cache').remove(); //we remove the DOM node once anim is over...
		next();
	});
	$(window).bind('resizeEnd adjustCssSizes', function() {
	    //do something, window hasn't changed size in 500ms
	    var window_h = $(window).height();
			var gal_h = window_h - (70 + 60);  //these are the footer + header height...
			
			$('section#home').css('height', gal_h);
			// ALSO adjust Width accordingly???
	});
	$(window).trigger('adjustCssSizes'); //we also trigger the view fix on init 
	
	sammy.run('/');
}


function scrollTop(){
	$('body').scrollTo({ top:0, left:0 }, 300);
}


/////////////// MODEL CODE...

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


/////////////// ROUTES (SAMMY)
sammy = Sammy('body', function () {
			this.use('Storage');
		//this.use('Cache');
		this.use(Sammy.Template, "html");
		this.use('Title');
		this.use(Sammy.JSON);
		//this.use(Sammy.Haml); //default uses .template file ext for templates

		//////// LOAD ROUTE (homepage)
		this.get('/', function (context) {
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
		
		context.bob = context.$element('#main');
		
		// LOAD PAGE - Initial Load for Basic View
		context.render('/templates/footer.html', {title: "hello!"})
		   .replace(context.$element('footer')).then(function(content) {
			});
			context.render('/templates/header.html', {title: "hello!"})
			   .replace(context.$element('header')).then(function(content) {
						$('header .bt').bind('click touch', function() {//Adding action to header buttons (mindless of route changes)
							scrollTop();
						});
				});
				
				/* It bugs because the JSON isn't loaded!!! */
				galleries = Gallery.all();
				context.render('/templates/home.html', {gal: galleries})
				   .replace(context.$element('section#home')).then(function(content) {
					});
					context.render('/templates/info.html', {title: "hello!"})
					   .replace(context.$element('section#info')).then(function(content) {
						});
	}); 

	///////////////
	this.get('/col', function (context) {
		//This Route shows the menu, but doesn't change the content!
		var col = this.params['col'];
		//alert("col = "+ col);
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
	}); 

	//////////////////
	this.get('/col/:col', function (context) {
		var col = this.params['col'];
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
		
		$('#home nav a.active').removeClass('active');//Interface FX (active bt)
		$('#home nav a.'+col).addClass('active');
		
		var gal = Gallery.select(function() { //selecting the galery model (json bit)
		  return this.attr("id") == col
		}).first();
		
		context.render('/templates/gal.html', {gal: gal}).replace(context.$element('#home .gallery')).then(function(content) {
					
					$(".gallery img").one('load', function() {//FADE IMG on load...
					  $(this).removeClass('loading');
					}).each(function() {
					  if(this.complete) $(this).load(); //fix caching event not firing
					});
					
					$(".gallery img").bind('click touch', function() {//bind scrolling behavior on img clicks
						$.scrollTo(this, 300, {axis: 'x'});
					});
			}); // eo render
	}); // eo route

	///////////////////////
	this.get('/infos', function (context) {
		//alert("infos");
		$('body').removeClass('col');
		$('body').addClass('info');
		scrollTop();
	}); // eo route
	
});//eo sammy routes


// WE LAOD DATA JSON, then call the init Route!

//if (Gallery.count() == 0){ //if it'S not in cache...
	$.getJSON('data/gallery.json', function(data) { //cached...
	  $.each(data, function(key, val) {
			var gal = new Gallery(val);
			gal.save();
	  }) //end of each...

		initView(); // starts sammy and fadeIn
	});//eo json init
//}//end if!

});//eo doc ready
















