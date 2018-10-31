Vue.component('psofia-form-section', {
	// declare the props
	props: {
		formSectionId:{
			type: Number,
			required: true
		},
	},
	template: `
		<v-flex xs12 mb-3>
			<v-card class="card--flex-toolbar">
				<v-card-title primary-title>
					<div>
						<h3 v-if="!(section.HideSectionTitle)" class="headline mb-0">{{section.SectionTitle}}</h3>
						<div v-if="section.SectionDesc" v-html="section.SectionDesc" style="white-space: pre-wrap;"></div>
					</div>
				</v-card-title>
				<v-card-text>
					<psofia-form-field v-for="f in orderedFields" :key="f.FormFieldID"
						:form-field-id="f.FormFieldID">
					</psofia-form-field>
					<!--<form-sub-section v-for="sub in subSections" :key="sub.SubSectionID" :sub-section="sub" :fields="getSubSectionFields(sub)" :vs-sets="vsSets" :vs-options="vsOptions"></form-sub-section>-->
				</v-card-text>
			</v-card>
		</v-flex>
	`,
	
	//<form-section v-for="sub in subSections"></form-section>
	data: function(){
		return{
			sharedState: store.state,
		}
	},
	computed: {
		payload: function(){
			var self = this;
			return {id:self.formSectionId};
		},
		section: function(){
			var self = this;
			return store.getFormSection(self.payload);
		},
		orderedFields:function (){
			var self = this;
			return store.getFormFields_OrderedInSec(self.formSectionId);
		},
		orderedSubSections:function (){
			var self = this;
			return store.getFormSubSections_OrderedInSec(self.payload);
		},
	},
	methods: {
		filterFields:function (fieldTypeID){
			var self = this;
			return this.orderedFields.filter(function(f){
				return f.FieldTypeID == fieldTypeID;
			});
		}
	}
})