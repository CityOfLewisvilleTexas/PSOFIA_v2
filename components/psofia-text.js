Vue.component('psofia-text', {
	props: {
		stateName:{
			type: String,
			required: false,
			default: 'form'
		},
		storeName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: true
		},
		storeId:{	// formFieldID, formSectionID, formSubSectionID, etc
			type: Number,
			required: false
		},
		valPropname:{
			type: String,
			required: true
		},
		inputDisabled:{
			type: Boolean,
			required: false,
			default: false
		},
		inputClearable:{
			type: Boolean,
			required: false,
			default: true
		},
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
		isDarkMode:{
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: `
		<v-text-field
			:id="inputID" :ref="inputID"
			
			v-model="inputVal"
			@input="updateValue"
			@change="changeValue"
			@update:error="updateErr"
			
			:label="inputLabel"
			:hint="inputDesc"
			:persistent-hint="hasHint"
			:disabled="inputDisabled"
			:clearable="inputClearable"

			@click:clear="clearInput"
			@focus="selectAll"
			@click.right="logValue"

			:messages="msg"
			:success="wasChanged"

			:rules="[]"
			:error="hasError"
		>
		</v-text-field>
	`,
	/*:value="inputVal"*/
	data: function(){
		return{
			isLoading: true,
			sharedState: store.state,
			inputValObj: {},
			inputVal: '',
			hasError: false,
			errMsg: '',
			debug: true,
		}
	},


	created: function(){
		 //this.initialize();
	},
	mounted: function(){
		var self = this;
		Vue.nextTick(function(){
            self.initialize();
        });
	},


	watch:{
		/*valObj: {
			handler: function(val, prev){
				if(val){
					if(this.debug) console.log('watch field obj - reload input: ' + this.valPropname);
					this.loadInput();
				}
			},
			deep: false
		}*/
	},


	computed:{
		stateLoading: function(){ return this.sharedState.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        dbLoading: function(){ return this.sharedState.database.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading; },
        appLoading: function(){ return this.storeLoading || this.isLoading; },

		compError: function(){
			if((this.storeName !== 'formData' || this.storeName !== 'formRecord') && !(this.storeId)) return true;
			else return false;
		},

		storeIdPropname: function(){
        	return store.getStoreTableID(this.payload);
        },
		descPropname: function(){
			var propname;
			if(this.storeName == 'formSections') propname = 'SectionDesc';
			else if(this.storeName == 'formSubSections') propname = 'SubsectionDesc';
			else if(this.storeName == 'formFields') propname = 'FieldDesc';
			return propname;
		},

        payload: function(){
			return {stateName: this.stateName, storeName: this.storeName, id: this.storeId, propname: this.valPropname};
		},
		origPayload: function(){
			return Object.assign({}, this.payload, {stateName: 'database'});
		},
		descPayload: function(){
			return Object.assign({}, this.payload, {propname: this.descPropname});
		},
		
		valObj: function(){
			return store.getObjProp(this.payload);
		},
		origValObj: function(){
			return store.getObjProp(this.origPayload);
		},

		// only for dialog
		isDialog: function(){
			return (this.stateName && this.stateName == 'dialog');
		},
		formPayload: function(){
			if(this.isDialog) return Object.assign({}, this.payload, {stateName: 'form'});
			else return null;
		},
		formValObj: function(){
			if(this.isDialog) return store.getObjProp(this.payload);
			else return null
		},

		inputID: function(){
			var id = '';
			if(this.storeId) id += 'input_' + this.storeName + '_' + this.storeIdPropname + this.storeId + '_' + this.valPropname;
			else id += 'input_' + this.storeName + '_' + this.valPropname;

			if(id.length > 0) return id;
			else return null;
		},

		inputLabel: function(){
			if(this.valObj) return this.valObj.Label;
			else return null;
		},
		inputDesc: function(){
			var self = this;
			if(this.storeName === 'fields') return store.getObjProp(self.descPayload);
			//else if(this.descPropname != null && this.valObj.hasOwnProperty(self.descPropname)) return this.valObj[self.descPropname];
			else return null;
		},
		
		hasHint: function(){
			if (this.inputDesc) return true;
			else return false;
		},
		wasChanged: function(){
			if(this.valObj.updateDB) return true;
			else return false;
		},
		inputColor: function(){
			if(this.wasChanged) return 'green';
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged) return 'original: ' + this.valToText(this.origValObj);
		},
		logMsg: function(){
			if(!this.isDialog){
				return this.valPropname + "\n" +
				" - original: " + this.valToText(this.origValObj) + "\n" + 
				" - current: " + this.valToText(this.valObj) + "\n" +
				" - input: " + this.valToText(this.inputValObj);
			}
			else{
				return this.valPropname + "\n" +
				" - original: " + this.valToText(this.origValObj) + "\n" + 
				" - form: " + this.valToText(this.formValObj) + "\n" +
				" - dialog: " + this.valToText(this.valObj) + "\n" +
				" - input: " + this.valToText(this.inputValObj);
			}
		}
	},


	methods:{
		initialize: function(){
			this.loadInput();
		},
		loadInput: function(){
			this.isLoading = true;
			var self = this;

			this.inputValObj = clone(self.valObj);
			Vue.nextTick(function(){
				self.inputVal = self.inputValObj.displayVal;
				self.isLoading = false;
			});
		},
		// @input (string)
		updateValue:function(newValue){
			var self = this;
			if(this.debug) console.log("text " + this.inputID + " @input " + newValue);

			var newVal = newValue;
			this.inputValObj.displayVal = newValue;

			if(newValue == ""){
				newVal = null;
			}
			this.inputValObj.dbVal = newVal;
			this.inputValObj.val = newVal ? newVal.toString().toUpperCase() : newVal;

			var newPayload = Object.assign({}, self.payload, {valObj: self.inputValObj});
			store.updateObjProp(newPayload);

			// reload input on watch
			//this.loadInput;

			/*switch(this.dataName){
				case 'formData':
					store.updateFormDataProp({propname: self.valPropname, newVal: newVal, valObj: self.inputValObj});
				break;
				case 'sections':
					//eventHub.$emit('update-section-data', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				case 'subSections':
					
				break;
				case 'fields':
					if(!(this.isRecordVal)){

					}
					else{

					}
				break;
				case 'edit-dialog':
					//eventHub.$emit('update-edit-dialog', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue, needsUpdate: this.wasChanged});
				break;
				default:
					
			}*/
		},
		valToText: function(_valObj){
			if(_valObj){
				if(_valObj.displayVal){
					if(_valObj.displayVal == '') return 'blank';
					else return _valObj.displayVal;
				}
				else return 'null';
			}
			else return 'null obj';
		},
		logValue: function(){
			if(this.debug) console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			if(this.debug) console.log("text " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			console.error("text " + this.inputID + " @update:error " + newValue);
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			/*setTimeout(function () {
				event.target.select()
			}, 0)*/
		},
		clearInput: function(){
			if(this.debug) console.log('clear input callback');
			//this.inputVal = null;
  			return;
		},
		setError: function(errMsg){
		},
		reload: function(val){
		},
	}
})