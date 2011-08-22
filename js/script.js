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
			if(gal_h >=800){gal_h=800}//set max height
			$('section#home').css('height', gal_h);
			// ALSO adjust Width accordingly???
	});
	$(window).trigger('adjustCssSizes'); //we also trigger the view fix on init 
	sammy.run('/');
}


function renderTemplate(context, elem, path, templateData, callback){
	if($(elem).hasClass('inDom')){
		if($.isFunction(callback)){
			callback(context); //if temlate already loaded, we just call the callBakc right away.
		}
	}else{
	  context.render(path, templateData)
	   .replace(context.$element(elem)).then(function(content) {
				if($.isFunction(callback)){
					callback(context);
				}
	  });
	}
}


function initTemplates(context, callbackHome){
	
	renderTemplate(context, 'footer', '/templates/footer.html', {title: "hello!"});
	renderTemplate(context, 'header', '/templates/header.html', {title: "hello!"}, function(context){
		$('header .bt').bind('click touch', function() {//Adding action to header buttons (mindless of route changes)
			scrollTop();
		});
	});
	renderTemplate(context, 'section#info', '/templates/info.html', {title: "hello!"});	
	renderTemplate(context, 'section#home', '/templates/home.html', {gal: Gallery.all()}, function(context){
		callbackHome(context);
	});
}

function scrollTop(){
	$('html').scrollTo({ top:0, left:0 }, 300);
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




		/////////////// LOAD ROUTE (homepage)
		this.get('/', function (context) {
		$('body').removeClass('info');
		$('body').addClass('col');
		scrollTop();
		initTemplates(context, function(context){
			// alert('call back!!');
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
		initTemplates(context, function(context){
			//alert('call back!!');
		});
	}); 



	//////////////////
	this.get('/col/:col', function (context) {
	//	alert('col route!!');
		var col = this.params['col'];
		$('body').removeClass('info');
		$('body').addClass('col');
		//scrollTop();
		$('html').scrollTo({ top:0, left:200 }, 300); //!! TWEAK value!
		var gal = Gallery.select(function() { //selecting the galery model (json bit)
		  return this.attr("id") == col
		}).first();
		initTemplates(context, function(context){
			renderTemplate(context, '#home .gallery', '/templates/gal.html', {gal: gal}, function(context){
					$('#home nav a.active').removeClass('active');//Interface FX (active bt)
					$('#home nav a.'+col).addClass('active');
					$(".gallery img").one('load', function() {//FADE IMG on load...
					  $(this).removeClass('loading');
					}).each(function() {
					  if(this.complete) $(this).load(); //fix caching event not firing
					});
					$(".gallery img").bind('click touch', function() {//bind scrolling behavior on img clicks
						$.scrollTo(this, 300, {axis: 'x'});
					});
			}); // eo render
		}); //eo call back for initTemplate	
	}); // eo route

	///////////////////////
	this.get('/infos', function (context) {
		//alert("infos");
		$('body').removeClass('col');
		$('body').addClass('info');
		scrollTop();
		initTemplates(context, function(context){
			alert('call back!!');
		});
	}); // eo route
	
});//eo sammy routes


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
















