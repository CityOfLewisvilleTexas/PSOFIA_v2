Vue.component('email-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
	},
	template: `
		<div class="input-field col s12 l10 offset-l1">
			<input type="email"
				:id="field.FieldHTMLID"
				:ref="field.FormFieldID"
				v-bind:value="field.fieldVal"
				v-on:input="updateValue($event.target.value)"
			>
			<label v-if="field.FieldName" :for="field.FieldHTMLID">{{field.FieldName}}</label>
		</div>
	`,
	/*v-on:focus="selectAll"*/
	data: function(){
		return{
			//list vars
		}
	},
	methods:{
		updateValue: function (value) {
			var formattedValue = value.trim();
			// If the value was not already normalized,
			// manually override it to conform
			if (formattedValue !== value) {
				this.$refs[this.field.FormFieldID].value = formattedValue;
			}
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: formattedValue});
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