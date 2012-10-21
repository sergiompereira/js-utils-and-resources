(function(){
	
	smp.createNamespace("smp.bitmap.BitmapFilter");
	
	smp.bitmap.BitmapFilter = (function()
	{
		//private properties
		var Constructor;
		//dependencies
		var MathUtils = smp.math.MathUtils;
		var Geometry2D = smp.math.Geometry2D;
		var BitmapData = smp.canvas.BitmapData;
		
		
		Constructor = function(filtername)
		{
			var self = this;
			var _bitmapData = new BitmapData();	
			var _auxBitmapData = new BitmapData();
			
			var _filterName = filtername;
			var _filterType = "";
			var _filterFnc;
			
			
			switch(_filterName){
				case "saturation":
					_filterType = "point";
					_filterFnc = _saturateFunction;
					break;
				case "brightness":
					_filterType = "point";
					_filterFnc = _brightenFunction;
					break;
				case "contrast":
					_filterType = "point";
					_filterFnc = _contrastFunction;
					break;
				case "threshold":
					_filterType = "point";
					_filterFnc = _thresholdFunction;
					break;
				case "red":
					_filterType = "point";
					_filterFnc = _channelFunction;
					break;
				case "green":
					_filterType = "point";
					_filterFnc = _channelFunction;
					break;
				case "blue":
					_filterType = "point";
					_filterFnc = _channelFunction;
					break;
				case "normalize":
					_filterType = "point";
					_filterFnc = _normalizeFunction;
					break;
				case "negative":
					_filterType = "point";
					_filterFnc = _negativeFunction;
					break;
				case "posterize":
					_filterType = "point";
					_filterFnc = _posterizeFunction;
					break;
				case "monotone":
					_filterType = "point";
					_filterFnc = _monotoneFunction;
					break;
				case "duotone":
					_filterType = "point";
					_filterFnc = _duotoneFunction;
					break;
				case "blur":
					_filterType = "area";
					_filterFnc = _blur;
					break;
				case "edges":
					_filterType = "area";
					_filterFnc = _findEdges;
					break;
				case "sharpen":
					_filterType = "area";
					_filterFnc = _sharpen;
					break;
				case "emboss":
					_filterType = "area";
					_filterFnc = _emboss;
					break;
				case "sobel":
					_filterType = "area";
					_filterFnc = _sobel;
					break;
				case "convolute":
					_filterType = "area";
					_filterFnc = _convolute;
					break;
				default:
					throw new Error("BitmapFilter->constructor: No filter name specified.");
			}
				
			/**
			 * @originalImageData 	: bitmap data ImageData
			 * @args... 			: filter params
			 */
			function _process(originalImageData, args){				
				
				var params = [];
				
				/** CHECK POINT FILTERS FIRST */
				if(_filterType == "point"){
					
					var i,
						total = originalImageData.data.length;
					
					self.auxBitmapData.setEmptyData(originalImageData.width, originalImageData.height);
					self.bitmapData.setData(originalImageData);
					
					for (var i=1; i<arguments.length; i++) {
						params.push(arguments[i]);
					}

					
					if(_filterName == "red" || _filterName == "green" || _filterName == "blue"){
						if(args != 1){
							//fill in the channel name
							params.splice(0,0,_filterName);
							return _runImageData();
						}else{
							return originalImageData;
						}
					}else if(_filterName == "threshold"){
						if(args <= 255){
							return _runImageData();
						}else{
							return originalImageData;
						}
					}else if(_filterName == "normalize"){

						if(params[1] > 255)  params[1] = 255;
						if(params[0] <  0)  params[0] = 0;
						
						return _runImageData();
					}else if(_filterName == "posterize"){
						params[0] = 255/params[0];
						return _runImageData();
					}else{
						return _runImageData();
					}
					
				}else if(_filterType == "area"){
					/** DELEGATE AREA FILTERS */

					for (var i=0; i<arguments.length; i++) {
						params.push(arguments[i]);
					}
					
					return _filterFnc.apply(self,params);
				}
				
				
				function _runImageData(){					
					var cparams = params.slice(0);
					//open space for the current pixel data, prefill with a zero.
					cparams.splice(0,0,0);

					for(i = 0; i<total; i+=4){
						//update the first item with the current pixel data
						cparams[0] = self.bitmapData.getColor(i);
						self.auxBitmapData.setColor(i,_filterFnc.apply(self,cparams));
					}
					return self.auxBitmapData.getData();
				}
				
			}
			
			function _name(){
				return _filterName;
			}
			function _type(){
				return _filterType;
			}
			
			
			this.process = _process;
			this.name = _name;
			this.bitmapData = _bitmapData;
			this.auxBitmapData = _auxBitmapData;
			
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
		
		};
		
		
		//private shared methods
		/** filters methods */

		
		function _blur(originalImageData,value){
			return _convolute.call(this,originalImageData, smp.bitmap.BitmapFilter.Blur(Number(value)));
		}
		
		function _findEdges(originalImageData,direction){
			return _convolute.call(this,originalImageData, smp.bitmap.BitmapFilter.Edges(direction));
		}
		
		function _sharpen(originalImageData,value){
			return _convolute.call(this,originalImageData, smp.bitmap.BitmapFilter.Sharpen(Number(value)));	
		}
			
		function _emboss(originalImageData,value){
			return _convolute.call(this,originalImageData, smp.bitmap.BitmapFilter.Emboss(Number(value)));
		}
		function _sobel(originalImageData,direction){
			return _convolute.call(this,originalImageData, smp.bitmap.BitmapFilter.Sobel(direction));
		}
			
		function _convolute(originalImageData, matrix, factor,bias, filter){

			if(factor == undefined) factor = 1;
			if(bias == undefined) bias = 0;
			
			var filterFnc, filterMap;
			if(typeof filter === "function"){
				filterFnc = filter;
			}else if(typeof filter === "object" && filter.data){
				filterMap = new smp.canvas.BitmapData(filter);
			}


			var self = this;
			
			//matrix should have a even number of items and their square root should be an integer
			var side = Math.sqrt(matrix.length),
				centeroffset = (side-1)/2,
				matrixlen = matrix.length,
				sum = 0,
				x,y,k,m,
				pixelslength = originalImageData.data.length,
				imgw = originalImageData.width,
				imgh = originalImageData.height;
				
			if(side%Math.floor(side)>0) throw new Error("CanvasFilter->convolute:Matrix width and eight must be the same (matrix length's square root must be an integer).")
			
			self.auxBitmapData.setEmptyData(imgw,imgh);
			self.bitmapData.setData(originalImageData);
			
			//obter o valor da soma de todos os elementos da matriz
			for(i=0;i<matrix.length;i++){
				sum+=matrix[i];
			}
			
			//avoid division by zero
			if(sum == 0) sum = 1;
			
			
			//PERFORMANCE TEST
			//var time = Date.now();
		
			var index,color;
			for(x=0; x<imgw; x++){
				for(y=0; y<imgh; y++){
					index = self.bitmapData.pointToIndex(x,y);
					color = self.bitmapData.getColor(index);
					if((!filterFnc && !filterMap) || (filterFnc && filterFnc(color))  || (filterMap && filterMap.getColorAt(x,y).a > 125)){
						self.auxBitmapData.setColor(index,_computeMatrix(x,y));
					}else{
						self.auxBitmapData.setColor(index,color);
					}
				}
			}
			
			//PERFORMANCE TEST
			//console.log(Date.now()-time)
			
			function _computeMatrix(imgx,imgy){
				var imgnx,imgny,color,value,psum = {r:0,g:0,b:0,a:255};
				for(k=0; k<side; k++){
					for(m=0;m<side;m++){
						value = matrix[m*side+k];
						nimgx = imgx - centeroffset+k;
						nimgy = imgy - centeroffset+m;
						
						if(nimgx<0) nimgx*=-1;
						if(nimgy<0) nimgy*=-1;
						if(nimgx>imgw-1) nimgx -= (nimgx - (imgw-1));
						if(nimgy>imgh-1) nimgy -= (nimgy - (imgh-1));
						
						color = self.bitmapData.getColor(nimgy*imgw*4+ nimgx*4);
		
						psum.r+=(color.r*value);
						psum.g+=(color.g*value);
						psum.b+=(color.b*value);					
					}
				}
				
				psum.r = Math.floor((psum.r/sum)*factor + bias);
				psum.g = Math.floor((psum.g/sum)*factor + bias);
				psum.b = Math.floor((psum.b/sum)*factor + bias);
		
				psum = _range(psum);
				
				return psum;
				
			}
			
			
			return self.auxBitmapData.getData();
			
		}
		
		
		
		/** per pixel algorithms */
		function _saturateFunction(obj, saturation)
		{

				//grayscale
			//dest.r = dest.g = dest.b = (colors.r+colors.g+colors.b)/3.0;
			//or REC 709
			//dest.r = dest.g = dest.b =  = 0.2126*r + 0.7152*g + 0.0722*b;
			//or REC 601
			//dest.r = dest.g = dest.b =  = 0.3*r + 0.59*g + 0.11*b;
			//in any case, the coefficients sum to 1.
			
			var rlum = 0.2126;
			var glum = 0.7152;
			var blum = 0.0722;
			
		
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
			
			if(brightness < 1){
					dest.r = brightenColor(obj.r);
					dest.g = brightenColor(obj.g);
				dest.b = brightenColor(obj.b);
			}else{
				dest.r = darkenColor(obj.r);
				dest.g = darkenColor(obj.g);
				dest.b = darkenColor(obj.b);
			}
			
			function brightenColor(color){
				return color + gaussian(color,125,100)* (brightness-1);
			}
			function darkenColor(color){
				return color + gaussian(color,125,50)* (brightness-1);
			}
			function gaussian(value, center, amplitude){
				var a = value, b = center, c = amplitude;
				//curva gaussiana, de modo que os pretos e brancos ficam quase inalterados.
				return a*Math.pow(Math.E, -(Math.pow(value-b,2)/(2*Math.pow(c,2))));
			}

			dest.a = obj.a;
			
			dest = _range(dest);
			
			return dest;
		}

		function _contrastFunction(obj, contrast)
		{
			
			var dest = {};
			
			dest.r = contrastColor(obj.r);
			dest.g = contrastColor(obj.g);
			dest.b = contrastColor(obj.b);
			
			function contrastColor(color){
				//formula : diferença de luminância / luminância média
				//ou seja, o desvio da média a dividir pela média.
				//http://en.wikipedia.org/wiki/Contrast_(formula)#Formula
				return ((color - 125)*contrast)+ 125;
			}
			
			dest.a = obj.a;
			
			dest = _range(dest);
			
			return dest;
		}
		
		function _thresholdFunction(obj, threshold)
		{
			
			var dest = {};
			//REC 709
			var nvalue = (0.2126*obj.r + 0.7152*obj.g + 0.0722*obj.b >= threshold) ? 255 : 0;
			
			dest.r = dest.g = dest.b = nvalue;
			dest.a = obj.a;
			
			//dest = _range(dest);
			
			return dest;
		}
		
		function _channelFunction(obj, channel, value)
		{
			var dest = {};
			
			dest.r = obj.r;
			dest.g = obj.g;
			dest.b = obj.b;
			dest.a = obj.a;
			
			switch(channel){
				case "red":
					dest.r*=value;
				break;
				case "green":
					dest.g*=value;
				break;
				case "blue":
					dest.b*=value;
				break;
			}
			
			dest = _range(dest);
			
			return dest;
		}

		function _normalizeFunction(obj,min,max){
			
			var dest = {};
			
			dest.r = MathUtils.normalize(obj.r,0,255,min,max);
			dest.g = MathUtils.normalize(obj.g,0,255,min,max);
			dest.b = MathUtils.normalize(obj.b,0,255,min,max);
			dest.a = obj.a;
			
			dest = _range(dest);
			
			return dest;
		}
		
		function _negativeFunction(obj){
			var dest = {};
			dest.r = 255-obj.r;
			dest.g = 255-obj.g;
			dest.b = 255-obj.b;
			dest.a = obj.a;
			
			return dest;
		}
		
		function _posterizeFunction(obj, span){
			var dest = {};
			dest.r = Math.round(obj.r/span)*span;
			dest.g = Math.round(obj.g/span)*span;
			dest.b = Math.round(obj.b/span)*span;
			dest.a = obj.a;
			
			return dest;
		}
		
		function _monotoneFunction(obj, color, towhite){
			var dest = _saturateFunction(obj,0);
			if(towhite){
				dest.r = _scale(dest.r,color.r);
				dest.g = _scale(dest.g,color.g);
				dest.b = _scale(dest.b,color.b);
				dest.a = obj.a;
			}else{
				dest.r = dest.r/255*color.r;
				dest.g = dest.g/255*color.g;
				dest.b = dest.b/255*color.b;
				dest.a = obj.a;
			}
			function _scale(value,outMin){
				return value / 255*(255-outMin) + outMin;
			}
			
			return dest;
		}
		function _duotoneFunction(obj, colora, colorb){
			var dest = _saturateFunction(obj,0);
			dest.r = _scale(dest.r,colora.r,colorb.r);
			dest.g = _scale(dest.g,colora.g,colorb.g);
			dest.b = _scale(dest.b,colora.b,colorb.b);
			dest.a = obj.a;
			function _scale(value,outMin,outMax){
				return value / 255*(outMax-outMin) + outMin;
			}
			
			return dest;
		}
		
		function _range(color){
			if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
			if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
			if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
			if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
			
			return color;
		}
		
		
		return Constructor;
		
	}());
	
	smp.bitmap.BitmapFilter.Blur = function(amount){
		
		var matrix;
		
		switch(amount){
			case 1:
				matrix =   [0,1,0,
							1,2,1,
							0,1,0];
				break;
			case 2: 
				matrix =   [0,0,1,0,0,
							0,1,2,1,0,
							1,2,3,2,1,
							0,1,2,1,0,
							0,0,1,0,0];
				break;
			case 3:
				matrix =   [0,0,0,1,0,0,0,
							0,0,1,2,1,0,0,
							0,1,2,3,2,1,0,
							1,2,3,4,3,2,1,
							0,1,2,3,2,1,0,
							0,0,1,2,1,0,0,
							0,0,0,1,0,0,0];
				break;
			case 4:
				matrix =   [0,0,0,0,1,0,0,0,0,
							0,0,0,1,2,1,0,0,0,
							0,0,1,2,3,2,1,0,0,
							0,1,2,3,4,3,2,1,0,
							1,2,3,4,5,4,3,2,1,
							0,1,2,3,4,3,2,1,0,
							0,0,1,2,3,2,1,0,0,
							0,0,0,1,2,1,0,0,0,
							0,0,0,0,1,0,0,0,0];
				break;
			default:
				matrix =   [0,1,0,
							1,2,1,
							0,1,0];
				break;
		}
		
		return matrix;
	};
	
	smp.bitmap.BitmapFilter.Sharpen = function(amount){
	
		/**
		 * 
		Semelhante a find edges, mas é adicionada a imagem original, em vez de se obter apenas a diferença.
		Deste modo se mantém a imagem original mas com as transições de cor realçadas, ganhando definição.
		
		definição prop. inversa ao valor ao centro (com os mesmos valores à volta)
		definiçao prop. directa aos valores à volta (em valor absoluto) com a mesma diff. entre o valor ao centro e a soma dos valores à volta
		*/
		
		if(amount >= 1 && amount <= 5 ){
				amount = 8-(amount-1)*2+10;
		}else{
			amount = 1;
		}
			
		return  [ 0, -2, 0,
				  -2, amount, -2,
				   0, -2, 0];
	}
	
	smp.bitmap.BitmapFilter.Edges = function(direction){
		
		/** A soma deverá ser zero, pois só as transições de cor serão coloridas 
		e todo o resto da imagem ficará escuro.
		A cada pixel subtraem-se os pixéis vizinhos, obtém-se uma diferença ou derivada de cor.
		A direcção pode ser qualquer ou todas.
		*/
			
		var matrix;
		
		switch(direction){
			case "V":
				matrix = [	0, -2, 0,
					  	 	0,  4,  0,
					   		0, -2, 0];
				break;
			case "H":
				matrix = [	 0, 0,  0,
					  	 	-2, 4, -2,
					   		 0, 0,  0];
				break;
			case "DRL":
				matrix = [	-2, 0,  0,
					  	 	 0, 4,  0,
					   		 0, 0, -2];
				break;
			case "DLR":
				matrix = [	 0,  0, -2,
					  	 	 0,  4,  0,
					   		-2,  0,  0];
				break;
			default:
				matrix = [	0, -2, 0,
					  	 	-2, 8, -2,
					   		0, -2, 0];
		}
		
		return matrix;
			
	}
	
	smp.bitmap.BitmapFilter.Sobel = function(direction){
		
		var matrix;
		
		switch(direction){
			case "V":
				matrix = [-1, -2, -1,
					  	   0,  0,  0,
					   	   1,  2,  1];
				break;
			case "H":
				matrix = [-1, 0,  1,
					  	  -2, 0,  2,
					   	  -1, 0,  1];
				break;
			default:
				matrix = [-1, -2, -1,
					  	   0,  0,  0,
					   	   1,  2,  1];
		}
		
		return matrix;
			
	}
	
	smp.bitmap.BitmapFilter.Emboss = function(amount){
		/**			
		Aumentando e reduzindo a intensidade dos pixéis vizinhos
		obtém-se um efeito 3D, como se a imagem estivesse em relevo.
		Neste caso a 45º (luz vem do c.s.e)
		
		 * inv. prop valor central (para os m.s valores à volta)
		 * dir. prop valores à volta (para o mesmo valor ao centro)
		 * */
					
		if(amount >=1 ){
			//amount = 5-(value-1);
			//range in: 1-5, out:3-1
			amount = (amount - 1) / (5 - 1) * (1 - 3) + 3;
		}else{
			amount = 1;
		}
		
		return [-2, -1, 0,
				-1, amount, 1,
				 0, 1, 2];
	}
	
	
}());


