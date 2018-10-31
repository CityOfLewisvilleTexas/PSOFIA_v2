Vue.component('psofia-builder-section', {
	props: {
		formSectionId:{
			type: [Number],
			required: true
		}
	},
	template: `
		<v-flex xs12 mb-3>
			<v-card class="card--flex-toolbar">
				<v-toolbar card>
					<v-toolbar-title class="body-2 grey--text">Section {{formSection.SectionOrder}}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon disabled @click="moveSectionUp">
						<v-icon>arrow_upward</v-icon>
					</v-btn>
					<v-btn icon disabled @click="moveSectionDown">
						<v-icon>arrow_downward</v-icon>
					</v-btn>
				</v-toolbar>
				
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12>
							<builder-combobox-v
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
						</v-flex>
						
						<v-flex xs12>
							<v-toolbar flat color="white">
								<v-toolbar-title class="body-2 grey--text">Fields</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-btn flat small disabled @click="editNewField">
									<v-icon small>add_box</v-icon>Add Field
								</v-btn>
							</v-toolbar>
							<builder-fields-table-v
								:section="formSection"
								:orig-section="origSection"
								:sub-sections="formSubSections"
								:fields="sectionFields"
								:orig-sections="origSections"
								:orig-sub-sections="origSubSections"
								:orig-fields="origFields"
							></builder-fields-table-v>
						</v-flex>

						<builder-field-dialog-v
							:form-section-id="formSectionId"
							:fields="sectionFields"
						></builder-field-dialog-v>
						
						<v-divider></v-divider>
						
						<!--<builder-form-sub-section-v v-for="sub in subSections" 
							:key="sub.SubSectionID" 
							:sub-section="sub" 
							:fields="getSubSectionFields(sub)"  
							:all-sub-sections="allSubSections"  
							:all-field-types="allFieldTypes" 
							:all-validation-sets="allValidationSets" 
						></builder-form-sub-section-v>-->
					</v-layout>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click="addSubSection">Add New Sub Section</v-btn>
				</v-card-actions>
				
			</v-card>
		</v-flex>
	`,
	data: function(){
		return{
			//list vars
			sharedState: store.state,
			/* copied from Vuetify for data-table w/ CRUD */
			showDialog: false,
			defaultField: {},
			origSection: {},
			editSection: {},
		}
	},
	created: function(){
		 this.initialize();
	},
	mounted:function(){
		//this.initialize(); // idk why not done in ready?
	},
	watch: {
      /*showDialog: function(val) {
        val || this.close()
      }*/
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

		formSection: function(){
			return store.getFormSection(this.formSectionId);
		},
		origSection: function(){
			var self = this;
			var payload2 = Object.assign(payload, {isOrig: true});
			return store.getFormSection(payload2);
		},
		sectionID:function(){
			return this.formSection.SectionID;
		},
		sectionTitle: function(){
			return store.getFormSectionProp(this.formSectionId, 'SectionTitle');
		},

		sectionSubSections:function(){
			return store.getFormSubSections_OrderedInSec(this.formSectionId);
		},

		sectionFields:function(){
			return store.getFormFields_OrderedInSec(this.formSectionId);
		},
	},
	methods: {
		initialize: function(){
			var self = this;

			this.origSection = clone(store.getOrigFormSection(self.formSectionId));
			this.editSection = clone(store.getFormSection(self.formSectionId));

			//this.listenOnHub();
		},
		listenOnHub: function(){
			var self = this;
			//eventHub.$on('open-edit-dialog-full', self.openDialog);
		},
		findInSetByID: function(set, id, idPropname){
            return set.find(function(s){
                return s[idPropname] == id;
            });
        },

        getDefaultField:function(){
        	var self = this;
        	return store.getDefaultField_ForSection(self.formSectionId);
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

		editNewField: function(fieldID){
        	var self = this;
			eventHub.$emit('open-edit-dialog-full', {sectionID: self.sectionID, fieldID: field.FormFieldID});
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
		addField: function(fieldID, field){
			eventHub.$emit('add-new-field', {fieldID: fieldID, field: field});
		},

/* ADD NEW SUBSECTION - currently passing section ID only */
		addSubSection: function(val){
			//eventHub.$emit('add-new-sub-section', {sectionID: this.section.sectionID});
		},
		moveSectionUp(){
			var self = this;
			eventHub.$emit('move-section', {formSectionID: self.formSection.FormSectionID, type: 'up'});
		},
		moveSectionDown(){
			eventHub.$emit('move-section', {formSectionID: self.formSection.FormSectionID, type: 'down'});
		}
	}
})