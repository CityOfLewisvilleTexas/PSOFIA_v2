Vue.component('builder-field-dialog-v', {
	// declare the props
	props: {
		formSectionId:{
			type: [Number],
			required: true
		},
		// fields for current section, including further subsections
		fields:{
			type: [Object, Array],
			required: false
		},
	},
	template: `\
		<v-dialog v-model="showDialog" max-width="500px">\
			<v-card>\
				<v-card-title>\
					<span class="headline">{{ formTitle }}</span>\
				</v-card-title>\
				<v-card-text>\
					<v-layout wrap>\
						<v-flex xs12>\
							<builder-text-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="FieldName"\
								id-text="editingFieldName"\
								label-text="Field Name"\
								data-portion="edit-dialog"\
							></builder-text-v>\
							<!--v-model="editingField.FieldName"-->\
						</v-flex>\
						<v-flex xs12>\
							<builder-text-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="FieldHTMLID"\
								id-text="editingFieldHTMLID"\
								label-text="Field HTML ID"\
								data-portion="edit-dialog"\
							></builder-text-v>\
							<!--v-model="editingField.FieldHTMLID" label="Field HTML ID"-->\
						</v-flex>\
						<v-flex xs12>\
							<builder-autocomplete-v\
								:field="editingField"\
								:orig-field="origField"
								:autocomplete-options="allFieldTypes" \
								val-propname="FieldTypeID" \
								text-propname="FieldType" \
								id-text="editingFieldType" \
								label-text="Field Type" \
								data-portion="edit-dialog"\
								add-option\
							></builder-autocomplete-v>\
						</v-flex>\
						<v-flex xs12 v-if="editingField.FieldTypeID == 7">\
							<builder-autocomplete-v\
								:field="editingField"\
								:orig-field="origField"
								:autocomplete-options="allValidationSets" \
								val-propname="ValidationSetID" \
								text-propname="ValidationSetName" \
								id-text="editingVSet" \
								label-text="Validation Set" \
								data-portion="edit-dialog"\
								add-option\
							></builder-autocomplete-v>\
						</v-flex>\
						<!--<v-flex xs6 v-if="editingField.FieldTypeID == 3">\
							<builder-checkbox-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="HasMaxMin"\
								id-text="editingMaxMinCk"\
								label-text="Add Max/Min"\
								data-portion="edit-dialog"\
							></builder-checkbox-v>\
						</v-flex>-->\
						<v-flex xs6 v-if="editingField.FieldTypeID == 3">\
							<builder-number-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="FieldMin"\
								id-text="editingFieldMin"\
								label-text="Min"\
								data-portion="edit-dialog"\
							></builder-number-v>\
						</v-flex>\
						<v-flex xs6 v-if="editingField.FieldTypeID == 3">\
							<builder-number-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="FieldMax"\
								id-text="editingFieldMax"\
								label-text="Max"\
								data-portion="edit-dialog"\
							></builder-number-v>\
						</v-flex>\
						<v-flex xs12>\
							<builder-checkbox-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="Required"\
								id-text="editingReq"\
								label-text="Required"\
								data-portion="edit-dialog"\
							></builder-checkbox-v>\
						</v-flex>
						<v-flex xs12>\
							<builder-checkbox-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="VisibleOnEdit"\
								id-text="editingVis"\
								label-text="Visible On Edit"\
								data-portion="edit-dialog"\
							></builder-checkbox-v>\
						</v-flex>
						<v-flex xs12>\
							<builder-checkbox-v\
								:field="editingField"\
								:orig-field="origField"
								val-propname="Active"\
								id-text="editingAct"\
								label-text="Active"\
								data-portion="edit-dialog"\
							></builder-checkbox-v>\
						</v-flex>
					</v-layout>\
				</v-card-text>\
				<v-card-actions>\
					<v-spacer></v-spacer>\
					<v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>\
					<v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>\
				</v-card-actions>\
			</v-card>\
		</v-dialog>\
	`,
	data: function(){
		return{
			//list vars
			/* copied from Vuetify for data-table w/ CRUD */
			sharedState: store.state,
			showDialog: false,
			fieldHeaders: [
				{text: 'Field Name', sortable: false},
				{text: 'HTML ID', sortable: false},
				{text: 'Field Type', sortable: false},
				{text: 'Properties', sortable: false}
			],
			defaultField: {},
			editingFieldID: -1,
			origField: {},
			editingField: {},
		}
	},
	/*create: function(){
		this.initialize(); // idk why not done in ready?
	},*/
	mounted: function(){
		this.initialize(); // idk why not done in ready?
	},
	watch: {
    },
	computed: {
		allSections:function(){
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
		},
		/*minFieldID:function(){
			return store.getMinFormFieldID();
		},*/

		/* Copied from Vuetify for data-table w/ CRUD */
		formTitle () {
			if(this.editingFieldID === this.newFieldID()){
				return 'New Item';
			}
			else if(this.editingFieldID < 0){
				return 'Editing New Item';
			}
			else{
				return 'Edit Item';
			}
		}
	},
	methods: {
		initialize: function(){
			var self = this;
			console.log('init dialog');
			this.defaultField = this.getDefaultField();
			this.origField = clone(self.defaultField);
			this.editingField = clone(self.defaultField);
			this.listenOnHub();
		},
		listenOnHub: function(){
			var self = this;
			eventHub.$on('open-edit-dialog-full', self.openDialog);
			eventHub.$on('update-edit-dialog', self.updateEditingField);
		},
		minFieldID:function(){
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
        },
		getDefaultField:function(){
        	var self = this;
        	return store.getDefaultFieldForSection(self.sectionId);
        },
		getEditingFieldClone: function(fieldID){
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
        },

		getFieldType:function(field){
			var ft = this.allFieldTypes.find(function(f){
				return f.FieldTypeID == field.FieldTypeID;
			})
			if(ft){
				return ft.FieldType;
			}
			else{
				return '';
			}
		},

		updateEditingField: function(payload){
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
		},

		openDialog: function(payload){	//{sectionID: this.section.FormSectionID, fieldID: field.FormFieldID}
        	var self = this;
        	console.log('openDialog');
        	console.log(payload);
        	if(payload.sectionID == this.sectionId){
        		/*var f = self.findInSetByID(self.fields, payload.fieldID, 'FormFieldID')
        		if(f){
        			self.updateField(f);
        		}*/
        		this.editingFieldID = payload.fieldID;
        		this.origField = this.getEditingFieldClone(payload.fieldID);
        		this.editingField = this.getEditingFieldClone(payload.fieldID);
        		this.showDialog = true;
        	}
        },

        close: function(){
			var self = this;
			if(this.showDialog){
				this.showDialog = false;
			}
		},


		save: function() {
			var self = this;
			if (this.editingFieldID != this.newFieldID()) {
				//Object.assign(this.fields[this.editedIndex], this.editedField)
				eventHub.$emit('update-field', {fieldID: self.editingFieldID, updatedField: self.editingField});
			}
			else {
				//this.fields.push(this.editedField)
				eventHub.$emit('add-new-field', {fieldID: self.editingFieldID, field: self.editingField});
			}
			this.close();
		},

		deleteField: function() {
			var self = this;

			//confirm('Are you sure you want to delete this field?') //&& this.fields.splice(index, 1);

			eventHub.$emit('delete-field', {fieldID: self.editingFieldID});
			this.close();
		},
	}
})