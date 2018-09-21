Vue.component('builder-checkbox-v', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
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
			value
			:input-value="inputVal"\
			@input="updateValue"\
			\
			:label="inputLabel"\
			:background-color="inputColor"\
			:disabled="inputDisabled"\
			\
			hint=""\
			:messages="msg"\
			:rules="[]"\
		>\
		</v-checkbox>\
	`,
	data: function(){
		return{
			origVal: '',
			//inputVal: '',
			hasError: false,
			errMsg: ''
		}
	},
	watch:{
		field: function(val, prev){
			if(prev[this.valPropname] == undefined){
				//console.log(prev[this.valPropname] + " " + val[this.valPropname]);
				//this.origVal = val[this.valPropname];
			}
		},
		inputVal: function(val, prev){
			console.log("checkbox " + prev + " -> " + val);
			if(prev == undefined && (val === true || val === false)){
				this.origVal = val;
			}
		}
	},
	computed:{
		inputID: function(){
			var id = '';
			if(this.idText != null && this.idNum == null && this.idPropname == null){
				id += this.idText;
			}
			if(this.idPropname != null && this.field.hasOwnProperty(this.idPropname)){
				id += this.field[idPropname].toString();
			}
			if(this.idNum != null){
				id += '_' + this.idNum.toString();
			}

			if(id.length > 0){
				return id;
			}
			else{
				return null;
			}
		},
		inputLabel: function(){
			if(this.labelText != null){
				return this.labelText;
			}
			else if(this.labelPropname != null && this.field.hasOwnProperty(this.labelPropname)){
				return this.field[this.labelPropname].toString();
			}
			else{
				return null;
			}
		},
		inputVal: function(){
			if(this.valPropname != null && this.field.hasOwnProperty(this.valPropname)){
				return this.field[this.valPropname];
			}
			else{
				this.setError("ERROR: Provided Value Poperty Does Not Exist");
				return null;
			}
		},
		wasChanged: function(){
			if((!this.origVal && this.inputVal) || (this.origVal != this.inputVal)){
				return true;
			}
			else{
				return false;
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
			return this.valPropname + " - original: " + this.origVal + "; current: " + this.inputVal;
		}
	},
	methods:{
		updateValue:function(value){
			console.log("checkbox function " + this.dataPortion);

			switch(this.dataPortion){
				case 'form-data':
					eventHub.$emit('update-form-data', {needsUpdate: this.wasChanged, valPropname: this.valPropname, val: value});
				break;
				case 'section':
					eventHub.$emit('update-section-data', {needsUpdate: this.wasChanged, formSectionID: this.field.FormSectionID, valPropname: this.valPropname, val: value});
				break;
				case 'edit-dialog':
					eventHub.$emit('update-edit-dialog', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue});
				break;
				default:
					eventHub.$emit('update-field', {needsUpdate: this.wasChanged, fieldID: this.field.FieldId, valPropname: this.valPropname, val: value});
			}
		},
		setError: function(errMsg){
		},
		reload: function(val){
		},
	},
	mounted: function(){
		//this.origVal = this.inputVal;
	}
})