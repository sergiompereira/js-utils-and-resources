(function(){
	
	
	
	//REC 709
	// 0.2126*r + 0.7152*g + 0.0722*b;
	//REC 601
	// 0.3*r + 0.59*g + 0.11*b;
	//in any case, the coefficients sum to 1.
	var rlum = 0.2126;
	var glum = 0.7152;
	var blum = 0.0722;
	
	function checkParams(params){
		return  (params && Object.prototype.toString.call(params)==="[object Array]") ? params : [];
	};
		
	
	function contrast(color, params)
		{		
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			
			var dest = {};
			dest.r = contrastColor(color.r);
			dest.g = contrastColor(color.g);
			dest.b = contrastColor(color.b);
			
			function contrastColor(color){
				//formula : diferença de luminância / luminância média
				//ou seja, o desvio da média a dividir pela média.
				//http://en.wikipedia.org/wiki/Contrast_(formula)#Formula
				return ((color - 127)*value)+ 127;
			}
			
			dest.a = color.a;
			
			dest = range(dest);
			
			return dest;
		};
	function brightness(color, params)
		{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			var dest = {};
			
			dest.r = changeColor(color.r);
			dest.g = changeColor(color.g);
			dest.b = changeColor(color.b);
			dest.a = color.a;
			
			function changeColor(color){
				return color + gaussian(color,125,100)* (value-1);
			}
			
			function gaussian(value, center, amplitude){
				var a = value, b = center, c = amplitude;
				//gaussian curve, so that black and white areas are less affected.
				return a*Math.pow(Math.E, -(Math.pow(value-b,2)/(2*Math.pow(c,2))));
			}
			
			dest = range(dest);
			
			return dest;
		};
	
	function saturation(color, params)
		{
			var value; 
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
				
			var dest = {};
			
			dest.r = ((rlum + (1.0 - rlum) * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + -blum * value) * color.b);
			dest.g = ((rlum + -rlum * value) * color.r) + ((glum + (1.0 - glum) * value) * color.g) + ((blum + -blum * value) * color.b);
			dest.b = ((rlum + -rlum * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + (1.0 - blum) * value) * color.b);
			dest.a = color.a;
			
			dest = range(dest);
			return dest;
		};
	
	function colorTemperature(color, params)
		{		
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			var dest = {};
			var inc = (value - 1)/2;
			var hinc = inc/2;
			if(value>1){
				dest.r = color.r*(1+hinc*(1-rlum));
				dest.g = color.g*(1+hinc*(1-glum));
				dest.b = color.b*(1-inc*(1-blum));
			}else if(value<1){
				dest.r = color.r*(1+inc*(1-rlum));
				dest.g = color.g*(1-hinc*(1-glum));
				dest.b = color.b*(1-hinc*(1-blum));
			}else{
				return color;
			}
		
			dest.a = color.a;
			
			dest = range(dest);
			
			return dest;
		};
		
	function threshold(color, params)
		{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			if(value > 255) value = 255;
			var dest = {};
			//REC 709
			var nvalue = (0.2126*color.r + 0.7152*color.g + 0.0722*color.b >= value) ? 255 : 0;
			
			dest.r = dest.g = dest.b = nvalue;
			dest.a = color.a;
						
			return dest;
		};
		
	function red(color,params) 
	{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			return hue("red",color,value);
		};
	function green(color,params) 
	{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			return hue("green",color,value);
		};
	function blue(color,params) 
	{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			return hue("blue",color,value);
		};
	function invert(color)
	{
			var dest = {};
			dest.r = 255-color.r;
			dest.g = 255-color.g;
			dest.b = 255-color.b;
			dest.a = color.a;
			
			return dest;
		};
	function normalize(color,params)
	{
			
			var min,max;
			if (checkParams(params).length > 0) {min = params[0]; max = params[1]} else {return;}
			if(max > 255)  max = 255;
			if(min <  0)  min = 0;
			var dest = {};
			
			dest.r = scale(color.r,0,255,min,max);
			dest.g = scale(color.g,0,255,min,max);
			dest.b = scale(color.b,0,255,min,max);
			dest.a = color.a;
			
			dest = range(dest);
			
			return dest;
		};
	function posterize(color, params)
	{
			var value;
			if (checkParams(params).length > 0) {value = params[0];} else {return;}
			value = 255/value;
			var dest = {};
			dest.r = Math.round(color.r/value)*value;
			dest.g = Math.round(color.g/value)*value;
			dest.b = Math.round(color.b/value)*value;
			dest.a = color.a;
			
			return dest;
		};
	function monotone(color,params)
	{
		var tint,towhite;
			if (checkParams(params).length > 0) {tint = params[0]; towhite = params[1]} else {return;}
			var dest = saturation(color,[0]);
			if(towhite){
				dest.r = _scale(dest.r,tint.r);
				dest.g = _scale(dest.g,tint.g);
				dest.b = _scale(dest.b,tint.b);
				dest.a = color.a;
			}else{
				dest.r = dest.r/255*tint.r;
				dest.g = dest.g/255*tint.g;
				dest.b = dest.b/255*tint.b;
				dest.a = color.a;
			}
			function _scale(value,outMin){
				return value / 255*(255-outMin) + outMin;
			}
			
			return dest;
		};
	function duotone(color, params)
	{
		var colora,colorb;
			if (checkParams(params).length > 0) {colora = params[0]; colorb = params[1]} else {return;}
			
			var dest = saturation(color,[0]);
			dest.r = _scale(dest.r,colora.r,colorb.r);
			dest.g = _scale(dest.g,colora.g,colorb.g);
			dest.b = _scale(dest.b,colora.b,colorb.b);
			dest.a = color.a;
			
			function _scale(value,outMin,outMax){
				return value / 255*(outMax-outMin) + outMin;
			}
			
			return dest;
		}
		
	PointFilter = {
		contrast:contrast,
		brightness:brightness,
		saturation:saturation,
		colorTemperature:colorTemperature,
		threshold:threshold,
		red:red,
		green:green,
		blue:blue,
		invert:invert,
		normalize:normalize,
		posterize:posterize,
		monotone:monotone,
		duotone:duotone
	};
	
	//utils
	function hue(channel,color, value)
	{
		var dest = {};
		
		dest.r = color.r;
		dest.g = color.g;
		dest.b = color.b;
		dest.a = color.a;
		
		switch(channel){
			case "red":
				dest.r*=value;
			break;
			case "green":
				dest.g*=value;
			break;
			case "blue":
				dest.b*=value;
			break;
		}
		
		dest = range(dest);
		
		return dest;
	};
	
	function range(color){
		if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
		if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
		if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
		if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
		
		return color;
	}
	function scale(valor, inMin , inMax , outMin , outMax) {
			return (valor - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
	}
	
}())