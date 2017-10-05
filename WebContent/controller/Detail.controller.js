/*global location */
sap.ui.define([
              "sap/usingmanifest/controller/BaseController",
              "sap/ui/model/json/JSONModel",
              "sap/ui/Device",
              "sap/m/MessageStrip",
              "sap/m/GroupHeaderListItem"
	], function (BaseController, JSONModel, Device,GroupHeaderListItem) {
	
		"use strict";
	
		return BaseController.extend("sap.usingmanifest.controller.Detail", {
			
			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit: function() {
				
				this.getRouter().getRoute("object").attachPatternMatched(function(){

					var oDm = sap.ui.getCore().getModel("empobj");
					this.getView().setModel(oDm,"oDm");
				}, this);
				
				this.bDevice = this.getOwnerComponent().getModel("device").getData().system.phone;
				if(this.bDevice){
					
					this.getView().byId("detailPage").setShowNavButton(true);
				}
			},
		
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf northwind.Detail
			 */
			//  onBeforeRendering: function() {
			//
			//  },

			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf northwind.Detail
			 */
		
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf northwind.Detail
			 */
			//  onExit: function() {
			//
			//  }

			onApproveConfirmation: function(dialog) {
				
//				this.processConfirmation();
				this.processConfirmation();
				dialog.close();
				//sap.m.URLHelper.triggerEmail("swaroop.ssce@gmail.com", "Testing", "Hi, This is testing");
				this.callSuccessMessage();
			},
			
			onApproveButtonPress: function() {
				var context = this;
				context.dialog = new sap.m.Dialog({
					title: 'Confirm',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Do You want to Approve the Leave Request(s)?'
					}),
					beginButton: new sap.m.Button({
						text: 'Submit',
						press: function() {
							context.onApproveConfirmation(context.dialog);
						}
					}),
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function() {
							context.dialog.close();
						}
					}),
					afterClose: function() {
						context.dialog.destroy();
					}
				});

				context.dialog.open();
			},

			callSuccessMessage: function() {
				
				sap.m.MessageToast.show("Leave Approved Successfully", {
					animationDuration: 10000
				});
				
			/*	var oMs = sap.ui.getCore().byId("msgStrip");

				if (oMs) {
					oMs.destroy();
				}
				this._generateMsgStrip();	*/
			},
			
			/*_generateMsgStrip : function(){
				
				//var aTypes = ["Information", "Warning", "Error", "Success"],
				var oVC =  this.getView().byId("detailPage"),

				oMsgStrip = new sap.m.MessageStrip("msgStrip", {
					text: "Approved successfully",
					showCloseButton: true,
					showIcon: true,
					type: "Information"
				});
				
				oVC.addContent(oMsgStrip);
			},
*/
			onRejectButtonPress: function() {

				this.processConfirmation();
				
				sap.m.MessageToast.show("Leave Rejected", {
					animationDuration: 10000
				});

			},
			
			processConfirmation : function(){
				var newArray = [];
				var oList = window.oList;
			    var aItems = oList.getSelectedItems();
				var oModel = oList.getModel("myModel");
				var aData = oModel.getData();
				var requests = aData.requests;
				var oMasterPage = window.oMasterPage;
				for (var i = 0; i < aItems.length; i++) {

				   var item = aItems[i];
				   var context = item.getBindingContext("myModel");
				   var path = context.getPath();
				   var index = parseInt(path.substring(path.lastIndexOf('/') + 1));
				   requests[index]=undefined;
				   if(i == aItems.length -1){
					   for(var j=0;j<requests.length;j++){
						   if(requests[j] !== undefined){
							   newArray.push(requests[j]);
						   }
					   }
					   
				   }
				  }
				
				oModel.setProperty("/requests",newArray);
				this._removeSelection(oList);
				var currentCount = newArray.length;
				
				if(this.bDevice){
					
					if(oList.getItems().length>0){
						this._removeSelection(oList);
						this.getRouter().navTo("master", {}, false);
					}
					else{
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}
				}
				else {
				
					if(!oList.getItems().length>0){
						
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}
					else{
				
						var detailsModel = this.getView().getModel("oDm");
						var item = oList.getItems()[0];
						if( item instanceof sap.m.GroupHeaderListItem ){ 
			
					    	  item = oList.getItems()[1];
					    }
						
						var sContext = item.getBindingContext("myModel");
						var data = sContext.getObject();
			    		detailsModel.setData(data);
						window.detailsModel = detailsModel;

					}
				}
				
								
			},

			onNavPress: function(evt) {
				
				this.getRouter().navTo("master", {}, false);
				this._removeSelection(window.oList);
			},
			
			_removeSelection : function(oList){
				for(var listItem=0;listItem<oList.getItems().length;listItem++){
					oList.setSelectedItem(oList.getItems()[listItem],false);
				}
			}
			});

	}
);