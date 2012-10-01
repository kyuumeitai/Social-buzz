<?php 
/********************************************************************************
Álex Acuña Viera - Multinet 2012.
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
//Setup
$app_id = "241129952604057";
$app_secret = "841b25852b262d4da0710bf9d46a3a6e";
$access_token = "AAADbTnErb5kBABcosVGgA7wdj2Efs3fJF7MEZAIW2aSLlnZA49M49r6MeVZCTPCbBDtNEbtYo1NabiCBtcn092U8Ot6EO0ZD";
$pageid = '226467530793812';
$method = 'posts';

include_once('tokenizer.php');

?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Social Buzz</title>
		<link type="text/css" href="style.css" rel="stylesheet" />
		<script type="text/javascript" src="libraries/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="libraries/jquery.timeago.js"></script>		
		<script type="text/javascript">
		/* <![CDATA[ */
		var uris = {
			facebook: "https://graph.facebook.com/<?=$pageid;?>/<?=$method;?>?access_token=<? echo mnet_get_data($pageid, $method, $access_token, $app_id, $app_secret);?>",
			twitter: "",
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
				<li id="facebook-link"><a href="https://www.facebook.com/pages/Post-it-Chile/226467530793812" target="_blank" rel="facebook">Facebook</a></li>
				<li id="twitter-link"><a href="http://twitter.com/postitCHL" target="_blank" rel="twitter">Twitter</a></li>
				<li id="flickr-link"><a href="http://www.flickr.com/photos/postitproducts/" target="_blank" rel="flickr">Flickr</a></li>
				<li id="youtube-link"><a href="http://www.youtube.com/user/postitnotes" target="_blank" rel="youtube">Youtube</a></li>
<!-- 				<li id="all-link"><a href="#" rel="all">Todos</a></li>			 -->
			</ul>
			<div class="feed clearfix">
			
			</div><!-- .feed -->
			<img class="preloader" src="images/preloader.gif" />
		</div><!-- #social-buzz -->
	</body>
</html>