(function(){
	
	smp.createNamespace("smp.canvas.CanvasImage");
	
	//dependencies
	var MathUtils = smp.math.MathUtils;
	
	smp.canvas.CanvasImage = (function()
	{
		//private shared properties
		var Constructor;
		var auxCanvas = document.createElement("canvas");
		var auxContext;
		if(!!auxCanvas.getContext){
			auxContext = auxCanvas.getContext("2d");
		}else{
			smp.log("CanvasImage -> The browser doesn't support canvas.");
			return;
		}
		
		
		
		/** utils */
		//private shared methods
		function _createCanvas(w,h){
			var tCanvas = document.createElement("canvas");
			tCanvas.setAttribute("width", w);
			tCanvas.setAttribute("height", h);
			return tCanvas;
		}
		
		function _createImageData(w,h){
			return auxContext.createImageData(w,h);
		}
		
		function _cloneImageData(imgData){
			auxContext.putImageData(imgData, 0, 0);
			return auxContext.getImageData(0, 0, imgData.width, imgData.height)
		}
	
		
		/**
		 * @param {canvas element reference} canvas (optional)
		 * @param {Number} w (optional)
		 * @param {Number} h (optional)
		 */
		
		Constructor = function(canvas, w, h)
		{
			var _canvas,
				_context,
				_originalImageData,
				_imageData,
				_imageWidth,
				_imageHeight;				
				
			if(canvas && canvas !== "undefined"){
				_canvas = canvas;
			}else if(w && h){
				_canvas = _createCanvas(w,h);
			}
			if(_canvas){
				_imageWidth = _canvas.width;
				_imageHeight = _canvas.height;
				_context = _canvas.getContext("2d");
				_originalImageData = _context.getImageData(0,0,_canvas.width, _canvas.height);
				_imageData = _cloneImageData(_originalImageData);
			
			}

	
			/**
			 * 
			 * @param image		: Dom img element reference
			 */
			function _setImage(image)
			{
				_imageWidth = image.width;
				_imageHeight = image.height;
				_canvas.setAttribute('width', _imageWidth);
				_canvas.setAttribute('height', _imageHeight);
				/*
				_clipObj.w = _imageWidth;
				_clipObj.h = _imageHeight;
				*/
				_context.drawImage(image, 0, 0, _imageWidth, _imageHeight);
				
				_originalImageData = _context.getImageData(0,0,_imageWidth, _imageHeight);
				_imageData = _cloneImageData(_originalImageData);
			}
			
			function _getCanvas(){
				return _canvas;
			}
			
			function _getImageData(){
				return _context.getImageData(0,0,_canvas.width, _canvas.height)
			}
			
			
			/* TODO */
			/*
			function _scale(x,y, bmpData){
				
				if(!bmpData || bmpData === "undefined"){
					bmpData = _cloneBitmapData(_originalBitmapData);
				}
				
				if(!y || y === "undefined"){
					y = x;
				}
				
				
				var tempCanvas = _createCanvas(bmpData.width, bmpData.height);
				var tempContext = tempCanvas.getContext("2d");
				var tempCanvas2 = _createCanvas(bmpData.width, bmpData.height);
				var tempContext2 = tempCanvas2.getContext("2d");
				
				tempContext.putImageData(bmpData,0,0);
				tempContext2.scale(x,y);
				tempContext2.drawImage(tempCanvas,0,0);
				
				_bitmapData = tempContext2.getImageData(0, 0, bmpData.width*x, bmpData.height*y);
				return _bitmapData;
				
			}
			
			function _crop(x,y,w,h, bmpData)
			{
				if(!bmpData || bmpData === "undefined"){				
					_context.putImageData(_originalBitmapData,0,0);
					_bitmapData = _context.getImageData(x, y, w, h);
					
				}else{
					var tempCanvas = _createCanvas(bmpData.width, bmpData.height);
					var tempContext = tempCanvas.getContext("2d");
					tempContext.putImageData(bmpData,0,0);
					_bitmapData = tempContext.getImageData(x, y, w, h);
				}
				
				return _bitmapData;
			
			}
			*/
			/* END : TODO */
			

			
			function _savePNGImage(canvas, bmpData){
				var imageData;
				if(bmpData){
					var canvas = _createCanvas(bmpData.width,bmpData.height);
					canvas.getContext("2d").putImageData(bmpData, 0,0);
				}else if(!canvas){
					canvas = _canvas;
				}
				
				imageData = canvas.toDataURL("image/png");
				var imageUrl = imageData.replace("image/png", "image/octet-stream");
				window.open(imageUrl,'userimage','width='+_canvas.width+',height='+_canvas.height+',left=100,top=100,resizable=No');

			}
			
			
			//public interface (instance scope)
			this.setImage = _setImage;
			this.getCanvas = _getCanvas;
			this.getImageData = _getImageData;
			this.savePNGImage =  _savePNGImage;
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public shared methods
			createCanvas : _createCanvas,
			createImageData :	_createImageData,
			cloneImageData : _cloneImageData
		};
		
		return Constructor;
		
	}());

	
}());


