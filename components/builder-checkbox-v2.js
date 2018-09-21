Vue.component('builder-checkbox-v', {
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
		concatId:{
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
		dataPortion:{
			type: String,
			required: false
		},
	},
	template: `\
		<v-checkbox\
			:id="inputID"\
			:ref="inputID"\
			\
			v-bind:value="inputVal"\
			v-on:input="updateValue"\
			@change="changeValue"\
			@update:error="updateErr"\
			\
			:label="inputLabel"\
			:background-color="inputColor"\
			:disabled="inputDisabled"\
			@click.right="logValue"\
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		>\
		</v-checkbox>\
	`,
	data: function(){
		return{
			valNotes: '',
			hasError: false,
			errMsg: ''
		}
	},
	created: function(){
		//listen on event hub
	},
	mounted: function(){
		//nada
	},
	watch:{
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
			if(this.field && this.field[self.valPropname]){
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
			// both null or is equal for false
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
		updateValue:function(newValue){
			console.log("checkbox " + this.inputID + " @input " + newValue);

			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {needsUpdate: this.wasChanged, valPropname: this.valPropname, val: value});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {needsUpdate: this.wasChanged, formSectionID: this.field.FormSectionID, valPropname: this.valPropname, val: value});
				break;
				default:
					eventHub.$emit('update-field', {needsUpdate: this.wasChanged, fieldID: this.field.FieldId, valPropname: this.valPropname, val: value});
			}
		},
		valToText: function(oVal){
			var val = oVal;
			if(val){
				return val.toString();
			}
			else if(val == ''){
				return 'blank';
			}
			else{
				return 'null';
			}
		},
		logValue: function(){
			console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			console.log("text " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			console.log("text " + this.inputID + " @update:error " + newValue);
		},
		setError: function(errMsg){
		},
		reload: function(val){
		},
	}
})