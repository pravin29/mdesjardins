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


function renderTemplate(context, elem, path, templateData, cache, callback){
	if( $(elem).hasClass('inDom') && cache){
		if($.isFunction(callback)){
			callback(context); //if temlate already loaded, we just call the callBakc right away.
		}
	}else{
	  context.render(path, templateData)
	   .replace(context.$element(elem)).then(function(content) {
				$(elem).addClass('inDom');
				if($.isFunction(callback)){
					callback(context);
				}
	  });
	}
}


function initTemplates(context, callbackHome){
	
	renderTemplate(context, 'footer', '/templates/footer.html', {title: "hello!"}, true);
	renderTemplate(context, 'header', '/templates/header.html', {title: "hello!"}, true, function(context){
		$('header .bt').bind('click touch', function() {//Adding action to header buttons (mindless of route changes)
			scrollTop();
		});
	});
	renderTemplate(context, 'section#info', '/templates/info.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#bio', '/templates/bio.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#credit', '/templates/credit.html', {title: "hello!"}, true);	
	renderTemplate(context, 'section#home', '/templates/home.html', {gal: Gallery.all()}, true, function(context){
		callbackHome(context);
	});
}

function scrollTop(){
	$('html').scrollTo({ top:0, left:0 }, 100);
}

function formatYear(yyyy){
	return yyyy.toString().slice(2);
}

function bodyClass(context, section){
	$('body').removeClass('info bio col credit');
	$('body').addClass(section);
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
		bodyClass(context, 'col');
		scrollTop();
		initTemplates(context, function(context){
			// alert('call back!!');
		});
		

	}); 


	///////////////
	this.get('/collections', function (context) {
		//This Route shows the menu, but doesn't change the content!
		var col = this.params['col'];
		//alert("col = "+ col);
bodyClass(context, 'col');
		scrollTop();
		initTemplates(context, function(context){
			//alert('call back!!');
		});
	}); 



	//////////////////
	this.get('/photos/:col', function (context) {
	//	alert('col route!!');
		var col = this.params['col'];
		bodyClass(context, 'col');
		//scrollTop();
		
		// $('html').scrollTo({ top:0, left:200 }, 200); //!! TWEAK value!
		var gal = Gallery.select(function() { //selecting the galery model (json bit)
		  return this.attr("id") == col
		}).first();
		$('header .btCol strong').text(gal.attr('season') +" "+ gal.attr('year'));
		initTemplates(context, function(context){
			renderTemplate(context, '#home .gallery', '/templates/gal.html', {gal: gal}, false, function(context){  //false = no chache of templ.
					$('#home nav a.active').removeClass('active');//Interface FX (active bt)
					$('#home nav a.'+col).addClass('active');
					$(".gallery img").one('load', function() {//FADE IMG on load...
					  $(this).removeClass('loading');
					}).each(function() {
					  if(this.complete) $(this).load(); //fix caching event not firing
					});
					$(".gallery img").bind('click touch', function() {//bind scrolling behavior on img clicks
						$('html').scrollTo(this, 300, {axis: 'x'});
						//alert('touch img');
					});
					
			}); // eo render
		}); //eo call back for initTemplate	
	}); // eo route

	///////////////////////
	this.get('/infos', function (context) {
		//alert("infos");
		bodyClass(context, 'info');
		scrollTop();
		initTemplates(context, function(context){
			alert('call back!!');
		});
	}); // eo route
	
	
	this.get('/bio', function (context) {
		bodyClass(context, 'bio');
		scrollTop();
		initTemplates(context, function(context){
			//alert('call back!!');
		});
	}); // eo route
	
	this.get('/credits', function (context) {
		bodyClass(context, 'credit');
		scrollTop();
		initTemplates(context, function(context){
			//alert('call back!!');
		});
	}); // eo route
	
});//eo sammy routes



/////////////// JSON data load

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
















