Vue.component('time-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
	},
	template: `
		<div class="input-field col s12 l10 offset-l1">
			<p class="date-label" v-if="field.FieldName">{{field.FieldName}}</p>
			<input type="text" class="timepicker"
				:ref="field.FormFieldID"
				:id="field.FieldHTMLID"
				v-bind:value="valI"
			>
		</div>
	`,
	/*
v-bind:value="field.fieldVal"\
				v-on:input="updateValue($event.target.value)"\

	v-bind:value="field.value"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
				v-on:blue="formatValue"\
				*/
	data: function(){
		return{
			valI: '',
			prevPickerVal: '',
			timeid: 'mytimefield', //field.FieldHTMLID,
			debug: true,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			//if(this.debug) console.log('watch fieldVal: ' + this.field.FieldName + ': ' + oldVal + " -> " + newVal);
			if(this.debug) console.log('watch fieldVal: ' + this.field.FieldName + ': ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));
			//if(newVal != oldVal){
				this.setPicker();
			//}
		}
	},
	computed:{
		fieldVal: function(){
			return this.field.fieldVal;
		},
		fieldValFormat: function(){
			if (this.fieldVal){
				return moment('1970-01-01 ' + this.fieldVal, 'YYYY-MM-DD HH:mm').format('h:mm A');
			}
			else return '';
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

		$input.on('change', function($event){
			var val = $event.target.value;
			if(vm.debug) console.log('Change: ' + vm.field.FieldName + ' = ' + vm.getValText(val));
			vm.updateValue(val);
		});

		// Prevent datepicker from auto-closing  CF 03/23/2020
		$input.on('mousedown',function(event){
			event.preventDefault();
		})

		//this.setPicker();
		Vue.nextTick(function(){
			if(vm.debug) console.log('Initial Value: ' + vm.field.FieldName + ' = ' + vm.getValText(vm.fieldVal));
			if(vm.fieldVal) vm.setPicker();
		})

		//this.valI = this.fieldValFormat;
		//$input.pickadate(vm.fieldValFormat)
	},
	methods:{
		updateValue: function (pickerVal) {
			var vm = this;
			if(this.debug) console.log('updateValue: ' + this.field.FieldName + ' = ' + this.getValText(pickerVal))
			//var dateVal;
			var formattedVal;// = picker.get();
			if(pickerVal && pickerVal != ''){
				//dateVal = new Date(pickerVal);
            	formattedVal = moment('1970-01-01 ' + pickerVal, 'YYYY-MM-DD h:mmA').format('HH:mm');
            }
            else{
            	formattedVal = '';
            }
            //this.val = formattedVal;
            if(this.fieldVal != formattedVal){
            	//console.log('change: ' + this.fieldVal + ' != ' + formattedVal);
				// Emit the value through the hub (to top level)
				//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: formattedVal});
			}
			else{
				console.log('no change');
				Vue.nextTick(function(){
					vm.setPicker();
				});
			}
		},
		// set from store/object
		setPicker: function(){
			if(this.debug) console.log('setPicker: ' + this.field.FieldName + ' = ' + this.getValText(this.fieldValFormat))
			var $input = $('#' + this.field.FieldHTMLID).val(this.fieldValFormat);

			//this.valI = this.fieldValFormat;
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