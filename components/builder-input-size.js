Vue.component('builder-input-size', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		fieldIdStart:{
			type: String,
			required: true
		},
		propName:{
			type: String,
			required: true
		},
		propLabel:{
			type: String,
			required: true
		},
		inputDisabled:{
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: '\
		<div class="input-field col s3">\
			<input\
				type="text"\
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
			origVal: ''
		}
	},
	watch:{
	},
	computed:{
		fieldId:function(){
			return this.fieldIdStart + this.field.FormFieldID.toString();
		},
		isSelected: function(){
			
		},
	},
	methods:{
		updateValue:function(value){
			var formattedValue = value.trim();
			var vm = this;
			// If the value was not already normalized,
			// manually override it to conform
			if (formattedValue !== value) {
				this.$refs[vm.fieldIdStart + vm.field.FormFieldID.toString()].value = formattedValue;
			}
			
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-builder-input', {fieldID: this.fieldId, prop: this.propName, val: formattedValue});
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