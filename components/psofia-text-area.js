Vue.component('psofia-textarea', {
	props: {
		stateName:{
			type: String,
			required: false,
			default: 'form'
		},
		storeName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: true,
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
	},
	template: `
		<v-textarea auto-grow rows="1"
			:id="inputID"
			:ref="inputID"
			
			:value="inputVal"
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
		</v-textarea>
	`,
	data: function(){
		return{
			sharedState: store.state,
			isLoading: true,
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
		valObj: {
			handler: function(val, prev){
				if(val){
					if(this.debug) console.log('watch field obj - reload input');
					this.loadInput();
				}
			},
			deep: true
		}
	},


	computed:{
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.colsLoading || this.formLoading || this.dbLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

		compError: function(){
			if((this.storeName !== 'formData' || this.storeName !== 'formRecord') && !(this.storeId)){
				return true;
			}
			else return false;
		},
		storeIdPropname: function(){
			return this.sharedState.tableIDs[this.storeName];
		},
		descPropname: function(){
			var propname;
			if(this.storeName == 'formSections'){
				propname = 'SectionDesc';
			}
			else if(this.storeName == 'formSubSections'){
				propname = 'SubsectionDesc';
			}
			else if(this.storeName == 'formFields'){
				propname = 'FieldDesc';
			}
			return propname;
		},

        payload: function(){
        	//var self = this;
			if(!(this.storeId)) return {storeName: this.storeName, propname: this.valPropname};
			else return {storeName: this.storeName, id: this.storeId, idPropname: this.storeIdPropname, propname: this.valPropname};
		},
		origPayload: function(){
			//var self = this;
			return Object.assign({}, this.payload, {isOrig:true});
		},
		descPayload: function(){
			//var self = this;
			return Object.assign({}, this.payload, {propname:this.descPropname});
		},
		
		valObj: function(){
			//var self = this;
			return store.getObjProp(this.payload);
		},
		origValObj: function(){
			//var self = this;
			return store.getObjProp(this.origPayload);
		},

		inputID: function(){
			var id = '';
			if(this.storeId){
				id += 'input_' + this.storeName + '_' + this.storeIdPropname + this.storeId + '_' + this.valPropname;
			}
			else{
				id += 'input_' + this.storeName + '_' + this.valPropname;
			}

			if(id.length > 0){
				return id;
			}
			else return null;
		},
		inputLabel: function(){
			if(this.valObj){
				return this.valObj.Label;
			}
			else return null;
		},
		inputDesc: function(){
			var self = this;
			if(this.storeName === 'fields'){
				return store.getObjProp(self.descPayload);
			}
			/*else if(this.descPropname != null && this.formField.hasOwnProperty(self.descPropname)){
				return this.formField[self.descPropname];
			}*/
			else return null;
		},
		hasHint: function(){
			if (this.inputDesc){
				return true;
			}
			else return false;
		},

		wasChanged: function(){
			// both null or is equal for false
			if( this.valObj.updateDB ){
				return true;
			}
			else return false;
		},
		inputColor: function(){
			if(this.wasChanged){
				return 'green';
			}
		},
		isSelected: function(){
		},
		msg: function(){
			if(this.wasChanged){
				return 'original: ' + this.valToText(this.origValObj);
			}
		},
		logMsg: function(){
			return this.valPropname + "\n" +
			" - database: " + this.valToText(this.origValObj) + "\n" + 
			" - form (current): " + this.valToText(this.valObj) + "\n" +
			" - input: " + this.valToText(this.inputValObj);
		}
	},


	methods:{
		initialize: function(){
			this.loadInput();
		},
		loadInput: function(){
			this.loading = true;
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
			if(this.debug) console.log("textarea " + this.inputID + " @input " + newValue);

			var newVal = newValue;
			this.inputValObj.displayVal = newValue;

			if(newValue == ""){
				newVal = null;
			}
			this.inputValObj.dbVal = newVal;
			this.inputValObj.val = this.inputValObj.dbVal ? this.inputValObj.dbVal.toString().toUpperCase() : this.inputValObj.dbVal;

			var payload3 = Object.assign({}, self.payload, {valObj: self.inputValObj});
			store.updateObjProp(payload3);

			// reload input on watch
			//this.loadInput;
		},
		valToText: function(oVal){
			if(oVal){
				if(oVal.dbVal){
					return oVal.dbVal.toString();
				}
				else if(oVal.dbVal == ''){
					return 'blank';
				}
				else{
					return 'null';
				}
			}
			else{
				return 'null obj'
			}
		},
		logValue: function(){
			if(this.debug) console.log(this.logMsg);
		},
		// @change (string)
		changeValue: function(newValue){
			if(this.debug) console.log("textarea " + this.inputID + " @change " + newValue);
		},
		// @update:error (boolean)
		updateErr: function(newValue){
			if(this.debug) console.log("textarea " + this.inputID + " @update:error " + newValue);
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