<?php 
/********************************************************************************
Álex Acuña Viera - Multinet 2011.
¿Dudas, consultas?
aacuna@multinet.cl
@kyuumeitai (twitter)
		                   ___    __                        __      
		                  /\_ \  /\ \__  __                /\ \__   
		  ___ ___   __  __\//\ \ \ \ ,_\/\_\    ___      __\ \ ,_\  
		/' __` __`\/\ \/\ \ \ \ \ \ \ \/\/\ \ /' _ `\  /'__`\ \ \/  
		/\ \/\ \/\ \ \ \_\ \ \_\ \_\ \ \_\ \ \/\ \/\ \/\  __/\ \ \_ 
		\ \_\ \_\ \_\ \____/ /\____\\ \__\\ \_\ \_\ \_\ \____\\ \__\
		 \/_/\/_/\/_/\/___/  \/____/ \/__/ \/_/\/_/\/_/\/____/ \/__/
	 
 
*********************************************************************************/
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Social Buzz</title>
		<link type="text/css" href="style.css" rel="stylesheet" />
		<script type="text/javascript" src="libraries/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" src="libraries/jquery.timeago.js"></script>		
		<script type="text/javascript">
<?php 
/**************************************************************************** 

Configuración: Si se desea eliminar un servicio, simplemente debe declararse vacío. 

Hasta el momento hay 4 servicios configurados:
	- twitter
	- facebook
	- flickr
	- youtube

Si se necesitara extender hay que crear un parser en:
	libraries/calls.js, línea 14 
	función compositor()
para los distintos formatos.

NOTA: 
Los streams NO deben estar en JSONP sino en JSON (es decir, no atachar "callback=?")
ya que para esto está el proxy (en proxy/caller.php)
	
*****************************************************************************/
?>
		/* <![CDATA[ */
		var uris = {
			twitter: "https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=postitCHL",
			facebook: "https://graph.facebook.com/185425341488855/posts?access_token=241129952604057|Ph--6TL-LnvK_tpUvgso_FhJ9n0",
			flickr: "",
			youtube: ""
		};
		/* ]]> */
		</script>
		<script type="text/javascript" src="libraries/calls.js"></script>		
	</head>
	<body>
		<div id="social-buzz">
			<ul id="social-buzz-header" class="clearfix"> 
				<li>Muéstrame:</li>
				<li id="twitter-link"><a href="http://twitter.com/postitCHL" target="_blank" rel="twitter">Twitter</a></li>
				<li id="facebook-link"><a href="http://www.facebook.com/postitchile" target="_blank" rel="facebook">Facebook</a></li>
				<li id="flickr-link"><a href="http://www.flickr.com/photos/postitproducts/" target="_blank" rel="flickr">Flickr</a></li>
				<li id="youtube-link"><a href="http://www.youtube.com/user/postitnotes" target="_blank" rel="youtube">Youtube</a></li>
				<li id="all-link"><a href="#" rel="all">Todos</a></li>			
			</ul>
			<div class="feed clearfix">
			
			</div><!-- .feed -->
			<img class="preloader" src="images/preloader.gif" />
		</div><!-- #social-buzz -->
	</body>
</html>