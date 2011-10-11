/*
¿Dudas, consultas? 
aacuna@multinet.cl
@kyuumeitai (twitter)
*/
$(document).ready (function(){

	jQuery.timeago.settings.strings = {
	   prefixAgo: "hace",
	   prefixFromNow: "dentro de",
	   suffixAgo: "",
	   suffixFromNow: "",
	   seconds: "menos de un minuto",
	   minute: "un minuto",
	   minutes: "unos %d minutos",
	   hour: "una hora",
	   hours: "%d horas",
	   day: "un día",
	   days: "%d días",
	   month: "un mes",
	   months: "%d meses",
	   year: "un año",
	   years: "%d años"
	};

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
        	} else 
        if(turi == 'facebook'){
        	a = a.replace(/(_s.jpg\S+)/g, '_t.jpg');
        	}
        return a;
	    }
	   
	function parseImg(a, turi){
        if(turi == 'facebook'){
        	a = a.replace('_s.jpg', '_t.jpg');
        	a = a.replace('_n.jpg', '_t.jpg');
        	}
        return a;
		}
		
	function parseTwitterHour(a){
		var a = a.split(" ");
		var anyo = a[5];
		var dia = a[2];
		var hora = a[3];
		var gmt = a[4];
		var mes;
		switch(a[1]){
		case 'Jan':
			mes = '01'
			break;
		case 'Feb':
			mes =  '02'
			break;
		case 'Mar':
			mes =  '03'
			break;
		case 'Apr':
			mes =  '04'
			break;
		case 'May':	
			mes =  '03'
			break;
		case 'Jun':
			mes =  '06'
			break;
		case 'Jul':
			mes =  '07'
			break;
		case 'Aug':
			mes =  '08'
			break;
		case 'Sep':
			mes =  '09'
			break;
		case 'Oct':
			mes =  '10'
			break;
		case 'Nov':
			mes =  '11'
			break;
		case 'Dec':
			mes =  '12'
			break;
		default:
		  	mes =  '01'
		}

return anyo + "-" + mes + "-" + dia + "T" + hora + gmt;

		}
		
	function compositor(i, dt, turi){
		var salida = '';

		if(turi == 'twitter'){
			var msg = dt.text;
			var nombre = '<a class="social-widget-twitter-account-link" href="http://twitter.com/' + dt.user.screen_name + '" target="_blank">' + dt.user.screen_name + "</a>";
			var link = "http://twitter.com/" + dt.user.screen_name + "/status/" + dt.id_str;
			var inreplyto = (dt.in_reply_to_screen_name) ? dt.in_reply_to_screen_name : "";
			var hora = parseTwitterHour(dt.created_at);
			
			salida += '<li class="type-twitter clearfix">' + parseText(dt.text, turi) + ' <a href="'+link+'" target="_blank">ver</a>';
			if(inreplyto != ""){
				salida += '<span class="inreplyto">En respuesta a: <a href="http://twitter.com/'+inreplyto+'" target="_blank">@'+inreplyto+'</a></span>';				
				}
			salida += '<span class="time">' + $.timeago(hora) + '</span>';
			salida += '</li>';
			}
			
		else if(turi == 'facebook'){
			var msg = (typeof(dt.message) != "undefined") ? dt.message : "";
			var link = (typeof(dt.link) != "undefined") ? dt.link : ""; 
			var foto = (typeof(dt.picture) != "undefined") ? dt.picture : "";
			var nombre = (typeof(dt.name) != "undefined") ? dt.name : "";
			var hora = (typeof(dt.created_time) != "undefined") ? dt.created_time : "";
			salida += '<li class="type-facebook clearfix">';
			if(foto != ""){
				salida += (link != "") ? '<a href="' + link + '" class="link" target="_parent"><img src="' + parseImg(foto, turi) + '" /></a>' : '<img src="' + parseImg(foto, turi) + '" />';
				}
			if(nombre != ""){
				salida += (link != "") ? '<h3><a href="'+ link +'" class="link" target="_blank">' + nombre + '</a></h3>' : '';	
				}
			salida += '<p>' + parseText(msg) + '</p>';
			salida += '<span class="time">' + $.timeago(hora) + '</span>';
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
		t.parent().removeClass('inactive').addClass('active');
		t.parent().siblings().removeClass('active').addClass('inactive');
 		ejecutor(turi, proxy);
 		return false;
 		});
 	
 	$('#social-buzz .feed').each(function(){
		var t = $(this);
		var turi = 'all';
		var proxy = 'proxy/caller.php';
 		ejecutor(turi, proxy);
 		});
 		
 	function ejecutor(turi, proxy){
		var t = $(this);
		$('.feed').animate({opacity:0}, 500, function(){
			$('#social-buzz .preloader').fadeIn('fast');
			});
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
				
				$('.feed').empty().html(html);
				$('.feed').animate({opacity:1}, 500);
				
				$('#social-buzz .preloader').fadeOut('fast');
				
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

					$('.feed').animate({opacity:0}, 500, function(){
						$('.feed').empty().html(html+'</ul>');
						});
						$('.feed').animate({opacity:1}, 500);
						$('#social-buzz .preloader').fadeOut('fast');
					});
					};
		 		});		 		
		 	}
 		}
 		
});