(function(){
	
	
	BitmapEffect = (function()
	{
		//private properties
		var Constructor;
		//dependencies
		var Geometry2D = smp.math.Geometry2D;
		var BitmapData = smp.canvas.BitmapData;
		
		Constructor = function(effectname)
		{
			
			var _bitmapData = new BitmapData(),	
				_auxBitmapData = new BitmapData(),
				_effectName = effectname,
				_effectType = "",
				_effectFnc;
			
			switch(_effectName){
				
				case "stretch":
					_effectType = "area";
					_effectFnc = _stretch;
					break;
				case "magnify":
					_effectType = "area";
					_effectFnc = _magnify;
					break;
				case "ripple":
					_effectType = "area";
					_effectFnc = _ripple;
					break;
				case "displace":
					_effectType = "area";
					_effectFnc = _displace;
					break;
				default:
					throw new Error("BitmapEffect->constructor: No effect name specified.");
					return false;
			}
				
			/**
			 * @param[0] : bitmap data ImageData
			 * @param[1] : empty bitmap data ImageData
			 * @param... : filter params
			 */
			function _process(){				
				return  _effectFnc.apply(this, arguments);
			}
			
			
			function _name(){
				return _effectName;
			}
			function _type(){
				return _effectType;
			}
			
			
			this.process = _process;
			this.name = _name;
			this.type = _type;
			this.bitmapData = _bitmapData;
			this.auxBitmapData = _auxBitmapData;
			
			
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
		
		};
		
		
		//private shared methods
		/** effects methods */
		
		
		/**
		 * displacementCoeff: 1 - ...20... - 200
		 * radialCoeff: 1 - ...50... - 200
		 */
		
		function _stretch(originalImageData, origin, dest, displacementCoeff, radialCoeff){
		
			
			var i,
				total = originalImageData.data.length,
				self = this;
				
			if(!displacementCoeff) displacementCoeff = 20;
			if(!radialCoeff) radialCoeff = 50;
			
			self.auxBitmapData.setEmptyData(originalImageData.width, originalImageData.height);
			self.bitmapData.setData(originalImageData);
			
			// displacement: the vector between the original position and the new position (destination)
            var displacement = {x:dest.x - origin.x, y:dest.y - origin.y};
			// correctedDisplacement decreases in proportion to displacement increase (f(x) = 1/(1+x/a))
            //      and equals to displacement value when this reaches 0 (the origin is never actually moved to destination, but is somewhere along the way)
            //      Consider this as a sort of friction...
            var  correctedDisplacement = {x:0,y:0};
            correctedDisplacement.x = (displacement.x / (1.0 + Math.abs(displacement.x) / displacementCoeff));
            correctedDisplacement.y = (displacement.y / (1.0 + Math.abs(displacement.y) / displacementCoeff));
           
			
			var x,y,w = originalImageData.width,h = originalImageData.height;
			for(y = 0; y<h; y++){
				for(x = 0; x<w; x++){
					self.auxBitmapData.setColor(self.bitmapData.pointToIndex(x,y),_stretchPoint({x:x,y:y}));	
				}
			}
			return self.auxBitmapData.getData();
			
			function _stretchPoint(point){
				
	            // distance: the distance (vector length) between the current pixel and the origin
	            var distance = Geometry2D.distance(origin.x,origin.y,point.x,point.y);
	        
	            // the correctedDisplacement is further changed by a factor that decreases in proportion to distance increase
	            //      If the current pixel is over the origin (distance equals 0) than no change occurs.
	            var relativeDisplacement = (1.0 + distance / radialCoeff);
	            
	            var pos = {x:point.x - correctedDisplacement.x / relativeDisplacement, y:point.y - correctedDisplacement.y / relativeDisplacement};

	            return self.bitmapData.bilinearInterpolation(pos);
			}
			
			
		}
		
		function _magnify(originalImageData, position, innerRadius, outerRadius, magnificationValue,interpolationType){
	    		
					
			var self = this,
				_innerRadius = 60,
		     	_outerRadius = 80,
		     	_magnification = 3,
				_interpolationFnc,
		     	_center = {},
		     	dest,
		     	total = originalImageData.data.length,
				i,j,x,y;

			(interpolationType == "bicubic") ? _interpolationFnc = self.bitmapData.bicubicInterpolation : _interpolationFnc = self.bitmapData.bilinearInterpolation;


			_center.x = 150;
			_center.y = 100;

			self.auxBitmapData.setEmptyData(originalImageData.width, originalImageData.height);
			self.bitmapData.setData(originalImageData);
	    	
	    	if(position  && position != "") _center = position;
	    	if(innerRadius  && innerRadius != "") _innerRadius = innerRadius;
	    	if(outerRadius  && outerRadius != "") _outerRadius = outerRadius;
	    	if(magnificationValue  && magnificationValue != "") _magnification = magnificationValue;
	    	
			for(i = 0; i<total; i+=4){
								
				self.auxBitmapData.setColor(i, getNewColor(self.bitmapData.indexToPoint(i)));
				
			}
			
			
			return self.auxBitmapData.getData();
			
			function getNewColor(point){
				
				var x = point.x, y = point.y;
				
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
		    		
		    		return _interpolationFnc(targetPixel);
		    		
		    		
		    		
		    	}else // we're ouside of the affected area
		        {
		            // don't change this pixel
		            targetPixel.x = coord.x;
		            targetPixel.y = coord.y;
		            
		            return self.bitmapData.getColorAt(targetPixel.x,targetPixel.y);
		        }
		     
		    	
		    	return null;
			}
			
			
		}
		
		
		function _ripple(originalImageData, center, displacement, size, rippleWidth, phase, lightDirection, lightBright){
			
			self = this;
			
			if(!center) center = {x:320, y:240};
			if(displacement == null || displacement === "undefined"){
				displacement = 6;
			}else if(displacement == 0){
				return originalImageData;
			}
			if(!size) size = 256;
			if(!rippleWidth) rippleWidth = 32;
			if(!phase) phase = 0;
			if(!lightDirection) lightDirection = {x:0.7, y:0.7};
			if(!lightBright) lightBright = 0.3;
			
			self.auxBitmapData.setEmptyData(originalImageData.width, originalImageData.height);
			self.bitmapData.setData(originalImageData);
			
			var x,y,w = originalImageData.width,h = originalImageData.height;
			for(y = center.y-size; y<center.y+size; y++){
				for(x = center.x-size; x<center.x+size; x++){
					self.auxBitmapData.setColorAt(x,y,evaluatePixel({x:x,y:y}));	
				}
			}
			return self.auxBitmapData.getData();
			
			function evaluatePixel(point){
				
				var offset = {x:point.x - center.x, y:point.y-center.y};

				// distance from center
				var r = distance(0,0,offset.x,offset.y);
				var originColor = self.bitmapData.getColorAt(point.x, point.y);

				if (r < size && r>0) {
					// disp = # pixels to displace, ang = displace direction
					
					var disp = (1.0 - r/size) * displacement * Math.sin(-phase + r/(rippleWidth/6.28));
					var ang = Math.atan2(offset.x,offset.y);
					// brightness of pixel is based on displacement and angle between
					// displacement and lightdir
					var bright = 1.0 + (lightBright*disp/displacement * (offset.x*lightDirection.x/r + offset.y*lightDirection.y/r) );
					
					var interpol = self.bitmapData.bilinearInterpolation({x:point.x+disp*Math.sin(ang), y:point.y+disp*Math.cos(ang)});
					return {r:interpol.r*bright,
							g:interpol.g*bright,
							b:interpol.b*bright,
							a:interpol.a*bright
						};
				} else {
					return originColor;
				}
			}
		}
		    
		
		function _displace(originalImageData, map, displacement, angle, lightDirection, lightBright){
			self = this;
			
			self.auxBitmapData.setEmptyData(originalImageData.width, originalImageData.height);
			self.bitmapData.setData(originalImageData);
			var mapdata = new smp.canvas.BitmapData(map);
			var sobelMatrix = [-2, -1, 0,
							   -1,  0, 1,
							   	0,  1, 2];
			var side = Math.sqrt(sobelMatrix.length),
				centeroffset = (side-1)/2,
				matrixlen = sobelMatrix.length,
				imgw = map.width,
				imgh = map.height,
				sum = 0;
				
			//obter o valor da soma de todos os elementos da matriz
				for(i=0;i<sobelMatrix.length;i++){
					sum+=sobelMatrix[i];
				}
				//avoid division by zero
				if(sum == 0) sum = 1;;
			
			var x,y,w = originalImageData.width,h = originalImageData.height;
			for(y = 0; y<h; y++){
				for(x = 0; x<w; x++){
					self.auxBitmapData.setColorAt(x,y,evaluatePixel({x:x,y:y}));	
				}
			}
			return self.auxBitmapData.getData();
			
			function evaluatePixel(point){
		
				var originColor = self.bitmapData.getColorAt(point.x, point.y);
				
				var slope = convolute(mapdata,x,y,sobelMatrix,1,0).g;
				
				var value = mapdata.getColorAt(x,y).g;
				if (value > 0) {
					// disp = # pixels to displace, ang = displace direction
					
					var disp = (value/255) * displacement;
					// brightness of pixel is based on displacement and angle between
					// displacement and lightdir
					//var bright = 1.0 + (lightBright*disp/displacement * (offset.x*lightDirection.x/r + offset.y*lightDirection.y/r) );
					var bright = 1 + slope/255 * lightBright;
					//var bright = 1;
					var interpol = self.bitmapData.bilinearInterpolation({x:point.x+disp*Math.sin(angle), y:point.y+disp*Math.cos(angle)});
					return range({r:interpol.r*bright,
							g:interpol.g*bright,
							b:interpol.b*bright,
							a:interpol.a
						});
				} else {
					return originColor;
				}
				
			}
			
			function convolute(bmpdata,imgx,imgy,matrix,factor,bias){
				
				var k,m,nimgx,nimgy,color,value,psum = {r:0,g:0,b:0,a:255};
				for(k=0; k<side; k++){
					for(m=0;m<side;m++){
						value = matrix[m*side+k];
						nimgx = imgx - centeroffset+k;
						nimgy = imgy - centeroffset+m;
						
						if(nimgx<0) nimgx*=-1;
						if(nimgy<0) nimgy*=-1;
						if(nimgx>imgw-1) nimgx -= (nimgx - (imgw-1));
						if(nimgy>imgh-1) nimgy -= (nimgy - (imgh-1));
						
						color = bmpdata.getColorAt(nimgx,nimgy);
		
						psum.r+=(color.r*value);
						psum.g+=(color.g*value);
						psum.b+=(color.b*value);					
					}
				}
				
				psum.r = Math.floor((psum.r/sum)*factor + bias);
				psum.g = Math.floor((psum.g/sum)*factor + bias);
				psum.b = Math.floor((psum.b/sum)*factor + bias);
		
				psum = range(psum);
				return psum;
					
			}
		}
		
		
		/**  utils */
		
		function range(color){
			if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
			if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
			if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
			if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
			
			return color;
		}
		
		function distance(x1,y1,x2,y2){
			var dx = x1 - x2;
			var dy = y1 - y2;
			return Math.sqrt(dx*dx+dy*dy);
		}
		function isInsideEllipse(x,y,a,b){
			return x*x/(a*a) + y*y/(b*b) < 1;
		}
		
		
		return Constructor;
		
	}());
	
	
}());


