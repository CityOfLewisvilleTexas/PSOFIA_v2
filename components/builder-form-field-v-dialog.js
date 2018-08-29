/*
	Modified 7/12 PM
	- checked through multiple times
	- not tested 
	- corrected on 0 components
	- might have fully corrected on index
*/

Vue.component('builder-form-field-v-dialog', {
	// declare the props
	props: {
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
		<v-dialog v-model="dialog" max-width="500px">\
			<v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>\
			<v-card>\
				<v-card-title>\
					<span class="headline">{{ formTitle }}</span>\
				</v-card-title>\
				<v-card-text>\
					<v-container grid-list-md>\
						<v-layout wrap>\
							<v-flex xs12 sm6 md4>\
								<v-text-field v-model="editedItem.name" label="Field name"></v-text-field>\
							</v-flex>\
							<v-flex xs12 sm6 md4>\
								<v-text-field v-model="editedItem.calories" label="Field HTML ID"></v-text-field>\
							</v-flex>\
							<v-flex xs12 sm6 md4>\
								<v-text-field v-model="editedItem.fat" label="Field Type"></v-text-field>\
							</v-flex>\
							<v-flex xs12 sm6 md4>\
								<v-text-field v-model="editedItem.carbs" label="Active"></v-text-field>\
							</v-flex>\
							<v-flex xs12 sm6 md4>\
								<v-text-field v-model="editedItem.protein" label="Required"></v-text-field>\
							</v-flex>\
						</v-layout>\
					</v-container>\
				</v-card-text>\
				<v-card-actions>\
					<v-spacer></v-spacer>\
					<v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>\
					<v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>\
				</v-card-actions>\
			</v-card>\
		</v-dialog>\
	',
	data: function(){
		return{
			//list vars
		}
	},
	computed: {
		/* Pulled from Vuetify */
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		}
	},
	methods: {
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