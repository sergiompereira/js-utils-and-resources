
(function(){
	SmokeConfig = (function(){
	
		var Constructor = function(){
			
			//group level (Smoke)
			 this.frequency = 3;
			 this.blurRatio = [2,4];
			 this.colors = {start:'#40fe4a',end:'#7e18ef'};
			
				 //particle level (SmokeParticle)
				  this.maxXOffset  =  10.0;
				 
				  this.minXSpeed  =  -1.0;
				  this.maxXSpeed  =  1.0;
				  
				  this.minYSpeed  =  -1.0;
				  this.maxYSpeed  =  -3.0;
				 
				  this.minXAcc  =  0;
				  this.maxXAcc  =  0;
		 
				  this.minYAcc  =  0;
				  this.maxYAcc  =  -0.1;
		 
				  this.fadeInRate  =  0.05;
				  this.minParticleAlpha  =  0.3;
				  this.maxParticleAlpha  =  0.8;
				  this.minAlphaDecay  =  0.005;
				  this.maxAlphaDecay  =  0.01;
		 
				  this.minInitialScale  =  0.3;
				  this.maxInitialScale  =  0.4;
				  this.minParticleExpansionRate  =  0.02;
				  this.maxParticleExpansionRate  =  0.08;
				  
		}
		
		return Constructor;
		
	}());
}());
