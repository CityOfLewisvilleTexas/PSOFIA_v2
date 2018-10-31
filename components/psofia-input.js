Vue.component('builder-input-v', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: false
		},
		fieldId:{
			type: String,
			required: true
		},
		valPropname:{
			type: String,
			required: true
		},
		labelPropname:{
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
		}
	},
	template: '\
		<v-text-field\
			:id="fieldId"\
			:ref="fieldId"\
			v-bind:value="field[propName]"\
			v-on:input="updateValue($event.target.value)"\
			v-on:focus="selectAll"\
			:label="propLabel"\
		>\
		</v-text-field>\
	',
	data: function(){
		return{
			origVal: ''
		}
	},
	watch:{
	},
	computed:{
		isSelected: function(){
			
		},
	},
	methods:{
		updateValue:function(value){
			var formattedValue = value.trim();
			// If the value was not already normalized,
			// manually override it to conform
			if (formattedValue !== value) {
				this.$refs[this.fieldId].value = formattedValue;
			}
			
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			console.log("comp function");
			//console.log(value);
			eventHub.$emit('update-builder-input', {fieldID: this.fieldId, prop: this.propName, val: formattedValue});
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
	},
	mounted: function(){
		//this.origVal = field[propName];
	}
})