/**
 * namespace pattern
 * @class StringUtilities
 * @namespace smp.utils
 */

(function(){
	
	smp.namespace("smp.geom.StringUtilities");
	
	//constructor (instance creation)
	smp.utils.StringUtilities = (function()
	{
		var _value;
		var Constructor;
		
		
		Constructor = function()
		{
		
		}
		
		Constructor.prototype = {
			//public properties
			value:_value,
			version:"1.1"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
	//static methods

	smp.utils.StringUtilities.trim = function(str)
	{
		var l=0; var r=s.length -1;
		while(l < s.length && s[l] == ' ')
		{	l++; }
		while(r > l && s[r] == ' ')
		{	r-=1;	}
		return s.substring(l, r+1);
	}
	
	smp.utils.StringUtilities.isWhitespace = function(ch) 
	{
		 return ch == '\r' || 
					ch == '\n' ||
					ch == '\f' || 
					ch == '\t' ||
					ch == ' '; 
    }
	
	smp.utils.StringUtilities.truncate = function(inputString, maxLength, appendedString) 
	{
			if (!appendedString) {
				appendedString = "...";
			}
			var ttext;
			
			if(inputString.length > maxLength){
				ttext = inputString.substr(0, maxLength);
				
				var j = ttext.length - 1;
				while (!smp.utils.StringUtilities.isWhitespace(ttext.charAt(j))) 
				{
					if (j > 0) {
						j--;
					}else {
						break;
					}
				}
				
				if(j == 0){
					var pos = inputString.search(" ");
					if(pos>0){
						ttext = inputString.substring(0, pos);
					}else {
						ttext = inputString;
					}
				}else{
					ttext = inputString.substring(0, j);
				}
				
				if(ttext != inputString){
					ttext+= appendedString;
				}	
			}else{
				ttext = inputString;
			}
			
			
			return ttext;
		
	}
    
	smp.utils.StringUtilities.wrapString = function(originalString, maxLength) 
	{
		var chunkedString = [];
		var maxlen = maxLength;
		var start = 0;
		var processString = originalString;
		//var count = 40;
		
		if(originalString.length > maxLength){
			/*while(count>0){
			count--;*/
			while(start < processString.length){
				truncate();
			}
			
		}else{
			chunkedString.push(originalString);
			
		}
		
		return chunkedString;
		
		function truncate()
		{
			var tempString = processString.substr(start, maxlen);
			
			//se ainda existem pelo menos maxlen letras até ao fim da string
			if (tempString.length == maxlen)
			{
				var j = tempString.length - 1;
				while (!smp.utils.StringUtilities.isWhitespace(tempString.charAt(j))) 
				{
					
					if (j > 0) {
						j--;
					}else {
						break;
					}
				}
							
				if(j == 0){
				//não existirem brancos, procura o próximo mais adiante
					var pos = start + processString.substr(start).search(" ");
					
					if(pos > start-1){
						
						tempString = processString.substring(start, pos);
						start = pos + 1;
					}else{
						
						//se já não existirem mais brancos, termina o processo
						tempString = processString.substr(start);
						start = processString.length;
					}
				}else{
					tempString = processString.substring(start, start+j);
					start = start + j + 1;
				}
				
			}else{
			//caso contrário, termina o processo
				start = processString.length;
			}
			chunkedString.push(tempString);
		}
		
	}
	
	
	smp.utils.StringUtilities.generateKey = function(length) 
	{
	
	  // start with a blank password
	  var password = "";

	  // define possible characters
	  var possible = "0123456789abcdefghjkmnpqrstvwxyz"; 
		
	  // set up a counter
	  var i = 0, char; 

	  // add random characters to $password until $length is reached
	  while (i < length) { 

		// pick a random character from the possible ones
		char = possible.substr(Math.round(Math.random()*(possible.length-1)), 1);
			
		// we don't want this character if it's already in the password
		if (password.indexOf(char)==-1) { 
		  password += char;
		  i++;
		}

	  }

	  // done!
	  return password;

	}

}());