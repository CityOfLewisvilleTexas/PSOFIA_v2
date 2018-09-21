Vue.component('builder-select-v', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		setOptions:{
			type: [Object, Array],
			required: false
		},
		valPropname:{//propName
			type: String,
			required: false
		},
		textPropname:{//propTextName
			type: String,
			required: false
		},
		idText:{
			type: String,
			required: true
		},
		idPropname:{
			type: String,
			required: false
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
		fieldHasText:{
			type: Boolean,
			required: false,
			default: false
		},
		addOption:{
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: '\
		<v-select\
			:id="inputID"\
			:ref="inputID"\
			\
			:value="inputVal"\
			@input="updateValue"\
			\
			:label="inputLabel"\
			:background-color="inputColor"\
			:dense="true"\
			:disabled="inputDisabled"\
			:clearable="inputClearable"\
			@click:clear="clearInput"\
			@focus="selectAll"\
			\
			:items="setOptions"\
			:item-text="inputTextPropname"\
			:item-value="inputValPropname"\
			:return-object="true"\
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		>\
			<!--<option value="">Choose an Option</option>\
			<option v-for="o in setOptions" :key="o[propName]" v-bind:value="o[propName]" v-bind:selected="o[propName]==field[propName]">{{o[propTextName]}}</option>\
			<option v-if="addOption" disabled>Add New</option>-->\
			<!-- ADD NEW MODAL -->\
		</v-select>\
	',
	data: function(){
		return{
			//list vars
			origVal: '',
			wasChanged: false,
			hasError: false,
			errMsg: ''
		}
	},
	watch:{
		/*field.fieldVal: function(val){
			this.reload(val);
		}*/
	},
	computed:{
		inputID: function(){
			var self = this;
			if(this.idText != null && this.idPropname == null){
				return this.idText.toString();
			}
			else if(this.idText != null && this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
				return this.idText + this.field[this.idPropname].toString();
			}
			else if(this.idText == null && this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
				return this.field[this.idPropname].toString();
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
				return this.field[this.labelPropname].toString();
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
		inputVal: function(){
			return this.field[this.inputValPropname];
		},
		inputTextPropname: function(){
			var self = this;
			if(this.textPropname != null && this.setOptions.length > 0 && this.setOptions[0].hasOwnProperty(self.textPropname)){
				return this.textPropname;
			}
			else{
				return this.inputValPropname;
			}
		},

		sortedOptions: function(){
			return this.setOptions.sort(function(a, b){
				return a.OptionOrder - b.OptionOrder;
			});
		},

		inputColor: function(){
			if((!this.origVal && this.inputVal) || (this.origVal != this.inputVal)){
				return 'green';
			}
		},
		isSelected: function(){
		},
		msg: function(){
			return "original: " + this.origVal + "; current: " + this.inputVal;
		}
	},
	methods:{
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			console.log("select function");
			//console.log(value);
			//eventHub.$emit('update-builder-select', {fieldID: this.fieldId, propName:this.propName, propTextName: this.propTextName, val: value});
			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {valPropname: this.valPropname, val: formattedValue});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {formSectionID: this.field.FormSectionID, valPropname: this.valPropname, val: formattedValue});
				break;
				default:
				eventHub.$emit('update-field', {fieldID: this.field.FieldId, valPropname: this.valPropname, val: formattedValue});
			}
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		},
		clearInput: function(){
		},
		setError: function(errMsg){
		},
		reload: function(val){
		}
	},
	mounted: function(){

	}
})