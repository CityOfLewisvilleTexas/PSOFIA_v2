Vue.component('select-field', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		vSet:{
			type: Object,
			required: false
		},
		vsOptions:{
			type: [Object, Array],
			required: false
		},
		highlightRequired:{
			type: Boolean,
			required: false,
			default: false,
		},
	},
	template: `
		<div class="input-field col s12 l10 offset-l1" :class="classObject">
			<select
				:id="field.FieldHTMLID" :ref="field.FormFieldID"
				v-model="inputVal"
			>
				<option value="">Choose your option</option>
				<option v-for="o in sortedOptions"
					:key="o.VSOptionID"
					v-bind:value="o.EntryValue" 
					v-bind:selected="o.EntryValue===inputVal"
				>{{o.EntryName}}</option>
			</select>
			<label v-if="field.FieldName" :for="field.FieldHTMLID">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
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
		fieldRequired: function(){
			return this.field.Required;
		},
		sortedOptions: function(){
			return this.vsOptions.sort(function(a, b){
				return a.OptionOrder - b.OptionOrder;
			});
		},
		classObject: function () {
			return {
				'field-is-blank': this.fieldVal === '' || !(this.fieldVal),
				'field-is-required': this.fieldRequired,
				'field-show-required': this.highlightRequired && this.fieldRequired && (this.fieldVal === '' || !(this.fieldVal)),
			}
		},
		// Does something funky to SELECTS
		/*labelClassObject: function(){
			return {
				'active': this.fieldVal !== '',
			}
		},*/
	},
	mounted: function(){
		var vm = this;
		var s = $('#' + this.field.FieldHTMLID);

		s.on('change', function($event){
			var val = $event.target.value;
			if(vm.debug) console.log('ON CHANGE: ' + vm.field.FieldHTMLID + ' => ' + vm.getValText(val) + '; inputVal = ' + vm.getValText(vm.inputVal));
			if(vm.debug) console.log('!!! set inputVal: '  + vm.field.FieldHTMLID);
			vm.inputVal = val;
			vm.updateValue(val);
		});

		//console.log(s.material_select());
		//Vue.nextTick(function(){
			if(vm.fieldVal){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal));
				vm.refreshInput();
			}
		//});
	},
	methods:{
		updateValue:function(value){
			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			// Does this need to be compared b/c valset obj?
			if(this.fieldVal !== value){
				if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); //+ ' - ' + this.getValText(this.fieldVal) + ' !== ' + this.getValText(value));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: value});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		refreshInput: function () {
			var vm = this;

			if(this.fieldVal !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);

				this.inputVal = this.fieldVal;

				Vue.nextTick(function() {
					vm.reload();
				});
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		reload: function(val){
			//if(this.debug) console.log('reload: ' + this.field.FieldHTMLID)
			$('#' + this.field.FieldHTMLID).material_select();
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else return val;
		},
	},
})