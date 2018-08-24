/*
	Modified 7/12 PM
	- checked through multiple times
	- not tested 
	- corrected on 0 components
	- might have fully corrected on index
*/

Vue.component('builder-form-section', {
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
<!-- ADD CHECKBOX TO HIDE TITLE --> \
			<builder-form-field-min v-if="fields.length > 0" \
				:field="fields[0]" \
				:field-types="allFieldTypes" \
				:validation-sets="allValidationSets" \
			></builder-form-field-min>\
			<builder-form-field v-for="f in orderedFields" \
				:key="f.FormFieldID" \
				:field="f" \
				:field-types="allFieldTypes" \
				:validation-sets="allValidationSets" \
			></builder-form-field>-->\
			<!--span v-for="f in orderedFields"> \
				<builder-form-field v-if="fieldEditing == f.FormFieldID" \
					:key="f.FormFieldID" \
					:field="f" \
					:field-types="allFieldTypes" \
					:validation-sets="allValidationSets" \
				></builder-form-field>\
				<builder-form-field-min v-else \
					:field="f" \
					:field-types="allFieldTypes" \
					:validation-sets="allValidationSets" \
				></builder-form-field-min>\
			</span>-->\
			<div class="col s12 l10 offset-l1">\
				<a class="waves-effect waves-light btn" \
					v-on:click="addField($event.target)" \
				>Add New Field</a>\
				<a class="waves-effect waves-light btn" \
					v-on:click="addSubSection($event.target)"\
				>Add New Sub Section</a>\
			</div>\
			<builder-form-sub-section v-for="sub in subSections" \
				:key="sub.SubSectionID" \
				:sub-section="sub" \
				:fields="getSubSectionFields(sub)"  \
				:all-sub-sections="allSubSections"  \
				:all-field-types="allFieldTypes" \
				:all-validation-sets="allValidationSets" \
			></builder-form-sub-section>\
			<div class="col s12 divider grey lighten-2"></div>\
		</span>\
	',
	data: function(){
		return{
			//list vars
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
	},
	methods: {
		getSubSectionFields: function(sub){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID?
				return f.FormSubSectionID == sub.FormSubSectionID;
			});
		},
/* ADD NEW FIELD - currently passing section ID only */
		addField:function(val){
			//eventHub.$emit('add-new-field', {sectionID: this.section.sectionID, SubSectionID: null});
		},
/* ADD NEW SUBSECTION - currently passing section ID only */
		addSubSection:function(val){
			//eventHub.$emit('add-new-sub-section', {sectionID: this.section.sectionID});
		}
	}
})