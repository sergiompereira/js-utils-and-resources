/**
 * namespace pattern
 * @class BitmapData
 * @namespace smp.bitmap
 */

(function(){
	
	smp.namespace("smp.bitmap.BitmapData");
	
	//constructor (instance creation)
	smp.bitmap.BitmapData =(function()
	{
		//private properties
		var Constructor;
		var _bitmapData;
		
		//filters
		var filters = [];
		var filtersObj;
		
		//private made public in prototype
		function _getData(){
			return _bitmapData;
		}
		
		function _getPointAtIndex(id, bmpData){
			
			var point = {};
			var tx = (id%(bmpData.width * 4)) * bmpData.width;
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
			
			var id = y*bmpData.width*4+ x*4;
			var data = {};
			data.id = id;
			data.r = bmpData[id];
			data.g = bmpData[id+1];
			data.b = bmpData[id+2];
			data.a = bmpData[id+3];
			
			return data;
		}
		
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
				
			var i,j;
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
				
			
				for(j=0; j<filters.length;j++){					
					dest = filters[j][1](dest,filters[j][2]);
				}
				
				
				_bitmapData.data[i] = dest.r;
				_bitmapData.data[i+1] = dest.g;
				_bitmapData.data[i+2] = dest.b;
				_bitmapData.data[i+3] = dest.a;
				
			}
			
			return _bitmapData;
			
		};
		
		function _clearFilters(){
			filters.splice(0, filters.length);
		};
	
		/*
		 * !! It won't type cast to CanvasPixelArray
		 * 
		function _createBitmapData(w,h){
			var bmpData =  {};
			bmpData.width = parseInt(w);
			bmpData.height = parseInt(h);
			var pixelArray = [];
			bmpData.data = pixelArray;
		
			return bmpData;
		}
		
		
		function _cloneBitmapData(bmpData){
			var i;
			var total = bmpData.data.length;
			var tempBmpData = _createBitmapData(bmpData.width, bmpData.height);
			for(i = 0; i<total; i++){
				tempBmpData.data[i] = bmpData.data[i];
			}
			tempBmpData.width = bmpData.width;
			tempBmpData.height = bmpData.height;
			return tempBmpData;
		}
		*/

		
		//Constructor
		Constructor = function(bmpData)
		{

			if(bmpData != null && bmpData !== "undefined"){
				_bitmapData = bmpData;
			}
			
			filtersObj = new BitmapFilters();
		};
		
		//public
		Constructor.prototype = {
			
			//public properties (getters)
				
			//public methods
			getData:_getData,
			getDataAtPoint:_getDataAtPoint,
			getPointAtIndex:_getPointAtIndex,
			addFilter:_addFilter,
			applyFilters:_applyFilters,
			clearFilters:_clearFilters
		};
		
		
		return Constructor;
		
	}());
}());
	



