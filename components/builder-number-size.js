Vue.component('builder-number', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		fieldIdStart:{
			type: String,
			required: false
		},
		propName:{
			type: String,
			required: true
		},
		propLabel:{
			type: String,
			required: true
		}
	},
	template: '\
		<div class="input-field col s1">\
			<input\
				type="number"\
				:id="fieldIdStart + field.FormFieldID.toString()"\
				:ref="fieldIdStart + field.FormFieldID.toString()"\
				v-bind:value="field[propName]"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
			/>\
			<label>{{propLabel}}</label>\
		</div>\
	',
	data: function(){
		return{
			//fieldId: this.fieldIdStart + this.field.FormFieldID.toString(),
		}
	},
	computed: {
		fieldId: function(){
			return this.fieldIdStart + this.field.FormFieldID.toString();
		},
	},
	methods:{
		updateValue: function (value) {
			var formattedValue = value.trim();
			// If the value was not already normalized, manually override it to conform
			if (formattedValue !== value) {
				this.$refs[this.field.FormFieldID].value = formattedValue;
			}
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.fieldId, val: Number(formattedValue)});
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		}
	}
})