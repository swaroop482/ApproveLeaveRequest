sap.ui.define([
		"sap/ui/base/Object",
		"sap/ui/model/Sorter"
	], function (BaseObject, Sorter) {
	"use strict";

	return BaseObject.extend("sap.m.sample.SemanticPage.GroupSortState", {

		/**
		 * Creates sorters and groupers for the master list.
		 * Since grouping also means sorting, this class modifies the viewmodel.
		 * If a user groups by a field, and there is a corresponding sort option, the option will be chosen.
		 * If a user ungroups, the sorting will be reset to the default sorting.
		 * @class
		 * @public
		 * @param {sap.ui.model.json.JSONModel} oViewModel the model of the current view
		 * @param {function} fnGroupFunction the grouping function to be applied
		 * @alias sap.ui.demo.masterdetail.model.GroupSortState
		 */
		constructor: function (fnGroupFunction) {
			
			this._fnGroupFunction = fnGroupFunction;
		},

		
		/**
		 * Groups by UnitNumber, or resets the grouping for the key "None"
		 *
		 * @param {string} sKey - the key of the field used for grouping
		 * @returns {sap.ui.model.Sorter[]} an array of sorters
		 */
		group: function (sKey) {
			var aSorters = [];

			if (sKey === "id") {
				
				aSorters.push(
					new Sorter("id", false,
						this._fnGroupFunction.bind(this))
				);
			} else if (sKey === "None") {
				// select the default sorting again
				/*aSorters.push(
						new Sorter("", false,
							this._fnGroupFunction.bind(this))
					);*/
				aSorters=[];
			}
			return aSorters;
		}

	});
});