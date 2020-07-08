Vue.component('builder-autocomplete-v', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		origField:{
			type: Object,
			required: false
		},
		autocompleteOptions:{
			type: [Object, Array],
			required: false
		},
		valPropname:{
			type: String,
			required: false
		},
		textPropname:{
			type: String,
			required: false
		},
		idText:{
			type: String,
			required: false
		},
		idNum:{
			type: Number,
			required: false,
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
		dataPortion:{
			type: String,
			required: false
		},
		addOption:{
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: `\
		<div>
		<v-autocomplete\
			:id="inputID"\
			:ref="inputID"\
			\
			v-bind:value="selectedItem"\
			v-on:input="updateValue"\
			@change="changeValue"\
			@update:error="updateErr"\
			:search-input.sync="searchText"
			\
			:label="inputLabel"\
			:background-color="inputColor"\
			:dense="true"\
			:disabled="inputDisabled"\
			:hide-no-data="false"\
			:clearable="inputClearable"\
			@click:clear="clearInput"\
			@focus="setSearch"\
			@click.right="logValue"
			\
			:items="autocompleteOptions"\
			:item-text="inputTextPropname"\
			:item-value="inputValPropname"\
			:filter="filterOptions"\
			:return-object="true"\
			\
			:append-outer-icon="addOption ? 'edit' : ''"
			@click:append-outer="openEditDialog"
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		>\
			<template slot="no-data">\
				<v-list-tile>
					<v-list-tile-title>
						No data found: 
						<strong>{{searchText}}</strong>
					</v-list-tile-title>
				</v-list-tile>\
			</template>\
		</v-autocomplete>\
		<builder-dept-dialog-v
			v-if="dataPortion == 'form-data' && valPropname == 'DepartmentID'"
			:search-text="searchText"
			:departments="autocompleteOptions"
			:show-dialog="showDialog"
		></builder-dept-dialog-v>
		</div>
	`,
	data: function(){
		return{
			// copy objs
			//list vars
			//selectedItemB: {},
			searchText: null,
			showDialog: false,
			valNotes: '',
			textNotes: '',
			hasError: false,
			errMsg: '',
			dataField:{},
		}
	},
	created: function(){
		var self = this;

		eventHub.$on('close-dialog', self.closeDialog);
		///Vue.set(self.selectedItemB, self.inputValPropname, self.fieldVal);
		//Vue.set(self.selectedItemB, self.inputTextPropname, self.fieldText);
	},
	mounted: function(){
		var self = this;
		//Vue.set(self.selectedItemB, self.inputValPropname, self.fieldVal);
		//Vue.set(self.selectedItemB, self.inputTextPropname, self.fieldText);
	},
	watch:{
		/*fieldVal: function(val, prev){
			var self = this;
			if(prev == undefined){
				console.log(val);
				Vue.set(self.selectedItemB, self.inputValPropname, self.fieldVal);
				Vue.set(self.selectedItemB, self.inputTextPropname, self.fieldText);
			}
		},
		fieldText: function(val, prev){
			var self = this;
			if(prev == undefined){
				console.log('fieldText changed');
				//Vue.set(self.selectedItemB, self.inputValPropname, self.fieldVal);
				//Vue.set(self.selectedItemB, self.inputTextPropname, self.fieldText);
			}
		},*/
		/*selectedItem:function(val, prev){
			console.log('selectedItem watch');
			if (typeof val === 'string') {
				console.log('selectedItem watch - string');
				//var newItem = {};
				/*this.selectedItemB[self.inputTextPropname] = val;
				this.selectedItemB[self.inputValPropname] = null;
				*
      			//this.selectedItemB = newItem;
      		}
		},
		searchText:function(val, prev){
			console.log('searchText watch - ' + prev + ' -> ' + val);
		}*/
	},
	computed:{
		inputID: function(){
			var self = this;

			var id = '';
			if(this.concatID){
				if(this.idText != null && this.idNum == null && this.idPropname == null){
					id += this.idText;
				}
				if(this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
					id += this.field[self.idPropname].toString();
				}
				if(this.idNum != null){
					id += '_' + this.idNum.toString();
				}
			}
			else{
				if(this.idText != null){
					id = this.idText;
				}
				else if(this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
					id = this.field[self.idPropname].toString();
				}
			}

			if(id.length > 0){
				return id;
			}
			else{
				return null;
			}
		},
		inputLabel: function(){
			var self = this;
			if(this.labelText != null){
				return this.labelText;
			}
			else if(this.labelPropname != null && this.field.hasOwnProperty(self.labelPropname)){
				return this.field[self.labelPropname];
			}
			else{
				return null;
			}
		},
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
		origVal: function(){
			var self = this;
			if(this.origField && this.origField[self.inputValPropname]){
				return this.origField[self.inputValPropname];
			}
			else{
				return null;
			}
		},
		origText: function(){
			var self = this;

			if(this.origField && this.origField.hasOwnProperty(self.inputTextPropname)){ //&& this.field[self.inputTextPropname]){
				return this.origField[self.inputTextPropname];
			}
			else if(!(this.origVal)){
				return null;
			}
			else{
				var opt = this.autocompleteOptions.find(function(o){
					return o[self.inputValPropname] == self.origVal;
				});
				if (opt){
					return opt[self.inputTextPropname];
				}
				else{
					return '[[unknown]]';
				}
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
		wasChanged: function(){
			// both null or is equal for false
			if( (!(this.origVal) && !(this.inputVal)) || (this.origVal == this.inputVal) ){
				return false;
			}
			else if( (!(this.origText) && !(this.inputText)) || (this.origText == this.inputText) ){
				return false;
			}
			else{
				return true;
			}
		},
		inputColor: function(){
			if(this.wasChanged){
				return 'green';
			}
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged){
				return "original: " + this.valToText(this.origText) + " [" + this.valToText(this.origVal) + "]";
			}
		},
		logMsg: function(){
			return "[" + this.inputValPropname + "] " + this.inputTextPropname + '\n' +
				" - original: [" + this.valToText(this.origVal) + "] " + this.valToText(this.origText) + '\n' +
				" - current: [" + this.valToText(this.inputVal) + "] " + this.valToText(this.inputText) + '\n' +
				" - field: [" + this.valToText(this.fieldVal) + "] " + this.valToText(this.fieldText);
		}
	},
	methods:{
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
		updateValue:function(newValue){
			var self = this;
			console.log("autocomplete " + this.inputID + " @input " + newValue);

			var item = this.getNullItem();

			if (typeof newValue === 'string') {
				console.log('selectedItem string');
				item[this.inputTextPropname] = newValue;
				item[this.inputValPropname] = -1;
      		}
      		else if(newValue){ 
      			console.log(newValue);
      			item[this.inputValPropname] = newValue[this.inputValPropname];
      			if(newValue.hasOwnProperty(self.inputTextPropname)){
      				item[this.inputTextPropname] = newValue[this.inputTextPropname];
      			}
      			else{
      				console.log('no text on selectedItem' + newValue[this.inputValPropname]);
      			}
      		}
      		else{
      			console.log("selectedItem undefined?");
      		}

			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {formSectionID: self.field.FormSectionID, valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
				break;
				case 'edit-dialog':
					eventHub.$emit('update-edit-dialog', {formSectionID: self.field.FormSectionID, valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
				break;
				default:
					eventHub.$emit('update-field', {fieldID: self.field.FieldId, valPropname: self.inputValPropname, val: item[self.inputValPropname], textPropname: self.inputTextPropname, text: item[self.inputTextPropname]});
			}
			//this.selectedItem = item;
		},
		updateSearchText: function(val){
			console.log("updateSearchText " + val);
		},
		setSearch: function(){
			console.log("setSearch");
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
				[self.inputValPropname]:null,
				[self.inputTextPropname]:null
			}
		},
		closeDialog: function(){
			if(this.showDialog){
				this.showDialog = false;
			}
		},
		valToText: function(oVal){
			var val = oVal;
			if(val){
				return val.toString();
			}
			else if(val == ''){
				return 'blank'
			}
			else{
				return 'null'
			}
		},
		logValue: function(){
			console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(value){
			console.log("autocomplete " + this.inputID + " @change " + value);
		},
		// @update:error (boolean)
		updateErr: function(value){
			console.log("autocomplete " + this.inputID + " @update:error " + value);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		},
		clearInput: function(){
			console.log('clear input callback?');
  			//this.searchText = null;
  			return;
		},
		setError: function(errMsg){
		},
		reload: function(val){
		}
	}
})