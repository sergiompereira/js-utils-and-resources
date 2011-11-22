
/**
* CORE
*/

(function(){

	if (typeof smp == "undefined" || !smp) {
	  
		smp = {};
	}

	if (typeof window.console == 'undefined') {
		window.console = {};
		window.console.log = function(msg) {
			return;
		};
	}

	function _createNamespace(sNamespace){
		var parts = sNamespace.split("."),
			parent = smp,
			i;
		
		if(parts[0] === "smp"){
			parts = parts.slice(1);
		}
		
		for(i=0; i<parts.length; i+=1){
			if(typeof parent[parts[i]] === "undefined"){
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
	};
	
	function _createModule(init,options)
	{
		
		var Constructor;
		
		
		Constructor = function()
		{
			if(init) init();
		}
		
		Constructor.prototype = {
			//public properties
			
			version:"1.1"
			
			//public methods
			
		};
		
		if(options)
			Constructor.prototype = _clone(options, Constructor.prototype);
		
		return Constructor;
		
	}


	//some utils
	smp.debugMode = true;
	smp.log = function(value){
		if(this.debugMode){
			window.console.log("smp log : "+value);
		}
	}


	/**
	* UTILS
	*/
	
	function _clone(parent, child){
		
		var child = child || {};
		var i, 
			toString = Object.prototype.toString, 
			astr = "[object Array]";
		
		
		function _copy(parent, child){
			
			for(i in parent){
				if(parent.hasOwnProperty(i)){
					if(typeof parent[i] === "object"){
						child[i] = (toString.call(parent[i])===astr) ? [] : {};
						_copy(parent[i], child[i]);
					}else{
						child[i] = parent[i];
					}
				}
			}
			return child;
		}
		
		_copy(this,child);

		
		return child;

	}
	

	function _extend(parent, child){

		if(typeof parent === "function"){
			var child = child || function(){};
			
			//copy own properties (added to this.)
			child = smp.clone(parent, child);
			
			//copy prototype
			var proxyF = function(){};
			proxyF.prototype = parent.prototype;
			child.prototype = new proxyF();
			child.superPrototype = parent.prototype;
			child.prototype.constructor = child;
			
		}else{
			return null;
		}
		
		return child;
		
	}
	
	
	//static methods
 
	smp.clone = _clone;
	smp.extend = _extend;
	
	smp.serialize = function(_obj)
	{
	   // Let Gecko browsers do this the easy way
	   if (typeof _obj.toSource !== 'undefined' && typeof _obj.callee === 'undefined')
	   {
		  return _obj.toSource();
	   }

	   // Other browsers must do it the hard way
	   switch (typeof _obj)
	   {
		  // numbers, booleans, and functions are trivial:
		  // just return the object itself since its default .toString()
		  // gives us exactly what we want
		  case 'number':
		  case 'boolean':
		  case 'function':
			 return _obj;
			 break;

		  // for JSON format, strings need to be wrapped in quotes
		  case 'string':
			 return '\'' + _obj + '\'';
			 break;

		  case 'object':
			 var str;
			 if (_obj.constructor === Array || typeof _obj.callee !== 'undefined')
			 {
				str = '[';
				var i, len = _obj.length;
				for (i = 0; i < len-1; i++) { str += serialize(_obj[i]) + ','; }
				str += serialize(_obj[i]) + ']';
			 }
			 else
			 {
				str = '{';
				var key;
				for (key in _obj) { str += key + ':' + serialize(_obj[key]) + ','; }
				str = str.replace(/\,$/, '') + '}';
			 }
			 return str;
			 break;

		  default:
			 return 'UNKNOWN';
			 break;
	   }

	}
	
	
	/**
	* 	@example	var teste = ["Portugal","It�lia","Finl�ndia","Bulg�ria"];
	*				smp.each(teste,
	*					function(key,value){
	*						console.log(key+" // "+value);
	*					}, this
	*				);
	*/
	smp.each = function(obj,fnc,context){
		if(obj === null || obj === undefined) return;
		if(typeof obj == "object"){
			if(obj.length !== null && obj.length !== undefined){
				var length = obj.length;
				var i = 0;
				while(i<length){
					fnc.call(context, i, obj[i], obj);
					i++;
				}
			}else{
				var key;
				for(key in obj){
					if (hasOwnProperty.call(obj, key)) {
						fnc.call(context, key, obj[key], obj);
					}
				}
			}
		}
	}
	
		
	/**
	* @example smp.times(10, function(){
	*					document.write("Hello!<br/>");
	*				});
	*/
	smp.times = function(number,callback)
		var i;
		for(i=0;i<number; i++){
			callback();
		}
	}
	
	
	/**
	* MATH
	*/
	
	_createNamespace("smp.math");
	smp.math = _createModule();
	
	
	/**
     *  Round a number. By default the number is rounded to the nearest
     *  integer. Specifying a roundToInterval parameter allows you to round
     *  to the nearest of a specified interval.
     *  @param  number             The number you want to round.
     *  @param  nRoundToInterval   (optional) The interval to which you want to
     *                             round the number. The default is 1.
     *  @return                    The number rounded to the nearest interval.
	 *	@example alert(smp.math.round(10.347, 0.1));	//outputs 10.3
     */
    smp.math.round = function(nNumber, nRoundToInterval) {
      // Return the result
	  if(nRoundToInterval == null){
	  	nRoundToInterval = 1;
	  }
      return Math.round(nNumber / nRoundToInterval) * nRoundToInterval;
    }
    

    /**
     *  Get the floor part of a number. By default the integer part of the
     *  number is returned just as if calling Math.floor( ). However, by specifying
     *  a roundToInterval, you can get non-integer floor parts.
     *  to the nearest of a specified interval.
     *  @param  number             The number for which you want the floor part.
     *  @param  nRoundToInterval   (optional) The interval to which you want to
     *                             get the floor part of the number. The default is 1.
     *  @return                    The floor part of the number.
     */
   smp.math.floor  = function(nNumber, nRoundToInterval) {
    
	  if(nRoundToInterval == null){
	  	nRoundToInterval = 1;
	  }
      // Return the result
      return Math.floor(nNumber / nRoundToInterval) * nRoundToInterval;
    }

    /**
     *  Get the ceiling part of a number. By default the next highested integer
     *  number is returned just as if calling Math.ceil( ). However, by specifying
     *  a roundToInterval, you can get non-integer ceiling parts.
     *  to the nearest of a specified interval.
     *  @param  number             The number for which you want the ceiling part.
     *  @param  nRoundToInterval   (optional) The interval to which you want to
     *                             get the ceiling part of the number. The default is 1.
     *  @return                    The ceiling part of the number.
     */
    smp.math.ceil = function(nNumber, nRoundToInterval) {

	  if(nRoundToInterval == null){
	  	nRoundToInterval = 1;
	  }
      // Return the result
      return Math.ceil(nNumber / nRoundToInterval) * nRoundToInterval;
    }

    /**
     *  Generate a random number within a specified range. By default the value
     *  is rounded to the nearest integer. You can specify an interval to which
     *  to round the value.
     *  @param  minimum            The minimum value in the range.
     *  @param  maximum            (optional) The maxium value in the range. If
                                   omitted, the minimum value is used as the maximum,
                                   and 0 is used as the minimum.
     *  @param  roundToInterval    (optional) The interval to which to round.
     *  @return                    The random number.
     */
    smp.math.random = function(nMinimum, nMaximum, nRoundToInterval) {

	  if(nMaximum == null){
	  	nMaximum = 0;
	  }
	  
	  if(nRoundToInterval == null){
	  	nRoundToInterval = 1;
	  }
      // If the minimum is greater than the maximum, switch the two.
      if(nMinimum > nMaximum) {
        var nTemp = nMinimum;
        nMinimum = nMaximum;
        nMaximum = nTemp;
      }

        // Calculate the range by subtracting the minimum from the maximum. Add
        // 1 times the round to interval to ensure even distribution.
        var nDeltaRange = (nMaximum - nMinimum) + (1 * nRoundToInterval);

        // Multiply the range by Math.random(). This generates a random number
        // basically in the range, but it won't be offset properly, nor will it
        // necessarily be rounded to the correct number of places yet.
        var nRandomNumber = Math.random() * nDeltaRange;

        // Add the minimum to the random offset to generate a random number in the correct range.
        nRandomNumber += nMinimum;

        // Return the random value. Use the custom floor( ) method to ensure the
        // result is rounded to the proper number of decimal places.
        return NumberUtilities.floor(nRandomNumber, nRoundToInterval);
      }
	  
	  
	smp.math.scale = function(valor, inMin , inMax , outMin , outMax) {
			return (valor - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
	}
	
	/**
	 * Considering a matrix with matrixHCount elements in each row,
	 * and an array that would store each of the matrix elements in a left to right and top bottom order,
	 * this method returns the index position in the array that stores the element at the matrix coordinates (x,y)
	 * @param	matrixHCount	: number of elements in each row of the matrix
	 * @param	x				: x position in the matrix grid
	 * @param 	y				: y position in the matrix grid
	 * @return					: index in the array
	 */
	smp.math.getIndexFromPoint = function(matrixHCount, x, y) {
		if(x<matrixHCount && x>=0){
			return y*matrixHCount + x;
		}
		return null;
		
	}
	
	/**
	 * Considering a matrix with matrixHCount elements in each row,
	 * and an array that would store each of the matrix elements in a left to right and top bottom order,
	 * this method returns the (x,y) position in the matrix grid of the element stored in the index position of the array.
	 * @param	matrixHCount	: number of elements in each row of the matrix
	 * @param	index			: position of the element in the array
	 * @return					: an object with properties x and y
	 */
	smp.math.getPointFromIndex = function(matrixHCount, index) {
		var point = {};
		var tx = (index % matrixHCount);
		point.x = Math.floor(tx);
		var subindex = (tx % 1) - 1;
		point.y = Math.floor(index/matrixHCount);
		return point;
	}
	
	
	/**
	* STRING
	*/
	_createNamespace("smp.string");
	smp.string = _createModule();
	
	//static methods
	
	smp.string.trim = function(str)
	{
		var l=0; var r=s.length -1;
		while(l < s.length && s[l] == ' ')
		{	l++; }
		while(r > l && s[r] == ' ')
		{	r-=1;	}
		return s.substring(l, r+1);
	}
	
	smp.string.isWhitespace = function(ch) 
	{
		 return ch == '\r' || 
					ch == '\n' ||
					ch == '\f' || 
					ch == '\t' ||
					ch == ' '; 
    }
	
	smp.string.truncate = function(inputString, maxLength, appendedString) 
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
    
	smp.string.wrap = function(originalString, maxLength) 
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
			
			//se ainda existem pelo menos maxlen letras at� ao fim da string
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
				//n�o existirem brancos, procura o pr�ximo mais adiante
					var pos = start + processString.substr(start).search(" ");
					
					if(pos > start-1){
						
						tempString = processString.substring(start, pos);
						start = pos + 1;
					}else{
						
						//se j� n�o existirem mais brancos, termina o processo
						tempString = processString.substr(start);
						start = processString.length;
					}
				}else{
					tempString = processString.substring(start, start+j);
					start = start + j + 1;
				}
				
			}else{
			//caso contr�rio, termina o processo
				start = processString.length;
			}
			chunkedString.push(tempString);
		}
		
	}
	
	
	smp.string.generateKey = function(length) 
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
	
	/**
	* DATE
	*/
	_createNamespace("smp.date");
	smp.date = _createModule();
	
	//static methods
	smp.date.print = function() {
		var dt = new Date();
		var dtstring = dt.getFullYear()
			+ '-' + pad2(dt.getMonth()+1)
			+ '-' + pad2(dt.getDate())
			+ ' ' + pad2(dt.getHours())
			+ ':' + pad2(dt.getMinutes())
			+ ':' + pad2(dt.getSeconds());
			
			return dtstring;
	}
	
	
	
	
	
	/**
	* URL
	*/
	
	_createNamespace("smp.url");
	smp.url = _createModule();
	
	//static methods
	smp.url.params = function()
	{
		var qsParm = new Array();
        var query = '';
        var fullURL = window.document.URL;
        if (fullURL.indexOf('?') > 0) {
            query = fullURL.substring(fullURL.indexOf('?')+1, fullURL.length);
            query = unescape(query);
        }
		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				qsParm[key] = val;
			}
		}
        return (qsParm);
	}
	
	
	
	/**
	* GEOMETRY
	*/
	
	_createNamespace("smp.geom");
	smp.geom = _createModule();
	
	 /**
     *  Round a number. By default the number is rounded to the nearest
     *  integer. Specifying a roundToInterval parameter allows you to round
     *  to the nearest of a specified interval.
     *  @param  number             The number you want to round.
     *  @param  nRoundToInterval   (optional) The interval to which you want to
     *                             round the number. The default is 1.
     *  @return                    The number rounded to the nearest interval.
     */
    smp.geom.distance = function(x1, y1, x2, y2) 
    {
    	var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx*dx+dy*dy);
    }
    
    smp.geom.distance3 = function(x1, y1, z1, x2, y2, z2) 
    {
		var dxz = smp.geom.GeometryUtils.distance(x1, z1, x2, z2);
		var dy = y1 - y2;
		return Math.sqrt(dxz*dxz+dy*dy);
    }
    
	
	
}());
