(function(){
	
	smp.namespace("smp.canvas.ColorPicker");
	
	/**
	 * @see http://www.boostworthy.com/blog/?p=200
	 */
	
	 
	smp.canvas.ColorPicker = (function(){		
		
		if(!smp.math.MathUtils || !smp.math.ColorUtils){
			smp.log('ColorPicker -> MathUtils and ColorUtils needed.');
			return;
			
		}
		var MathUtils = smp.math.MathUtils;
		var ColorUtils = smp.math.ColorUtils;
		var Constructor;
		
		Constructor = function(canvasel){
			
			var canvas = canvasel;
			var context = canvas.getContext('2d');
			var canvasBitmapData;
			var colorsColl;
			var selectedColor = 0;
			var marker = document.createElement('span');
			marker.setAttribute('style','display:block;width:3px;height:3px;border:1px solid #ccc;position:absolute;');
			marker = jq(marker);
			
			var colorCodeDisplay = document.createElement('span');
			colorCodeDisplay.innerHTML = "#";
			jq(canvas).after(colorCodeDisplay);
			
			var canvasPos = jq(canvas).offset();
			
			var evtDisp = new EventDispatcher();
			evtDisp.clone(this);
			delete evtDisp;
	
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
						var colors = [ColorUtils.getColorParts('000000',10),
						              ColorUtils.getColorParts(xcolors[i],10),
						              ColorUtils.getColorParts('ffffff',10)];
				
						var total = size.y/2;
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
						for(j=0; j<size.y/2; j++){
							
							value.r = Math.round(MathUtils.cosineInterpolation(colors[1].r,colors[2].r,j/total));
							value.g = Math.round(MathUtils.cosineInterpolation(colors[1].g,colors[2].g,j/total));
							value.b = Math.round(MathUtils.cosineInterpolation(colors[1].b,colors[2].b,j/total));
							
							value.r = ColorUtils.normalizeHexaValues(value.r.toString(16),2);
							value.g = ColorUtils.normalizeHexaValues(value.g.toString(16),2);
							value.b = ColorUtils.normalizeHexaValues(value.b.toString(16),2);
							
							color = value.r+value.g+value.b;
							
							gradientStyle.addColorStop((size.y/2+j)/size.y, "#"+color);
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
				
				if(jQuery && smp.canvas.CanvasBitmapData) handleColorSelection(this);
				
			}
		
		
		//private
		function handleColorSelection(self) 
		{
			jq = jQuery.noConflict();
			jq(canvas).bind('click', jq.proxy(onCanvasClicked,self));
			canvasBitmapData = new smp.canvas.CanvasBitmapData();
			
			
		}
		//events
		function onCanvasClicked(evt){
			jq(canvas).parent().append(marker);	
			var pixelPos = {
					x:Math.round(evt.pageX - jq(evt.currentTarget).offset().left),
					y:Math.round(evt.pageY - jq(evt.currentTarget).offset().top)
			};
			
			marker.css({'left':canvasPos.left+pixelPos.x,'top':canvasPos.top+pixelPos.y});
			
			
			var bmpData = context.getImageData(pixelPos.x,pixelPos.y,1,1);
			selectedColor = canvasBitmapData.getDataAtPoint(0,0,bmpData,true);
			/** See the proxy on 'handleColorSelection', 
			    which receives the context from the public call of method 'drawGradientLinear'
			    Otherwise, if no context was provided, 'this' would point to window
			    and if no proxy was used, 'this' would point to the canvas element
			*/
			this.dispatchEvent('change',selectedColor);
			colorCodeDisplay.innerHTML = "#"+selectedColor.r+selectedColor.g+selectedColor.b;
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

	
	smp.canvas.ColorPicker.spectrum = smp.math.ColorUtils.spectrum;
	

	
}());