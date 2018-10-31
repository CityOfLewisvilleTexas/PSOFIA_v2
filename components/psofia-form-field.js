Vue.component('psofia-form-field', {
	// declare the props
	props: {
		formFieldId:{
			type: Number,
			required: true
		},
	},
	template: `
		<div>
			<psofia-text v-if="isText"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-text>
			<psofia-textarea v-if="isTextArea"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-textarea>
			<psofia-number v-if="isNumber"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-number>
			<psofia-checkbox v-if="isCheckbox"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-checkbox>
			<psofia-autocomplete v-if="isSelect"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-autocomplete>
		</div>
	`,
	/*<span>
			<!--<psofia-number v-if="isNumber" :field="field"></number-field>
			<psofia-date v-if="isDate" :field="field"></date-field>
			<psofia-field v-if="isTime" :field="field"></time-field>
			<number-field v-if="isYear" :field="field"></number-field>
			<checkbox-field v-if="isCheckbox" :field="field"></checkbox-field>
			<text-field v-if="isText" :field="field"></text-field>
			<email-field v-if="isEmail" :field="field"></email-field>
			<text-area-field v-if="isTextArea" :field="field"></text-area-field>
			<select-field v-if="isSelect" :field="field" :v-set="vSet" :vs-options="vsOptions"></select-field>
			<select-field-category v-if="isCatSelect" :field="field" :v-set="vSet" :vs-options="vsOptions"></select-field-category>
		</span>*/
	data: function(){
		return{
			//list vars
		}
	},
	computed:{
		payload: function(){
			var self = this;
			return {id:self.formFieldId};
		},
		field: function(){
			var self = this;
			return store.getFormField(self.payload);
		},
		fieldHTMLID: function(){
			return this.field.FieldHTMLID;
		},
		origPayload: function(){
			var self = this;
			return Object.assign(self.payload, {isOrig:true});
		},
		origField: function(){
			var self = this;
			return store.getFormField(self.origPayload);
		},
		isDate: function(){
			return this.field.FieldType == 'DATE';
		},
		isTime: function(){
			return this.field.FieldType == 'TIME';
		},
		isYear: function(){
			return this.field.FieldType == 'YEAR';
		},
		isCheckbox: function(){
			return this.field.FieldType == 'CHECKBOX';
		},
		isText: function(){
			return this.field.FieldType == 'TEXT';
		},
		isEmail: function(){
			return this.field.FieldType == 'EMAIL';
		},
		isTextArea: function(){
			return this.field.FieldType == 'TEXTAREA';
		},
		isNumber: function(){
			return this.field.FieldType == 'NUMBER';
		},
		isSelect: function(){
			return (this.field.FieldType == 'SELECT');
		},
	},
	methods:{
		
	}
})