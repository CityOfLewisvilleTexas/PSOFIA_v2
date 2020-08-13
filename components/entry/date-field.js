Vue.component('date-field', {
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
			<label v-if="field.FieldName" :for="field.FieldHTMLID" :class="labelClassObject">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
			<input type="text" class="datepicker"
				:id="field.FieldHTMLID" :ref="field.FormFieldID"
				v-bind:value="inputVal"
			>
		</div>
	`,
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
		fieldValFormat: function(){
			if(this.fieldVal) return moment(this.fieldVal).format('MM/DD/YYYY');
			else return '';
		},
		fieldRequired: function(){
			return this.field.Required;
		},
		classObject: function () {
			return {
				'field-is-blank': this.fieldValFormat === '',
				'field-is-required': this.fieldRequired,
				'field-show-required': this.highlightRequired && this.fieldRequired && this.fieldValFormat === '',
			}
		},
		labelClassObject: function(){
			return {
				'active': this.fieldValFormat !== '',
			}
		},
	},
	mounted: function(){
		var vm = this;

		var d = $('#' + this.field.FieldHTMLID);

		var $input = $('#' + this.field.FieldHTMLID).pickadate({
			selectMonths: true,
			selectYears: 15,
			today: 'Today',
			clear: 'Clear',
			close: 'Ok',
			closeOnSelect: true,
			format: 'mm/dd/yyyy',
			onSet: function (context) {
				//if(vm.debug) console.log(context);
				if(context.select){
					if(vm.debug) console.log('ON SELECT: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(context.select) + '; inputVal = ' + vm.getValText(vm.inputVal));
					if(vm.debug) console.log('!!! set inputVal: '  + vm.field.FieldHTMLID);
					vm.inputVal = moment(context.select).format('MM/DD/YYYY');
					vm.updateValue(context.select)
					this.close()
				}
				else if(context.hasOwnProperty('clear')){
					if(vm.debug) console.log('ON CLEAR: ' + vm.field.FieldHTMLID);
					if(vm.debug) console.log('!!! set inputVal: '  + vm.field.FieldHTMLID);
					vm.inputVal = '';
					vm.updateValue(null)
					this.close()
				}
				else if(context.view){
					if(vm.debug) console.log('ON VIEW: ' + vm.field.FieldHTMLID);
					//vm.storeVal = context.view;
				}
			},
			onClose: function() {
				$(document.activeElement).blur() // fixes the date picker opening when leaving tab and coming back
			}
		});

		// Prevent datepicker from auto-closing  CF 03/23/2020
		// CL 06/10/2020 - still occurs but only after clicking clear, clicking into different window, then immediately clicking input field before focus returned to form window
		$input.on('mousedown',function(event){
			event.preventDefault();
		})

		Vue.nextTick(function(){
			if(vm.fieldVal){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal) + '; formatted = ' + vm.getValText(vm.fieldValFormat) );
				vm.refreshInput();
			}
		})
	},
	methods:{
		updateValue: function (pickerVal) {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; formatted = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			var dbFormatVal; //, inputFormatVal;

			if(pickerVal && pickerVal !== ''){
            	dbFormatVal = moment(pickerVal).format('YYYY-MM-DD');
            	//inputFormatVal = moment(pickerVal).format('MM/DD/YYYY');
            }
            else{
            	dbFormatVal = '';
            	//inputFormatVal = '';
            }

            /* moved to on set, on clear */
            //v-model doesn't work with pickadate.js, inputValue not set when .val changes
            //if(this.debug) console.log('!!! set inputVal: '  + this.field.FieldHTMLID + ' = ' + this.getValText(inputFormatVal) + ' (updateValue)');
			//this.inputVal = inputFormatVal;

            if(this.fieldVal !== dbFormatVal){
            	if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); //+ ' - ' + this.getValText(this.fieldVal) + ' !== ' + this.getValText(dbFormatVal));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: dbFormatVal});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		// set from store/object
		refreshInput: function(){
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('refreshInput: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; formatted = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );
			
			if(this.fieldValFormat !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID); //+ ' = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(val) );

				//this.inputVal = this.fieldValFormat;

				var $input = $('#' + this.field.FieldHTMLID).pickadate();
				// Use the picker object directly.
				var picker = $input.pickadate('picker')
				
				if(this.fieldVal){
					picker.set('select', this.fieldVal, {format: 'yyyy-mm-dd'})
				}
				else{
					if(this.debug) console.log('refreshInput: no val, clear picker: ' + this.field.FieldHTMLID)
					picker.set('clear')
				}
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else return val;
		},
	},
})

/*
		// set from store/object
		setPickerView: function(){
			//var vm = this;
			var $input = $('#' + this.field.FieldHTMLID).pickadate();
			// Use the picker object directly.
			var picker = $input.pickadate('picker')
			picker.set('view', this.fieldVal, {format: 'yyyy-mm-dd'})
		},
*/