
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.canvas
 */

(function(){
	
	smp.createNamespace("smp.canvas.CanvasBitmapData");
	
	smp.canvas.CanvasBitmapData = (function()
	{
		//private shared properties
		var Constructor;
		var auxCanvas = document.createElement("canvas");
		var auxContext;
		if(!!auxCanvas.getContext){
			auxContext = auxCanvas.getContext("2d");
		}else{
			smp.log('CanvasBitmapData -> O browser não suporta canvas.');
			return;
		}
		var _colorUtils = smp.math.ColorUtils;
		var filtersObj = new smp.canvas.CanvasFilters();
		
	
		//private shared methods
		function _createCanvas(w,h){
			var tCanvas = document.createElement("canvas");
			tCanvas.setAttribute("width", w);
			tCanvas.setAttribute("height", h);
			return tCanvas;
		}
		
		function _createBitmapData(w,h){
			return auxContext.createImageData(w,h);
		}
		
		function _cloneBitmapData(bmpData){
			var i;
			var total = bmpData.data.length;
			var tempBmpData = auxContext.createImageData(bmpData.width, bmpData.height);
			for(i = 0; i<total; i++){
				tempBmpData.data[i] = bmpData.data[i];
			}
			tempBmpData.width = bmpData.width;
			tempBmpData.height = bmpData.height;
			return tempBmpData;
		}
		

		
		//
		
		Constructor = function(canvas, w, h)
		{
			var _canvas;
			if(canvas && canvas !== "undefined"){
				_canvas = canvas;
			}else{
				_canvas = document.createElement("canvas");
				_canvas.setAttribute("width", w);
				_canvas.setAttribute("height", h);
			}
			var _context = _canvas.getContext("2d");
			
			var _imageWidth;
			var _imageHeight;
			var _originalBitmapData = _context.getImageData(0,0,_canvas.width, _canvas.height);
			var _bitmapData = _cloneBitmapData(_originalBitmapData);
			
			var filters = [];
		
			
			/**
			 * 
			 * @param image		: Dom img tag reference
			 */
			function _setImage(image)
			{
				_imageWidth = image.width;
				_imageHeight = image.height;
				_canvas.setAttribute('width', _imageWidth);
				_canvas.setAttribute('height', _imageHeight);
				/*_clipObj.w = _imageWidth;
				_clipObj.h = _imageHeight;*/
				_context.drawImage(image, 0, 0, _imageWidth, _imageHeight);
				
				_originalBitmapData = _context.getImageData(0,0,_imageWidth, _imageHeight);
				_bitmapData = _cloneBitmapData(_originalBitmapData);
			}
			
			function _getCanvas(){
				return _canvas;
			}
			
			function _getBitmapData(){
				return _bitmapData;
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
			
			
			function _getDataAtIndex(id){
				
				var point = {};
				var tx = id%(bmpData.width * 4)/4;
				point.x = Math.floor(tx);
				var subindex = (tx%1) * 4 - 1;
				point.y = Math.floor((id/4)/bmpData.width);
				
				point.r = _bitmapData.data[id-subindex];
				point.g = _bitmapData.data[id-subindex+1];
				point.b = _bitmapData.data[id-subindex+2];
				point.a = _bitmapData.data[id-subindex+3];
				
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
			
			/**
			 * @param	int			x		:	horizontal position on the image data grid
			 * @param	int			y		: 	vertical position on the image data grid
			 * @param	Boolean		hexColor:	if false, the method returns an object with properties id,r,g,b and a in decimal (0-255) values.
			 * 									If true, the method returns an object with properties id,r,g,b and a in hexadecimal values.	
			 */
			function _getDataAtPoint(x,y, hexColor){
				
				var id = y*_bitmapData.width*4+ x*4;
				var data = {};
				data.id = id;
				
				if(hexColor){
					var value,i,temp = [];
					for(i=0; i<4; i++){
						value = _bitmapData.data[id+i].toString(16);
						if(value.length < 2){
							value = '0'+value;
						}
						temp.push(value); 
					}
					
					data.r = temp[id];
					data.g = temp[id+1];
					data.b = temp[id+2];
					data.a = temp[id+3];
					
				}else{
					data.r = _bitmapData.data[id];
					data.g = _bitmapData.data[id+1];
					data.b = _bitmapData.data[id+2];
					data.a = _bitmapData.data[id+3];
				}
				
				return data;
			}
			
			function _setDataAtPoint(x,y, color){
				
				var id = y*_bitmapData.width*4+ x*4;
				
				var color = _colorUtils.getColorParts(color,10);
				_bitmapData.data[id] = color.r;
				_bitmapData.data[id+1] = color.g;
				_bitmapData.data[id+2] = color.b;
				_bitmapData.data[id+3] = 255;
				
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
				_applyFilters();
			}
			
			function _applyFilters(){
					
				//don't apply the filters to the bitmapdata
				//to avoid applying filters over filters
				var filtersImageData = _createBitmapData(_bitmapData.width, _bitmapData.height);
				var i;
				var total = _bitmapData.data.length;
				for(i = 0; i<total; i+=4){
					
					var colors = {};
					colors.r = _bitmapData.data[i];
					colors.g = _bitmapData.data[i+1];
					colors.b = _bitmapData.data[i+2];
					colors.a = _bitmapData.data[i+3];
				
					var dest = {};
					dest.r = colors.r;
					dest.g = colors.g;
					dest.b = colors.b;
					dest.a = colors.a;
					
					var j;
					for(j=0; j<filters.length;j++){
						dest = filters[j][1](dest,filters[j][2]);
					}
					
					
					filtersImageData.data[i] = dest.r;
					filtersImageData.data[i+1] = dest.g;
					filtersImageData.data[i+2] = dest.b;
					filtersImageData.data[i+3] = dest.a;
					
				}
				_context.putImageData(filtersImageData, 0,0);
			}
			
			function _clearFilters(){
				filters.splice(0, filters.length);
			};
			
			
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
			
			
			//public interface (instance scope)
			this.setImage = _setImage;
			this.getCanvas = _getCanvas;
			this.getBitmapData = _getBitmapData;
			this.getDataAtPoint = _getDataAtPoint;
			this.getDataAtIndex = _getDataAtIndex;
			this.setDataAtPoint = _setDataAtPoint;
			this.addFilter = _addFilter;
		//	this.applyFilters = _applyFilters;
			this.clearFilters = _clearFilters;
			this.savePNGImage =  _savePNGImage;
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public shared methods
			createCanvas : _createCanvas,
			createBitmapData :	_createBitmapData,
			cloneBitmapData : _cloneBitmapData
		};
		
		return Constructor;
		
	}());

	
}());


