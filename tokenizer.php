<?php
// FIND THE TOKEN!! 
// http://www.youtube.com/watch?v=CZRWxV56I_Q
// La idea es que primero prueba el token por defecto. Si por alguna razón expira, va a buscar uno nuevo.

function mnet_get_token($app_id, $app_secret){
	$token_url = "https://graph.facebook.com/oauth/access_token?client_id=$app_id&client_secret=$app_secret&grant_type=client_credentials";
	$response = file_get_contents($token_url);
	$params = null;
	parse_str($response, $params);
	$access_token = $params['access_token'];
	return $access_token;
}

function mnet_get_data($pageid, $method, $access_token, $app_id, $app_secret){
	$graph_url = "https://graph.facebook.com/$pageid/$method?access_token=$access_token";
	$response = curl_get_file_contents($graph_url);
	$decoded_response = json_decode($response);
	$output = "";
	if (isset($decoded_response -> error )) {
		if ($decoded_response->error->type == "OAuthException") {
			$output = mnet_get_token($app_id, $app_secret);
		}
	} else {
		$output = $access_token;
	}
	return $output;
}

//Gracias, stackoverflow.
function curl_get_file_contents($URL) {
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($c, CURLOPT_URL, $URL);
	$contents = curl_exec($c);
	$err  = curl_getinfo($c,CURLINFO_HTTP_CODE);
	curl_close($c);
	if ($contents) return $contents;
	else return FALSE;
}
?>