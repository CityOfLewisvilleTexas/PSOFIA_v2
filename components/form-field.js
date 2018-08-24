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
		}
	},
	template: '\
		<span>\
			<number-field v-if="isNumber" :field="field"></number-field>\
			<date-field v-if="isDate" :field="field"></date-field>\
			<time-field v-if="isTime" :field="field"></time-field>\
			<checkbox-field v-if="isCheckbox" :field="field"></checkbox-field>\
			<text-field v-if="isText" :field="field"></text-field>\
			<text-area-field v-if="isTextArea" :field="field"></text-area-field>\
			<select-field v-if="isSelect" :field="field" :v-set="vSet" :vs-options="vsOptions"></select-field>\
		</span>\
	',
	//<select-field v-if="isSelect" :field="field" :v-set="vSet"></select-field>
	data: function(){
		return{
			//list vars
		}
	},
	computed:{
		isDate: function(){
			return this.field.FieldType == 'DATE';
		},
		isTime: function(){
			return this.field.FieldType == 'TIME';
		},
		isCheckbox: function(){
			return this.field.FieldType == 'CHECKBOX';
		},
		isText: function(){
			return this.field.FieldType == 'TEXT';
		},
		isTextArea: function(){
			return this.field.FieldType == 'TEXTAREA';
		},
		isNumber: function(){
			return this.field.FieldType == 'NUMBER';
		},
		isSelect: function(){
			return this.field.FieldType == 'SELECT';
		}
	},
	methods:{
		
	}
})