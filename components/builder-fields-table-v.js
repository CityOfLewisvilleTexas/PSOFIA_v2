Vue.component('builder-fields-table-v', {
	// declare the props
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
		},
	},
	template: `
		<v-data-table
			:headers="headers"
			:items="orderedFields"
			hide-actions
			class="elevation-1"
		>
			<template slot="items" slot-scope="props">
				<td>{{ props.item.FieldName }}</td>
				<td class="text-xs-left">{{ props.item.FieldHTMLID }}</td>
				<td class="text-xs-left">{{ getFieldType(props.item) }} {{" [" + props.item.FieldTypeID + "]" }}</td>
				<td>
					<v-chip small :value="props.item.FieldType==7">Validation Set: {{props.item.ValidationSetID}}</v-chip>
					<v-chip small :value="props.item.FieldMin">Min: {{props.item.FieldMin}}</v-chip>
					<v-chip small :value="props.item.FieldMax">Max: {{props.item.FieldMax}}</v-chip>
					<v-chip small :value="props.item.Required">Required</v-chip>
					<v-chip small :value="props.item.VisibleOnEdit">Visible</v-chip>
					<v-chip small :value="props.item.Active">Active</v-chip>
				</td>
				<td>
					<v-btn icon flat small @click="editField(props.item)">
						<v-icon small>edit</v-icon>
					</v-btn>
					{{props.item.FormFieldID}}
					<v-btn icon flat small disabled @click="moveFieldUp(props.item)">
						<v-icon small>arrow_upward</v-icon>
					</v-btn>
					<v-btn icon flat small disabled @click="moveFieldDown(props.item)">
						<v-icon small>arrow_downward</v-icon>
					</v-btn>
				</td>
			</template>
		</v-data-table>
	`,
	data: function(){
		return{
			//list vars
			/* copied from Vuetify for data-table w/ CRUD */
			sharedState: store.state,
			headers: [
				{text:'Field Name', sortable:false},
				{text:'HTML ID', sortable:false},
				{text:'Field Type', sortable:false},
				{text:'Properties', sortable:false},
				{text:'', sortable:false},
				{text:'', sortable:false}
			],
		}
	},
	ready: function(){
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
		defaultField:function(){
			return this.sharedState.default.field;
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
	},
	methods: {
		initialize: function(){
			/* copied from Vuetify data-table w/ CRUD - needed to do here b/c defaults sent from server */
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
		editField: function(field){
			var self = this;
			console.log(field);
			eventHub.$emit('open-edit-dialog-full', {sectionID: self.section.SectionID, fieldID: field.FormFieldID});
		},
		moveFieldUp: function(field){
			eventHub.$emit('move-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID, type: 'up'});
		},
		moveFieldDown: function(field){
			eventHub.$emit('move-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID, type: 'down'});
		},
		deleteField: function(field){
			eventHub.$emit('delete-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID});
		}
	}
})