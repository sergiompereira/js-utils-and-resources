
(function(){
	
	smp.namespace("smp.utils.Ajax");
	
	//constructor (instance creation)
	smp.utils.Ajax = (function()
	{
		
		var Constructor;

		Constructor = function()
		{
		
		};

		
		//private methods
		var getHttpObject = function(){
			
				var xmlHttp=false;
				
				if(window.XMLHttpRequest){
					xmlHttp=new XMLHttpRequest();
				}else if (window.ActiveXObject){
					try {
						xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
					}catch(e){
						try{
							xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
						}catch(e){
							xmlHttp = false;
						}
					}
						
				}
				return xmlHttp;
			};
		
		var urlencode = function(params, key, value){

				if(params.length>0){
					params+="&";
				}
				return params + encodeURIComponent(key)+"="+encodeURIComponent(value);
			}
 
		//callback should expect an argument according to the responsetype specified: "xml", "text/html", "json"
		var get = function(path, callback, responsetype){
			
				var xh = getHttpObject();
				if(xh){
					xh.onreadystatechange = function(){
						if(xh.readyState == 4){
							if(xh.status == 200 || xh.status == 304){
								if(typeof callback === "function"){
									switch(responsetype){
										case "xml":
											callback(xh.responseXML);
											break;
										case "json":
											callback(eval('('+xh.responseText+')'));
											break;
										default:
											callback(xh.responseText);
									}	
									
								}
							}
						}
					};
					
					xh.open("GET", path, true);
					xh.send(null);
					
				}
			};
	
		//callback should expect an argument according to the responsetype specified: "xml", "text/html", "json"
		var post = function(path, data, callback, responsetype){
			
				var params = "";
				var xh = getHttpObject();
				if(xh){
					xh.onreadystatechange = function(){
						if(xh.readyState == 4){
							if(xh.status == 200 || xh.status == 304){
								if(typeof callback === "function"){
									switch(responsetype){
										case "xml":
											callback(xh.responseXML);
											break;
										case "json":
											callback(eval('('+xh.responseText+')'));
											break;
										default:
											callback(xh.responseText);
									}	
								}
							}
						}
					};
					
					for(var i in data){
						if(data.hasOwnProperty(i)){
							params = urlencode(params, i, data[i]);
						}
					}
					
					//Notice : crossdomain communication is not allowed
					//Use a server side script (proxy) for "tunneling"
					xh.open("POST", path, true);
					//for xml or html response type (coment these lines is an image is expected)
					xh.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xh.setRequestHeader("Encoding", "utf-8");
					xh.send(params);
					
				
				}
			};
				
			//END private methods
			
			//return public interface (reveal only the desired private methods)
			Constructor.prototype = {
					//public properties
					version:"1.0",
					
					//public methods
					get:get,
					post:post
				};
			
			
			return Constructor;
			
	//immediate function pattern (auto-execute)	
	}());
}());



