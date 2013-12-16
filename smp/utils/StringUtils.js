/**
 * namespace pattern
 * @class StringUtils
 * @namespace smp.utils
 */

(function(){
	
	smp.createNamespace("smp.utils.StringUtils");
	
	//constructor (instance creation)
	smp.utils.StringUtils = (function()
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

	smp.utils.StringUtils.trim = function(str)
	{
		var l=0; var r=str.length -1;
		while(l < str.length && str[l] == ' ')
		{	l++; }
		while(r > l && str[r] == ' ')
		{	r-=1;	}
		return str.substring(l, r+1);
	}
	
	smp.utils.StringUtils.isWhitespace = function(ch) 
	{
		 return ch == '\r' || 
					ch == '\n' ||
					ch == '\f' || 
					ch == '\t' ||
					ch == ' '; 
    }
	
	smp.utils.StringUtils.truncate = function(inputString, maxLength, appendedString) 
	{
			if (!appendedString) {
				appendedString = "...";
			}
			var ttext;
			
			if(inputString.length > maxLength){
				ttext = inputString.substr(0, maxLength);
				
				var j = ttext.length - 1;
				while (!smp.utils.StringUtils.isWhitespace(ttext.charAt(j))) 
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
    
	smp.utils.StringUtils.wrapString = function(originalString, maxLength) 
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
				while (!smp.utils.StringUtils.isWhitespace(tempString.charAt(j))) 
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
	
	
	smp.utils.StringUtils.generateKey = function(length) 
	{
	
	  // start with a blank password
	  var password = "";

	  // define possible characters
	  var possible = "0123456789abcdefghjkmnpqrstvwxyz"; 
		
	  // set up a counter
	  var i = 0, letter; 

	  // add random characters to $password until $length is reached
	  while (i < length) { 

		// pick a random character from the possible ones
		letter = possible.substr(Math.round(Math.random()*(possible.length-1)), 1);
			
		// we don't want this character if it's already in the password
		if (password.indexOf(letter)==-1) { 
		  password += letter;
		  i++;
		}

	  }

	  // done!
	  return password;

	}
	
	smp.utils.StringUtils.stripHTML = function(str){
		return str.replace(/<(?:.|\s)*?>/g, ' ');
	}

	smp.utils.StringUtils.removeAccents = function(str){
		
		var nstr = str;
		
		
		var MAPPED_CONVERTIONS = [
			
			["a", "á","à","â","ã","ä"],
			["e", "é","è","ê","ë"],
			["o", "ó","ò","ô","õ","ö"],
			["i", "í","ì","î","ï"],
			["u", "ú","ù","û","ü"],
			["c","ç"],
			["n", "ñ"],
			["y", "ý","ÿ"],
			["A", "Á","Á","Â","Ã","Ä"],
			["E", "É","È","Ê","Ë"],
			["O", "Ó","Ò","Ô","Õ","Ö"],
			["I", "Í","Ì","Î","Ï"],
			["U", "Ú","Ù","Û","Ü"],
			["C","Ç"],
			["N", "Ñ"],
			["Y", "Ý"]
		
		];
		
		var i,j,accent,noaccent;
		for(i=0; i<MAPPED_CONVERTIONS.length; i++){
			noaccent = MAPPED_CONVERTIONS[i][0];
			for(j=1;j<MAPPED_CONVERTIONS[i].length;j++){
				accent = MAPPED_CONVERTIONS[i][j];
				while(nstr.indexOf(accent) >= 0){
					nstr = nstr.replace(accent,noaccent);
				}
			}
		}
		
		return nstr;
	}
}());