Vue.component('psofia-form-field', {
	// declare the props
	props: {
		stateName:{
			type: String,
			required: false,
			default: 'form'
		},
		storeName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: false,
			default: 'formRecord'
		},
		storeId:{	// formFieldID, formSectionID, formSubSectionID, etc
			type: Number,
			required: false
		},
		valPropname:{
			type: String,
			required: true
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
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
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
			<!--<psofia-autocomplete v-if="isSelect"
				data-name="record" :val-propname="fieldHTMLID" :form-field-id="formFieldId">
			</psofia-autocomplete>-->
		</div>
	`,
	data: function(){
		return{
			isLoading: true,
            sharedState: store.state,
            debug: true,
		}
	},
	computed:{
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

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

		isMoment: function(){
			return this.valObj.valType === 'moment';
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


		isNumber: function(){
			return this.valObj.valType === 'number';
		},
		isText: function(){
			return this.valObj.valType === 'text';
		},
		isTextArea: function(){
			return this.valObj.valType === 'textarea';
		},
		isCheckbox: function(){
			return this.valObj.valType === 'boolean';
		},
		isSelect: function(){
			return (this.valObj.valType === 'select');
		},
		isSelect2: function(){
			return (this.valObj.valType === 'select2');
		},
		isAutocomplete: function(){
			return (this.valObj.valType === 'autocomplete');
		},
		isCombobox: function(){
			return (this.valObj.valType === 'combobox');
		},
	},
	methods:{
		
	}
})

/*
		formFieldId:{
			type: Number,
			required: true
		},

		<span>
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
		</span>
*/