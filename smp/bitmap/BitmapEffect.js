(function(){
	
	smp.createNamespace("smp.bitmap.BitmapEffect");
	
	smp.bitmap.BitmapEffect = (function()
	{
		//private properties
		var Constructor;
		//dependencies
		var Geometry2D = smp.math.Geometry2D;
		var BitmapDataUtility = smp.bitmap.BitmapDataUtility;
		
		Constructor = function(effectname)
		{
			
			var _bitmapDataUtil = new BitmapDataUtility();	
			var _auxBitmapDataUtil = new BitmapDataUtility();
			
			var _effectName = effectname;
			var _effectType = "";
			var _effectPointFnc, _effectAreaFnc;
			
			
			switch(_effectName){
				
				case "stretch":
					_effectType = "area";
					_effectAreaFnc = _stretch;
					break;
				case "magnify":
					_effectType = "area";
					_effectAreaFnc = _magnify;
					break;
				default:
					throw new Error("BitmapEffect->constructor: No effect name specified.");
			}
				
			/**
			 * @param[0] : bitmap data ImageData
			 * @param[1] : empty bitmap data ImageData
			 * @param... : filter params
			 */
			function _applyToData(){				
				return  _effectAreaFnc.apply(this, arguments);
			}
			
			function _applyToPoint(){
				if(_effectType == "point"){
					return _effectPointFnc.apply(this, arguments);
				}else{
					throw new Error("BitmapEffect->applyToPoint: Effect is of type 'area'. Applying on a point basis will render unconsistent results.")
				}
			}
			function _name(){
				return _effectName;
			}
			function _type(){
				return _effectType;
			}
			
			
			this.applyToData = _applyToData;
			this.applyToPoint = _applyToPoint;
			this.name = _name;
			this.type = _type;
			this.bitmapDataUtil = _bitmapDataUtil;
			this.auxBitmapDataUtil = _auxBitmapDataUtil;
			
			
			
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
		
		function _stretch(originalImageData, newData, origin, dest, displacementCoeff, radialCoeff){
		
			
			var i;
			var total = originalImageData.data.length;
			var self = this;
			self.auxBitmapDataUtil.setBitmapData(newData);
			self.bitmapDataUtil.setBitmapData(originalImageData);
			
			// displacement: the vector between the original position and the new position (destination)
            var displacement = {x:dest.x - origin.x, y:dest.y - origin.y};
			// correctedDisplacement decreases in proportion to displacement increase (f(x) = 1/(1+x/a))
            //      and equals to displacement value when this reaches 0 (the origin is never actually moved to destination, but is somewhere along the way)
            //      Consider this as a sort of friction...
            var  correctedDisplacement = {x:0,y:0};
            correctedDisplacement.x = (displacement.x / (1.0 + Math.abs(displacement.x) / displacementCoeff));
            correctedDisplacement.y = (displacement.y / (1.0 + Math.abs(displacement.y) / displacementCoeff));
           
			self.bitmapDataUtil.setBitmapData(originalImageData);
			
			/*for(i = 0; i<20; i+=4){
				_setColor(newData,i,_stretchPoint(bitmapDataUtil.indexToPoint(i)));	
			}*/
			
			var x,y,w = originalImageData.width,h = originalImageData.height;
			for(y = 0; y<h; y++){
				for(x = 0; x<w; x++){
					self.auxBitmapDataUtil.setColor(self.bitmapDataUtil.pointToIndex(x,y),_stretchPoint({x:x,y:y}));	
				}
			}
			return newData;
			
			function _stretchPoint(point){
				
	            // distance: the distance (vector length) between the current pixel and the origin
	            var distance = Geometry2D.distance(origin.x,origin.y,point.x,point.y);
	        
	            // the correctedDisplacement is further changed by a factor that decreases in proportion to distance increase
	            //      If the current pixel is over the origin (distance equals 0) than no change occurs.
	            var relativeDisplacement = (1.0 + distance / radialCoeff);
	            
	            var pos = {x:point.x - correctedDisplacement.x / relativeDisplacement, y:point.y - correctedDisplacement.y / relativeDisplacement};

	            return self.bitmapDataUtil.bilinearInterpolation(pos);
			}
			
			
		}
		
		function _magnify(originalImageData, newData, position, innerRadius, outerRadius, magnificationValue,interpolationType){
	    		
					
			var self = this,
				_innerRadius = 60,
		     	_outerRadius = 80,
		     	_magnification = 3,
				_interpolationFnc,
		     	_center = {},
		     	dest,
		     	total = originalImageData.data.length,
				i,j,x,y;

			(interpolationType == "bicubic") ? _interpolationFnc = self.bitmapDataUtil.bicubicInterpolation : _interpolationFnc = self.bitmapDataUtil.bilinearInterpolation;


			_center.x = 150;
			_center.y = 100;
			
			self.auxBitmapDataUtil.setBitmapData(newData);
			self.bitmapDataUtil.setBitmapData(originalImageData);
	    	
	    	if(position !== undefined && position != "") _center = position;
	    	if(innerRadius !== undefined && innerRadius != "") _innerRadius = innerRadius;
	    	if(outerRadius !== undefined && outerRadius != "") _outerRadius = outerRadius;
	    	if(magnificationValue !== undefined && magnificationValue != "") _magnification = magnificationValue;
	    	
			for(i = 0; i<total; i+=4){
								
				self.auxBitmapDataUtil.setColor(i, getNewColor(self.bitmapDataUtil.indexToPoint(i)));
				
			}
			
			
			return newData;
			
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
		            
		            return self.bitmapDataUtil.getColorAt(targetPixel.x,targetPixel.y);
		        }
		     
		    	
		    	return null;
			}
			
			
		}
		
		
		 
		    
		
		/**  utils */
		
		function _range(color){
			if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
			if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
			if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
			if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
			
			return color;
		}
		
		
		return Constructor;
		
	}());
	
	
}());


