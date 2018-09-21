Vue.component('builder-number-v', {
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
		valPropname:{
			type: String,
			required: true
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
	},
	template: '\
		<v-text-field\
			type="number"\
			\
			:id="inputID"\
			:ref="inputID"\
			\
			:value="inputVal"\
			@input="updateValue"\
			\
			:label="inputLabel"\
			:background-color="inputColor"\
			:disabled="inputDisabled"\
			:clearable="inputClearable"\
			@click:clear="clearInput"\
			@focus="selectAll"\
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		/>\
		</v-text-field>\
	',
	data: function(){
		return{
			valNotes: '',
			hasError: false,
			errMsg: ''
		}
	},
	created: function(){
		//nada
	},
	mounted: function(){
		//this.origVal = this.inputVal;
	},
	watch:{
		field: function(val, prev){
			if(prev[this.valPropname] == undefined){
				//console.log(prev[this.valPropname] + " " + val[this.valPropname]);
				//this.origVal = val[this.valPropname];
			}
		},
		inputVal: function(val, prev){
			//console.log("input " + prev + " -> " + val);
			if(prev == undefined){
				this.origVal = val;
			}
		}
	},
	computed: {
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
		origVal: function(){
			var self = this;
			if(this.origField && this.origField[self.valPropname]){
				return this.origField[self.valPropname];
			}
			else{
				return null;
			}
		},
		fieldVal: function(){
			var self = this;
			if(this.field && this.field[self.valPropname]){			//this.field.hasOwnProperty(self.valPropname)???
				return this.field[self.valPropname];
			}
			else{
				return null;
			}
		},
		inputVal: function(){
			return this.fieldVal;
		},
		wasChanged: function(){
			if( (!(this.origVal) && !(this.inputVal)) || (this.origVal == this.inputVal)){
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
				return 'original: ' + this.valToText(this.origVal);
			}
		},
		logMsg: function(){
			return this.valPropname + "\n" +
			" - original: " + this.valToText(this.origVal) + "\n" + 
			" - current: " + this.valToText(this.inputVal) + "\n" +
			" - field: " + this.valToText(this.fieldVal);
		}
	},
	methods:{
		updateValue: function (newValue) {
			var self = this;
			console.log("number " + this.inputID + " @input " + newValue);
			var formattedValue;

			if(typeof newValue == 'String'){
				formattedValue = newValue.trim();
			}
			if(newValue == ""){
				formattedValue = null;
			}
			// If the value was not already normalized, manually override it to conform
			if (formattedValue !== newValue) {
				//this.$refs[this.field.FormFieldID].value = formattedValue;
			}
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.fieldId, val: Number(formattedValue)});
			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {valPropname: this.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {formSectionID: this.field.FormSectionID, valPropname: this.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				case 'edit-dialog':
					eventHub.$emit('update-edit-dialog', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				default:
					eventHub.$emit('update-field', {fieldID: this.field.FieldId, valPropname: this.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
			}
		},
		logValue: function(){
			console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			console.log("number " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			console.log("number " + this.inputID + " @update:error " + newValue);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			/*setTimeout(function () {
				event.target.select()
			}, 0)*/
		},
		clearInput: function(){
			console.log('clear input callback');
			//this.inputVal = null;
  			return;
		},
		setError: function(errMsg){
		},
		reload: function(val){
		},
	}
})