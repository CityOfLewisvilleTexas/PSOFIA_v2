Vue.component('builder-input', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		propName:{
			type: String,
			required: true
		},
		label:{
			type: String,
			required: true
		}
	},
	template: '\
		<div class="input-field col s12 l10 offset-l1">\
			<input\
				type="text"\
				:ref="field.FormFieldID"\
				v-bind:value="field[propName]"\
				v-on:input="updateField($event.target.value)"\
				v-on:focus="selectAll"\
			>\
			<label>{{field.FieldName}}</label>\
		</div>\
	',
	data: function(){
		return{
			//list vars
		}
	},
	watch:{
	},
	computed:{
		isSelected: function(){
			
		},
		sortedOptions: function(){
			this.vsOptions.sort(function(a, b){
				return a.OptionOrder - b.OptionOrder;
			});
		}
	},
	methods:{
		updateValue:function(value){
			var formattedValue = value.trim();
			// If the value was not already normalized,
			// manually override it to conform
			if (formattedValue !== value) {
				this.$refs[this.field.FormFieldID].value = formattedValue;
			}
			
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			console.log("comp function");
			//console.log(value);
			eventHub.$emit('update-builder-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, prop: this.propName, val: formattedValue});
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		},
		reload: function(val){
			//var s = $(this.$el);
			
		},
	}
})