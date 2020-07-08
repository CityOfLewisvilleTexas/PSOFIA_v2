Vue.component('psofia-autocomplete', {
	props: {
		stateName:{	
			type: String,
			required: false,
			default: 'form'
		},
		storeName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: true
		},
		storeId:{	// formFieldID, formSectionID, formSubSectionID, etc
			type: Number,
			required: false
		},
		valPropname:{
			type: String,
			required: false
		},
		inputDisabled:{
			type: Boolean,
			required: false,
			default: false
		},
		inputClearable:{
			type: Boolean,
			required: false,
			default: true
		},
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
		minimalInput:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<v-autocomplete
			:id="inputID"
			:ref="inputID"
			
			:value="inputVal"
			@input="updateValue"
			@change="changeValue"
			@update:error="updateErr"
			
			:items="orderedJoinSetValObjs"
			:search-input.sync="searchText"
			:filter="customFilter"
			return-object
			
			:label="minimalInput ? '' : inputLabel"
			:hint="minimalInput ? '' : inputDesc"
			:persistent-hint="minimalInput ? false : hasHint"
			:disabled="inputDisabled"
			:clearable="inputClearable"

			:background-color="inputColor"
			:hide-no-data="!searchText"

			@click:clear="clearInput"
			@focus="setSearch"
			@click.right="logValue"
			
			:messages="minimalInput ? '' : msg"
			:success="wasChanged"

			:rules="[]"
			:error="hasError"
		>
			<template v-slot:selection="{ attr, on, item, selected }">
				<v-list-item-title>
					{{ getFullInputText(item) }}
				</v-list-item-title>
			</template>
			<template v-slot:item="{ item }">
				{{ getFullInputText(item) }}
			</template>
			
			<!--<template slot="selection" slot-scope="data">
				<v-chip
					:selected="data.selected"
					:disabled="data.disabled"
					:key="data.item[inputValPropname]"
					@input="data.parent.selectItem(data.item)"
				
				{{ data.item[inputTextPropname] }}
				<!--</v-chip>
			</template>-->

			<template slot="no-data">
				<v-list-tile>
					<v-list-tile-title>
						No data found: 
						<strong>{{searchText}}</strong>
					</v-list-tile-title>
				</v-list-tile>
			</template>
		</v-autocomplete>
	`,
	/*
	append-outer-icon="launch"
			@click:append-outer="openEditDialog"*/
	/*<builder-dept-dialog-v
				v-if="dataPortion == 'form-data' && valPropname == 'DepartmentID'"
				:search-text="searchText"
				:departments="autocompleteOptions"
				:show-dialog="showDialog"
			></builder-dept-dialog-v>*/
	data: function(){
		return{
			isLoading: true,
			sharedState: store.state,
			inputValObj: '',	//{}
			inputVal: '',		//includes properties that are val objects: 1 from allSections (sectionID, sectionTitle, sectionDesc)
			optionVals: [],		//includes properties that are val objects, ex: allSections (sectionID, sectionTitle, sectionDesc)
			defaultOption: '',
			searchText: null,
			showDialog: false,
			hasError: false,
			errMsg: '',
			debug: true,
		}
	},
	created: function(){
		var self = this;
		eventHub.$on('close-dialog', self.closeDialog);
	},
	mounted: function(){
		var self = this;
		Vue.nextTick(function(){
            self.initialize();
        });
	},
	watch:{
		valObj: {
			handler: function(val, prev){
				if(val){
					if(this.debug) console.log('watch field obj - reload input');
					this.loadInput();
				}
			},
			deep: true
		}
	},
	computed:{
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

		compError: function(){
			if((this.storeName !== 'formData' || this.storeName !== 'formRecord') && !(this.storeId)) return true;
			else return false;
		},
		storeIdPropname: function(){
			return this.sharedState.tableIDs[this.storeName];
		},
		descPropname: function(){
			var propname;
			if(this.storeName == 'formSections') propname = 'SectionDesc';
			else if(this.storeName == 'formSubSections') propname = 'SubsectionDesc';
			else if(this.storeName == 'formFields') propname = 'FieldDesc';
			return propname;
		},

		payload: function(){
			return {stateName: this.stateName, storeName: this.storeName, id: this.storeId, propname: this.valPropname};
		},
		origPayload: function(){
			return Object.assign({}, this.payload, {stateName: 'database'});
		},
		descPayload: function(){
			return Object.assign({}, this.payload, {propname:this.descPropname});
		},

		valObj: function(){
			return store.getObjProp(this.payload);
		},
		origValObj: function(){
			return store.getObjProp(this.origPayload);
		},

		joinSet: function(){
			if(this.valObj) return this.valObj.JoinSet;
		},
		joinSetValProp: function(){
			if(this.valObj) return this.valObj.ValProp;
		},
		joinSetPayload: function(){
			if(this.joinSet) return {storeName: this.joinSet};
		},
		joinSetDefPayload: function(){
			if(this.joinSetPayload) return Object.assign({}, this.joinSetPayload, {stateName: 'default'});;
		},

		joinSetValObjs: function(){
			if(this.joinSetPayload) return store.getArrDataObjs(this.joinSetPayload)
		},
		joinSetDefault: function(){
			if(this.joinSetDefPayload) return store.getDataObj(this.joinSetDefPayload)
		},

		joinSetTextProp: function(){
			if(this.valObj) return this.valObj.TextProp;
		},
		joinSetStoreIdPropname: function(){
        	if (this.joinSet) return store.getStoreTableID(this.joinSetPayload);
        },
        /*joinSetOrderIdPropname: function(){
        	if (this.joinSet) return store.getStoreOrderID(this.joinSetPayload);
        },*/

        orderedJoinSetValObjs: function(){
        	if(this.filteredFields){
				var orderPayload = Object.assign({}, this.joinSetPayload, {arrDataObjs: joinSetValObjs});
				return store.orderArrDataObjs(orderPayload);
			}
        	/*var self = this;
            if(this.joinSetOrderIdPropname && this.joinSetValObjs.length > 0){
                return this.joinSetValObjs.sort(function(a, b){
                    return a[self.joinSetOrderIdPropname] - b[self.joinSetOrderIdPropname];
                });
            }
            else return this.joinSetValObjs;
            */
        },

        // only for dialog
		isDialog: function(){
			return (this.stateName && this.stateName == 'dialog');
		},
		formPayload: function(){
			if(this.isDialog) return Object.assign({}, this.payload, {stateName: 'form'});
			else return null;
		},
		formValObj: function(){
			if(this.isDialog) return store.getObjProp(this.payload);
			else return null
		},

		formField: function(){
			var self = this;
			if(self.formFieldId){
				return store.getFormField({id:self.formFieldId});
			}
			else return null;
		},

		inputID: function(){
			var id = '';
			if(this.storeId) id += 'input_' + this.storeName + '_' + this.storeIdPropname + this.storeId + '_' + this.valPropname;
			else id += 'input_' + this.storeName + '_' + this.valPropname;

			if(id.length > 0) return id;
			else return null;
		},
		inputLabel: function(){
			if(this.valObj) return this.valObj.Label;
			else return null;
		},
		inputDesc: function(){
			var self = this;
			if(this.storeName === 'formFields') return store.getObjProp(self.descPayload);
			//else if(this.descPropname != null && this.valObj.hasOwnProperty(self.descPropname)) return this.valObj[self.descPropname];
			else return null;
		},

		hasHint: function(){
			if (this.inputDesc) return true;
			else return false;
		},
		wasChanged: function(){
			if(this.valObj.updateDB) return true;
			else return false;
		},
		inputColor: function(){
			if(this.wasChanged) return 'green';
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged) return 'original: ' + this.valToText(this.origValObj);
		},
		logMsg: function(){
			if(!this.isDialog){
				return this.valPropname + "\n" +
				" - original: " + this.valToText(this.origValObj) + "\n" + 
				" - current: " + this.valToText(this.valObj) + "\n" +
				" - input: " + this.valToText(this.inputValObj);
			}
			else{
				return this.valPropname + "\n" +
				" - original: " + this.valToText(this.origValObj) + "\n" + 
				" - form: " + this.valToText(this.formValObj) + "\n" +
				" - dialog: " + this.valToText(this.valObj) + "\n" +
				" - input: " + this.valToText(this.inputValObj);
			}
		}
	},
	methods:{
		initialize: function(){
			this.loadInput();
			//this.loadAutocompleteOptions();
		},

		loadInput: function(){
			this.loading = true;
			var self = this;

			this.inputValObj = clone(self.valObj);
			//this.inputItem = this.inputValObj.valObj;
			//this.loading = false;
			Vue.nextTick(function(){
				if(self.inputValObj.valObj){
					if(self.debug) console.log('HAS VALUE')
					self.inputVal = clone(self.inputValObj.valObj);
				}
				else if(self.debug) console.log('NO VALUE')
				self.loadOptions();
			});
		},
		loadOptions: function(){
			var self = this;
			this.optionVals = clone(self.joinSetValObjs);
			this.loadDefaultOption();
		},
		loadDefaultOption: function(){
			var self = this;
			this.defaultOption = clone(self.joinSetDefault);
			this.isLoading = false;
		},

		getItemVal: function(item){
			if (item && this.joinSetStoreIdPropname && this.joinSetValProp){
				// table id was not converted to valObj;
				if (this.joinSetStoreIdPropname == this.joinSetValProp) return item[this.joinSetValProp].toString();
				else return item[this.joinSetValProp].displayVal;
			}
			else return null;
		},
		getItemText: function(item){
			if (item && this.joinSetStoreIdPropname && this.joinSetTextProp){
				// table id was not converted to valObj;
				if (this.joinSetStoreIdPropname == this.joinSetTextProp) return item[this.joinSetTextProp].toString();
				else return item[this.joinSetTextProp].displayVal;
			}
			else return null;
		},
		getFullInputText: function(item){
			var val, txt;
			val = this.getItemVal(item);
			txt = this.getItemText(item);
			if(val && txt) return txt + ' (' + val + ')';
			else if(txt) return txt;
			else if (val) return val;
			else return null;
			//return txt;
		},

		customFilter (item, queryText, itemText) {
			var textOne = this.getItemText(item).toUpperCase()
			//const textTwo = item.abbr.toLowerCase()
			var searchText = queryText.toUpperCase()

			return textOne.indexOf(searchText) > -1;
		},

		updateValue:function(newValue){
			var self = this;
			var valO, textO;

			//this.inputVal = newValue;
			if(newValue){
				if(typeof newValue === 'object'){
					if(this.debug) console.log('combo update - obj');
					this.inputValObj.valObj = newValue;

					valO = newValue[this.joinSetValProp];
					if(typeof(valO) === "object"){
						this.inputValObj.dbVal = valO.dbVal;
						this.inputValObj.val = valO.val;
					}
					else{
						this.inputValObj.dbVal = valO;
						this.inputValObj.val = valO;
					}

					textO = newValue[this.joinSetTextProp];
					if(typeof(valO) === "object"){
						//this.inputValObj.val = textO.val;
						this.inputValObj.displayVal = textO.displayVal;
					}
					else{
						//this.inputValObj.val = textO;
						this.inputValObj.displayVal = textO;
					}
				}
				else{
					if(this.debug) console.error('combo update - not obj');
					if(this.debug) console.error(newValue);
				}
	        }
	        else{
	        	if(this.debug) console.log('combo update - null');
	        	this.inputValObj.valObj = null;
	        	this.inputValObj.dbVal = null;
	        	this.inputValObj.val = null;
				this.inputValObj.displayVal = '';
	        }

	        /*var item = this.getNullItem();

			if (typeof newValue === 'string') {
				if(this.debug) console.log('selectedItem string');
				item[this.inputTextPropname] = newValue;
				item[this.inputValPropname] = -1;
      		};
      		else if(newValue){ 
      			if(this.debug) console.log(newValue);
      			item[this.inputValPropname] = newValue[this.inputValPropname];
      			if(newValue.hasOwnProperty(self.inputTextPropname)){
      				item[this.inputTextPropname] = newValue[this.inputTextPropname];
      			}
      			else{
      				if(this.debug) console.log('no text on selectedItem' + newValue[this.inputValPropname]);
      			}
      		}
      		else{
      			if(this.debug) console.log("selectedItem undefined?");
      		}*/

			/*switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {formSectionID: self.field.FormSectionID, valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
				break;
				default:
					eventHub.$emit('update-field', {fieldID: self.field.FieldId, valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
			}*/
			//this.selectedItem = item;
		},
		updateSearchText: function(val){
			if(this.debug) console.log("updateSearchText " + val);
		},
		setSearch: function(){
			if(this.debug) console.log("setSearch");
			//this.searchText = this.selectedItem[this.inputTextPropname];
			//this.nullSelectedItem();
			return;
		},
		openEditDialog: function(){
			this.showDialog = true;
		},
		getNullItem:function(){
			var self = this;
			return {
				[self.itemTextProp]:null,
				[self.itemValueProp]:null
			}
		},
		closeDialog: function(){
			if(this.showDialog){
				this.showDialog = false;
			}
		},
		valToText: function(oVal){
			if(oVal){
				if(oVal.dbVal){
					return oVal.dbVal.toString();
				}
				else if(oVal.dbVal == ''){
					return 'blank';
				}
				else{
					return 'null';
				}
			}
			else{
				return 'null obj'
			}
		},
		logValue: function(){
			console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			if(this.debug) console.log("autocomplete " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			if(this.debug) console.log("autocomplete " + this.inputID + " @update:error " + newValue);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			/*setTimeout(function () {
				event.target.select()
			}, 0)*/
		},
		clearInput: function(){
			if(this.debug) console.log('clear input callback?');
  			//this.searchText = null;
  			return;
		},
		setError: function(errMsg){
		},
		reload: function(val){
		}
	}
})


/*
			:value="inputItem"
			:items="autocompleteOptions"
			:item-text="itemTextProp"
			:item-value="itemValueProp"
			:filter="filterOptions"
			:hide-no-data="false"

			<template slot="selection" slot-scope="{ item, index }">
				<span>{{item[itemTextProp]}}
					<span class="grey--text caption">
						{{' (' + item[itemValueProp].toString() + ')'}}
						<span v-if="item[itemGroupProp]" class="font-italic">
							{{' ' + item[itemGroupProp]}}
						</span>
					</span>
				</span>
			</template>
			<template slot="item" slot-scope="{ item, tile }">
				<template v-if="typeof item !== 'object'">
					<v-list-tile-content v-text="item"></v-list-tile-content>
				</template>
				<template v-else>
					<v-list-tile-content>
						<v-list-tile-title>
							{{item[itemTextProp]}}
							<span class="grey--text">
								{{' (' + item[itemValueProp].toString() + ')'}}
							</span>
						</v-list-tile-title>
						<v-list-tile-sub-title v-if="item[itemGroupProp]">
							{{item[itemGroupProp]}}
						</v-list-tile-sub-title>
					</v-list-tile-content>
				</template>
			</template>


			inputItem: {},
			autocompleteOptions: [],


		inputID: function(){
			var self = this;
			var id = 'input';

			if(this.formField){
				/*if(this.idPropname != null && this.formField.hasOwnProperty(self.idPropname)){
					if(!(this.concatID)){
						return 'input_' + this.formField[self.idPropname].toString();
					}
					else id += '_' + this.formField[self.idPropname].toString();
				}*
				if(!(this.concatID)){
					return 'input_' + this.formField.FormFieldID.toString();
				}
				else id += '_' + this.formField.FormFieldID.toString();
			}

			if(this.idText != null){
				if(!(this.concatID)){
					return 'input_' + this.idText.toString();
				}
				else id += '_' + this.idText.toString();
			}
			else if(this.valPropname != null){
				if(!(this.concatID)){
					return 'input_' + this.valPropname.toString();
				}
				else id += '_' + this.valPropname.toString();
			}

			if(this.idNum != null){
				if(!(this.concatID)){
					return 'input_' + this.idNum.toString();
				}
				else id += '_' + this.idNum.toString();
			}

			if(id.length > 5){
				return id;
			}
			else return null;
		},
		inputLabel: function(){
			var self = this;

			if(this.formField){
				if(this.labelPropname != null && this.formField.hasOwnProperty(self.labelPropname)){
					return this.formField[self.labelPropname];
				}
				else{
					return this.formField.FieldName;
				}
			}
			else if(this.labelText != null){
				return this.labelText;
			}
			else if(this.valPropname != null){
				return this.valPropname;
			}
			else return null;
		},
		addInDialog: function(){
			if(this.dataName == 'record' && this.valPropname == 'DepartmentID'){
				return true;
			}
			else return false;
		},
		itemTextProp: function(){
			if(this.dataName == 'record' && this.valPropname == 'DepartmentID'){
				return 'Department';
			}
			else return 'EntryName';
		},
		itemValueProp: function(){
			if(this.dataName == 'record' && this.valPropname == 'DepartmentID'){
				return 'DepartmentID';
			}
			else return 'EntryValue';
		},
		itemGroupProp: function(){
			if(this.dataName == 'record' && this.valPropname == 'DepartmentID'){
				return '';
			}
			else return 'VSECategory';
		},



		loadAutocompleteOptions: function(){
			var self = this;
			if(self.valObj.valType == 'set' && self.valObj.hasOwnProperty('ValidationSetID') && self.valObj.ValidationSetID){
				this.autocompleteOptions = clone(store.getFormVSOptions_OrderedInSet_ExCategory(self.valObj.ValidationSetID));
			}
			else if(self.valObj.valType == 'dept'){
				this.autocompleteOptions = clone(store.getDepartments_Ordered());
			}
		},
		filterOptions: function(item, queryText, itemText){
			var self = this;
			var query;
			var returnVal = false;

			if(queryText != null){
				if(!(isNaN(queryText))){
					// search for number at beginning of entry value
					query = queryText;
					returnVal = item[self.itemValueProp].toString().startsWith(query);
				}

				if(returnVal == false){
					// search for text anywhere in EntryName/Department
					query = queryText.toUpperCase();
					returnVal = item[self.itemTextProp].toUpperCase().indexOf(query) > -1;
				}
				return returnVal;
			}
			else{
				return true;
			}
		},
		updateValue:function(newValue){
			var self = this;

			var item = this.getNullItem();
			var payload3;

			if (typeof newValue === 'string') {
				if(this.debug) console.log("autocomplete " + this.inputID + " @input string: " + newValue);
				item[self.itemTextProp] = newValue;
				item[self.itemValueProp] = -1;
      		}
      		else if(newValue){
      			if(this.debug) console.log("autocomplete " + this.inputID + " @input valObj: " + newValue[self.itemTextProp] + " (" + newValue[self.itemValueProp] + ")");
      			if(this.debug) console.log(newValue);

      			item = newValue;

      			this.inputValObj.valObj = item;
      			this.inputValObj.dbVal = item[self.itemValueProp];
      			this.inputValObj.val = item[self.itemValueProp];
                this.inputValObj.displayVal = item[self.itemTextProp].toString();

      			payload3 = Object.assign({}, self.payload, {valObj: self.inputValObj});
				store.updateObjProp(payload3);
      		}
      		else{
      			if(this.debug) console.log("autocomplete " + this.inputID + " @input newValue undefined?");
      			this.inputValObj.valObj = newValue;
      			this.inputValObj.dbVal = null;
      			this.inputValObj.val = null;
                this.inputValObj.displayVal = '';

                payload3 = Object.assign({}, self.payload, {valObj: self.inputValObj});
				store.updateObjProp(payload3);
      		}
		},
*/