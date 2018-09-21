Vue.component('builder-form-data', {
	// declare the props
	props: {
		formData:{
			type: Object,
			required: true
		},
		departments:{
			type: [Object, Array],
			required: true
		}
	},
	template: '\
		<span>\
			<builder-input\
				:field="formData"\
				field-id="FormName"\
				prop-name="FormName"\
				prop-label="Form Name">\
			</builder-input>\
			<builder-input\
				:field="formData"\
				field-id="FormTable"\
				prop-name="TableName"\
				prop-label="Table Name"\
				input-disabled>\
			</builder-input>\
			<builder-input\
				:field="formData"\
				field-id="FormAddress"\
				prop-name="ViewFormAddress"\
				prop-label="View Form Address">\
			</builder-input>\
			<builder-select\
				:field="formData"\
				field-id="FormDepartment" \
				:set-options="departments" \
				prop-name="DepartmentID" \
				prop-text-name="Department" \
				prop-label="Department" \
				add-option>\
			</builder-select>\
		</span>\
	',
	data: function(){
		return{
		}
	},
	watch:{
	},
	computed:{
	},
	methods:{
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-form-data', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, prop: val: value});
		},
		reload: function(val){
			//var s = $(this.$el);
			
		},
		/*getFieldVSet: function(field){
			if(field.FieldType == 'SELECT'){
				return this.vsSets.find(function(s){
					return s.ValidationSetID == field.ValidationSetID;
				});
			}
			else{
				return null;
			}
		},
		getFieldVSOptions: function(field){
			if(field.FieldType == 'SELECT'){
				return this.vsOptions.filter(function(o){
					return o.ValidationSetID == field.ValidationSetID;
				}).sort(function(a, b){
					return a.OptionOrder - b.OptionOrder;
				});
			}
			else{
				return null;
			}
		},*/
	},
	mounted: function(){
	}
})