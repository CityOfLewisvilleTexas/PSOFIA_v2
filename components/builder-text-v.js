Vue.component('builder-text-v', {
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
	template: `\
		<v-text-field\
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
			:clearable="inputClearable"\
			@click:clear="clearInput"\
			@focus="selectAll"\
			@click.right="logValue"\
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		>\
		</v-text-field>\
	`,
	data: function(){
		return{
			//_field: this.field,
			//_origField: this.origField,
			//inputVal: '',
			valNotes: '',
			hasError: false,
			errMsg: ''
		}
	},
	created: function(){
		//nada
	},
	mounted: function(){
		//this._origField = this.origField;
	},
	watch:{
		/*origField: {
			handler(newVal, oldVal){
				if(oldVal){
					console.log(oldVal["FormName"] + " => " + newVal.FormName);
				}
				else{
					console.log("=> " + newVal.FormName);
				}
			}, deep: true
		},
		origVal: function(newVal, oldVal) {
			if(oldVal){
				console.log("[v] " + oldVal + " => " + newVal);
			}
			else{
				console.log("[v] => " + newVal);
			}
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
		origVal: function(){
			var self = this;
			if(this.origField && this.origField[self.valPropname]){
				return this.origField[self.valPropname];
			}
			else{
				return null;
			}
		},
		/*origVal: {
			get: function(){
				var self = this;
				if(this._origField){
					console.log("has origField");
					return this._origField[(self.valPropname)];
				}
				else{
					console.log("no origField")
					return null;
				}
			},
			set: function(newValue){
				console.log('set wtf ' + newValue);
			}
		},*/
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
		/*inputVal: {
			get: function(){
				return this.fieldVal;
			},
			set: function(newValue){
				console.log('wtf ' + newValue);
			}
		},*/
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
		// @input (string)
		updateValue:function(newValue){
			var self = this;
			console.log("text " + this.inputID + " @input " + newValue);

			var formattedValue = newValue.trim();
			if(newValue == ""){
				formattedValue = null;
			}
			// If the value was not already normalized,
			// manually override it to conform
			if (formattedValue !== newValue) {
				//this.$refs[this.inputID].value = formattedValue;
			}

			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				case 'edit-dialog':
					eventHub.$emit('update-edit-dialog', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				default:
					eventHub.$emit('update-field', {fieldID: self.field.FieldId, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
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