Vue.component('psofia-textarea', {
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
			required: true
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
	},
	template: `
		<v-textarea box
			:id="inputID"
			:ref="inputID"
			
			v-bind:value="inputVal"
			v-on:input="updateValue"
			@change="changeValue"
			@update:error="updateErr"
			
			:label="inputLabel"
			:hint="inputDesc"
			:persistent-hint="hasHint"
			:disabled="inputDisabled"
			:clearable="inputClearable"

			@click:clear="clearInput"
			@focus="selectAll"
			@click.right="logValue"

			:messages="msg"
			:success="wasChanged"

			:rules="[]"
			:error="hasError"
		>
		</v-textarea>
	`,
	data: function(){
		return{
			sharedState: store.state,
			isLoading: true,
			inputValObj: {},
			inputVal: '',
			valNotes: '',
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
			var id = '';

			if(this.formField){
				id += 'input_' + this.formField.FormFieldID;
			}
			/*else if(this.concatID){
				if(this.idText != null && this.idNum == null && this.idPropname == null){
					id += this.idText;
				}
				if(this.idPropname != null && this.formField.hasOwnProperty(self.idPropname)){
					id += this.formField[self.idPropname].toString();
				}
				if(this.idNum != null){
					id += '_' + this.idNum.toString();
				}
			}
			else{
				if(this.idText != null){
					id = this.idText;
				}
				else if(this.idPropname != null && this.formField.hasOwnProperty(self.idPropname)){
					id = this.formField[self.idPropname].toString();
				}
			}*/

			if(id.length > 0){
				return id;
			}
			else return null;
		},
		inputLabel: function(){
			var self = this;

			if(this.formField){
				return this.formField.FieldName;
			}
			/*else if(this.labelText != null){
				return this.labelText;
			}
			else if(this.labelPropname != null && this.formField.hasOwnProperty(self.labelPropname)){
				return this.formField[self.labelPropname];
			}*/
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
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged){
				return 'original: ' + this.valToText(this.origValObj);
			}
		},
		logMsg: function(){
			return this.valPropname + "\n" +
			" - original: " + this.valToText(this.origValObj) + "\n" + 
			" - current: " + this.valToText(this.valObj) + "\n" +
			" - input: " + this.valToText(this.inputValObj);
		}
	},
	methods:{
		initialize: function(){
			this.loadInput();
		},
		loadInput: function(){
			this.loading = true;
			var self = this;

			this.inputValObj = clone(self.valObj);
			this.inputVal = this.inputValObj.displayVal;
			this.loading = false;
		},
		// @input (string)
		updateValue:function(newValue){
			var self = this;
			console.log("textarea " + this.inputID + " @input " + newValue);

			var newVal = newValue;
			this.inputValObj.displayVal = newValue;

			if(newValue == ""){
				newVal = null;
			}
			this.inputValObj.dbVal = newVal;
			this.inputValObj.val = this.inputValObj.dbVal ? this.inputValObj.dbVal.toString().toUpperCase() : this.inputValObj.dbVal;

			var payload3 = Object.assign({}, self.payload, {valObj: self.inputValObj});
			store.updateObjProp(payload3);

			// reload input on watch
			//this.loadInput;
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
			if(this.debug) console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			if(this.debug) console.log("textarea " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			if(this.debug) console.log("textarea " + this.inputID + " @update:error " + newValue);
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
			//this.inputVal = null;
  			return;
		},
	}
})