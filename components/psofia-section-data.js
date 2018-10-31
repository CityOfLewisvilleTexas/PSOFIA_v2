/*
	Modified 7/12 PM
	- checked through multiple times
	- not tested 
	- corrected on 0 components
	- might have fully corrected on index
*/

Vue.component('builder-form-section-v', {
	// declare the props
	props: {
		formSectionId:{
			type: Number,
			required: true
		},
	},
	template: `\
		<v-flex xs12>\
			<v-card class="card--flex-toolbar">\
				<v-toolbar card>\
					<v-toolbar-title class="body-2 grey--text">Section {{section.SectionOrder}}</v-toolbar-title>\
					<v-spacer></v-spacer>\
					<v-btn icon>\
						<v-icon>more_vert</v-icon>\
					</v-btn>\
				</v-toolbar>\
				\
				<!--<v-divider></v-divider>-->\
				\
				<v-card-text>\
					<!--<v-flex s12 l10 offset-l1>-->\
<!-- CHANGE TO AUTOCOMPLETE --> \
					<builder-combobox-v\
						data-portion="section"\
						:form-section-id="formSectionId"\
						:autocomplete-options="allSections"\
						val-propname="SectionID"\
						text-propname="SectionTitle"\
						id-text="SecTitle" \
						:id-num="formSectionId"\
						label-text="Section Title"\
					></builder-combobox-v>\
					<builder-checkbox-v\
						data-portion="section"\
						:form-section-id="formSectionId"\
						val-propname="HideSectionTitle"\
						id-text="SecTitleCk"\
						:id-num="formSectionId"\
						label-text="Hide Title In Form"\
					></builder-checkbox-v>\
					<v-divider></v-divider>\
					<!--</v-flex>-->\
					\
					<div>\
						<v-toolbar flat color="white">\
							<v-toolbar-title class="body-2 grey--text">Fields</v-toolbar-title>\
							<v-spacer></v-spacer>\
							<v-dialog v-model="dialog" max-width="500px">\
								<v-btn slot="activator" color="primary" dark class="mb-2">New Field</v-btn>\
								<v-card>\
									<v-card-title>\
										<span class="headline">{{ formTitle }}</span>\
									</v-card-title>\
									<v-card-text>\
										<v-layout wrap>\
											<v-flex xs12>\
												<builder-text-v\
													:field="editedField"\
													val-propname="FieldName"\
													id-text="editingFieldName"\
													label-text="Field Name"\
													data-portion="edit-dialog"\
												></builder-text-v>\
												<!--v-model="editedField.FieldName"-->\
											</v-flex>\
											<v-flex xs12>\
												<builder-text-v\
													:field="editedField"\
													val-propname="FieldHTMLID"\
													id-text="editingFieldHTMLID"\
													label-text="Field HTML ID"\
													data-portion="edit-dialog"\
												></builder-text-v>\
												<!--v-model="editedField.FieldHTMLID" label="Field HTML ID"-->\
											</v-flex>\
											<v-flex xs12>\
												<builder-autocomplete-v\
													:field="editedField"\
													:autocomplete-options="allFieldTypes" \
													val-propname="FieldTypeID" \
													text-propname="FieldType" \
													id-text="editingFieldType" \
													label-text="Field Type" \
													data-portion="edit-dialog"\
													add-option\
												></builder-autocomplete-v>\
											</v-flex>\
											<v-flex xs12 v-if="editedField.FieldTypeID == 7">\
												<builder-autocomplete-v\
													:field="editedField"\
													:autocomplete-options="allValidationSets" \
													val-propname="ValidationSetID" \
													text-propname="ValidationSetName" \
													id-text="editingVSet" \
													label-text="Validation Set" \
													data-portion="edit-dialog"\
													add-option\
												></builder-autocomplete-v>\
											</v-flex>\
											<!--<v-flex xs6 v-if="editedField.FieldTypeID == 3">\
												<builder-checkbox-v\
													:field="editedField"\
													val-propname="HasMaxMin"\
													id-text="editingMaxMinCk"\
													label-text="Add Max/Min"\
													data-portion="edit-dialog"\
												></builder-checkbox-v>\
											</v-flex>-->\
											<v-flex xs6 v-if="editedField.FieldTypeID == 3">\
												<builder-number-v\
													:field="editedField"\
													val-propname="FieldMin"\
													id-text="editingFieldMin"\
													label-text="Min"\
													data-portion="edit-dialog"\
												></builder-number-v>\
											</v-flex>\
											<v-flex xs6 v-if="editedField.FieldTypeID == 3">\
												<builder-number-v\
													:field="editedField"\
													val-propname="FieldMax"\
													id-text="editingFieldMax"\
													label-text="Max"\
													data-portion="edit-dialog"\
												></builder-number-v>\
											</v-flex>\
											<v-flex xs12>\
												<builder-checkbox-v\
													:field="editedField"\
													val-propname="Required"\
													id-text="editingReq"\
													label-text="Required"\
													data-portion="edit-dialog"\
												></builder-checkbox-v>\
											</v-flex>
											<v-flex xs12>\
												<builder-checkbox-v\
													:field="editedField"\
													val-propname="VisibleOnEdit"\
													id-text="editingVis"\
													label-text="Visible On Edit"\
													data-portion="edit-dialog"\
												></builder-checkbox-v>\
											</v-flex>
											<v-flex xs12>\
												<builder-checkbox-v\
													:field="editedField"\
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
						</v-toolbar>\
						<v-data-table\
							:headers="fieldHeaders"\
							:items="orderedFields"\
							hide-actions\
							class="elevation-1"\
						>\
							<template slot="items" slot-scope="props">\
								<td>{{ props.item.FieldName }}</td>\
								<td class="text-xs-left">{{ props.item.FieldHTMLID }}</td>\
								<td class="text-xs-left">{{ getFieldType(props.item) }} {{" [" + props.item.FieldTypeID + "]" }}</td>\
								<td>\
									<v-chip small :value="props.item.FieldType==7">Validation Set: {{props.item.ValidationSetID}}</v-chip>\
									<v-chip small :value="props.item.FieldMin">Min: {{props.item.FieldMin}}</v-chip>\
									<v-chip small :value="props.item.FieldMax">Max: {{props.item.FieldMax}}</v-chip>\
									<v-chip small :value="props.item.Required">Required</v-chip>\
									<v-chip small :value="props.item.VisibleOnEdit">Visible</v-chip>\
									<v-chip small :value="props.item.Active">Active</v-chip>\
								</td>\
								<td class="justify-center">\
									<v-icon @click="editField(props.item)">\
										edit\
									</v-icon>\
								</td>\
								<td class="justify-center layout px-0">\
									<v-icon small class="mr-2" @click="moveFieldUp(props.item)">\
										arrow_upward\
									</v-icon>\
									<v-icon small @click="moveFieldDown(props.item)">\
										arrow_downward\
									</v-icon>\
								</td>\
							</template>\
						</v-data-table>\
					</div>\
					\
					<v-divider></v-divider>\
					\
					<builder-form-sub-section-v v-for="sub in subSections" \
						:key="sub.SubSectionID" \
						:sub-section="sub" \
						:fields="getSubSectionFields(sub)"  \
						:all-sub-sections="allSubSections"  \
						:all-field-types="allFieldTypes" \
						:all-validation-sets="allValidationSets" \
					></builder-form-sub-section-v>\
				</v-card-text>\
				<v-card-actions>\
					<v-spacer></v-spacer>\
					<v-btn color="blue darken-1" flat @click="addSubSection">Add New Sub Section</v-btn>\
				</v-card-actions>\
				\
			</v-card>\
		</v-flex>\
	`,
	data: function(){
		return{
			//list vars
			/* copied from Vuetify for data-table w/ CRUD */
			sharedState: store.state,
			dialog: false,
			fieldHeaders: [
				{text: 'Field Name', sortable: false},
				{text: 'HTML ID', sortable: false},
				{text: 'Field Type', sortable: false},
				{text: 'Properties', sortable: false}
			],
			editedIndex: -1,
			
			editedField: {},
			defaultField:{},

			origSection:{},
			editSection: {},
		}
	},
	ready: function(){
		this.initialize(); // idk why not done in ready?
	},
	watch: {
      dialog: function(val) {
        val || this.close()
      }
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
		/* Copied from Vuetify for data-table w/ CRUD */
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		}
	},
	methods: {
		initialize: function(){
			/* copied from Vuetify data-table w/ CRUD - needed to do here b/c defaults sent from server */
			/*this.editField = this.formDefaults.FormField;
			this.defField = this.
			this.origField = this.formDefaults.FormField;*/

			this.origSection = clone(store.getOrigFormSection(self.formSectionId));
			this.editSection = clone(store.getFormSection(self.formSectionId));

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

		/* copied from Vuetify data-table w/ CRUD - not sure if I can pass item the same way they did, so I pass index */
		editField: function(field) {
			this.editedIndex = this.fields.indexOf(field);
			this.editedField = Object.assign({}, field);
			this.dialog = true;
		},
		editField2: function(fieldIndex) {
			this.editedIndex = fieldIndex;
			this.editedField = Object.assign({}, this.fields[fieldIndex]);
			this.dialog = true;
		},
		deleteField: function(field) {
			const index = this.fields.indexOf(field);
			confirm('Are you sure you want to delete this field?') && this.fields.splice(index, 1);
		},
		deleteField2: function(fieldIndex) {
			const index = fieldIndex;
			confirm('Are you sure you want to delete this field?') && this.fields.splice(index, 1);
		},

		close: function() {
			this.dialog = false
			setTimeout(function () {
				this.editedField = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			}, 300)
		},

		save: function() {
			if (this.editedIndex > -1) {
				//Object.assign(this.fields[this.editedIndex], this.editedField)
				this.editField(this.editedIndex, this.editedField)
			}
			else {
				//this.fields.push(this.editedField)
				this.addField(this.editedField)
			}
			this.close()
		},


/* ADD NEW FIELD - currently passing section ID only */
		//editField: function(index, val){
			//eventHub.$emit('add-new-field', {sectionID: this.section.sectionID, SubSectionID: null});
		//},
		addField: function(val){
			//eventHub.$emit('add-new-field', {sectionID: this.section.sectionID, SubSectionID: null});
		},
/* ADD NEW SUBSECTION - currently passing section ID only */
		addSubSection: function(val){
			//eventHub.$emit('add-new-sub-section', {sectionID: this.section.sectionID});
		}
	}
})