Vue.component('psofia-input', {
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
	},
	template: `
		<v-row>
			<v-col cols="12" xs="12" :sm="smallSize">
				<psofia-text v-if="isText"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-text>
				<psofia-textarea v-if="isTextArea"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-textarea>
				<psofia-number v-if="isNumber"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-number>
				<psofia-checkbox v-if="isCheckbox"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-checkbox>
				<psofia-combobox v-if="isCombobox"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-combobox>
				<!--<psofia-select v-if="isSelect"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-select>-->
				<!--<psofia-autocomplete v-if="isAutocomplete"
					:state-name="stateName" :store-name="storeName" :store-id="storeId" :val-propname="valPropname">
				</psofia-autocomplete>-->
			</v-col>

			<v-col v-if="(storeName==='formData' && valPropname==='FormName')"" cols="12" xs="12" sm="4">
				<psofia-text v-if="showFormTable"
					:store-name="storeName" :store-id="storeId" val-propname="TableName" 
					:inputDisabled="true" :inputClearable="false">
				</psofia-text>
			</v-col>

			<v-col v-if="(storeName==='formSections' && valPropname==='SectionID')"" cols="12" xs="12" sm="4">
				<psofia-checkbox
					:store-name="storeName" :store-id="storeId" val-propname="HideSectionTitle" 
				></psofia-checkbox>
			</v-col>

			<v-col v-if="showFieldTypeExtra" cols="12" xs="12" sm="4">
				<psofia-checkbox v-if="showPrimaryDate"
					:store-name="storeName" :store-id="storeId" val-propname="PrimaryDateField" 
				></psofia-checkbox>

				<psofia-combobox v-if="showValSets"
					:store-name="storeName" :store-id="storeId" val-propname="ValidationSetID" 
				></psofia-combobox>

				<psofia-number v-if="showMaxMin"
					:store-name="storeName" :store-id="storeId" val-propname="FieldMax" 
				></psofia-number>
				<psofia-number v-if="showMaxMin"
					:store-name="storeName" :store-id="storeId" val-propname="FieldMin" 
				></psofia-number>
			</v-col>
		</v-row>
	`,
	data: function(){
		return{
			isLoading: true,
            sharedState: store.state,
            debug: true,
		}
	},
	created: function(){
        //if(this.debug) console.log("\t\t\tBUILDER FORM DATA INPUT - Created");
    },
    mounted: function(){
        //if(this.debug) console.log("\t\t\tBUILDER FORM DATA INPUT - Mounted");
        this.isLoading = false;
    },
	watch:{
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
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

        storeIdPropname: function(){
        	return this.sharedState.tableIDs[this.storeName];
		},
        payload: function(){
			return {stateName: this.stateName, storeName: this.storeName, propname: this.valPropname};
		},
        valObj: function(){
        	var self = this;
			return store.getObjProp(self.payload);
        },

        smallSize: function(){
        	if(this.storeName === 'formData' && this.valPropname === 'FormName') return 8;
        	else if(this.storeName === 'formSections' && this.valPropname === 'SectionID') return 8;
        	else if(this.storeName === 'formFields' && this.valPropname === 'FieldTypeID') return 8;
        	else return null;
        },

        isMoment: function(){
			return this.valObj.valType === 'moment';
		},
		isDate: function(){
			return this.field.FieldType == 'DATE';
		},
		isTime: function(){
			return this.field.FieldType == 'TIME';
		},
		isYear: function(){
			return this.field.FieldType == 'YEAR';
		},

		isNumber: function(){
			return this.valObj.valType === 'number';
		},
		isText: function(){
			return this.valObj.valType === 'text';
		},
		isTextArea: function(){
			return this.valObj.valType === 'textarea';
		},
		isCheckbox: function(){
			return this.valObj.valType === 'boolean';
		},
		isSelect: function(){
			return (this.valObj.valType === 'select');
		},
		isSelect2: function(){
			return (this.valObj.valType === 'select2');
		},
		isAutocomplete: function(){
			return (this.valObj.valType === 'autocomplete');
		},
		isCombobox: function(){
			return (this.valObj.valType === 'combobox');
		},

		showFormTable: function(){
			var otherPayload;
			var otherValObj;
			if(this.storeName === 'formData' && this.valPropname === 'FormName'){
				otherPayload = this.getOtherPayload('TableName');
				otherValObj = store.getObjProp(otherPayload);
				if(otherValObj && otherValObj.val){
					return true;
				}
				else return false;
			}
			else return false;
		},
		showFieldTypeExtra: function(){
			if(this.storeName === 'formFields' && this.valPropname === 'FieldTypeID'){
				if(this.valObj && (this.valObj.val == 1 || this.valObj.val == 3 || this.valObj.val == 7)) return true;
				else return false;
			}
			else return false;
		},
		showPrimaryDate: function(){
			if(this.valObj.val == 1) return true;
			else return false;
		},
		showValSets: function(){
			if(this.valObj.val == 7) return true;
			else return false;
		},
		showMaxMin: function(){
			if(this.valObj.val == 3) return true;
			else return false;
		},
	},
	methods:{
		getOtherPayload: function(otherPropname){
			var self = this;
			return Object.assign({}, self.payload, {propname:otherPropname});
		},
	}
})

/*
			//var self = this;
			//if(!(this.storeId)) return {stateName: this.stateName, storeName: this.storeName, propname: this.valPropname};
			//else return {stateName: this.stateName, storeName: this.storeName, id: this.storeId, propname: this.valPropname}; //idPropname: this.storeIdPropname,


		storeIdPropname: function(){
        	return this.sharedState.tableIDs[this.storeName];
			/*var propname;
			if(this.storeName == 'formSections'){
				propname = 'FormSectionID';
			}
			else if(this.storeName == 'formSubSections'){
				propname = 'FormSubSectionID';
			}
			else if(this.storeName == 'formFields'){
				propname = 'FormFieldID';
			}
			return propname;*
		},
*/