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
		<div class="signature-field col s12 l10 offset-l1" :class="classObject">
			<div :id="field.FieldHTMLID" class="signature-wrapper">
				<div v-if="inputVal">
					<img v-if="inputVal" :src="'data:image/jpeg;base64,' + inputVal"
						width="300px" height="50px"
					/>
					<a v-if="inputVal" @click="clearInputVal" class="btn-flat"><i class="material-icons">clear</i></a>
				</div>
				<a @click="open"
					:id="field.FieldHTMLID + '-button'" :ref="field.FormFieldID + '-button'"
					class="btn" :class="showRequired ? 'red darken-1' : ''"
					>{{ inputVal ? 'Edit' : 'Sign' }}</a>
			</div>
			<label v-if="field.FieldName" :for="field.FieldHTMLID" class="active">{{field.FieldName}}{{fieldRequired ? ' *' : ''}}</label>
			<div :id="field.FieldHTMLID + '-modal'" :ref="field.FormFieldID + '-modal'" class="modal signature-modal">
				<div class="modal-content">
					<div class="row">
    					<div class="col s12">
							<ul class="tabs">
								<li class="tab col s3"><a @click="isDrawing = false" :class="{active: !isDrawing ? true : false}" :href="field.FieldHTMLID + '-type-tab'">Type</a></li>
								<li v-if="!field.HideDraw" class="tab col s3"><a @click="isDrawing = true" :class="{active: isDrawing ? true : false}" :href="field.FieldHTMLID + '-draw-tab'">Draw</a></li>
							</ul>
						</div>
						<div v-if="!isDrawing" :id="field.FieldHTMLID + '-type-tab'" class="col s12 signature-type-tab">
							<div class="input-field inline col s6">
								<input type="text" v-model.lazy="textVal"
									:id="field.FieldHTMLID + '-type-input'" :ref="field.FieldHTMLID + '-type-input'"
									placeholder="Type your name"
								>
							</div>
							<a v-if="textVal" @click="clearTextInput" class="btn-flat"><i class="material-icons">clear</i></a>
							<span style="font-family:'Petit Formal Script'; color:#fafafa;">.</span>
						</div>
						<div v-if="isDrawing" :id="field.FieldHTMLID + '-draw-tab'" class="col s12 signature-draw-tab">
							<a v-if="hasDrawn" @click="clearCanvas" class="btn-flat">Clear</a>
							<a v-if="hasDrawn" @click="undo" class="btn-flat">Undo</a>
						</div>
					</div>
					<div class="row">
						<canvas :id="field.FieldHTMLID + '-signature'" :ref="field.FormFieldID + '-signature'"
							width="600px" height="100px" style='border: 1px solid black'></canvas>
					</div>
				</div>
				<div class="modal-footer">
					<a @click="save" v-if="hasSignature" class="btn-flat teal-text">Sign</a>
					<a @click="cancel" class="btn-flat red-text">Cancel</a>
				</div>
			</div>
		</div>
	`,
	data: function(){
		return{
			debug: false,
			inputVal: '',
			textVal: '',
			isOpen: false,
			isDrawing: false,
			canvas: null,
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
		},
		textVal: function(newVal, oldVal){
			if(newVal.length > 0) this.drawTextVal(newVal)
			else this.clearCanvas();
		},
		isDrawing: function(newVal, oldVal){
			this.clearCanvas()
			// switch to text
			if(newVal === false){
				this.signaturePad.off();
				this.clearCanvas()
				if(this.textVal.length > 0){
					this.drawTextVal()
				}
			}
			// switch to draw
			else if(newVal === true){
				this.signaturePad.on();
				this.clearCanvas()
				// to keep drawn data (to allow undo), must be 2 separate canvas (don't clear drawn canvas)
				// to keep drawn imgage (w/o allowing undo), save toDataURL, and redraw from that variable
			}
		},
	},
	computed:{
		fieldVal: function(){ return this.field.fieldVal; },
		fieldRequired: function(){ return this.field.Required; },
		showRequired: function(){ return (this.highlightRequired && this.fieldRequired && this.fieldVal === '') },
		classObject: function (){
			return {
				'field-is-blank': this.fieldVal === '',
				'field-is-required': this.fieldRequired,
				'field-show-required': this.showRequired,
			}
		},
		/*labelClassObject: function(){
			return {
				'active': this.fieldVal !== '',
			}
		},*/
		signatureData: function(){
			if(this.signaturePad) return this.signaturePad.toData()
		},
		hasDrawn: function(){
			return this.signatureData && this.signatureData.length > 0
		},
		hasDrawnText: function(){
			return this.textVal.length > 0
		},
		hasSignature: function(){
			return ((!this.isDrawing && this.hasDrawnText) || (this.isDrawing && this.hasDrawn))
		},
		canClear: function(){
			return this.hasSignature
		},
	},
	mounted() {
		if(this.debug) console.log('Mounted')
		var vm = this;

		$('#' + this.field.FieldHTMLID + '-modal').modal({
			dismissible: false,
			ready: function(modal, trigger) {
				$('ul.tabs').tabs();
			},
		})
		this.canvas = document.querySelector('#' + vm.field.FieldHTMLID + '-signature');

		Vue.nextTick(function(){
			vm.signaturePad = new SignaturePad(vm.canvas, {
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
		//$('.tabs').tabs('destroy'); // method dne?
	},
	methods:{
		open: function() {
			this.isOpen = true;
			$('#' + this.field.FieldHTMLID + '-modal').modal('open')
			if(!this.isDrawing) this.signaturePad.off();
			else this.signaturePad.on();
		},
		close: function() {
			$('#' + this.field.FieldHTMLID + '-modal').modal('close')
			this.isOpen = false;
		},
		drawTextVal: function(){
			this.clearCanvas();
			var ctx = this.canvas.getContext("2d");
			var adjustHeight = 16
			if(this.textVal.length > 16 && this.textVal.length <= 20){
				ctx.font = "bold 45px Petit Formal Script";
				adjustHeight = 13;
			}
			else if(this.textVal.length > 20){
				ctx.font = "bold 30px Petit Formal Script";
				adjustHeight = 10;
			}
			else ctx.font = "bold 60px Petit Formal Script";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText(this.textVal, this.canvas.width/2, (this.canvas.height/2 + adjustHeight));
		},
		undo: function() {
			var data = this.signaturePad.toData();
			if(this.hasDrawn){
				this.signatureData.pop();
				if(this.signatureData.length > 0){
					this.signaturePad.fromData(this.signatureData);
				}
				else{
					this.clearCanvas()
				}
			}
		},
		clearCanvas: function() {
			this.signaturePad.clear();
		},
		clearTextInput: function(){
			if(this.textVal.length > 0) this.textVal = '';
		},
		clearInputVal: function(){
			if(this.inputVal.length > 0) this.inputVal = '';
			this.updateValue();
		},
		cancel: function(){
			var vm = this
			this.clearTextInput()
			this.refreshInput()
			this.close();
		},
		save: function() {
			var jpegStr = this.signaturePad.toDataURL("image/jpeg");
			this.inputVal = jpegStr.replace('data:image/jpeg;base64,', '')
			if(this.debug) console.log(this.inputVal.length)
			this.updateValue();
			this.close();
		},
		updateValue: function () {
			var vm = this;
			if(this.hasSignature || this.fieldVal != this.inputVal){
				if(this.debug) console.log('updateValue: change: '  + this.field.FieldHTMLID); // + ' - ' + this.getValText(this.fieldVal) + '  |  !==  |  ' + this.getValText(trimVal));
				eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: this.inputVal});
			}
			else if(this.debug) console.log('updateValue: no change to main: '  + this.field.FieldHTMLID);
		},
		refreshInput: function () {
			var vm = this;
			if(this.fieldVal !== this.inputVal){
				if(this.debug) console.log('refreshInput: set input from store: ' + this.field.FieldHTMLID);
				this.inputVal = this.fieldVal;
			}
			//else if(this.debug) console.log('refreshInput: no change: ' + this.field.FieldHTMLID);
		},
		getValText: function(val){
			if(val === null) return 'NULL';
			else if(val === undefined) return 'UNDEFINED';
			else if(val === '') return 'EMPTY STRING';
			else if(val === ' ') return 'EMPTY SPACE';
			else return 'HAS SIGNATURE';
		},
	}
})