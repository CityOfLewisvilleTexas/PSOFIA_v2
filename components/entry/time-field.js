Vue.component('time-field', {
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
			<input type="text" class="timepicker"
				:id="field.FieldHTMLID" :ref="field.FormFieldID"
				v-bind:value="inputVal"
			>
		</div>
	`,
/*
				v-bind:value="inputVal"
				v-bind:value="field.fieldVal"\
				v-on:input="updateValue($event.target.value)"\
*/
	data: function(){
		return{
			inputVal: '',
			debug: true,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			if(typeof(oldVal) !== 'undefined' && newVal !== oldVal){
				if(this.debug) console.log('watch fieldVal: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));
				this.refreshInput();
			}
			// Initial set (Undefined -> whatever) is handled in mounted
		},
	},
	computed:{
		fieldVal: function(){
			return this.field.fieldVal;
		},
		fieldValFormat: function(){
			if (this.fieldVal) return moment('1970-01-01 ' + this.fieldVal, 'YYYY-MM-DD HH:mm').format('h:mm A');
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

		var $input = $('#' + this.field.FieldHTMLID).pickatime({
			//default: vm.fieldValFormat, // Set default time: 'now', '1:30AM', '16:30'
			default: 'now',
			fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
			format: 'h:i a',
			twelvehour: true, // Use AM/PM or 24-hour format
			donetext: 'OK', // text for done-button
			cleartext: 'Clear', // text for clear-button
			canceltext: 'Cancel', // Text for cancel-button,
			autoclose: false, // automatic close timepicker
			ampmclickable: true, // make AM PM clickable
		})

		d.on('change', function($event){
			var val = $event.target.value;
			if(vm.debug) console.log('ON CHANGE: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(val) + '; inputVal = ' + vm.getValText(vm.inputVal));
			if(vm.debug) console.log('!!! set inputVal: '  + vm.field.FieldHTMLID);
			if(val) vm.inputVal = moment('1970-01-01 ' + val, 'YYYY-MM-DD h:mmA').format('h:mm A');
			else vm.inputVal = ''
			vm.updateValue(val);
		});

		// Prevent datepicker from auto-closing  CF 03/23/2020
		$input.on('mousedown',function(event){
			event.preventDefault();
		})

		//this.refreshInput();
		//Vue.nextTick(function(){
			if(vm.fieldVal){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal));
				vm.refreshInput();
			}
		//})

		//this.inputVal = this.fieldValFormat;
		//$input.pickadate(vm.fieldValFormat)
	},
	methods:{
		updateValue: function (pickerVal) {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; formatted = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			var dbFormatVal; //, inputFormatVal;
			var vm = this;
			
			if(pickerVal && pickerVal !== ''){
            	dbFormatVal = moment('1970-01-01 ' + pickerVal, 'YYYY-MM-DD h:mmA').format('HH:mm');
            	//inputFormatVal = moment('1970-01-01 ' + pickerVal, 'YYYY-MM-DD h:mmA').format('h:mm A');
            }
            else{
            	dbFormatVal = '';
            	//inputFormatVal = '';
            }

            /* moved to on set, on clear */
            //v-model doesn't work with time picker, inputValue not set when .val changes
            //if(this.debug) console.log('!!! set inputVal: '  + this.field.FieldHTMLID + ' = ' + this.getValText(inputFormatVal) + ' (updateValue)');
			//this.inputVal = inputFormatVal;

            if(this.fieldValFormat !== dbFormatVal){
            	if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); //+ ' - ' + this.getValText(this.fieldVal) + ' !== ' + this.getValText(dbFormatVal));
				// Emit the value through the hub (to top level)
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: dbFormatVal});
			}
			else{
				if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
				/*Vue.nextTick(function(){
					vm.refreshInput();
				});*/
			}
		},
		// set from store/object
		refreshInput: function () {
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('refreshInput: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; formatted = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			if(this.fieldValFormat !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID); //+ ' = ' + this.getValText(this.fieldValFormat) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(val) );

				//if(this.debug) console.log('refreshInput: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldValFormat))
				//var $input = $('#' + this.field.FieldHTMLID).val(this.fieldValFormat);

				if(this.debug) console.log('!!! set inputVal: '  + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldValFormat) + ' (refreshInput)');
				this.inputVal = this.fieldValFormat;
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

			/*onSet: function (context) {
				if(context.select){
					console.log('set select: ' + context.select)
					self.updateValue(context.select)
					//this.close()
				}
				else if(context.view){
					console.log('set view: ' + context.view)
					//self.storeVal = context.view;
				}
			},
			onClose: function() {
				$(document.activeElement).blur() // fixes the date picker opening when leaving tab and coming back
			}*/