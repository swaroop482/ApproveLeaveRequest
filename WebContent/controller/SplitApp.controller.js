
sap.ui.define([
              "sap/ui/core/mvc/Controller",
              "sap/ui/model/json/JSONModel"
	], function (Controller, JSONModel) {
	
		"use strict";
	
		return Controller.extend("sap.usingmanifest.controller.SplitApp", {

			

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				window.splitApp = this.getView().byId("splitApp");
			},
			
			
			to : function (pageId, context) {
				
				var app = this.getView().byId("splitApp");
				// load page on demand
				var master = ("Master" === pageId);
				if (app.getPage(pageId, master) === null) {
					var page = sap.ui.view({
						id : pageId,
						viewName : "sap.usingmanifest.view." + pageId,
						type : "XML"
					});
					page.getController().nav = this;
					app.addPage(page, master);
					jQuery.sap.log.info("app controller > loaded page: " + pageId);
				}
				
				// show the page
				app.to(pageId);
				
				// set data context on the page
				if (context) {
					var page = app.getPage(pageId);
					page.setModel(context,"detObj");
				}
			}
			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			/*onListUpdateFinished : function (oEvent) {
				var sTitle,
					fOrderTotal = 0,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("detailView"),
					oItemsBinding = oEvent.getSource().getBinding("items"),
					aItemsContext;

				// only update the counter if the length is final
				if (oItemsBinding.isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);

					aItemsContext = oItemsBinding.getContexts();
					fOrderTotal = aItemsContext.reduce(_calculateOrderTotal, 0);
					oViewModel.setProperty("/totalOrderAmount", fOrderTotal);
				}

			},
*/
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			});

	}
);