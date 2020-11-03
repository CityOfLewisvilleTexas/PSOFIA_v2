Vue.component('checkbox-field', {
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
		<div class="col s12 l10 offset-l1" :class="classObject">
			<p>
				<input type="checkbox" class="filled-in"
					:id="field.FieldHTMLID" :ref="field.FormFieldID"
					v-model="isChecked"
				>
				<label v-if="field.FieldName" :for="field.FieldHTMLID">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
			</p>
		</div>
	`,
	data: function(){
		return{
			isChecked: false,
			debug: false,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			if(typeof(oldVal) !== 'undefined' && newVal != oldVal){
				if(this.debug) console.log('watch fieldVal: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));
				//this.updateValue(newVal);
				this.refreshInput();
			}
			// Initial set (Undefined -> whatever) is handled in mounted
		},
		/*isChecked: function(newVal, oldVal){
			if(typeof(oldVal) !== 'undefined' && newVal != oldVal){
				if(this.debug) console.log('watch isChecked: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));
				//this.updateValue(newVal);
				//this.refreshInput();
			}
		},*/
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
				'field-is-blank': this.fieldVal == '',
				'field-is-required': this.fieldRequired,
				'field-show-required': this.highlightRequired && this.fieldRequired && this.fieldVal == '',
			}
		},
		/*labelClassObject: function(){
			return {
				'active': this.fieldVal != '',
			}
		},*/
	},
	mounted: function(){
		var vm = this;
		var s = $('#' + this.field.FieldHTMLID);

		s.on('change', function($event){
			var val = $event.target.value;
			if(vm.debug) console.log('ON CHANGE: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(val) + ' (' + typeof(val) + ')');
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
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + ' (' + typeof(this.fieldVal) + '); isChecked = ' + this.getValText(this.isChecked) + ' (' + typeof(this.isChecked) + '); actual value: ' + this.getValText(actVal) + ' (' + typeof(actVal) + ')' );

			if(this.fieldVal !== this.isChecked){
				if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); //+ ' - ' + this.getValText(this.fieldVal) + ' != ' + this.getValText(value));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: this.isChecked});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		refreshInput: function () {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('refreshInput: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + ' (' + typeof(this.fieldVal) + '); isChecked = ' + this.getValText(this.isChecked) + ' (' + typeof(this.isChecked) + '); actual value: ' + this.getValText(actVal) + ' (' + typeof(actVal) + ')' );

			if(this.fieldVal != this.isChecked){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);

				this.isChecked = this.fieldVal;
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else if (!val) return 'false'
			else if (val) return 'true'
			else return val;
		},
	},
})