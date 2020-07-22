Vue.component('checkbox-field', {
	props: {
		field:{
			type: Object,
			required: true
		}
	},
	template: `
		<div class="col s12 l10 offset-l1">
			<input type="checkbox" class="filled-in"
				:id="field.FieldHTMLID"
				:ref="field.FormFieldID"
				v-model="isChecked"
			>
			<label :for="field.FieldHTMLID">{{field.FieldName}}</label>
		</div>
	`,
	data: function(){
		return{
			//list vars
			isChecked: false
		}
	},
	watch:{
		isChecked: function(newVal, oldVal){
			console.log(oldVal + " -> " + newVal);
			if(newVal != oldVal){
				this.updateValue(newVal);
			}
		}
	},
	methods:{
		updateValue: function (value) {
			/*var formattedValue = value;
			// If the value was not already normalized, manually override it to conform
			if (formattedValue !== value) {
				this.$refs[this.field.FormFieldID].value = formattedValue;
			}*/
			// Emit the value through the hub (to top level)
			eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: value});
		}
	},
	mounted: function(){
		this.isChecked = this.field.fieldVal;
	}
})