Vue.component('checkbox-field', {
	model: {
		prop: 'checked',
		event: 'change'
	},
	props: {
		checked: Boolean,
		// this allows using the `value` prop for a different purpose
		value: String
	},
	template: '\
		<div>\
			<label v-if"label">{{label}}</label>\
			<input\
				type="date" class="datepicker"\
				ref="fieldId"\
				:id="field.FieldHTMLID"\
				:ref="field.FormFieldID"\
				v-model="field.fieldVal"\
				v-bind:value="value"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
				v-on:blue="formatValue"\
			>\
		</div>\
	',
	data: function(){
		return{
			//list vars
		}
	}
})