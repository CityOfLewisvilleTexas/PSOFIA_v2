/*
	Modified 7/12 PM
	- checked through multiple times
	- not tested 
	- corrected on 0 components/index
	- might have fully corrected on index
*/

Vue.component('builder-form-sub-section', {
	// declare the props
	props: {
		subSection:{
			type: [Object],
			required: true
		},
		// fields for current subsection
		fields:{
			type: [Object, Array],
			required: false
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
			<h5>SUB SECTION</h5>\
			<div class="col s12 l10 offset-l1">\
<!-- CHANGE TO AUTOCOMPLETE --> \
				<h3>{{subSectionTitle}}</h3>\
			</div>\
<!-- ADD CHECKBOX TO HIDE TITLE --> \
			<builder-form-field v-for="f in fields" \
				:key="f.FormFieldID" \
				:field="f" \
				:field-types="allFieldTypes" \
				:validation-sets="allValidationSets" \
			></builder-form-field>\
			<div class="col s12 l10 offset-l1">\
				<a class="waves-effect waves-light btn" \
					v-on:click="addField($event.target)" \
				>Add New Field</a>\
			</div>\
			<div class="col s12 divider grey lighten-2"></div>\
		</span>\
	',
	data: function(){
		return{
			//list vars
		}
	},
	computed: {
		orderedFields:function (){
			return this.fields.sort(function(a, b){
/* NOT SURE ABOUT THIS SORT - null? */
				return a.SectionOrder - b.SectionOrder || a.SubSectionOrder - b.SubSectionOrder || a.FieldOrder - b.FieldOrder;
			});
		},
		subSectionTitle: function(){
			var vm = this;
			var ss = this.allSubSections.find(function(ssF){
				// DON'T COMPARE TO FormSubSectionID
				return vm.subSection.SubSectionID == ssF.SubSectionID;
			});
			if(ss){
				return ss.SubSectionTitle;
			}
/* AUTOCOMPLETE - where is update/set? */
			else{
				return "ERROR?";
			}
		},
	},
	methods: {
/* ADD NEW FIELD - currently passing section ID && subSection ID only */
		addField:function(){
			eventHub.$emit('add-new-field', {sectionID: this.subSection.sectionID, SubSectionID: this.subSection.subSectionID});
		},
	}
})