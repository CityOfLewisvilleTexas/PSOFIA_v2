Vue.component('email-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		highlightRequired:{
			type: Boolean,
			required: false,
			default: false,
		},
	},
	template: `
		<div class="input-field col s12 l10 offset-l1" :class="classObject">
			<input type="email"
				:id="field.FieldHTMLID" :ref="field.FormFieldID"
				v-model="inputVal"
			>
			<label v-if="field.FieldName" :for="field.FieldHTMLID" :class="labelClassObject">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
		</div>
	`,
	/*
				v-bind:value="field.fieldVal"
				v-on:input="updateValue($event.target.value)"
	*/
	data: function(){
		return{
			inputVal: '',
			debug: false,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			if(typeof(oldVal) !== 'undefined' && newVal !== oldVal){
				if(this.debug) console.log('watch fieldVal: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));
				this.refreshInput();
			}
			// Initial set (Undefined -> whatever) is handled in mounted
		}
	},
	computed:{
		fieldVal: function(){
			return this.field.fieldVal;
		},
		fieldRequired: function(){
			return this.field.Required;
		},
		classObject: function () {
			return {
				'field-is-blank': this.fieldVal === '',
				'field-is-required': this.fieldRequired,
				'field-show-required': this.highlightRequired && this.fieldRequired && this.fieldVal === '',
			}
		},
		labelClassObject: function(){
			return {
				'active': this.fieldVal !== '',
			}
		},
	},
	mounted: function(){
		var vm = this;
		var s = $('#' + this.field.FieldHTMLID);

		s.on('change', function($event){
			var val = $event.target.value;
			if(vm.debug) console.log('ON CHANGE: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(val));
			vm.updateValue(val);
		});

		//Vue.nextTick(function(){
			if(vm.fieldVal){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal));
				vm.refreshInput();
			}
		//})
	},
	methods:{
		updateValue: function (value) {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			//var formattedValue = value.trim();

			if(this.fieldVal !== value){
				if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); //+ ' - ' + this.getValText(this.fieldVal) + ' !== ' + this.getValText(value));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: formattedValue});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		refreshInput: function () {
			if(this.fieldVal !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);
				
				this.inputVal = this.fieldVal;

				Vue.nextTick(function() {
					Materialize.updateTextFields();
				});
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else return val;
		},
	}
})