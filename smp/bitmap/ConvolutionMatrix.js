(function(){
	

	function Blur(amount){
		
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
	
	function Sharpen(amount){
	
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
	
	function Edges(direction){
		
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
	
	function Sobel(direction){
		
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
				matrix = [-2, -1, 0,
					  	  -1,  0, 1,
					   	   0,  1, 2];
		}
		
		return matrix;
			
	}
	
	
	function Emboss(amount,direction){
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
		
		var matrix;
		
		switch(direction){
			case "V":
				matrix =  [-1, -2, -1,
							0, amount, 0,
							1, 2, 1];
				break;
			case "H":
				matrix =  [ -1, 0, 1,
							-2, amount, 2,
							-1, 0, 1];
				break;
			case "DRL":
				matrix =  [ 0, -1, -2,
							1, amount, -1,
							2,  1, 0];
				break;
			case "DLR":
				matrix =  [ -2, -1, 0,
							-1, amount, 1,
							 0, 1, 2];
				break;
			default:
				matrix =  [ -2, -1, 0,
							-1, amount, 1,
							 0, 1, 2];
		}
		
		return matrix;
		
	}
	
	ConvolutionMatrix = {
		BLUR:Blur,
		SHARPEN:Sharpen,
		EDGES:Edges,
		SOBEL:Sobel,
		EMBOSS:Emboss
	}
	
	
}());