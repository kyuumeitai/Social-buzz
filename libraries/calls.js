/*
¿Dudas, consultas? 
aacuna@multinet.cl
@kyuumeitai (twitter)
*/
$(document).ready (function(){

	$.each(uris, function (cada) {
		var valor = uris[cada];
		if(valor.length == 0){
		    $('#'+cada+'-link').empty().remove();
			}
		});
		
	function parseText(a, turi) {
        a = a.replace(/(http\S+)/g, '<a href="$1" target="_blank">$1</a>');
        if(turi == 'twitter'){
	        a = a.replace(/(#\S+)/g, '<a href="http://twitter.com/search?q=$1" target="_blank">$1</a>');      	
        	}
        return a;
	    }

	function compositor(i, dt, turi){
		var salida = '';

		if(turi == 'twitter'){
			var msg = dt.text;
			var nombre = '<a class="social-widget-twitter-account-link" href="http://twitter.com/' + dt.user.screen_name + '" target="_blank">' + dt.user.screen_name + "</a>";
			var link = "http://twitter.com/" + dt.user.screen_name + "/status/" + dt.id_str;
			var inreplyto = (dt.in_reply_to_screen_name) ? dt.in_reply_to_screen_name : "";
			salida += '<li class="type-twitter clearfix">' + parseText(dt.text, turi) + ' <a href="'+link+'" target="_blank">ver</a>';
			if(inreplyto != ""){
				salida += '<span class="inreplyto">En respuesta a: <a href="http://twitter.com/'+inreplyto+'" target="_blank">@'+inreplyto+'</a></span>';				
				}
			salida += '</li>';
			}
			
		else if(turi == 'facebook'){
			var msg = (typeof(dt.message) != "undefined") ? dt.message : "";
			var link = (typeof(dt.link) != "undefined") ? dt.link : ""; 
			var foto = (typeof(dt.picture) != "undefined") ? dt.picture : "";
			var nombre = (typeof(dt.name) != "undefined") ? dt.name : "";			
			salida += '<li class="type-facebook clearfix">';
			if(foto != ""){
				salida += (link != "") ? '<a href="' + link + '" class="link" target="_parent"><img src="' + foto + '" /></a>' : '<img src="' + foto + '" />';
				}
			if(nombre != ""){
				salida += (link != "") ? '<h3><a href="'+ link +'" class="link" target="_blank">' + nombre + '</a></h3>' : '';	
				}
			salida += '<p>' + parseText(msg) + '</p>';
			salida += '</li>';	
			}
		else if(turi == 'flickr'){
			salida += 'flikerr!';
			}
		else if(turi == 'youtube'){
			salida += 'iutub!';			
			}
		return salida;
		}
	
	
		
 	$('#social-buzz-header li a').live('click', function(){
 		var t = $(this);
 		var turi = t.attr('rel');
 		var proxy = 'proxy/caller.php';
 		if(turi == 'facebook' || turi == 'twitter' || turi == 'flickr' || turi == 'youtube'){
 			var ruta  = proxy + '?url=' + encodeURIComponent(uris[turi]) + '&full_headers=1&full_status=1';

	 		$.getJSON(ruta, function(json){
	 			var html = '<ul class="each">';
				if(turi == 'twitter'){	
					$.each(json.contents, function(i,dt){
						html += compositor(i, dt, turi);
						});
					}
				else if(turi == 'facebook'){
					$.each(json.contents.data, function(i, dt){
 						html += compositor(i, dt, turi); 
						});
					}
				html += '</ul>';

				$('.feed').animate({opacity:0}, 500, function(){
					$('.feed').empty().html(html);
					});
				$('.feed').animate({opacity:1}, 500);				
				});
 			}
 			
 		else if(turi == 'all'){
 			var fids = {};
 			var html = '<ul class="each">';
 			$.each(uris, function (cada) {
			var valor = uris[cada];
			if(valor.length != 0){
				var indruta  = proxy + '?url=' + encodeURIComponent(valor) + '&full_headers=1&full_status=1';
				$.getJSON(indruta, function(json){					
					fids[cada] = json;
					if(cada == 'twitter'){
						$.each(json.contents, function(i, dt){
							html += compositor(i, dt, cada);		
							});
						}
					else if (cada == 'facebook'){
						$.each(json.contents.data, function(i, dt){
							html += compositor(i, dt, cada);												
							});
						}
					console.log(html);

					$('.feed').animate({opacity:0}, 500, function(){
						$('.feed').empty().html(html+'</ul>');
						});
						$('.feed').animate({opacity:1}, 500);
					});
					};
		 		});		 		
		 	}
 		return false;
 		});
 		
});