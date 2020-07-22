Vue.component('date-field', {
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
			<input type="text" class="datepicker"
				:ref="field.FormFieldID"
				:id="field.FieldHTMLID"
			>
		</div>
	`,
	/*v-bind:value="field.value"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
				v-on:blue="formatValue"\
				*/
	data: function(){
		return{
			debug: true,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			if(this.debug) console.log('watch fieldVal: ' + this.field.FieldName + ': ' + this.getValText(oldVal) + " -> " + this.getValText(newVal));

			if(newVal != oldVal){
				this.setPicker();
			}
		}
	},
	computed:{
		fieldVal: function(){
			return this.field.fieldVal;
		},
		fieldValFormat: function(){
			return moment(this.fieldVal).format('MM/DD/YY');
		},
	},
	mounted: function(){
		var self = this;

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
				if(self.debug) console.log(context);
				if(context.select){
					//console.log('set select: ' + context.select)
					self.updateValue(context.select)
					this.close()
				}
				else if(context.hasOwnProperty('clear')){
					self.updateValue(null)
					this.close()
				}
				else if(context.view){
					//console.log('set view: ' + context.view)
					//self.storeVal = context.view;
				}
			},
			onClose: function() {
				$(document.activeElement).blur() // fixes the date picker opening when leaving tab and coming back
			}
		});

		/*$input.on('change', function($event){
			//console.log($event.target.value);
			self.updateValue($event.target.value);
		});*/

		// Prevent datepicker from auto-closing  CF 03/23/2020
		// CL 06/10/2020 - still occurs but only after clicking clear, clicking into different window, then immediately clicking input field before focus returned to form window
		$input.on('mousedown',function(event){
			event.preventDefault();
		})

		Vue.nextTick(function(){
			if(self.debug) console.log('Initial Value: ' + self.field.FieldName + ' = ' + self.getValText(self.fieldVal));
			if(self.fieldVal) self.setPicker();
		})
	},
	methods:{
		updateValue: function (pickerVal) {
			//var dateVal;
			var formattedVal;// = picker.get();
			if(this.debug) console.log('updateValue: ' + this.field.FieldName + ' = ' + this.getValText(pickerVal))

			if(pickerVal && pickerVal != ''){
				//dateVal = new Date(pickerVal);
            	formattedVal = moment(pickerVal).format('YYYY-MM-DD');
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
				if(this.debug) console.log('updateValue: '  + this.field.FieldName + ': no change')
			}
		},
		// set from store/object
		setPicker: function(){
			//var self = this;
			if(this.debug) console.log('setPicker: ' + this.field.FieldName + ' = ' + this.getValText(this.fieldVal));

			var d = $('#' + this.field.FieldHTMLID)
			var $input = $('#' + this.field.FieldHTMLID).pickadate();
			// Use the picker object directly.
			var picker = $input.pickadate('picker')
			
			if(this.fieldVal){
				picker.set('select', this.fieldVal, {format: 'yyyy-mm-dd'})
			}
			else{
				if(this.debug) console.log('setPicker: ' + this.field.FieldName + ': NO VAL, CLEAR PICKER')
				picker.set('clear')
			}
		},
		// set from store/object
		setPickerView: function(){
			//var self = this;
			var $input = $('#' + this.field.FieldHTMLID).pickadate();
			// Use the picker object directly.
			var picker = $input.pickadate('picker')
			picker.set('view', this.fieldVal, {format: 'yyyy-mm-dd'})
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else return val;
		},
	},
})