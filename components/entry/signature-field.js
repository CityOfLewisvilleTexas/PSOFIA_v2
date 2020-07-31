Vue.component('signature-field', {
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
			<img v-if="inputVal" :src="'data:image/jpeg;base64,' + inputVal"
				width="200px" height="50px"
				/>
			<a @click="open" class="btn"
				:id="field.FieldHTMLID + '-button'" :ref="field.FormFieldID + '-button'"
			>
			Signature
			</a>
			
			<div :id="field.FieldHTMLID + '-modal'" :ref="field.FormFieldID + '-modal'" class="modal">
				<div class="modal-content">
					<div class="row">
						<canvas :id="field.FieldHTMLID + '-signature'" :ref="field.FormFieldID + '-signature'"
							width="800px" height="200px"></canvas>
					</div>
					<div class="row">
						<a @click="clear" class="btn">Clear</a>
						<a @click="undo" class="btn">Undo</a>
					</div>
				</div>
				<div class="modal-footer">
					<a @click="close" class="btn-flat red-text">Cancel</a>
					<a @click="save" class="btn-flat teal-text">Save</a>
				</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			inputVal: '',
			debug: true,
			signaturePad: null,
		}
	},
	watch:{
		fieldVal: function(newVal, oldVal){
			if(typeof(oldVal) !== 'undefined' && newVal !== oldVal){
				if(this.debug) console.log('watch fieldVal: ' + this.field.FieldHTMLID + ' - ' + this.getValText(oldVal) + "  |  ->  |  " + this.getValText(newVal));
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
	mounted() {
		console.log('Mounted')
		var vm = this;

		$('#' + this.field.FieldHTMLID + '-modal').modal({ dismissible: false })
		var canvas = document.querySelector('#' + vm.field.FieldHTMLID + '-signature');

		Vue.nextTick(function(){
			vm.signaturePad = new SignaturePad(canvas, {
  				backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
			});

			if(vm.fieldVal){
				if(vm.debug) console.log('Initial Value: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal));
				vm.refreshInput();
			}
		})
	},
	beforeDestroy() {
		$('#' + this.field.FieldHTMLID + '-modal').modal('destroy')
	},
	methods:{
		open: function() {
			$('#' + this.field.FieldHTMLID + '-modal').modal('open')
		},
		undo: function() {
			var data = this.signaturePad.toData();
			if(data){
				data.pop();
				this.signaturePad.fromData(data);
			}
		},
		clear: function() {
			this.signaturePad.clear();
		},
		save() {
			var jpegStr = this.signaturePad.toDataURL("image/jpeg");
			this.inputVal = jpegStr.replace('data:image/jpeg;base64,', '')
			if(this.debug) console.log(this.inputVal.length)
			$('#' + this.field.FieldHTMLID + '-modal').modal('close')
		},
		close: function(value){
			$('#' + this.field.FieldHTMLID + '-modal').modal('close')
		},
		updateValue: function (value) {
			var vm = this;

			var actVal = $('#' + this.field.FieldHTMLID).val();
			if(this.debug) console.log('updateValue: ' + this.field.FieldHTMLID + ' = ' + this.getValText(this.fieldVal) + '; inputVal = ' + this.getValText(this.inputVal) + '; actual value: ' + this.getValText(actVal) );

			var trimVal = value.trim();
			if (trimVal !== value) {
				this.inputVal = trimVal;
				/*Vue.nextTick(function() {
					actVal = $('#' + vm.field.FieldHTMLID).val();
					if(vm.debug) console.log('updateValue: TRIM: ' + vm.field.FieldHTMLID + ' = ' + vm.getValText(vm.fieldVal) + '; inputVal = ' + vm.getValText(vm.inputVal) + '; actual value: ' + vm.getValText(actVal) );
				});*/
			}

			if(this.fieldVal !== trimVal){
				if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); // + ' - ' + this.getValText(this.fieldVal) + '  |  !==  |  ' + this.getValText(trimVal));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: trimVal});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		refreshInput: function () {
			if(this.fieldVal !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);
				
				this.inputVal = this.fieldVal;
				//this.signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...")
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else if(val === ' ') return 'EMPTY SPACE';
			else return val;
		},
	}
})