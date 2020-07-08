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
						<h3 v-if="!(section.HideSectionTitle.val)" class="headline mb-0">{{section.SectionTitle.displayVal}}</h3>
						<div v-if="section.SectionDesc.displayVal" v-html="section.SectionDesc.displayVal" style="white-space: pre-wrap;"></div>
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
            isLoading: true,
            debug: true,
		}
	},
	computed: {
		sharedForm: function(){
            return this.sharedState.form;
        },
        sharedCols: function(){
            return this.sharedState.columns;
        },
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading && this.formLoading && this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading && this.isLoading;
        },
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
	}
})