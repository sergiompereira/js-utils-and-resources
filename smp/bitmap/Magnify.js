/**
 * namespace pattern
 * @class FilterMagnify
 * @namespace smp.bitmap
 */

(function(){
	
	smp.namespace("smp.bitmap.FilterMagnify");
	
	//constructor (instance creation)
	smp.bitmap.FilterMagnify = (function()
	{
		
		//private properties
		var Constructor;
			
		var _bitmapData;
	    // center point of the magnification
		var _center = {};
		_center.x = 150;
		_center.y = 100;
		var _innerRadius = 60;
	    var _outerRadius = 80;
	    var _magnification = 3;
	    
	    function _apply(bitmapData, position, innerRadius, outerRadius, magnificationValue){
	    	
	    	
	    	if(bitmapData == null || bitmapData === undefined){
				return;
			}
	    	
	    	_bitmapData = _cloneBitmapData(bitmapData);
	    	
	    	
	    	if(position !== undefined && position != "") _center = position;
	    	if(innerRadius !== undefined && innerRadius != "") _innerRadius = innerRadius;
	    	if(outerRadius !== undefined && outerRadius != "") _outerRadius = outerRadius;
	    	if(magnificationValue !== undefined && magnificationValue != "") _magnification = magnificationValue;
	    	
	    	
	    	var i,j,x,y;
	    	var dest;
	    	var bmpData = _cloneBitmapData(_bitmapData);
			var total = bmpData.data.length;
			for(i = 0; i<total; i+=4){
								
				var colors = {};
				colors.r = bmpData.data[i];
				colors.g = bmpData.data[i+1];
				colors.b = bmpData.data[i+2];
				colors.a = bmpData.data[i+3];
		
				x = (i/4)%bmpData.width;
				y = Math.floor((i/4)/bmpData.width);
				
				/*
				 * 	x' = (i%(bmpData.width * 4)) * bmpData.width
					x = Math.floor(x')
					subindex = (x'%1) * 4 - 1

				 */
				
				dest = _setPixel(x,y);
				//dest = colors;
		
				bmpData.data[i] = dest.r;
				bmpData.data[i+1] = dest.g;
				bmpData.data[i+2] = dest.b;
				bmpData.data[i+3] = dest.a;
				
			}
			
			return bmpData;
		}
	    
	    function _setPixel(x,y){
	    	
	    	var targetPixel = {};
	    	targetPixel.x = 0;
	    	targetPixel.y = 0;
	    	//current x,y position
	    	var coord = {};
	    	coord.x = x;
	    	coord.y = y;
	    	
	    	//vector difference between current position (coord) and lens center (center)
	    	var centerVector = {};
	    	centerVector.x = coord.x - _center.x;
	    	centerVector.y = coord.y - _center.y;
	    	//length or absolute value of centerVector
	    	var distance = Math.sqrt(Math.pow(centerVector.x,2)+Math.pow(centerVector.y,2));
	    	var maxMagnification = {};
	    	maxMagnification.x = 0;
	    	maxMagnification.y = 0;
	    	var ratio = 0;
	    	var trigRatio = 0;
	    	
	    	if( distance < _outerRadius ) // we're inside the affected area
	    	{
	    		maxMagnification.x = _center.x + (centerVector.x / _magnification);
	    		maxMagnification.y = _center.y + (centerVector.y / _magnification);
	    		
	    		if( distance < _innerRadius ) // we're in the innermost region
	    		{
	              // do a simple magnification
	              targetPixel = maxMagnification;
	    		}
	    		else // we're in between the inner and outer radius
	    		{
	              // interpolate the magnification amount along a cosine curve between the two radii
	              ratio = (distance - _innerRadius) / (_outerRadius - _innerRadius); // gives a value between 0 and 1
	              trigRatio = (Math.cos(ratio * Math.PI) + 1.0) / 2.0;
	              targetPixel.x = maxMagnification.x * (trigRatio) + coord.x * (1.0 - trigRatio);
	              targetPixel.y = maxMagnification.y * (trigRatio) + coord.y * (1.0 - trigRatio);
	              
	    		}
	    		
	    		return _interpolateColorAt(targetPixel);
	    		
	    	}else 
	    	if( Math.abs(distance - _outerRadius)<1 ){// we're on the border
	    		 targetPixel.x = -1;
		         targetPixel.y = -1;
		         
		         return _drawBorderAt(targetPixel);
		         
	    	}else // we're ouside of the affected area
	        {
	            // don't change this pixel
	            targetPixel.x = coord.x;
	            targetPixel.y = coord.y;
	            
	            return _getColorAt(targetPixel);
	        }
	     
	    	
	    	//return sampleLinear(inputImage, targetPixel);
	    	return null;
	    }
	    
	    
	    function _drawBorderAt(position){
	    	var nColor = {};
	    	nColor.r = nColor.g = nColor.b = 0;
    		nColor.a = 255;
    		return nColor;
	    }
	    
	    function _getColorAt(position){
	    	var nColor = {};
	    	var index = position.y*_bitmapData.width*4+ position.x*4;
			nColor.r = _bitmapData.data[index];
	    	nColor.g = _bitmapData.data[index+1];
	    	nColor.b = _bitmapData.data[index+2];
	    	nColor.a = _bitmapData.data[index+3];
    		return nColor;
	    }
	    
	    function _interpolateColorAt(position)
	    {
	    	var nColor = {};
    		
    		//visualização dos pixéis não interpolados
    		/*
    		if(Math.round(position.x) == position.x && Math.round(position.y) == position.y){
    			var index = position.y*_bitmapData.width*4+ position.x*4;
    			nColor.r = _bitmapData.data[index];
		    	nColor.g = _bitmapData.data[index+1];
		    	nColor.b = _bitmapData.data[index+2];
		    	nColor.a = _bitmapData.data[index+3];
    		}else{
    			nColor.r = 255;
		    	nColor.g = 255;
		    	nColor.b = 255;
		    	nColor.a = 255;
    		}
    		*/
    		
	    	//bilinear interpolation:
			//http://en.wikipedia.org/wiki/Bilinear_interpolation
	    	//linear interpolation
	    	//f[x] = f[x0](x1 - x)/(x1 - x0) + f[x1](x - x0)/(x1 - x0);
	    	
	    	var posA;
	    	var posB;
	    	var distPBP = {};
	    	var distPAPB = {};
	    	var distPPA = {};
	    	var distPBPA = {};
	    	var ratio1X;
	    	var ratio2X;
	    	var ratio1Y;
	    	var ratio2Y;
	    	
	    	function computeKnownPoints(){
		    	//determinação de dois pontos conhecidos
		    	posA = {};
	    		posA.x = Math.floor(position.x);
	    		posA.y = Math.floor(position.y);
	    		posB = {};
	    		posB.x = Math.ceil(position.x);
	    		posB.y = Math.ceil(position.y);
	    	}
	    	function computeDistancesOnX(){
	    		//determinação de distâncias entre esses pontos
	    		distPBP.x = posB.x - position.x;
	    		distPAPB.x = posA.x - posB.x;
	    		distPPA.x = position.x - posA.x;
	    		distPBPA.x = -distPAPB.x;
	    	}
	    	function computeDistancesOnY(){
	    		//determinação de distâncias entre esses pontos
	    		distPBP.y = posB.y - position.y;
	    		distPAPB.y = posA.y - posB.y;
	    		distPPA.y = position.y - posA.y;
	    		distPBPA.y = -distPAPB.y;
	    	}
	    	
	    	//determinação dos ratios conforme a equação linear em cima (linear em X e linear em Y)
	    	function computeRatiosOnX(){
	    		
	    		ratio1X = distPBP.x/distPBPA.x;
	    		ratio2X = distPPA.x/distPBPA.x;
    		
	    	}
	    	function computeRatiosOnY(){
	    		ratio1Y = distPBP.y/distPBPA.y;
	    		ratio2Y = distPPA.y/distPBPA.y;
	    	}
    		
	    	//se a posição não for fraccionária, o valor é conhecido e a correspondência é directa
    		if(Math.round(position.x) == position.x && Math.round(position.y) == position.y){
    			
    			var index = position.y*_bitmapData.width*4+ position.x*4;
    			nColor.r = _bitmapData.data[index];
		    	nColor.g = _bitmapData.data[index+1];
		    	nColor.b = _bitmapData.data[index+2];
		    	nColor.a = _bitmapData.data[index+3];
		    	
		    //se uma das dimensões for fraccionária, é só necessária a interpolação linear numa direcção
		    //x é inteiro, interpolação em y
    		}else if(Math.round(position.x) == position.x){
    			
    			computeKnownPoints();
    			computeDistancesOnY();
    			computeRatiosOnY();
    			
    			var indexA = Math.floor(position.y)*_bitmapData.width*4+ position.x*4;
    			var indexB = Math.ceil(position.y)*_bitmapData.width*4+ position.x*4;
    			var nColorY1 = {};
	    		var nColorY2 = {};
	    		nColorY1.r = _bitmapData.data[indexA];
	    		nColorY1.g = _bitmapData.data[indexA+1];
	    		nColorY1.b = _bitmapData.data[indexA+2];
	    		nColorY1.a = _bitmapData.data[indexA+3];
		    	
	    		nColorY2.r = _bitmapData.data[indexB];
	    		nColorY2.g = _bitmapData.data[indexB+1];
	    		nColorY2.b = _bitmapData.data[indexB+2];
	    		nColorY2.a = _bitmapData.data[indexB+3];
	    		
	    		nColor.r = nColorY1.r*ratio1Y + nColorY2.r*ratio2Y;
	    		nColor.g = nColorY1.g*ratio1Y + nColorY2.g*ratio2Y;
	    		nColor.b = nColorY1.b*ratio1Y + nColorY2.b*ratio2Y;
	    		nColor.a = nColorY1.a*ratio1Y + nColorY2.a*ratio2Y;
		    	
	    	//y é inteiro, interpolação em x
    		}else if(Math.round(position.y) == position.y){
    			
    			computeKnownPoints();
    			computeDistancesOnX();
    			computeRatiosOnX();
    			
    			var indexA = position.y*_bitmapData.width*4+ Math.floor(position.x)*4;
    			var indexB = position.y*_bitmapData.width*4+ Math.ceil(position.x)*4;
    			var nColorX1 = {};
	    		var nColorX2 = {};
	    		nColorX1.r = _bitmapData.data[indexA];
	    		nColorX1.g = _bitmapData.data[indexA+1];
	    		nColorX1.b = _bitmapData.data[indexA+2];
	    		nColorX1.a = _bitmapData.data[indexA+3];
		    	
	    		nColorX2.r = _bitmapData.data[indexB];
	    		nColorX2.g = _bitmapData.data[indexB+1];
	    		nColorX2.b = _bitmapData.data[indexB+2];
	    		nColorX2.a = _bitmapData.data[indexB+3];
	    		
	    		nColor.r = nColorX1.r*ratio1X + nColorX2.r*ratio2X;
	    		nColor.g = nColorX1.g*ratio1X + nColorX2.g*ratio2X;
	    		nColor.b = nColorX1.b*ratio1X + nColorX2.b*ratio2X;
	    		nColor.a = nColorX1.a*ratio1X + nColorX2.a*ratio2X;
	    	
	    	//se ambas forem fraccionárias, é necessário calcular a interpolação numa das direcções
	    	//e usar o valor resultante na interpolação da segunda
    		}else{
    			
    			computeKnownPoints();
    			computeDistancesOnX();
    			computeRatiosOnX();
    			computeDistancesOnY();
    			computeRatiosOnY();
    			
    			//determinar os quatro cantos
		    	var indexQ11 = Math.floor(position.y)*_bitmapData.width*4+ Math.floor(position.x)*4;
		    	var indexQ12 = Math.ceil(position.y)*_bitmapData.width*4+ Math.floor(position.x)*4;
		    	var indexQ21 = Math.floor(position.y)*_bitmapData.width*4+ Math.ceil(position.x)*4;
		    	var indexQ22 = Math.ceil(position.y)*_bitmapData.width*4+ Math.ceil(position.x)*4;
		    	
		    	var nColorX1 = {};
	    		var nColorX2 = {};
	    		
		    	var nColorQ11 = {};
	    		var nColorQ12 = {};
	    		var nColorQ21 = {};
	    		var nColorQ22 = {};
	    		
	    		nColorQ11.r = _bitmapData.data[indexQ11];
	    		nColorQ11.g = _bitmapData.data[indexQ11+1];
	    		nColorQ11.b = _bitmapData.data[indexQ11+2];
	    		nColorQ11.a = _bitmapData.data[indexQ11+3];
		    	
	    		nColorQ12.r = _bitmapData.data[indexQ12];
	    		nColorQ12.g = _bitmapData.data[indexQ12+1];
	    		nColorQ12.b = _bitmapData.data[indexQ12+2];
	    		nColorQ12.a = _bitmapData.data[indexQ12+3];
	    		
	    		nColorQ21.r = _bitmapData.data[indexQ21];
	    		nColorQ21.g = _bitmapData.data[indexQ21+1];
	    		nColorQ21.b = _bitmapData.data[indexQ21+2];
	    		nColorQ21.a = _bitmapData.data[indexQ21+3];
	    		
	    		nColorQ22.r = _bitmapData.data[indexQ22];
	    		nColorQ22.g = _bitmapData.data[indexQ22+1];
	    		nColorQ22.b = _bitmapData.data[indexQ22+2];
	    		nColorQ22.a = _bitmapData.data[indexQ22+3];
		    	
	    		//interpolação em X (dois valores extremos)
	    		nColorX1.r = nColorQ11.r*ratio1X + nColorQ21.r*ratio2X;
	    		nColorX1.g = nColorQ11.g*ratio1X + nColorQ21.g*ratio2X;
	    		nColorX1.b = nColorQ11.b*ratio1X + nColorQ21.b*ratio2X;
	    		nColorX1.a = nColorQ11.a*ratio1X + nColorQ21.a*ratio2X;
	    		
	    		nColorX2.r = nColorQ12.r*ratio1X + nColorQ22.r*ratio2X;
	    		nColorX2.g = nColorQ12.g*ratio1X + nColorQ22.g*ratio2X;
	    		nColorX2.b = nColorQ12.b*ratio1X + nColorQ22.b*ratio2X;
	    		nColorX2.a = nColorQ12.a*ratio1X + nColorQ22.a*ratio2X;
	    		
	    		//interpolação em Y
	    		nColor.r = nColorX1.r*ratio1Y + nColorX2.r*ratio2Y;
	    		nColor.g = nColorX1.g*ratio1Y + nColorX2.g*ratio2Y;
	    		nColor.b = nColorX1.b*ratio1Y + nColorX2.b*ratio2Y;
	    		nColor.a = nColorX1.a*ratio1Y + nColorX2.a*ratio2Y;
	    		
	    		
	    	}
	    	
	    	//return index;
	    	return nColor;
	    }
	    
	    function sampleLinear(position){
	    
	    	var nColor = {};
	    	nColor.y = y0(x - x1)/(x0 - x1) + y1(x - x0)/(x1 - x0);
	    	//ou ?
	    	nColor.y = y0(x1 - x)/(x1 - x0) + y1(x - x0)/(x1 - x0);
	    	
	    	return nColor;
	    }
	    
	    //internal utils
	    function _createBitmapData(w,h){
			var tCanvas = document.createElement("canvas");
			return tCanvas.getContext("2d").createImageData(w,h);
		}
		
		function _cloneBitmapData(bmpData){
			var i;
			var total = bmpData.data.length;
			var tempBmpData = _context.createImageData(bmpData.width, bmpData.height);
			for(i = 0; i<total; i++){
				tempBmpData.data[i] = bmpData.data[i];
			}
			tempBmpData.width = bmpData.width;
			tempBmpData.height = bmpData.height;
			return tempBmpData;
		}
	    
	    
	    Constructor = function()
		{
	    	
	    	
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)
			version:"1.0",
				
			//public methods
			apply:_apply
			
		};
		
		return Constructor;
		
	}());

}());	

