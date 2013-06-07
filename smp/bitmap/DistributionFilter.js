(function(){

	
	
	//REC 709
	// 0.2126*r + 0.7152*g + 0.0722*b;
	//REC 601
	// 0.3*r + 0.59*g + 0.11*b;
	//in any case, the coefficients sum to 1.
	var rlum = 0.2126;
	var glum = 0.7152;
	var blum = 0.0722;
	
	function saturation(color, value)
	{
		var dest = {};
		
		dest.r = ((rlum + (1.0 - rlum) * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + -blum * value) * color.b);
		dest.g = ((rlum + -rlum * value) * color.r) + ((glum + (1.0 - glum) * value) * color.g) + ((blum + -blum * value) * color.b);
		dest.b = ((rlum + -rlum * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + (1.0 - blum) * value) * color.b);
		dest.a = color.a;
		
		dest = range(dest);
		
		return dest;
	}
	
	/**
	 * params[0] : threshold value to decide upon 0(black) or 255(white)
	 *
	 */
	function halftone(imagedata,x,y,params)
	{	
		var toString = Object.prototype.toString;
		var astr = "[object Array]";
		
		var threshold = (params && toString.call(params)===astr && params.length>0) ? params[0] : 127,
	    	color = getColor(imagedata,x,y),
	      	sat = saturation(color,0),
	      	dest = copyColor(sat);

	      if(dest.r > threshold){dest.r = dest.g = dest.b = 255;}
	      else{dest.r = dest.g = dest.b = 0;};
	      
		  var error = sat.r - dest.r;
	      setColor(imagedata, x, y, dest);
	     
	     var ncolor = getColor(imagedata, x+1,y);
		      ncolor.r = ncolor.g = ncolor.b = ncolor.r + 7/16*error;
		      setColor(imagedata, x+1,y, range(ncolor));
		  var ncolor = getColor(imagedata, x-1,y+1);
	    		ncolor.r = ncolor.g = ncolor.b = ncolor.r + 3/16*error;
	      		setColor(imagedata, x-1,y+1, range(ncolor));
	      var ncolor = getColor(imagedata, x,y+1);
		      ncolor.r = ncolor.g = ncolor.b = ncolor.r + 5/16*error;
		      setColor(imagedata, x,y+1, range(ncolor));
	      var ncolor = getColor(imagedata, x+1,y+1);
		      ncolor.r = ncolor.g = ncolor.b = ncolor.r + 1/16*error;
		      setColor(imagedata, x+1,y+1, range(ncolor));
			  
	}
	

	/**
	 * params[0] : bit size value to specify on how many values per channel 
	 *				values per channel = bitsize -> number of colors = bitsize^3
	 */
	function dither(imagedata,x,y,params)
	{	
		var toString = Object.prototype.toString;
		var astr = "[object Array]";
		
		var bitsize = (params && toString.call(params)===astr && params.length>0 && params[0]>1) ? params[0] : 2,
			ratio = 255/(bitsize-1),
	    	color = getColor(imagedata,x,y),
	      	//sat = saturation(color,0),
	      	dest = copyColor(color);
		
		dest.r = Math.round(dest.r/ratio)*ratio;
		dest.g = Math.round(dest.g/ratio)*ratio;
		dest.b = Math.round(dest.b/ratio)*ratio;
	    /* 
		if(sat.r > threshold){dest.r = dest.g = dest.b = 255;}
	      else{dest.r = dest.g = dest.b = 0;};
	    */
		
		var error = {};
		  error.r = color.r - dest.r;
		  error.g = color.g - dest.g;
		  error.b = color.b - dest.b;
		  
	      setColor(imagedata, x, y, dest);
	     
	     var ncolor = getColor(imagedata, x+1,y);
		      ncolor.r =  ncolor.r + 7/16*error.r;
		      ncolor.g =  ncolor.g + 7/16*error.g;
		      ncolor.b =  ncolor.b + 7/16*error.b;
		      setColor(imagedata, x+1,y, range(ncolor));
		ncolor = getColor(imagedata, x-1,y+1);
			  ncolor.r =  ncolor.r + 3/16*error.r;
		      ncolor.g =  ncolor.g + 3/16*error.g;
		      ncolor.b =  ncolor.b + 3/16*error.b;
	      		setColor(imagedata, x-1,y+1, range(ncolor));
	    ncolor = getColor(imagedata, x,y+1);
		      ncolor.r =  ncolor.r + 5/16*error.r;
		      ncolor.g =  ncolor.g + 5/16*error.g;
		      ncolor.b =  ncolor.b + 5/16*error.b;
		      setColor(imagedata, x,y+1, range(ncolor));
	    ncolor = getColor(imagedata, x+1,y+1);
		      ncolor.r =  ncolor.r + 1/16*error.r;
		      ncolor.g =  ncolor.g + 1/16*error.g;
		      ncolor.b =  ncolor.b + 1/16*error.b;
		      setColor(imagedata, x+1,y+1, range(ncolor));
			  
	}
	
	
	DistributionFilter = {
		halftone:halftone,
		dither:dither
	}
	
	//utils
	function copyColor(color){
		return {r:color.r ,g:color.g ,b:color.b, a:color.a};
	}
	//utils
	function getColor(imgdata, x,y){
		var i = y*imgdata.width*4 + x*4;
		var data = imgdata.data;

		var color = {r:0,g:0,b:0,a:0};
		color.r = data[i];
		color.g = data[i+1];
		color.b = data[i+2];
		color.a = data[i+3];

		return color;
	}
	function setColor(imgdata, x,y, color){
		var i = y*imgdata.width*4 + x*4;

		imgdata.data[i] = color.r;
		imgdata.data[i+1] = color.g;
		imgdata.data[i+2] = color.b;
		imgdata.data[i+3] = color.a;
	}
	function range(color){
		if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
		if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
		if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
		if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
		
		return color;
	}
}())