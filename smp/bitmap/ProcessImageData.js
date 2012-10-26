importScripts("PointFilter.js","ConvolutionMatrix.js","DistributionFilter.js");

var console = {};
	console.log = function(msg){
		postMessage({"action":"log", "msg":msg});
	};
	
(function(){
	
	this.addEventListener('message', function(evt) {
		var data = evt.data;
	
		if(data.action == "process"){
			var imagedata = data.imagedata,
				sourcedata = copyData(imagedata),
				buffer = data.buffer,
				tempBuffer = copyData(buffer),
				filters = data.filters.slice(0),
				width = imagedata.width,
				height = imagedata.height,
				length = imagedata.data.length,
				x,y,color,currFilter,pointFiltersStack = [],firstrun = true;
		
			readFilters();
			postMessage({"imagedata":copyData(tempBuffer,buffer)});
			
			//routines
			function readFilters() {
				for(var i=0;i<filters.length; i++){
					
					var filtername = filters[i].name;
					if(PointFilter[filtername]){
						pointFiltersStack.push({name:filtername, params:filters[i].params.slice(0)});
						filters.splice(i,1);
						readFilters();
						return;
					}else{
						if(!isEmpty(pointFiltersStack)){
							if(!firstrun){
								sourcedata = copyData(tempBuffer);
							}else{
								firstrun = false;
							}
							processPointFilters();
							pointFiltersStack = [];
							readFilters();
							return;
						}else{
							if(ConvolutionMatrix[filtername.toUpperCase()]){
								if(!firstrun){
									sourcedata = copyData(tempBuffer);
								}else{
									firstrun = false;
								}
								processConvolutionFilter(ConvolutionMatrix[filtername.toUpperCase()](filters[i].params[0] || undefined), filters[i].params.slice(1));
								filters.splice(i,1);
								readFilters();
								return;
							}else if(filtername == "convolute"){
								if(!firstrun){
									sourcedata = copyData(tempBuffer);
								}else{
									firstrun = false;
								}
								processConvolutionFilter(filters[i].params[0], filters[i].params.slice(1));
								filters.splice(i,1);
								readFilters();
								return;
							}else if (DistributionFilter[filtername]) {
								if(!firstrun){
									sourcedata = copyData(tempBuffer);
								}else{
									firstrun = false;
								}
								processDistributionFilter(DistributionFilter[filtername], filters[i].params.slice(1));
								filters.splice(i,1);
								readFilters();
								return;
							}else{
								
								//ignore filter and go on
								filters.splice(i, 1);
								readFilters();
								return;
							}
							
						}
					}
				}
				
				if(!isEmpty(pointFiltersStack)){
					if(!firstrun){
						sourcedata = copyData(tempBuffer);
					}else{
						firstrun = false;
					}
					processPointFilters();
					pointFiltersStack = [];
				}
			}
				
			function processPointFilters(){
				var i,j;
				for(i = 0; i < length; i+=4){
					color = getColor(sourcedata,i);
					for(j=0;j<pointFiltersStack.length; j++){
						var params = pointFiltersStack[j].params;
						var lastparam = params[params.length-1];
								
						var filterFnc, filterMap;
						if (typeof lastparam === "function") {
							filterFnc = lastparam;
						}
						else if (typeof lastparam === "object" && lastparam.width) {
							filterMap = lastparam;
						}
						
						if ((!filterFnc && !filterMap) || (filterFnc && filterFnc(color)) || (filterMap && getColor(filterMap, i).g > 125)) {
							color = PointFilter[pointFiltersStack[j].name](color, pointFiltersStack[j].params);
						}
					}
					setColor(tempBuffer, i,color);
				}
			}
			function processConvolutionFilter(){
				
				var matrix,factor,bias,filter;
				matrix = arguments[0];
				var args = arguments[1];
				if(!matrix || Object.prototype.toString.call(matrix)!=="[object Array]") throw new Error("ProcessImageData->processConvolutionFilter:Matrix not defined.");

				if(args.length>0) {factor = args[0] }else{ factor = 1};
				if(args.length>1) {bias = args[1] }else{ bias = 0};
				if(args.length>2) {filter = args[2] }else{ filter = null};
								
				var filtered = false, filterFnc, filterMap, filterArea;
				if (filter) {
					if (typeof filter === "function") {
						filterFnc = filter;
						filtered = true;
					}else if (typeof filter === "object" && filter.data) {
						filterMap = filter;
						filtered = true;
					}else if(typeof filter === "object" && filter.x && filter.r){
						filterArea = filter;
						filterArea.ir = (filterArea.border) ? filterArea.r*(1-filterArea.border) : filterArea.r;
						filtered = true;
					}
				}
				
				//matrix should have a even number of items and their square root should be an integer
				var side = Math.sqrt(matrix.length),
					centeroffset = (side-1)/2,
					matrixlen = matrix.length,
					sum = 0,
					x,y,
					pixelslength = sourcedata.data.length,
					imgw = sourcedata.width,
					imgh = sourcedata.height;
				
				if(side%Math.floor(side)>0) throw new Error("ProcessImageData->processConvolutionFilter:Matrix width and eight must be the same (matrix length's square root must be an integer).")
				
				
				//obter o valor da soma de todos os elementos da matriz
				for(i=0;i<matrix.length;i++){
					sum+=matrix[i];
				}
				
				
				//avoid division by zero
				if(sum == 0) sum = 1;
			
				
				if(filterArea){
					for (y = filterArea.y-filterArea.r; y < filterArea.y+filterArea.r; y++) {
						for (x = filterArea.x-filterArea.r; x < filterArea.x+filterArea.r; x++) {
							var originColor = getColorAt(sourcedata,x,y);
							var color = convolute(sourcedata,x,y,matrix,factor,bias);
							var dist = distance(x,y,filterArea.x,filterArea.y);
							
							if(filterArea.ir < filterArea.r){
								if(dist<filterArea.ir){
									setColorAt(tempBuffer, x,y, color);
								}else if(dist<filterArea.r){
									var interpol = interpolateColorLinear(originColor,color,filterArea.ir/dist);
									setColorAt(tempBuffer, x,y, interpol);
								}else{
									setColorAt(tempBuffer, x,y, originColor);
								}
							}else if(dist<filterArea.r){
								setColorAt(tempBuffer, x,y, color);
							}else{
								setColorAt(tempBuffer, x,y, originColor);
							}
							
						}
					}
				}else if(filterMap){
					var index,color;
					for(y=0; y<imgh; y++){
						for(x=0; x<imgw; x++){
							var originColor = getColorAt(sourcedata,x,y);
							var color = convolute(sourcedata,x,y,matrix,factor,bias);
							var mapcolor = getColorAt(filterMap,x,y).g;
							if(mapcolor > 0){
								var color = convolute(sourcedata,x,y,matrix,factor,bias);
								var interpol = interpolateColorLinear(originColor,color,mapcolor/255);
								setColorAt(tempBuffer, x,y, interpol);
							}else{
								setColorAt(tempBuffer, x,y, originColor);
							}
						}
					}
				}else{
					var index,color;
					for(y=0; y<imgh; y++){
						for(x=0; x<imgw; x++){
							if(!filtered || (filterFnc && filterFnc(color))){
								setColorAt(tempBuffer, x,y, convolute(sourcedata,x,y,matrix,factor,bias));
							}else{
								color = getColorAt(sourcedata,x,y);
								setColorAt(tempBuffer, x,y, color);
							}
						}
					}
				}
				
				
				function convolute(sourcedata,imgx,imgy,matrix,factor,bias){
	
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
							
							color = getColorAt(sourcedata,nimgx,nimgy);
			
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

			function processDistributionFilter(){
				var filterFunc = arguments[0];
				var args = (arguments.length>1)  ? arguments[1] : undefined;

				var x,y,imgw=sourcedata.width,imgh=sourcedata.height;
				for (y = 0; y < imgh; y++) {
					for (x = 0; x < imgw; x++) {
						filterFunc(sourcedata,x,y, args);
					}
				}
				tempBuffer = copyData(sourcedata);
			}

		}
		
		
	}, false);


	/** utils **/
	
	function getColor(imgdata, i){
		var data = imgdata.data;

		var color = {};
		color.r = data[i];
		color.g = data[i+1];
		color.b = data[i+2];
		color.a = data[i+3];

		return color;
	}
			
	function getColorAt(imgdata,x,y){
		var id = pointToIndex(imgdata,x,y);
		return getColor(imgdata,id);
	}
	function setColor(imgdata, i, color){
		imgdata.data[i] = color.r;
		imgdata.data[i+1] = color.g;
		imgdata.data[i+2] = color.b;
		imgdata.data[i+3] = color.a;
	}
			
	function setColorAt(imgdata,x,y,color){
		setColor(imgdata,pointToIndex(imgdata,x,y),color);
	}
			
	function pointToIndex(imgdata,x,y){
		return y*imgdata.width*4+ x*4;
	}
			
	function indexToPoint(imgdata,index){
		var tx = index%(imgdata.width * 4)/4;
		var x = Math.floor(tx);
		var subindex = (tx%1) * 4 - 1;
		var y = Math.floor((index/4)/imgdata.width);
		
		return {x:x, y:y};
	}
	function range(color){
		if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
		if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
		if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
		if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
		
		return color;
	}
	function copyData(imagedata,destdata){
		
		var i=0;len=imagedata.data.length;
		if (!destdata) {
			destdata = {};
			destdata.width = imagedata.width;
			destdata.height = imagedata.height;
			destdata.data = [];
		}
		var imgdata = imagedata.data, nimgdata = destdata.data;
		for(i=0;i<len;i++){
			nimgdata[i] = imgdata[i];
		}
		return destdata;
	}
	function clone(parent, child){
		
		var child = child || {};
		var i, 
			toString = Object.prototype.toString, 
			astr = "[object Array]";
		
		function _copy(parent, child){
			
			for(i in parent){
				if(parent.hasOwnProperty(i)){
					if(typeof parent[i] === "object"){
						child[i] = (toString.call(parent[i])===astr) ? [] : {};
						_copy(parent[i], child[i]);
					}else{
						child[i] = parent[i];
					}
				}
			}
			return child;
		}
		
		_copy(parent,child);
		
		return child;
	}
	
	function isEmpty(obj){
		var key;
		for(key in obj){
			if(obj.hasOwnProperty(key)) return false;
		}
		return true;
	}
	function distance(x1, y1, x2, y2) 
    {
    	var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx*dx+dy*dy);
    }
	function interpolateColorLinear(color1,color2,r){
		return {
			r:linearInterpolation(color1.r,color2.r,r),
			g:linearInterpolation(color1.g,color2.g,r),
			b:linearInterpolation(color1.b,color2.b,r),
			a:linearInterpolation(color1.a,color2.a,r)
		}
	}
	function linearInterpolation(y1,y2,rORxk,x1,x2){
    	var r;
    	if(arguments.length == 3){
    		r = rORxk;
    	}else if(arguments.length == 5){
    		r = (rORxk-x1)/(x2-x1);
    	}
    	
    	return y1*(1-r) + y2*r;
    }
	
}());