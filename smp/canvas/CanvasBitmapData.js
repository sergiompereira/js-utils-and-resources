
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.canvas
 */

(function(){
	
	smp.namespace("smp.canvas.CanvasBitmapData");
	
	smp.canvas.CanvasBitmapData = (function()
	{
		//private properties
		var Constructor;
		var _canvas = document.createElement("canvas");
		_canvas.name = "canvasutil";
		var _context;
		
		var _imageWidth;
		var _imageHeight;
		var _originalBitmapData;
		var _bitmapData;
		
		//filters
		var filters = [];
		var filtersObj = new smp.canvas.CanvasFilters();

		if(!!_canvas.getContext){
			_context = _canvas.getContext("2d");
		}else{
			return;
		}
		
		
		//private methods (made public below)
		function _setImage(image)
		{
			_imageWidth = image.width;
			_imageHeight = image.height;
			_canvas.setAttribute('width', _imageWidth);
			_canvas.setAttribute('height', _imageHeight);
			_clipObj.w = _imageWidth;
			_clipObj.h = _imageHeight;
			_context.drawImage(image, 0, 0, _imageWidth, _imageHeight);
			_bitmapData = _context.getImageData(0,0,_imageWidth, _imageHeight);
			
			//save original data:
			_originalBitmapData = _cloneBitmapData(_bitmapData);
		}
		
		function _getBitmapData(){
			return _bitmapData;
		}
		
		
		
		function _savePNGImage(canvas, bmpData){
			
			if(canvas && canvas !== "undefined"){
				canvas.name = "Imagem";
			}else if(bmpData && bmpData !== "undefined"){
				canvas = document.createElement("canvas");
				canvas.name = "Imagem";
				var context = canvas.getContext("2d");
				context.putImageData(bmpData);
			}else{
				canvas = _canvas;
				_context.putImageData(_originalBitmapData, 0,0);
			}
			
			var imageData = canvas.toDataURL("image/png");
			var imageUrl = imageData.replace("image/png", "image/octet-stream");
			window.open(imageUrl,'userimage','width='+canvas.width+',height='+canvas.height+',left=100,top=100,resizable=No');

		}
		
		//
		
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
		
		function _clip(x,y,w,h, bmpData)
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
		
		
		function _getPointAtIndex(id, bmpData){
			
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _originalBitmapData;
			}
			
			var point = {};
			var tx = id%(bmpData.width * 4)/4;
			point.x = Math.floor(tx);
			var subindex = (tx%1) * 4 - 1;
			point.y = Math.floor((id/4)/bmpData.width);
			
			point.r = bmpData.data[id-subindex];
			point.g = bmpData.data[id-subindex+1];
			point.b = bmpData.data[id-subindex+2];
			point.a = bmpData.data[id-subindex+3];
			
			switch(subindex){
				case 0:
					point.color = "R";
					break;
				case 1:
					point.color = "G";
					break;
				case 2:
					point.color = "B";
					break;
				case 3:
					point.color = "A";
					break;
			}
			
			
			return point;
			
			
		}
		
		function _getDataAtPoint(x,y, bmpData){
			
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _originalBitmapData;
			}
			
			var id = y*bmpData.width*4+ x*4;
			var data = {};
			data.id = id;
			data.r = bmpData[id];
			data.g = bmpData[id+1];
			data.b = bmpData[id+2];
			data.a = bmpData[id+3];
			
			return data;
		}
		
		//
		
		function _addFilter(filter, value){
			
			var i;
			var filterExist = false;
			for(i=0; i<filters.length; i++){
				if(filters[i][0] == filter){
					filters[i][2] = value;
					filterExist = true;
					break;
				}
			};
			if(!filterExist) filters.push([filter, filtersObj.getFilter(filter), value]);
			
		}
		
		function _applyFilters(bmpData){
				
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _originalBitmapData;
			}
			var newImageData = _createBitmapData(bmpData.width, bmpData.height);
			var i;
			var total = bmpData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = bmpData.data[i];
				colors.g = bmpData.data[i+1];
				colors.b = bmpData.data[i+2];
				colors.a = bmpData.data[i+3];
			
				var dest = {};
				dest.r = colors.r;
				dest.g = colors.g;
				dest.b = colors.b;
				dest.a = colors.a;
				
				var j;
				for(j=0; j<filters.length;j++){
					dest = filters[j][1](dest,filters[j][2]);
				}
				
				
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
			
		}
		
		function _clearFilters(){
			filters.splice(0, filters.length);
		};
	
		//internal
		function _createCanvas(w,h){
			var tCanvas = document.createElement("canvas");
			tCanvas.setAttribute("width", w);
			tCanvas.setAttribute("height", h);
			return tCanvas;
		}
		
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
		

		
		//
		
		Constructor = function()
		{
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
			
			setImage: _setImage,
			getBitmapData: _getBitmapData,
			savePNGImage: _savePNGImage,
			getDataAtPoint:_getDataAtPoint,
			getPointAtIndex:_getPointAtIndex,
			addFilter: _addFilter,
			applyFilters:_applyFilters,
			clearFilters:_clearFilters
			
		};
		
		return Constructor;
		
	}());

	
}());


