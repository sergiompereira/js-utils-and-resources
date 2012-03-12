(function(){	
	
	smp.namespace("smp.canvas.PerlinNoise");
	
	//static class
	smp.canvas.PerlinNoise = (function(){
			
		
			var smoothed = false;
		
			/** 
			 * Example function to return random 'predictable' numbers, just integers
			 * i.e. the same provided argument will return the same value
				
				Allows up to 6 different outputs
			 */
			function getNoise(x,setid){
				
				return _noiseFnc(x, setid);
			}
			
			function getNoise2D(x,y,setid){
				
				// 2D version
				// 57 ??
				
				return _noiseFnc(x+y*57, setid);
				
				
			}
			
			function _noiseFnc(n,setid){

				/**
				Create variations changing the parameters (6) with other prime numbers
				(search prime number generators online)
				*/
				var a = [15731,98377,19387,84751,29363,93487];
				var b = [789221,293861,978521,365291,934811];
				var c = [1376312589,9686432471,3579854249,4704863153,2930982493,4395846001];
				var d = [2147483647,7653432791,6643290893,8742145697,9432811013,7898229397];	
				var e = [1073741824,2393893781,3392028511,5383747513,3715937399,1938372798];
				var f = [13,19,7,23,29,53];	
								
				//ERRADO! : n = (n<<f[setid]) ^ n;
				//CERTO:
				n = (n >> f[setid]) ^ n;
				return ( 1.0 - ( (n * (n * n * a[setid] + b[setid]) + c[setid]) & d[setid]) / e[setid]);
				
			}
			
			/**
			 * Compute a value between a and b based on r, which should be between 0 and 1
			 * If r = 0, it will return a; if r=1 it will return b;
			 * 
			 * Linear interpolation
			 * --------------------
			 * function (a,b,r)
			 * 	return a*(1-r) + b*r
			 * 
			 * Actually draws a line between a and b, so the result is hard
			 * 
			 * 
			 * Cosine interpolation 
			 * --------------------
			 * function (a,b,r)
			 * 	var pi = 3.1415927;
				var ft = r * pi;
				var f = (1 - cos(ft)) * 0.5
				return a*(1-f) + b*f
				
			 * Looks smoother around a and around b
			 * but it doesn't take into account the function variation around the values of a and b
			 * creating a wave curve that could actually be a straight line.
			 */
			function cosine_interpolate(a,b,r){
				//here v2 = a and v3 = b in the formulas above
				
				var pi = 3.1415927;
				var ft = r * pi;
				var f = (1 - Math.cos(ft)) * 0.5
				return a*(1-f) + b*f;
			}
			/**
			 * Cubic interpolation
			 * -------------------
			 * More complex and slower to compute. 
			 * Visually there is not much difference between cubic and cosine interpolation.
			 * It takes into account the function variation 
			 * and uses the value before a and the value after b 
			 * to compute a curve that integrates smoothly 
			 * with the curve before and the curve after
			 */
			function cubic_interpolate(v1,v2,v3,v4,r){
				//here v2 = a and v3 = b in the formulas above
				
				var P = (v4 - v3) - (v1 - v2);
				var Q = (v1 - v2) - P;
				var R = v3 - v1;
				var S = v2;
				return P*Math.pow(3,r) + Q*Math.pow(2,r) + R*r + S;
			}
			
			function interpolateNoise(x,i){
				var xint = Math.floor(x);
				var r = x -xint;
				
				var _fnc;
				if(smoothed){
					_fnc = smoothNoise;
				}else{
					_fnc = getNoise;
				}
				
				var a = _fnc(xint,i);
				var b = _fnc(xint+1,i);
				
				return cosine_interpolate(a,b,r);
			}
			
			/**
			 * In this case we have only one value at a time.
			 * What we can do is to get two values from one:
			 * 
			 * Ex. pass a value of 3.4
			 * a = 3
			 * b = 3+1=4 
			 * r = 3.4-3 = 0.4
			 * interpolate(noise(3),noise(4),0.4)
			 * 
			 * If the value was 3 (or 3.0)
			 * then interpolate(noise(3),noise(4),0) which returns noise(3) as desired
			 * and if it was 3.9
			 * then interpolate(noise(3),noise(4),0.9) which will return a value close to noise(4), as desired
			 * 
			 * For a cartesian position, we need to compute the values of a 2D interval, 
			 * that is, a square of unit 1
			 */
			function interpolateNoise2D(vx,vy,i){
				
				var vxint = Math.floor(vx);
				var vyint = Math.floor(vy);
				var rx = vx -vxint;
				var ry = vy -vyint;
				
				var _fnc;
				if(smoothed){
					_fnc = smoothNoise2D;
				}else{
					_fnc = getNoise2D;
				}
				//compute the noise at the corners
				var v1 = _fnc(vxint,vyint,i);
				var v2 = _fnc(vxint+1,vyint,i);
				var v3 = _fnc(vxint+1,vyint+1,i);
				var v4 = _fnc(vxint,vyint+1,i);
				
				//interpolate the values in the middle of two of the sides
				//if you use the bottom and up sides, use the value of rx
				var i1 = cosine_interpolate(v1,v2,rx);
				var i2 = cosine_interpolate(v3,v4,rx);
				
				//return the interpolation of the above values, which give the
				//interpolated noise in the centre of the square
				//The interpolation is done vertically, so use the value of ry
				return cosine_interpolate(i1,i2,ry);
				
			}

			
			function smoothNoise(x,i){
				return getNoise(x,i)/2 + getNoise(x-1,i)/4 + getNoise(x+1,i)/4;
			}
			
			/**
			 * Returns an average of the noise function around the value provided
			 * to avoid too disparate outputs, reducing contrast between close values
			 * and giving a more natural, not so turbulent look
			 */
			function smoothNoise2D(x,y,i){
				
				//2D
				var corners = ( getNoise2D(x-1, y-1,i)+getNoise2D(x+1, y-1,i)+getNoise2D(x-1, y+1,i)+getNoise2D(x+1, y+1,i) ) / 16;
				var sides = ( getNoise2D(x-1, y,i) +getNoise2D(x+1, y,i) +getNoise2D(x, y-1,i) +getNoise2D(x, y+1,i) ) / 8;
				var center = getNoise2D(x, y,i) / 4;
				return corners + sides + center;
			}
			
			
			
			
			/**
			 * Perlin Noise is a function that sums up two or more different functions.
			 * Each function is a noise function, i.e., a 'predictable' random number generator.
			 * Because this random generator only returns integers
			 * there is the need to interpolate the values between each integer
			 * computing the values in between and resulting in a wave function.
			 * Also, the result might look to crisp/turbulent, and there might be the need 
			 * for a smoother output, which is accomplished with the calculation of the average
			 * around each value, which will lower the hills and rise the valleys (reduce contrast)
			 * Each noise function called within the perlin noise function
			 * should be called with a different set of values.
			 * The values should be differently spaced, i.e. more frequent on each iteraction.
			 * In general the frequency rises exponentially on base 2, 
			 * so each function is called an 'octave', like in music.
			 * The number of function-octaves to sum is provided as an argument to the perlin noise function.
			 * The output of the noise function on each iteraction
			 * should also be amplified differently
			 * based on the value of persistence, provided also as an argument.
			 * The persistence determines if the final output is smooth or turbulent.
			 
			 */
			var _persistence = 0.7;
			//max 6 octaves (see the random generator above: setid)
			var _noctaves = 6;
			
			
			function perlinNoise(x, noctaves, persistence){
				
				if(persistence !== undefined) _persistence = persistence;
				if(noctaves !== undefined) _noctaves = noctaves;
				
				var output = 0;
				var n = _noctaves - 1;
				var i;
				var frequency, amplitude;
				for(i=0; i<=n; i++){
					frequency = Math.pow(2,i);
					amplitude = Math.pow(_persistence,i);
					output = output + interpolateNoise(x * frequency, i) * amplitude;
				}
					
				
				return output;
			}
			
			function perlinNoise2D(x,y, noctaves, persistence, bSmoothed){
				
				smoothed = bSmoothed;
				
				if(persistence !== undefined) _persistence = persistence;
				if(noctaves !== undefined) _noctaves = noctaves;
				
				var output = 0;
				var n = _noctaves - 1;
				var i;
				var frequency, amplitude;
				for(i=0; i<=n; i++){
					frequency = Math.pow(2,i);
					amplitude = Math.pow(_persistence,i);
					output = output + interpolateNoise2D(x * frequency,y * frequency, i) * amplitude;
				}
					
				
				return output;
			}
			
			
			
			//static
			return {
				get2D:perlinNoise2D,
				get:perlinNoise
			}
	}());
}());