
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.geom
 */

(function(){
	
	smp.createNamespace("smp.canvas.CanvasFilters");
	smp.canvas.CanvasFilters = (function()
	{
		//private properties
		var Constructor;
		
		var tCanvas = document.createElement("canvas");
		var tContext;
		
		if(!!tCanvas.getContext){
			tContext = tCanvas.getContext("2d");
		}else{
			smp.log('CanvasFilters -> O browser não suporta canvas.');
			return;
		}
		//private shared methods
		
		function _saturate(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var saturation = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				_setColor(newImageData,i,_saturateFunction(_copyColor(originalImageData,i), saturation));
				
			}
			return newImageData;
		}
		
		function _brighten(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var brightness = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				_setColor(newImageData,i,_brightenFunction(_copyColor(originalImageData,i), brightness));
				
			}
			return newImageData;
		}
		
		function _contrast(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var contrast = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				_setColor(newImageData,i,_contrastFunction(_copyColor(originalImageData,i), contrast));
				
			}
			return newImageData;
		}
		
		function _convolute(originalImageData, matrix ){
			
			//matrix should have a even number of items and their square root should be an integer
			var side = Math.sqrt(matrix.length);
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var i,total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				_setColor(newImageData,i,_computeMatrix(_copyColor(originalImageData,i),i));
				
			}
			
			function _computeMatrix(color,i){
				
			}
			
			return newImageData;
			
		}
		
		function _getFilter(value){
			switch(value){
				case smp.canvas.CanvasFilters.SATURATION:
					return _saturateFunction;
					break;
				case smp.canvas.CanvasFilters.BRIGHTNESS:
					return _brightenFunction;
					break;
				case smp.canvas.CanvasFilters.CONTRAST:
					return _contrastFunction;
					break;
				default:
					return null;
					break;
			}
		}
		
		function _saturateFunction(obj, saturation)
		{

			//grayscale
			//dest.r = dest.g = dest.b = (colors.r+colors.g+colors.b)/3.0;
			//or:
			//dest.r = dest.g = dest.b =  = 0.2126*r + 0.7152*g + 0.0722*b;
			
			var rlum = 0.3;
			var glum = 0.59;
			var blum = 0.11;
		
			var dest = {};
			
			dest.r = ((rlum + (1.0 - rlum) * saturation) * obj.r) + ((glum + -glum * saturation) * obj.g) + ((blum + -blum * saturation) * obj.b);
			dest.g = ((rlum + -rlum * saturation) * obj.r) + ((glum + (1.0 - glum) * saturation) * obj.g) + ((blum + -blum * saturation) * obj.b);
			dest.b = ((rlum + -rlum * saturation) * obj.r) + ((glum + -glum * saturation) * obj.g) + ((blum + (1.0 - blum) * saturation) * obj.b);
			dest.a = obj.a;
			
			return dest;
		}
		
		function _brightenFunction(obj, brightness)
		{
			var dest = {};
			
			dest.r = obj.r * brightness;
			dest.g = obj.g * brightness;
			dest.b = obj.b * brightness;
			dest.a = obj.a;
			
			return dest;
		}

		function _contrastFunction(obj, contrast)
		{
			var dest = {};
			
			dest.r = ((obj.r - 125)*contrast)+ 125;
			dest.g = ((obj.g - 125)*contrast)+ 125;
			dest.b = ((obj.b - 125)*contrast)+ 125;
			dest.a = obj.a;
			
			return dest;
		}
	
		
		//utils
		function _copyColor(bmpData,index){
			var color = {};
			
			color.r = bmpData.data[index];
			color.g = bmpData.data[index+1];
			color.b = bmpData.data[index+2];
			color.a = bmpData.data[index+3];
			
			return color;
		}
		
		function _setColor(bmpData,index,color){
			bmpData.data[index] = color.r;
			bmpData.data[index+1] = color.g;
			bmpData.data[index+2] = color.b;
			bmpData.data[index+3] = color.a;
		}
		
		function _createEmptyImageData(w,h){
			return tContext.createImageData(w,h);
		}
		
		//
		
		Constructor = function()
		{
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
			saturate:_saturate,
			brighten:_brighten,
			contrast:_contrast,
			getFilter:_getFilter
			
		};
		
		return Constructor;
		
	}());
	
	smp.canvas.CanvasFilters.SATURATION = "saturation";
	smp.canvas.CanvasFilters.BRIGHTNESS = "brightness";
	smp.canvas.CanvasFilters.CONTRAST = "contrast";
	
	
}());


