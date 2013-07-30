(function(){
	
	smp.createNamespace("smp.ui.ColorPicker");
	
	/**
	 * @see http://www.boostworthy.com/blog/?p=200
	 * 
	 * @example
	 * var colorPicker = new smp.ui.ColorPicker(canvaselRef);
		colorPicker.drawGradientLinear(smp.ui.ColorPicker.spectrum(canvaselRef.width,true), {x:canvaselRef.width, y:canvaselRef.height}, null, null, true);
		colorPicker.addEventListener("change", onColorStartChange);
	 */
	
	 
	smp.ui.ColorPicker = (function(){		
		
		if(!smp.math.MathUtils || !smp.math.ColorUtils){
			smp.log('ColorPicker -> MathUtils and ColorUtils needed.');
			return;
			
		}
		var MathUtils = smp.math.MathUtils;
		var ColorUtils = smp.math.ColorUtils;
		var Constructor;
		
		Constructor = function(canvasel){
			
			var self = this;
			var canvas = canvasel;
			var context = canvas.getContext('2d');
			var canvasBitmapData;
			var colorsColl;
			var selectedColor = {r:0,g:0,b:0};
			
			var canvasPos = {x:canvas.offsetLeft, y:canvas.offsetTop};
			
			smp.events.extend(self);
	
			/**
			 * @param	xcolors				:	Array of hexadecimal values
			 * @param 	point				:	Object{x:0,y:0}
			 * @param	crossOverlayType	:	Object{colors:[],alphas:[],ratios:[]}
			 * @param	matrixRotation		:	Number (radians)
			 * @param	discrete			:	Boolean 
			 */
			function drawGradientLinear(xcolors, size, crossOverlayType, matrixRotation, brightness) 
			{
				
				colorsColl = xcolors;
				var i;
				var colorlen = xcolors.length;
				
				if (brightness) {
					
					var xinc = size.x / colorlen;
					var brightness = 0;
					
					for (i = 0; i < colorlen; i++) {
						
						/** Simple discrete gradient */
						/*
						context.beginPath();
						
						context.strokeStyle = "#"+xcolors[i];
						context.moveTo(i*xinc,0);
						context.lineTo(i*xinc,size.y);
						context.stroke();
						*/
						
						/** Brightness discrete gradient */
						//draw a gradient (dark to bright) line per color
						var gradientStyle = context.createLinearGradient(0,0,0,size.y);
						var j,color,value = {};
						var colors = [ColorUtils.serializeColor('000000',10),
						              ColorUtils.serializeColor(xcolors[i],10),
						              ColorUtils.serializeColor('ffffff',10)];
				
						var total = size.y*4/10;
						//from black to color
						for(j=0; j<total; j++){
							
							value.r = Math.round(MathUtils.cosineInterpolation(colors[0].r,colors[1].r,j/total));
							value.g = Math.round(MathUtils.cosineInterpolation(colors[0].g,colors[1].g,j/total));
							value.b = Math.round(MathUtils.cosineInterpolation(colors[0].b,colors[1].b,j/total));
						
							value.r = ColorUtils.normalizeHexaValues(value.r.toString(16),2);
							value.g = ColorUtils.normalizeHexaValues(value.g.toString(16),2);
							value.b = ColorUtils.normalizeHexaValues(value.b.toString(16),2);
							
							color = value.r+value.g+value.b;
							
							gradientStyle.addColorStop(j/size.y, "#"+color);
						}
						//from color to white
						for(j=0; j<size.y*4/10; j++){
							
							value.r = Math.round(MathUtils.cosineInterpolation(colors[1].r,colors[2].r,j/total));
							value.g = Math.round(MathUtils.cosineInterpolation(colors[1].g,colors[2].g,j/total));
							value.b = Math.round(MathUtils.cosineInterpolation(colors[1].b,colors[2].b,j/total));
							
							value.r = ColorUtils.normalizeHexaValues(value.r.toString(16),2);
							value.g = ColorUtils.normalizeHexaValues(value.g.toString(16),2);
							value.b = ColorUtils.normalizeHexaValues(value.b.toString(16),2);
							
							color = value.r+value.g+value.b;
							
							gradientStyle.addColorStop((size.y*6/10+j)/size.y, "#"+color);
						}
						
						context.fillStyle = gradientStyle;
						context.fillRect(xinc*i,0,xinc,size.y);
						
					}
					
				}else{
					var gradientStyle = context.createLinearGradient(0,0,size.x,0);
					
					var ratInc = 1 / colorlen;		
					//add all the colors and let the api draw the gradient
					for (i = 0; i < colorlen; i++) {
						gradientStyle.addColorStop(i*ratInc, "#"+xcolors[i]);
					}
					
					context.fillStyle = gradientStyle;
					context.fillRect(0,0, size.x, size.y);
					
				}
				
				if(smp.canvas.BitmapData) handleColorSelection();
				
			}
		
		
		//private
		function handleColorSelection() 
		{
			canvasBitmapData = new smp.canvas.BitmapData();
			smp.events.attach(canvas,'click', onCanvasClicked);
			
			
			
		}
		//events
		function onCanvasClicked(evt){

			var pixelPos = {
					x:Math.round(evt.pageX - evt.currentTarget.offsetLeft),
					y:Math.round(evt.pageY - evt.currentTarget.offsetTop)
			};
						
			
			var bmpData = context.getImageData(pixelPos.x,pixelPos.y,1,1);
			canvasBitmapData.setData(bmpData);
			selectedColor = canvasBitmapData.getColorAt(0,0,true);
			self.dispatchEvent('change',selectedColor);
			//colorCodeDisplay.innerHTML = selectedColor.r+selectedColor.g+selectedColor.b;
		}	
		
		function getColor() {
			return selectedColor;
		}
		
		/*	
		function setDefaultColor(color) {
			var i;
			for (i = 0; i < colorsColl.length; i++) {
				if (color == colorsColl[i]) {
					selectedColor = colorsColl[i];
					//calcular a posição no spectrum de acordo com o tipo de color picker
			
					dispatchEvent(new Event(Event.SELECT));
					return true;
					break;
				}
			}
			
			return false;
		}
		 */
			
			
			
			/** public interface */
			
			this.drawGradientLinear = drawGradientLinear;
			this.getColor = getColor;
		};
		
		return Constructor;

	}());

	
	smp.ui.ColorPicker.spectrum = smp.math.ColorUtils.spectrum;
	

	
}());