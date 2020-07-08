Vue.component('psofia-field-dialog', {
	// declare the props
	props: {
		stateName:{	
			type: String,
			required: false,
			default: 'dialog'
		},
		storeName:{
			type: String,
			required: false,
			default: 'formFields'
		},
		storeId:{
			type: Number,
			required: false
		},
		props:{	// formSectionID, formSubSectionID
			type: Object,
			required: true
		},
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<v-dialog v-model="showDialog" max-width="800px">
			<v-card>
				<v-toolbar flat>
                	<v-toolbar-title>{{dialogTitle}}</v-toolbar-title>
                	<v-spacer></v-spacer>
					<v-btn icon @click="deleteField">
						<v-icon>delete</v-icon>
					</v-btn>
                </v-toolbar>

                <v-progress-linear color="red" :active="appLoading" indeterminate absolute bottom></v-progress-linear>

				<v-card-text>
					<psofia-input v-for="(field, index) in inputFields" :key="index"
						:store-name="storeName" :state-name="stateName" :store-id="storeId" :val-propname="field"
					></psofia-input>

					<v-row v-if="inputFields">
	                    <v-col cols="12" xs="12" sm="6" md="4" lg="3">
	                        <psofia-checkbox :state-name="stateName" :store-name="storeName" :store-id="storeId" val-propname="Required"></psofia-checkbox>
	                    </v-col>
	                    <v-col cols="12" xs="12" sm="6" md="4" lg="3">
	                        <psofia-checkbox :state-name="stateName" :store-name="storeName" :store-id="storeId" val-propname="VisibleInHeader"></psofia-checkbox>
	                    </v-col>
	                </v-row>

				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="cancelDialog" text>Cancel</v-btn>
					<v-btn @click="saveDialog" text>Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	`,


	data: function(){
		return{
			isLoading: false,
			sharedState: store.state,
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


	watch: {
    },


	computed: {
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        dialogLoading: function(){
            return this.sharedState.dialog.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.dialogLoading || this.formLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

        showDialog: function(){
        	return this.sharedState.dialogSettings.isOpen;
        },

        payload: function(){
        	if (this.storeName && this.storeId) return {stateName: this.stateName, storeName: this.storeName, id: this.storeId, props: this.props};
        },

        formField: function(){
        	if (this.payload) return store.getDataObj(this.payload);
        },

        inputFields: function(){
            var self = this;
            if(this.formField){
                return Object.keys(self.formField).filter(function(field){
                    return (self.formField[field].isInput && !(self.formField[field].isHidden) && (self.formField[field].valType !== 'boolean'));
                });
            }
        },

		/* Copied from Vuetify for data-table w/ CRUD */
		dialogTitle: function(){
			if(this.storeId === this.storeId){
				return 'New Item';
			}
			else if(this.storeId < 0){
				return 'Editing New Item';
			}
			else{
				return 'Edit Item';
			}
		}
	},
	methods: {
		initialize: function(){
			/*var self = this;
			console.log('init dialog');
			this.defaultField = this.getDefaultField();
			this.origField = clone(self.defaultField);
			this.editingField = clone(self.defaultField);
			this.listenOnHub();*/
		},

        closeDialog: function(){
        	var self = this;
        	var payload2 = Object.assign({}, self.payload, {isOpen: false});
        	store.setDialog(payload2);
			//eventHub.$emit('add-new-field', {fieldID: self.editingFieldID, field: self.editingField});
		},
		cancelDialog: function(){
			this.closeDialog();
		},
		saveDialog: function() {
			var self = this;
			
			this.closeDialog();
		},
		deleteField: function() {
			var self = this;

			//confirm('Are you sure you want to delete this field?') //&& this.fields.splice(index, 1);

			eventHub.$emit('delete-field', {fieldID: self.editingFieldID});
			this.closeDialog();
		},
	}
})




/*
<!--<v-layout wrap>
						<v-flex xs12>
							<builder-text-v
								:field="editingField"
								:orig-field="origField"
								val-propname="FieldName"
								id-text="editingFieldName"
								label-text="Field Name"
								data-portion="edit-dialog"
							></builder-text-v>
							<!--v-model="editingField.FieldName"--
						</v-flex>
						<v-flex xs12>
							<builder-text-v
								:field="editingField"
								:orig-field="origField"
								val-propname="FieldHTMLID"
								id-text="editingFieldHTMLID"
								label-text="Field HTML ID"
								data-portion="edit-dialog"
							></builder-text-v>
							<!--v-model="editingField.FieldHTMLID" label="Field HTML ID"--
						</v-flex>
						<v-flex xs12>
							<builder-autocomplete-v
								:field="editingField"
								:orig-field="origField"
								:autocomplete-options="allFieldTypes"
								val-propname="FieldTypeID"
								text-propname="FieldType"
								id-text="editingFieldType"
								label-text="Field Type"
								data-portion="edit-dialog"
								add-option
							></builder-autocomplete-v>
						</v-flex>
						<v-flex xs12 v-if="editingField.FieldTypeID == 7">
							<builder-autocomplete-v
								:field="editingField"
								:orig-field="origField"
								:autocomplete-options="allValidationSets"
								val-propname="ValidationSetID"
								text-propname="ValidationSetName"
								id-text="editingVSet"
								label-text="Validation Set"
								data-portion="edit-dialog"
								add-option
							></builder-autocomplete-v>
						</v-flex>
						<!--<v-flex xs6 v-if="editingField.FieldTypeID == 3">
							<builder-checkbox-v
								:field="editingField"
								:orig-field="origField"
								val-propname="HasMaxMin"
								id-text="editingMaxMinCk"
								label-text="Add Max/Min"
								data-portion="edit-dialog"
							></builder-checkbox-v>
						</v-flex>--
						<v-flex xs6 v-if="editingField.FieldTypeID == 3">
							<builder-number-v
								:field="editingField"
								:orig-field="origField"
								val-propname="FieldMin"
								id-text="editingFieldMin"
								label-text="Min"
								data-portion="edit-dialog"
							></builder-number-v>
						</v-flex>
						<v-flex xs6 v-if="editingField.FieldTypeID == 3">
							<builder-number-v
								:field="editingField"
								:orig-field="origField"
								val-propname="FieldMax"
								id-text="editingFieldMax"
								label-text="Max"
								data-portion="edit-dialog"
							></builder-number-v>
						</v-flex>
						<v-flex xs12>
							<builder-checkbox-v
								:field="editingField"
								:orig-field="origField"
								val-propname="Required"
								id-text="editingReq"
								label-text="Required"
								data-portion="edit-dialog"
							></builder-checkbox-v>
						</v-flex>
						<v-flex xs12>
							<builder-checkbox-v
								:field="editingField"
								:orig-field="origField"
								val-propname="VisibleOnEdit"
								id-text="editingVis"
								label-text="Visible On Edit"
								data-portion="edit-dialog"
							></builder-checkbox-v>
						</v-flex>
						<v-flex xs12>
							<builder-checkbox-v
								:field="editingField"
								:orig-field="origField"
								val-propname="Active"
								id-text="editingAct"
								label-text="Active"
								data-portion="edit-dialog"
							></builder-checkbox-v>
						</v-flex>
					</v-layout>-->
*/

		/*allSections:function(){
			return this.sharedState.sections;
		},
		allSubSections:function(){
			return this.sharedState.subSections;
		},
		allFieldTypes:function(){
			return this.sharedState.fieldTypes;
		},
		allValidationSets:function(){
			return this.sharedState.validationSets;
		},*/
		/*minFieldID:function(){
			return store.getMinFormFieldID();
		},*/

				/*listenOnHub: function(){
			var self = this;
			eventHub.$on('open-edit-dialog-full', self.openDialog);
			//eventHub.$on('update-edit-dialog', self.updateEditingField);
		},*/
		/*minFieldID:function(){
			return store.getMinFormFieldID();
		},
		newFieldID:function(){
			if(this.minFieldID() >= 0){
				return -1;
			}
			else{
				return this.minFieldID() - 1;
			}
		},
		maxFieldOrder:function(){
			var self = this;
			return store.getMaxOrderInSection(self.sectionId);
		},
		findInSetByID: function(set, id, idPropname){
            return set.find(function(s){
                return s[idPropname] == id;
            });
        },*/
		/*getDefaultField:function(){
        	var self = this;
        	return store.getDefaultFieldForSection(self.sectionId);
        },*/
		/*getEditingFieldClone: function(fieldID){
        	var self = this;
        	var f = this.findInSetByID(self.fields, fieldID, "FormFieldID");
        	if(f){
        		return clone(f);
        	}
        	else{
        		f = clone(self.defaultField);
        		f.FieldID = fieldID;
        		f.FieldOrder = this.maxFieldOrder() + 1;
        		return f;
        	}
        },*/

		/*updateEditingField: function(payload){
			if(payload.val){
                // check if change to form val
                if(this.editingField[payload.valPropname] != payload.val){
                    this.editingField[payload.valPropname] = payload.val;

                    //check if change from original val: if original section exists and val the same
                    if(!(this.origField) || this.origField[payload.valPropname] != payload.val){
                        this.editingField.updateDB = true;
                    }
                    else{
                        this.editingField.updateDB = false;
                    }
                    // only update text prop if already set
                    if (this.editingField.hasOwnProperty(payload.textPropname)){
                        this.editingField[payload.textPropname] = null;
                    }
                }
            }
            // else if only text was sent
            else if (payload.text){
                console.log('text');
                if(!(this.editingField.hasOwnProperty(payload.textPropname))){
                    Vue.set(this.editingField, payload.textPropname, payload.text);
                    this.editingField[payload.valPropname] = null;
                    this.editingField.updateDB = true;
                }
                else if(this.editingField.hasOwnProperty(payload.textPropname) && this.editingField[payload.textPropname] != payload.text){
                    this.editingField[payload.textPropname] = payload.text;
                    this.editingField[payload.valPropname] = null;
                    this.editingField.updateDB = true;
                }
            }
            else{
                console.log('null field');
                this.editingField[payload.valPropname] = null;
                if(this.editingField.hasOwnProperty(payload.textPropname)){
                    this.editingField[payload.textPropname] = null;
                }
                if(!(this.origField) || !(this.origField[payload.valPropname])){
                    this.editingField.updateDB = false;
                }
                else{
                    this.editingField.updateDB = true;
                }
            }
		},*/

		/*openDialog: function(payload){	//{sectionID: this.section.FormSectionID, fieldID: field.FormFieldID}
        	var self = this;
        	console.log('openDialog');
        	console.log(payload);
        	if(payload.sectionID == this.sectionId){
        		/*var f = self.findInSetByID(self.fields, payload.fieldID, 'FormFieldID')
        		if(f){
        			self.updateField(f);
        		}*
        		this.editingFieldID = payload.fieldID;
        		this.origField = this.getEditingFieldClone(payload.fieldID);
        		this.editingField = this.getEditingFieldClone(payload.fieldID);
        		this.showDialog = true;
        	}
        },*/