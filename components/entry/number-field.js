Vue.component('number-field', {
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
			<input type="number" step="0.001"
				:id="field.FieldHTMLID" :ref="field.FormFieldID"
				v-model.number="inputVal"
			>
			<label v-if="field.FieldName" :for="field.FieldHTMLID" :class="labelClassObject">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
		</div>
	`,
	//v-on:input="inputValue($event.target.value)"
	/*
				v-bind:value="inputVal"
				v-on:blur="updateValue($event.target.value)"
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
				if(this.debug) console.log('watch fieldVal: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + ' (' + typeof(oldVal) + ')' + " -> " + this.getValText(newVal) + ' (' + typeof(newVal) + ')');
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
			if(vm.debug) console.log('ON CHANGE: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(val) + ' (' + typeof(val) + ')');
			vm.updateValue(val);
		});

		Vue.nextTick(function(){
			if(vm.fieldVal !== ''){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal));
				vm.refreshInput();
			}
		})
	},
	methods:{
		updateValue: function (value) {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + ' (' + typeof(this.fieldVal) + ')' + '; inputVal = ' + this.getValText(this.inputVal) + ' (' + typeof(this.inputVal) + ')' + '; actual value: ' + this.getValText(actVal) + ' (' + typeof(actVal) + ')' );

			if(this.inputVal === ''){
				if(this.fieldVal){
					if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID + ' - ' + this.getValText(this.fieldVal) + ' (' + typeof(this.fieldVal) + ') !== ' + this.getValText(this.inputVal) + ' (' + typeof(this.inputVal) + ')');
					//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: value});
					eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: ''});
				}
				else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID)
			}
			else{
				if(this.fieldVal.toString() !== this.inputVal){
					if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID + ' - ' + this.getValText(this.fieldVal) + ' (' + typeof(this.fieldVal) + ') !== ' + this.getValText(this.inputVal) + ' (' + typeof(this.inputVal) + ')');
					//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: parseFloat(value)});
					eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: this.inputVal});
				}
				else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID)
			}
		},
		/*inputValue: function (value) {
			if(this.debug) console.log('inputValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(value))
		},*/
		refreshInput: function () {
			if(this.fieldVal !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);
				
				this.inputVal = this.fieldVal; //.toString();
				
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