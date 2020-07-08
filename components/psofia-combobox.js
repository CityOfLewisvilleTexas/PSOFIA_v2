Vue.component('psofia-combobox', {
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
			required: true
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
	},
					//:menu-props="{closeOnClick:false,closeOnContentClick:false,openOnClick:false,\
					//maxHeight:300,offsetY:true,offsetOverflow:true,transition:false}"\
	template: `
		<v-combobox
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
			
			:label="inputLabel"
			:hint="inputDesc"
			:persistent-hint="hasHint"
			:disabled="inputDisabled"
			:clearable="inputClearable"
			:background-color="inputColor"
			:hide-no-data="!searchText"

			@click:clear="clearInput"
			@focus="setSearch"
			@click.right="logValue"
			
			:messages="msg"
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
		</v-combobox>
	`,
	/*:filter="filterOptions"
	@update:search-input="updateSearchText"
	*/
	data: function(){
		return{
			isLoading: true,
			sharedState: store.state,
			inputValObj: '',	//
			inputVal: '',		//includes properties that are val objects: 1 from allSections (sectionID, sectionTitle, sectionDesc)
			optionVals: [],		//includes properties that are val objects, ex: allSections (sectionID, sectionTitle, sectionDesc)
			defaultOption: '',
			searchText: null,
			hasError: false,
			errMsg: '',
			debug: true,
		}
	},


	created: function(){
		 //this.initialize();
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
					//this.loadInput();
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


		/*joinSetTableIdProp: function(){
			if (this.joinSet) return this.sharedState.tableIDs[this.joinSet];
		},*/
		/*listValStr: function(){
			if(this.listTableIdProp == this.listValProp) return this.listValProp;
			else return this.listValProp + '.displayVal'
		},
		listTextStr: function(){
			if(this.listTableIdProp == this.listTextProp) return this.listTextProp;
			else return this.listTextProp + '.displayVal'
		},*/

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
		},

		loadInput: function(){
			this.isLoading = true;
			var self = this;

			this.inputValObj = clone(self.valObj);
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
			if(this.debug) console.log("combobox " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			if(this.debug) console.log("combobox " + this.inputID + " @update:error " + newValue);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			/*setTimeout(function () {
				event.target.select()
			}, 0)*/
		},
		clearInput: function(){
			if(this.debug) console.log('clear input callback');
			//this.nullSelectedItem();
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
		inputValPropname: function(){
			var self = this;
			if(this.valPropname != null && this.field.hasOwnProperty(self.valPropname)){
				return this.valPropname;
			}
			else{
				this.setError("ERROR: Provided Value Poperty Does Not Exist");
				return 'value';
			}
		},
		inputTextPropname: function(){
			var self = this;
			if( this.textPropname != null && ( this.field.hasOwnProperty(self.textPropname) || (this.autocompleteOptions.length > 0 && this.autocompleteOptions[0].hasOwnProperty(self.textPropname)) ) ){
				return this.textPropname;
			}
			else{
				return 'text';
			}
		},
		fieldVal: function(){
			var self = this;
			if(this.field && this.field[self.inputValPropname]){
				return this.field[self.inputValPropname];
			}
			else{
				return null;
			}
		},
		fieldText:function(){
			var self = this;
			if(this.field && this.field.hasOwnProperty(self.inputTextPropname)){ //&& this.field[self.inputTextPropname]){
				return this.field[self.inputTextPropname];
			}
			else if(!(this.fieldVal)){
				return null;
			}
			else{
				var opt = this.autocompleteOptions.find(function(o){
					return o[self.inputValPropname] == self.fieldVal;
				});
				if (opt){
					return opt[self.inputTextPropname];
				}
				else{
					return '[[unknown]]';
				}
			}
		},
		selectedItem: function(){
			var self = this;
			return {
				[self.inputValPropname]:self.fieldVal,
				[self.inputTextPropname]:self.fieldText
			}
		},
		inputVal: function(){
			var self = this;
			return this.selectedItem[self.inputValPropname];
		},
		inputText: function(){
			var self = this;
			return this.selectedItem[self.inputTextPropname];
		},


		getSelectedText: function(item){
			if(this.debug) console.log(item)
			var val, txt;
			val = this.getItemVal(item);
			txt = this.getItemText(item);
			return txt;
		},
		filterOptions: function(item, queryText, itemText){
			if (item.header){
				return false;
			}

			var text = (itemText != null) ? itemText : '';
			var query = (queryText != null) ? queryText : '';

			//if (query.toString().length < 4){
			//	return false;
			//}

			return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1;
		},
		filteredItems: function(){
			var self = this;
			return this.items.filter(function(i){
				if(self.searchText && self.searchText.length > 4){
					//i[this.inputTextPropname]
					return true;
				}
				else{
					return false;
				}
			})
		},
*/