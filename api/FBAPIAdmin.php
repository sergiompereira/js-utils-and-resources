<?php

// Responds to HTTP POST requests
// Credits:
// Author: Jason Levitt
// December 7th, 2005
//


new FBAPIAdmin();

class FBAPIAdmin {
		
	var $listaUsers;
	var $bInsere = false;
	var $hostname = "https://graph.facebook.com/oauth/";
	var $app_id = "103753239695901";
	var $app_secret = "3fbd629f8363cfa00d5a5ba3a2b662c9";
	var $debug = false;
		
	function FBAPIAdmin(){ 
		
		switch($_GET["method"])
		{
			case "getAppToken":
				$this->getAppToken();
				break;
				
		}
	}
		
	function getAppToken()
	{
		$path = "access_token?client_id=$this->app_id&client_secret=$this->app_secret&grant_type=client_credentials";
		$this->makeCall($this->initCall($path), $this->encodeValues($_GET));
	
	}
	
	
	//
	function encodeValues($coll)
	{
		// Put the POST data in the body
		$postvars = '';
		while ($element = current($coll)) {
			$postvars .= urlencode(key($coll)).'='.urlencode($element).'&';
			next($coll);
		}
		
		return $postvars;
	}
	
	// Init Curl
	function initCall($path)
	{
		$url = $this->hostname.$path;
		
		// Open the Curl session
		$session = curl_init($url);
		
		return $session;
	}
	
	// Make the call
	function makeCall($session, $postvars)
	{
		if($postvars){
			curl_setopt ($session, CURLOPT_POST, true);
			curl_setopt ($session, CURLOPT_POSTFIELDS, $postvars);
		}
		
		
		// Don't return HTTP headers. Do return the contents of the call
		curl_setopt($session, CURLOPT_HEADER, false);
		curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($session, CURLOPT_SSL_VERIFYHOST, false);
		
		if($this->debug) 
		{
			curl_setopt($session, CURLOPT_HEADERFUNCTION, "debug_curl_data");
			curl_setopt($session, CURLOPT_WRITEFUNCTION, "debug_curl_data");
			curl_setopt($session, CURLINFO_HEADER_OUT, true);
			
			
			function debug_curl_data($curl, $data=null) {
			  
			  static $buffer = '';
			
			  if ( is_null($curl) ) {
			    $r = $buffer;
			    $buffer = '';
			    return $r;
			  }else {
			    $buffer .= $data;
			    return strlen($data);
			  }
			}
		}
		
		
		switch($_GET["response_type"]){
			case "json":
				header("Content-Type: application/json");
				break;
			case "xml":
				header("Content-Type: text/xml");
				break;
			default:
				header("Content-Type: text/html");
		}
		
		
		$response = curl_exec($session);

		echo $response;
		
		if($this->debug) $this->debug_curl($session);
		
		curl_close($session);
	}
	
	function debug_curl($session)
	{
		echo '<fieldset><legend>request headers</legend><pre>',
				 htmlspecialchars(curl_getinfo($session, CURLINFO_HEADER_OUT)), 
	  			'</pre></fieldset>';
	
		echo '<fieldset><legend>response</legend><pre>', 
				htmlspecialchars($this->debug_curl_data(null)), 
				'</pre></fieldset>';
	}
	
	function debug_curl_data($curl, $data=null) {
			  
	  static $buffer = '';
	
	  if ( is_null($curl) ) {
	    $r = $buffer;
	    $buffer = '';
	    return $r;
	  }else {
	    $buffer .= $data;
	    return strlen($data);
	  }
	}
	
}

			     
?>