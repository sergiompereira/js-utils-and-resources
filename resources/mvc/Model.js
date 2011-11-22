/**
 * 
 */

(function(){
	
	ClientsModel = (function(){
		
		var serviceUrl = "somewhereontheweb.ext";
		
		var constructor;
		
		constructor = function(){

			//handy to access properties or functions within callbacks and listeners
			var _this = this;
			
			var eventDispatcher = new EventDispatcher();
			eventDispatcher.clone(this);
		
			//private (made public bellow)							
			function getClients(){
				jq.get(serviceUrl+"Clients/get.php", {format:"json"}, 
					function(response){
						getClientsResponse(response);
					},
					"json"
				);
			}
			
			//callbacks
			function getClientsResponse(data){
				if(data.status.code == "1"){
					_this.dispatchEvent(ClientsModel.events.GETCLIENTS_COMPLETE, data.status.response.clients);
				}else{
					_this.dispatchEvent(ClientsModel.events.GETCLIENTS_ERROR, data.status.code);
				}
				
			}
			
			
			//public access
			this.getClients = getClients;

		}
		
		return constructor;
	}());
	
	ClientsModel.events = {};
	ClientsModel.events.GETCLIENTS_COMPLETE = "GETCLIENTS_COMPLETE";
	ClientsModel.events.GETCLIENTS_ERROR = "GETCLIENTS_ERROR";

}())

