Vue.component('builder-form-section-v', {
	props: {
		section:{
			type: [Object],
			required: true
		},
		origSection:{
			type: [Object],
			required: false
		},
		// subsections for current section
		subSections:{
			type: [Object, Array],
			required: false
		},
		// fields for current section, including further subsections
		fields:{
			type: [Object, Array],
			required: false
		},
		origSections:{
			type: [Object, Array],
			required: false
		},
		origSubSections:{
			type: [Object, Array],
			required: false
		},
		origFields:{
			type: [Object, Array],
			required: false
		}
	},
	template: `
		<v-flex xs12>
			<v-card class="card--flex-toolbar">
				<v-toolbar card>
					<v-toolbar-title class="body-2 grey--text">Section {{section.SectionOrder}}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click="moveSectionUp">
						<v-icon>arrow_upward</v-icon>
					</v-btn>
					<v-btn icon @click="moveSectionDown">
						<v-icon>arrow_downward</v-icon>
					</v-btn>
				</v-toolbar>
				
				<v-card-text>
					<v-layout row wrap>
						<v-flex xs12>
							<builder-combobox-v
								:field="section"
								:orig-field="origSection"
								:autocomplete-options="allSections"
								val-propname="SectionID"
								text-propname="SectionTitle"
								id-text="SecTitle" 
								:id-num="section.FormSectionID"
								:concat-id="true"
								label-text="Section Title"
								data-portion="section"
							></builder-combobox-v>
						</v-flex>
						<v-flex xs12>
							<builder-checkbox-v
								:field="section"
								:orig-field="origSection"
								val-propname="HideSectionTitle"
								id-text="SecTitleCk"
								:id-num="section.FormSectionID"
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
								:section="section"
								:orig-section="origSection"
								:sub-sections="subSections"
								:fields="fields"
								:orig-sections="origSections"
								:orig-sub-sections="origSubSections"
								:orig-fields="origFields"
							></builder-fields-table-v>
						</v-flex>

						<builder-field-dialog-v
							:section-id="sectionID"
							:fields="fields"
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
			//editingFieldID: -1,
			//editingField: {},
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
		/*minFieldID:function(){
			//return store.getMinFieldID();
		},*/
		/*maxFieldOrder:function(){
			//return store.getMaxOrderInSection(self.sectionID);
		},*/

		sectionID:function(){
			return this.section.SectionID;
		},

		sectionTitle: function(){
			var vm = this;
			var s = this.allSections.find(function(sF){
				// DON'T COMPARE TO FormSectionID
				return vm.section.SectionID == sF.SectionID;
			});
			if(s){
				return s.SectionTitle;
			}
/* AUTOCOMPLETE - where is update/set? */
			else{
				return "ERROR?";
			}
		},

		sectionFields:function(){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID
				return (f.FormSubSectionID == null);
			});
		},
		orderedFields:function(){
			if(this.sectionFields){
				return this.sectionFields.sort(function(a, b){
	/* NOT SURE ABOUT THIS SORT - null? */
					return a.SectionOrder - b.SectionOrder || a.FieldOrder - b.FieldOrder;
				});
			}
		},
		orderedSubSections:function(){
			return this.subSections.sort(function(a, b){
				return a.SubSectionOrder - b.SubSectionOrder;
			});
		},
	},
	methods: {
		initialize: function(){
			var self = this;

			//this.defaultField = this.getDefaultField();
			//this.editingField = clone(self.defaultField);

			this.listenOnHub();
		},
		listenOnHub: function(){
			var self = this;
			//eventHub.$on('open-edit-dialog-full', self.openDialog);
		},
		minFieldID:function(){
			return store.getMinFieldID();
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
			return store.getMaxOrderInSection(self.sectionID);
		},
		findInSetByID: function(set, id, idPropname){
            return set.find(function(s){
                return s[idPropname] == id;
            });
        },

        getDefaultField:function(){
        	var self = this;
        	return store.getDefaultFieldForSection(self.sectionID);
        },
        

		getSubSectionFields: function(sub){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID?
				return f.FormSubSectionID == sub.FormSubSectionID;
			});
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

			eventHub.$emit('delete-field', {fieldID: fieldID});
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
			eventHub.$emit('move-section', {formSectionID: self.section.FormSectionID, type: 'up'});
		},
		moveSectionDown(){
			eventHub.$emit('move-section', {formSectionID: self.section.FormSectionID, type: 'down'});
		}
	}
})