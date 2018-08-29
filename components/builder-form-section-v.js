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
		section:{
			type: [Object],
			required: true
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
		fieldEditing:{
			type: [String],
			required: false
		},
		formDefaults:{
			type: [Object, Array],
			required: true
		},
		// all sections passed for autocomplete
		allSections:{
			type: [Object, Array],
			required: true
		},
		// all subsections passed for autocomplete
		allSubSections:{
			type: [Object, Array],
			required: false
		},
		// all field types passed for select
		allFieldTypes:{
			type: [Object, Array],
			required: true
		},
		// all validation sets passed for select
		allValidationSets:{
			type: [Object, Array],
			required: false
		}
	},
	template: '\
		<span>\
			<div class="col s12 l10 offset-l1">\
				<h5>SECTION</h5>\
			</div>\
			<div class="col s12 l10 offset-l1">\
<!-- CHANGE TO AUTOCOMPLETE --> \
				<h3>{{sectionTitle}}</h3>\
			</div>\
			\
<!-- ADD CHECKBOX TO HIDE TITLE --> \
\
<!-- Cant do this, need js methods for both dialog and data-table to be in same component --> \
<!--			<builder-form-field-v-dialog >\
			</builder-form-field-v-dialog>\
			\
			<builder-form-field-v-data-table \
				:fields="orderedFields">\
			</builder-form-field-v-data-table>\
-->			\
\
			\
			<div class="col s12 l10 offset-l1">\
				<a class="waves-effect waves-light btn" \
					v-on:click="addSubSection($event.target)"\
				>Add New Sub Section</a>\
			</div>\
			<builder-form-sub-section-v v-for="sub in subSections" \
				:key="sub.SubSectionID" \
				:sub-section="sub" \
				:fields="getSubSectionFields(sub)"  \
				:all-sub-sections="allSubSections"  \
				:all-field-types="allFieldTypes" \
				:all-validation-sets="allValidationSets" \
			></builder-form-sub-section-v>\
			<div class="col s12 divider grey lighten-2"></div>\
		</span>\
	',
	data: function(){
		return{
			//list vars
			/* copied from Vuetify for data-table w/ CRUD */
			dialog: false,
			headers: [
				{// I don't think I'll use headers?
				}
			],
			editedIndex: -1,
			editedField: {},
			defaultField:{}
		}
	},
	created: function(){
		this.intialize(); // idk why not done in ready?
	},
	watch: {
      dialog: function(val) {
        val || this.close()
      }
    },
	computed: {
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
		/* Copied from Vuetify for data-table w/ CRUD */
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		}
	},
	methods: {
		initialize: function(){
			/* copied from Vuetify data-table w/ CRUD - needed to do here b/c defaults sent from server */
			this.editedField = this.formDefaults.FormField;
			this.defaultField = this.formDefaults.FormField;
		},
		getSubSectionFields: function(sub){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID?
				return f.FormSubSectionID == sub.FormSubSectionID;
			});
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
		deleteItem: function(field) {
			const index = this.fields.indexOf(field);
			confirm('Are you sure you want to delete this field?') && this.fields.splice(index, 1);
		},
		deleteItem2: function(fieldIndex) {
			const index = fieldIndex;
			confirm('Are you sure you want to delete this field?') && this.fields.splice(index, 1);
		},

		close: function() {
			this.dialog = false
			/* REWRITE */
			setTimeout(() => {
				this.editedField = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
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
		}


/* ADD NEW FIELD - currently passing section ID only */
		editField:function(index, val){
			//eventHub.$emit('add-new-field', {sectionID: this.section.sectionID, SubSectionID: null});
		},
		addField:function(val){
			//eventHub.$emit('add-new-field', {sectionID: this.section.sectionID, SubSectionID: null});
		},
/* ADD NEW SUBSECTION - currently passing section ID only */
		addSubSection:function(val){
			//eventHub.$emit('add-new-sub-section', {sectionID: this.section.sectionID});
		}
	}
})