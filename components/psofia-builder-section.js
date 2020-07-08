Vue.component('psofia-builder-section', {
	props: {
		stateName:{	
			type: String,
			required: false,
			default: 'form'
		},
		storeName: {
			type: String,
			required: false,
			default: 'formSections'
		},
		storeId:{
			type: Number,
			required: true,
		},
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<v-card v-if="storeId && formSection"
			shaped class="mx-md-2 my-4">
			
			<v-toolbar flat color="grey lighten-2">
				<v-toolbar-title>Section {{formSection.SectionOrder.dbVal}}</v-toolbar-title>

				<v-progress-linear color="secondary" :active="appLoading" indeterminate absolute bottom></v-progress-linear>

				<v-spacer></v-spacer>

				<v-btn icon disabled @click="moveSectionUp">
					<v-icon>mdi-transfer-up</v-icon>
				</v-btn>
				<v-btn icon disabled @click="moveSectionDown">
					<v-icon>mdi-transfer-down</v-icon>
				</v-btn>
				<v-btn icon v-if="hasInactiveFields" @click="showInactive = !showInactive">
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</v-toolbar>
			
			<v-card-text>

				<psofia-input v-for="(field, index) in inputFields" :key="index"
					:store-name="storeName" :store-id="storeId" :val-propname="field"
				></psofia-input>

				<psofia-fields-table
					:state-name="stateName" store-name="formFields" :props="propsObj" :parent-show-inactive="showInactiveCalc"
				></psofia-fields-table>

				<v-divider></v-divider>
				
				<!--<builder-form-sub-section-v v-for="sub in subSections" 
					:key="sub.FormSubSectionID" 
					:sub-section="sub" 
					:fields="getSubSectionFields(sub)"  
					:all-sub-sections="allSubSections"  
					:all-field-types="allFieldTypes" 
					:all-validation-sets="allValidationSets" 
				></builder-form-sub-section-v>-->

			</v-card-text>

			<!--<builder-field-dialog-v
				:form-section-id="storeId" :fields="sectionFields"
			></builder-field-dialog-v>-->

			<v-card-actions>
				<v-btn @click="addSubSection" text block color="primary">
					<v-icon left>mdi-shape-rectangle-plus</v-icon>Add New Sub Section
				</v-btn>
			</v-card-actions>
			
		</v-card>
	`,

	data: function(){
		return{
			isLoading: false,
			sharedState: store.state,
			showInactive: false,
			//showDialog: false,
			//editSection: {},
			debug: true,
		}
	},

	created: function(){
		if(this.debug) console.log("\t\t\tBUILDER FORM SECTION - Created");
	},
	mounted:function(){
		if(this.debug) console.log("\t\t\tBUILDER FORM SECTION - Mounted");
        this.isLoading = false;
	},

	watch: {
    },

	computed: {
		showInactiveCalc: function(){
			return this.parentShowInactive || this.showInactive;
		},

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

		payload: function(){
			return {stateName: this.stateName, storeName: this.storeName, id: this.storeId}
		},

		formSection: function(){
			if(!this.storeLoading) return store.getDataObj(this.payload);
        },

        inputFields: function(){
            var self = this;
            if(this.formSection){
                return Object.keys(self.formSection).filter(function(field){
                    return (self.formSection[field].isInput && !(self.formSection[field].isHidden) && (self.formSection[field].valType !== 'boolean'));
                });
            }
        },

        /* PROPS FOR FIELDS TABLE */

        storeIdPropname: function(){
        	return store.getStoreTableID(this.payload);
        },
        subSectionIdPropname: function(){
        	return store.getStoreTableID({storeName:'formSubSections'});
        },

        propsObj: function(){
        	var obj = {};
        	obj[this.storeIdPropname] = this.storeId;
        	obj[this.subSectionIdPropname] = null;
        	return obj;
        },


        /* DETERMINE IF INACTIVE FORM FIELDS EXIST ANYWHERE IN SECTION (incl subsections of section) */

        payload_fields: function(){
        	var props = {}
        	props[this.storeIdPropname] = this.storeId;
        	return {stateName: this.stateName, storeName: 'formFields', props: props, keepInactive: this.showInactiveCalc};
        },

        hasInactiveFields: function(){
			if(this.payload_fields) return store.checkFieldsInactive(this.payload_fields);
		},
	},

	methods: {
		initialize: function(){
			var self = this;
		},

		deleteFieldByID: function(fieldID) {
			//confirm('Are you sure you want to delete this field?') //&& this.fields.splice(index, 1);

			//eventHub.$emit('delete-field', {fieldID: fieldID});
			//this.editingFieldID = null;
        	//this.editingField = clone(self.defaultField);
		},

/* ADD NEW FIELD - currently passing section ID only */
		updateField: function(fieldID, updatedField){
			eventHub.$emit('update-field', {fieldID: fieldID, updatedField: updatedField});
		},

/* ADD NEW SUBSECTION - currently passing section ID only */
		addSubSection: function(val){
			//eventHub.$emit('add-new-sub-section', {sectionID: this.section.sectionID});
		},
		moveSectionUp(){
			var self = this;
			//eventHub.$emit('move-section', {formSectionID: self.section.FormSectionID, type: 'up'});
		},
		moveSectionDown(){
			var self = this;
			//eventHub.$emit('move-section', {formSectionID: self.section.FormSectionID, type: 'down'});
		}
	}
})








/*<builder-combobox-v
								data-portion="section"
								:form-section-id="formSectionId"
								:autocomplete-options="allSections"
								val-propname="SectionID"
								text-propname="SectionTitle"
								id-text="SecTitle" 
								:id-num="formSectionId"
								:concat-id="true"
								label-text="Section Title"
							></builder-combobox-v>
						</v-flex>
						<v-flex xs12>
							<builder-checkbox-v
								:field="formSection"
								:orig-field="origSection"
								val-propname="HideSectionTitle"
								id-text="SecTitleCk"
								:id-num="formSectionId"
								:concat-id="true"
								label-text="Hide Title In Form"
								data-portion="section"
							></builder-checkbox-v>
							<v-divider></v-divider>
						</v-flex>*/

/*ckboxFields: function(){
            var self = this;
            if(this.formSection){
                return Object.keys(self.formSection).filter(function(field){
                    return (self.formSection[field].isInput  && !(self.formSection[field].isHidden) && (self.formSection[field].valType === 'boolean'));
                });
            }
        },*/


        /*sectionID:function(){
			return this.formSection.SectionID;
		},

		colAllSections: function(){
			return this.sharedState.columns.allSections;
		},
		colSections: function(){
            return this.sharedState.columns.formSections;
        },
        inputColumns: function(){
        	return this.colSections.filter(function(col){
        		return (col.UserInput && !(col.Hidden) && col.ColumnType !== 'BOOL' && col.ColumnType !== 'BOOLEAN');
        	});
        },
        ckboxColumns: function(){
        	return this.colSections.filter(function(col){
        		return (col.UserInput && !(col.Hidden) && (col.ColumnType === 'BOOL' || col.ColumnType === 'BOOLEAN'));
        	});
        },*/

		/*sectionSubSections:function(){
			var self = this;
			return store.getFormSubSections_OrderedInSec(self.payload);
		},

		sectionFields:function(){
			var self = this;
			return store.getFormFields_OrderedInSec(self.payload);
		},*/



		/*editNewField: function(fieldID){
        	var self = this;
			eventHub.$emit('open-edit-dialog-full', {sectionID: self.sectionID, fieldID: field.FormFieldID});
		},*/
		/*addField: function(fieldID, field){
			eventHub.$emit('add-new-field', {fieldID: fieldID, field: field});
		},*/