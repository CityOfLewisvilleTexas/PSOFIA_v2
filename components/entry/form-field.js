Vue.component('form-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		vSet:{
			type: [Object, Array],
			required: false
		},
		vsOptions:{
			type: [Object, Array],
			required: false
		},
		highlightRequired:{
			type: Boolean,
			required: false,
			default: false,
		},
	},
	template: `
		<span>
			<number-field v-if="isNumber" :field="field" :highlight-required="highlightRequired"></number-field>
			<date-field v-if="isDate" :field="field" :highlight-required="highlightRequired"></date-field>
			<time-field v-if="isTime" :field="field" :highlight-required="highlightRequired"></time-field>
			<number-field v-if="isYear" :field="field" :highlight-required="highlightRequired"></number-field>
			<checkbox-field v-if="isCheckbox" :field="field" :highlight-required="highlightRequired"></checkbox-field>
			<text-field v-if="isText" :field="field" :highlight-required="highlightRequired"></text-field>
			<email-field v-if="isEmail" :field="field" :highlight-required="highlightRequired"></email-field>
			<text-area-field v-if="isTextArea" :field="field" :highlight-required="highlightRequired"></text-area-field>
			<select-field v-if="isSelect" :field="field" :v-set="vSet" :vs-options="vsOptions" :highlight-required="highlightRequired"></select-field>
			<select-field-category v-if="isCatSelect" :field="field" :v-set="vSet" :vs-options="vsOptions" :highlight-required="highlightRequired"></select-field-category>
		</span>
	`,
	//<select-field v-if="isSelect" :field="field" :v-set="vSet"></select-field>
	data: function(){
		return{
			//list vars
		}
	},
	computed:{
		fieldVal: function(){
			return this.field.fieldVal;
		},
		fieldRequired: function(){
			return this.field.Required;
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
			return (this.field.FieldType == 'SELECT' && !(this.vSet.ShowCategory));
		},
		isCatSelect: function(){
			return (this.field.FieldType == 'SELECT' && this.vSet.ShowCategory);
		},
		classObject: function () {
			return {
				'field-is-blank': this.field.fieldVal == '',
				'field-is-required': this.fieldRequired,
			}
		},
	},
	methods:{
		
	}
})