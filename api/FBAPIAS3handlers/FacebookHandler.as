package Classes
{
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.external.ExternalInterface;
	import srg.mvc.core.CustomEvent;
	
	import nl.demonsters.debugger.MonsterDebugger;
	
	
	public class  FacebookHandler extends EventDispatcher
	{
		public static const LOGGED_OFF:String = "LOGGED_OFF";
		public static const LOGGED_IN:String = "LOGGED_IN";
		public static const POST_SUCCESS:String = "POST_SUCCESS";
		public static const POST_FAILED:String = "POST_FAILED";
		
		private var userData:Object;
		
		private var loading:Boolean = false;
		
		
		public function FacebookHandler() {
	
			ExternalInterface.addCallback("libraryLoadedHnd", libraryLoadedHnd);
			ExternalInterface.call("fcbkFlInt.init", "851bcb9064cf965a3777903ea70bed8f", "pt_PT", "libraryLoadedHnd");
			
		}
		
		
		
		private function libraryLoadedHnd():void 
		{
			MonsterDebugger.trace(this, "call");
			ExternalInterface.addCallback("loginStatusHnd", loginStatusHnd);
			ExternalInterface.call("fcbkFlInt.getLoginStatus", "", "loginStatusHnd");			
		}
		
		private function loginStatusHnd(data:Object):void {
			if (data == null) {
				dispatchEvent(new Event(LOGGED_OFF));
			}else {
				
				onUserReady(data);
			}
		}
		
		public function login():void {
			ExternalInterface.addCallback("onLoginResponse", onLoginResponse);
			ExternalInterface.call("fcbkFlInt.login", "publish_stream, email", "onLoginResponse");
		}
		
		private function onLoginResponse(data:Object):void {
			
			onUserReady(data);
			
		}
		
		private function onUserReady(data:Object):void
		{
			userData = data.response;
			MonsterDebugger.trace(this, userData.name);
			MonsterDebugger.trace(this, userData.email);
			MonsterDebugger.trace(this, userData.id);
			
			dispatchEvent(new CustomEvent(LOGGED_IN, data.response ));
		}
		
		public function getUserData():Object 
		{
			if(userData != null){
				return userData;
			}
			
			return null;
		}
		
		public function postUI(body):void 
		{
			ExternalInterface.addCallback("onPutUIResponse", onPutUIResponse);
			ExternalInterface.call("fcbkFlInt.postUI", "", "Passatempo Hyundai", body, "", "http://www.facebook.com/pages/StratDev/157947637577533?sk=app_151289021582640", "",[],"","popup", "onPutUIResponse");
		}
		
		private function onPutUIResponse(data:Object):void {
			
			dispatchEvent(new CustomEvent(POST_SUCCESS, data ));
		}
		
	}
}