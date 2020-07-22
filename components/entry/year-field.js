Vue.component('year-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
	},
	template: '\
		<div class="input-field col s12 l10 offset-l1">\
			<p class="date-label" v-if="field.FieldName">{{field.FieldName}}</p>\
			<input\
				type="date" class="datepicker"\
				:ref="field.FormFieldID"\
				:id="field.FieldHTMLID"\
				v-bind:value="field.fieldVal"\
				v-on:input="updateValue($event.target.value)"\
			>\
		</div>\
	',
	/*v-bind:value="field.value"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
				v-on:blue="formatValue"\
				*/
	data: function(){
		return{
			//list vars
		}
	},
	methods:{
		updateValue: function (value) {
			var dateVal = new Date(value)
            var formattedVal = moment(dateVal).format('YYYY')
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: formattedVal});
		}
	},
	mounted: function(){
		var vm = this;
		var d = $('#' + this.field.FieldHTMLID);
		
		d.on('change', function($event){
			//console.log($event.target.value);
			vm.updateValue($event.target.value);
		});
		
		d.pickadate({
			selectMonths: false,
			selectYears: 15,
			today: 'Today',
			clear: 'Clear',
			close: 'Ok',
			onSet: function (ele) {
				if(ele.select){
					this.close()
				}
			},
			onClose: function() {
				$(document.activeElement).blur() // fixes the date picker opening when leaving tab and coming back
			}
		})

	}
})