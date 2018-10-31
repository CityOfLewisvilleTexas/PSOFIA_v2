Vue.component('builder-form-data-v', {
	// declare the props
	props: {
	},
	template: `
		<v-flex xs12>\
			<v-card>\
				<v-card-text>\
					<v-layout row wrap>\
						<v-flex xs12 sm8>\
							<builder-text-v\
								data-portion="form-data"\
								val-propname="FormName"\
								id-text="FormName"\
								label-text="Form Name"\
							></builder-text-v>\
						</v-flex>
						<v-flex xs12 sm4>\
							<builder-text-v\
								:field="formData"\
								:orig-field="origFormData"\
								val-propname="TableName"\
								id-text="FormTable"\
								label-text="Table Name"\
								:input-disabled="true"\
								:input-clearable="false"\
								data-portion="form-data"\
							></builder-text-v>\
						</v-flex>
						<v-flex xs12>\
							<builder-text-v\
								:field="formData"\
								:orig-field="origFormData"\
								val-propname="ViewFormAddress"\
								id-text="FormAddress"\
								label-text="View Form Address"\
								data-portion="form-data"\
							></builder-text-v>\
						</v-flex>
						<v-flex xs12>\
							<builder-autocomplete-v\
								:field="formData"\
								:orig-field="origFormData"\
								:autocomplete-options="departments" \
								id-text="FormDepartment" \
								val-propname="DepartmentID" \
								text-propname="Department" \
								label-text="Department" \
								data-portion="form-data"\
								add-option\
							></builder-autocomplete-v>\

						</v-flex>
					</v-layout>
				</v-card-text>\
			</v-card>\
		</v-flex>\
	`,
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