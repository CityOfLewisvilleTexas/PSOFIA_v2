Vue.component('psofia-autocomplete', {
	// declare the props
	props: {
		dataName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: true
		},
		dataId:{	// formFieldID, formSectionID, formSubSectionID, etc
			type: Number,
			required: false
		},
		valPropname:{
			type: String,
			required: false
		},
		formFieldId:{
			type: Number,
			required: false
		},
		idText:{
			type: String,
			required: false
		},
		idNum:{
			type: Number,
			required: false
		},
		idPropname:{
			type: String,
			required: false
		},
		concatID:{
			type: Boolean,
			required: false,
			default: false
		},
		labelText:{
			type: String,
			required: false
		},
		labelPropname:{
			type: String,
			required: false
		},
		descPropname:{
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
		minimalInput:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<div>
			<v-autocomplete :dense="true"
				:id="inputID"
				:ref="inputID"
				
				v-bind:value="inputItem"
				v-on:input="updateValue"
				@change="changeValue"
				@update:error="updateErr"
				:return-object="true"
				:search-input.sync="searchText"

				:items="autocompleteOptions"
				:item-text="itemTextProp"
				:item-value="itemValueProp"
				:filter="filterOptions"
				:hide-no-data="false"
				
				:label="minimalInput ? '' : inputLabel"
				:hint="minimalInput ? '' : inputDesc"
				:persistent-hint="minimalInput ? false : hasHint"
				:disabled="inputDisabled"
				:clearable="inputClearable"

				@click:clear="clearInput"
				@focus="setSearch"
				@click.right="logValue"
				
				append-outer-icon="launch"
				@click:append-outer="openEditDialog"
				
				:messages="minimalInput ? '' : msg"
				:success="wasChanged"

				:rules="[]"
				:error="hasError"
			>
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
				<template slot="no-data">
					<v-list-tile>
						<v-list-tile-title>
							No data found: 
							<strong>{{searchText}}</strong>
						</v-list-tile-title>
					</v-list-tile>
				</template>
			</v-autocomplete>
		</div>
	`,
	/*<builder-dept-dialog-v
				v-if="dataPortion == 'form-data' && valPropname == 'DepartmentID'"
				:search-text="searchText"
				:departments="autocompleteOptions"
				:show-dialog="showDialog"
			></builder-dept-dialog-v>*/
	data: function(){
		return{
			sharedState: store.state,
			isLoading: true,
			inputValObj: {},
			inputItem: {},
			autocompleteOptions: [],
			searchText: null,
			showDialog: false,
			valNotes: '',
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
		compError: function(){
			if((this.dataName !== 'formData' || this.dataName !== 'record') && !(this.dataId)){
				return true;
			}
			else return false;
		},
		dataIdPropname: function(){
			var propname;
			if(this.dataName == 'sections'){
				propname = 'FormSectionID';
			}
			else if(this.dataName == 'subSections'){
				propname = 'FormSubSectionID';
			}
			else if(this.dataName == 'fields'){
				propname = 'FormFieldID';
			}
			return propname;
		},

		payload: function(){
			var self = this;
			if(!(this.dataId)){
				return {objName: self.dataName, propname: self.valPropname};
			}
			else{
				return {objName: self.dataName, id: self.dataId, idPropname: self.dataIdPropname, propname: self.valPropname};
			}
		},
		origPayload: function(){
			var self = this;
			return Object.assign({}, self.payload, {isOrig:true});
		},
		valObj: function(){
			var self = this;
			return store.getObjProp(self.payload);
		},
		origValObj: function(){
			var self = this;
			return store.getObjProp(self.origPayload);
		},

		formField: function(){
			var self = this;
			if(self.formFieldId){
				return store.getFormField({id:self.formFieldId});
			}
			else return null;
		},
		inputID: function(){
			var self = this;
			var id = 'input';

			if(this.formField){
				/*if(this.idPropname != null && this.formField.hasOwnProperty(self.idPropname)){
					if(!(this.concatID)){
						return 'input_' + this.formField[self.idPropname].toString();
					}
					else id += '_' + this.formField[self.idPropname].toString();
				}*/
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
		inputDesc: function(){
			var self = this;
			if(this.formField){
				return this.formField.FieldDesc;
			}
			/*else if(this.descPropname != null && this.formField.hasOwnProperty(self.descPropname)){
				return this.formField[self.descPropname];
			}*/
			else return null;
		},
		hasHint: function(){
			if (this.inputDesc){
				return true;
			}
			else return false;
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


		wasChanged: function(){
			// both null or is equal for false
			if( this.valObj.updateDB ){
				return true;
			}
			else return false;
		},
		inputColor: function(){
			if(this.wasChanged){
				return 'green';
			}
			else return '';
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged){
				return 'original: ' + this.valToText(this.origValObj);
			}
			else return null;
		},
		logMsg: function(){
			return this.valPropname + "\n" +
			" - original: [" + this.valToText(this.origValObj) + "] " + this.origValObj.displayVal + "\n" + 
			" - current: [" + this.valToText(this.valObj) + "] " + this.valObj.displayVal + "\n" +
			" - input: [" + this.valToText(this.inputValObj) + "] " + this.inputValObj.displayVal;
		},
	},
	methods:{
		initialize: function(){
			this.loadInput();
			this.loadAutocompleteOptions();
		},
		loadInput: function(){
			this.loading = true;
			var self = this;

			this.inputValObj = clone(self.valObj);
			this.inputItem = this.inputValObj.valObj;
			this.loading = false;
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
				if(oVal.val){
					return oVal.val.toString();
				}
				else if(oVal.val == ''){
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
			if(this.debug) console.log(this.logMsg);
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