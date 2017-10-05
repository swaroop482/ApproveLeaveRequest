/*global location */
sap.ui.define([
               "sap/usingmanifest/controller/BaseController",
	            "sap/ui/Device",
	            "sap/ui/model/json/JSONModel",
	            "jquery.sap.global",
	          	"sap/ui/model/Filter",
	          	"sap/ui/model/FilterOperator",
	          	"sap/usingmanifest/model/grouper",
	          	"sap/usingmanifest/model/GroupSortState",
	          	"sap/m/GroupHeaderListItem",
	          	"sap/m/ObjectListItem"
	], function (BaseController, JSONModel,Device, jQuery, Filter, FilterOperator, grouper, GroupSortState,GroupHeaderListItem,ObjectListItem) {
	
		"use strict";
		var filteredList = [];
		var _listItems;
		var oFilteredList;
		var context = null;
		return BaseController.extend("sap.usingmanifest.controller.Master", {

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit: function() {
				
				//creates the JSON data model containing the employees data stored in 'localServices/LeaveRequest.json'
				context = this;
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.loadData("model/LeaveRequest.json", null, false);
				window.oList = this.getView().byId("idList");
				this.oList = window.oList;
				window.oMasterPage = this.getView().byId("masterPage");
				window.oList.setModel(oModel, "myModel");
			
				this.bDevice = this.getOwnerComponent().getModel("device").getData().system.phone;
				
				if(this.bDevice){
					
					this.getView().byId("__switch0").setVisible(false);
					this.getView().byId("_searchField").setWidth("100%");
				}
				
				// set device model
					this._oListFilterState = {
							aFilter: [],
							aSearch: []
						};

						this._oGroupSortState = new GroupSortState(grouper.groupID());
						this.oLi = "Element sap.m.ObjectListItem";
						this.gHli = "Element sap.m.GroupHeaderListItem";
			
			},
			
			onChange:function() {

			    var toggle = this.byId("__switch0").getProperty("state");
			    if(toggle == true){
			      window.oList.setProperty("mode","MultiSelect");
			      this._removeSelection(window.oList);
			    }
			    
			    else{
			      var firstItem = window.oList.getItems()[0];	
			      window.oList.setProperty("mode","SingleSelectMaster");
			    
			      if(firstItem instanceof GroupHeaderListItem){
			    	 
			    	  window.oList.setSelectedItem(window.oList.getItems()[1]);
			    	  if(!window.detailsModel==undefined){
			    		
			    		this._setDetData();
			    	  }
			      }
			      else {
			    	  
			    	  window.oList.setSelectedItem(firstItem);
			    	  if(!window.detailsModel==null || !window.detailsModel == undefined){
			    		  
			    		  this._setDetData(); 
			    	  }
			      }
			      
			    }

			  },
			 
			_setDetData : function(){
				  var item = window.oList.getSelectedItem(),context = item.getBindingContext("myModel"),
				  data = context.getObject();
				  console.log("selected name : "+data.name);
	    		  window.detailsModel.setData(data);
			},  
			  
			onUpdate: function(oEvent) {
				
				this._updateListItemCount(oEvent.getParameter("total"));
			},
			
			_updateListItemCount : function (iTotalItems) {
				
				var sTitle = "Leave Requests ("+iTotalItems+")";
				// only update the counter if the length is final
				if (window.oList.getBinding("items").isLengthFinal()) {					
					window.oMasterPage.setTitle(sTitle);
					
					if(iTotalItems>0){

						this.oDevice = this.getOwnerComponent().getModel("device").getData();
						this.bDevice = this.oDevice.system.phone;
						var len = window.oList.getItems().length;
						
						//this method is for setting initial list item as selected and its corresponding data in the detail page.
						if(!this.bDevice && len>0 && window.oList.getProperty("mode")=="SingleSelectMaster"){
							var firstItem = window.oList.getItems()[0];
							var secondItem = window.oList.getItems()[1];
							// perform further neede code here..like modfieng detail page based upon first item
							
							if(firstItem instanceof ObjectListItem){
								
								window.oList.setSelectedItem(firstItem, true);
								this.firstItemBinding = firstItem.getBindingContext("myModel");
								//window.globalVariable = this.firstItemBinding;
								this._setDetailData(this.firstItemBinding);
							}
							else{
								window.oList.setSelectedItem(secondItem, true);
							}
						}
						
						else{
							
							return;
							
						}
					}			
				}
			},

			onSelectionChange: function(oEvt) {
				
				var listMode = window.oList.getProperty("mode");

			    if(listMode == "SingleSelectMaster"){
			    	var oEvnt = oEvt;
			    
					this._setBinding(oEvnt);
			     }
			    
			    else{
			    	return;
			    }
				//this method is called whenever a list item is selected explicitly by user.
			},
			
			_setBinding : function(oEvt){
			
				var item = oEvt.getParameter("listItem") || oEvt.getSource();
				var binding = item.getBindingContext("myModel");
				
				//window.globalVariable = binding;
				this._setDetailData(binding);
			},
			
			_setDetailData: function(binding) {
				
				//this method sets Detail Page corresponding data of the  list item is selected in the master page.
				var itemArray = window.oList.getModel("myModel").getProperty("/requests");
				var myModel1 = new sap.ui.model.json.JSONModel();
				var oDetObj = binding.getObject();
				
				for (var i = 0; i < itemArray.length; i++) {
					if (itemArray[i].id === oDetObj.id) {
						myModel1.setData(oDetObj);
						sap.ui.getCore().setModel(myModel1, "empobj");
						break;
					}
				}
				
				var sObjectId = oDetObj.id;
				this.getRouter().navTo("object", {
					objectId : sObjectId
				}, false);	
			},

			onSearch: function(oEvent) {
				// build filter array
				if (oEvent.getParameters().refreshButtonPressed ) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this._onRefresh();
					return;
				}
				/*if(oEvent.getParameters().clearButtonPressed){
					
					//console.log(JSON.stringify(filteredList));
					if(filteredList.length>0){
						window.oList.getModel("myModel").setProperty("/requests",filteredList);
					}else{
						this.binding.filter([]);
					}
					return;
				}*/
				
				var sQuery = oEvent.getSource().getValue();
				var oList = window.oList;
				this.binding = oList.getBinding("items");
				
				if (sQuery && sQuery.length>0) {

					var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
					var oFilter1 = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sQuery);
					var comFil = new sap.ui.model.Filter([oFilter, oFilter1]);
					this.binding.filter(comFil, sap.ui.model.FilterType.Application);
				} 
				
				else {
		
					if(!this.filterLength>0 || this.filterLength == undefined){
						console.log(this.filterLength);
						this.binding.filter([]);
					}
					else {
						var binding = oFilteredList.getBinding("items");
						console.log("oFiltered list length in onSearch : "+oFilteredList.getItems().length);
						binding.filter(this._oListFilterState.aFilter);	
					}
				}	
				
			},
			
			_onRefresh : function(){
				
				window.oList.getBinding("items").refresh();
			},
			
					/*Master page footer functions*/
		
			onSortPress: function(evt) {

				//It has three buttons to select sorting type and then after selecting a button navigates to another dialog box,
				//there it calls sortList.
				//method to sort list based on the selected radio button in the second dialog box.

				//this._oList = this.getView().byId("idList");
				
				this.binding = window.oList.getBinding("items");

				this.aSorter = [];
				this.aSorter2 = [];
				
				this.sortByWhich = this.getView().byId("mysort").getSelectedItem().getText();
		
				if (!this._Dialog) {

					this._Dialog = sap.ui.xmlfragment(
						"sap.usingmanifest.view.SortType",
						this
					);
					this.getView().addDependent(this._Dialog);

					this._Dialog.open();
				} else if (this._Dialog) {

					this._Dialog.open();
				} else {

					this.binding.sort(null);
				}
			},
			
			onCloseDialog: function() {
				this._Dialog.close();
			},
			
			onRadioSelect: function(oEvent) {

				//calls this method by second dialog whenever user selects a radio button
				var radioButtonId = oEvent.getSource().getId();
				if (radioButtonId === "ASC") {

					this.setSortType(false, radioButtonId);

				} else {

					this.setSortType(true, radioButtonId);
				}

			},
			setSortType: function(bsortType, radioButtonId) {

				//this method takes sort type 'descending : true/false' and radioButtonId 
				this.descending = bsortType;
				sap.ui.getCore().byId(radioButtonId).setSelected(false);
				this._Dialog.close();
				this.sorting();
			},
			sorting: function() {

				//this method is called in the setSortType method to do actual sorting based on the boolean value of 'this.descending' variable.
				if (this.sortByWhich === "Sort By Name") {

					var SORTKEY = "name",
						DESCENDING = this.descending,
						GROUP = false;

					this.aSorter.push(new sap.ui.model.Sorter(SORTKEY, DESCENDING, GROUP));

					this.binding.sort(this.aSorter);
					this._setSelectedItem();
					//this.onCloseDialog();
					this._Dialog.close();
				} 
				else {
					var SORTKEY2 = "id",
						DESCENDING2 = this.descending,
						GROUP2 = false;

					this.aSorter2.push(new sap.ui.model.Sorter(SORTKEY2, DESCENDING2, GROUP2));

					this.binding.sort(this.aSorter2);
					this._setSelectedItem();
					//this.onCloseDialog();
					this._Dialog.close();
				}
				
			},
			
			/**
			 * Event handler for the filter button to open the ViewSettingsDialog.
			 * which is used to add or remove filters to the master list. This
			 * handler method is also called when the filter bar is pressed,
			 * which is added to the beginning of the master list when a filter is applied.
			 * @public
			 */
			onOpenViewSettings: function() {
				
				if (!this._oViewSettingsDialog) {
					this._oViewSettingsDialog = sap.ui.xmlfragment("sap.usingmanifest.view.ViewSettingsDialog", this);
					this.getView().addDependent(this._oViewSettingsDialog);
					// forward compact/cozy style into Dialog
					//this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				this._oViewSettingsDialog.open();
				//this._oViewSettingsDialog._dialog.mAggregations.beginButton.setVisible(true);
			},

			/**
			 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
			 * has been closed with 'OK'. In the case, the currently chosen filters
			 * are applied to the master list, which can also mean that the currently
			 * applied filters are removed from the master list, in case the filter
			 * settings are removed in the ViewSettingsDialog.
			 * @param {sap.ui.base.Event} oEvent the confirm event
			 * @public
			 */
			onConfirmViewSettingsDialog: function(oEvent) {
				
					var aFilterItems = oEvent.getParameters().filterItems,
					aFilters = [],
					aCaptions = [];
				// update filter state:
				// combine the filter array and the filter string
				aFilterItems.forEach(function(oItem) {
					switch (oItem.getKey()) {
						case "Filter1":
							var filter = new Filter("leaveApplied", FilterOperator.LE, 4);
							aFilters.push(filter);

							break;
						case "Filter2":
							var filter = new Filter("leaveApplied", FilterOperator.GT, 4)
							aFilters.push(filter);
							break;
						default:
							break;
					}
					aCaptions.push(oItem.getText());
					
					});
				this.filterLength = aFilters.length;
				this._oListFilterState.aFilter = aFilters;
				//this._updateFilterBar(aCaptions.join(", "));
				this._applyFilterSearch();
			},
			
			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch: function() {
				
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter);
				this.itemsBeforeFilter = window.oList.getBinding("items");
				this.itemsBeforeFilter.filter(aFilters, "Application");
				_listItems = window.oList.getItems();
				oFilteredList = window.oList;
				
				if(!_listItems.length>0){
					filtteredList.length=0;
					this._callMessageBox();
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
					
				}else{
					for(var i=0;i<_listItems.length;i++){
						var item = _listItems[i];
						
						if(item instanceof sap.m.GroupHeaderListItem){
							item = _listItems[i+1];
						}
						var obj = item.getBindingContext("myModel").getObject();
						filteredList.push(obj);

					}					
				}		
				this._setSelectedItem();
			},
			
			onViewSettingsDialogResetFilters : function(){
				
				/*var oModel = this.oList.getModel("myModel");
				window.oList.setModel(oModel,"myModel");*/
				oFilteredList.getBinding("items").filter([]);
			},
			
			onGroup: function(oEvent) {
				
				var sKey = oEvent.getSource().getSelectedItem().getKey(),
					aSorters = this._oGroupSortState.group(sKey);
				this._applyGroupSort(aSorters);
			},

			/**
			 * Internal helper method to apply both group and sort state together on the list binding
			 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
			 * @private
			 */
			_applyGroupSort: function(aSorters) {
				
				window.oList.getBinding("items").sort(aSorters);
				
				this._setSelectedItem();
			},
			
			_setSelectedItem : function(){
				
				
				if(this.bDevice){
					return;
				}
				else {
					
					this._removeSelection(window.oList);
					var item=window.oList.getItems()[0];
					
					if(item instanceof GroupHeaderListItem){
						
						var gHLItem = window.oList.getItems()[1];
						window.oList.setSelectedItem(gHLItem,true);
						this._navToDetail(gHLItem);
					}
					
					else{
						window.oList.setSelectedItem(item,true);
					}
					
					
				}
			},
			
			_removeSelection : function(oList){
				for(var listItem=0;listItem<oList.getItems().length;listItem++){
					oList.setSelectedItem(oList.getItems()[listItem],false);
				}
			},
			
			_navToDetail : function (item){
				
				var binding = item.getBindingContext("myModel");
				this._setDetailData(binding);
			},
			_callMessageBox: function() {
				
				console.log("message box");
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				sap.m.MessageBox.information(
					"Data under this filter is empty, Kindly refresh filter.",
					{
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			},
		});
});