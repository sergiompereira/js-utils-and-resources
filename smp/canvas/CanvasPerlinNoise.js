
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.geom
 */

(function(){
	
	smp.namespace("smp.canvas.CanvasPerlinNoise");
	
	smp.canvas.CanvasPerlinNoise = (function()
	{
		//private properties
		var Constructor;
		//keep a reference to the static object
		var perlinNoise = smp.canvas.PerlinNoise;
		var canvasBmpData = new smp.canvas.CanvasBitmapData();
		//private methods
		
		//private
		/**
		 * originalImageData	:
		 * noctaves				:
		 * persistence			: 0 - 1
		 * smoothed				:
		 * R					: bool - channel red
		 * G					: bool - channel green
		 * B					: bool - channel blue
		 * A					: bool - channel alpha
		 */
		function _applyNoise(originalImageData,noctaves,persistence,smoothed,R,G,B,A){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = originalImageData.data[i];
				colors.g = originalImageData.data[i+1];
				colors.b = originalImageData.data[i+2];
				colors.a = originalImageData.data[i+3];
			
				var dest = {};
				
				var point = canvasBmpData.getPointAtIndex(i,originalImageData);
				
				var noise = perlinNoise.get2D(point.x,point.y,noctaves,persistence,smoothed);
				//or use the 1 Dimensional noise
				//var noise = perlinNoise.get(i/4,noctaves,persistence,smoothed);
				
				noise = Math.round((noise*128)+128);//Convert to 0-256 values.
				//console.log(noise)
				if(noise>255)
					noise=255;
				if(noise<0)
					noise=0;
				
				dest.r = colors.r;
				dest.g = colors.g;
				dest.b = colors.b;
				dest.a = 255;
	
				if(R)  dest.r = noise; 
				if(G)  dest.g = noise ;
				if(B)  dest.b = noise ;
				if(A)  dest.a = noise ; 
				
				
				
				//grayscale
				//dest.r = dest.g = dest.b = (colors.r+colors.g+colors.b)/3.0;
				
		
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
		}
		
		
		function _createEmptyImageData(w,h){
			var tCanvas = document.createElement("canvas");
			return tCanvas.getContext("2d").createImageData(w,h);
		}
		
		//
		
		Constructor = function()
		{
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
			apply:_applyNoise
			
		};
		
		return Constructor;
		
	}());
	
	
	
}());


