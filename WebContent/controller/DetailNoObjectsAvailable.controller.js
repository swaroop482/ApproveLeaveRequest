sap.ui.define([
               "sap/usingmanifest/controller/BaseController"
	            ], function (BaseController) {
	
		"use strict";
	
		return BaseController.extend("sap.usingmanifest.controller.DetailNoObjectsAvailable", {

			

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit: function() {
		
					
			}/*,

			onNavBack: function(evt) {
				
				this.getRouter().navTo("master", {}, false);
				window.oMasterPage.setTitle("Leave Requests("+window.oList.getGrowingInfo().total+")");
			}*/
		});
});