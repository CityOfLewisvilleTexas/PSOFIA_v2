Vue.component('form-section', {
	// declare the props
	props: {
		section:{
			type: [Object],
			required: true
		},
		subSections:{
			type: [Object, Array],
			required: false
		},
		fields:{
			type: [Object, Array],
			required: false
		},
		vsSets:{
			type: [Object, Array],
			required: false
		},
		vsOptions:{
			type: [Object, Array],
			required: false
		}
	},
	template: `
		<span>
			<div v-if="!(section.HideSectionTitle)" class="col s12 l10 offset-l1">
				<h3>{{section.SectionTitle}}</h3>
				<p v-if="section.SectionDesc" v-html="section.SectionDesc" style="white-space: pre-wrap;"></p>
			</div>
			<form-field v-for="f in getOrderedFields" :key="f.FormFieldID" :field="f" :v-set="getFieldVSet(f)" :vs-options="getFieldVSOptions(f)"></form-field>
			<form-sub-section v-for="sub in subSections" :key="sub.SubSectionID" :sub-section="sub" :fields="getSubSectionFields(sub)" :vs-sets="vsSets" :vs-options="vsOptions"></form-sub-section>
			<div class="col s12 divider grey lighten-2"></div>
		</span>
	`,
	
	//<form-section v-for="sub in subSections"></form-section>
	data: function(){
		return{
			//list vars
		}
	},
	computed: {
		getOrderedFields:function (){
			return this.fields.filter(function(f){
				return !(f.FormSubSectionID);
			}).sort(function(a, b){
				return a.FieldOrder - b.FieldOrder;
			});
		}
	},
	methods: {
		getSubSectionFields: function(sub){
			return this.fields.filter(function(f){
				return f.FormSubSectionID == sub.FormSubSectionID;
			}).sort(function(a, b){
				return a.FieldOrder - b.FieldOrder;
			});
		},
		getFieldVSet: function(field){
			if(field.FieldType == 'SELECT'){
				return this.vsSets.find(function(s){
					return s.ValidationSetID == field.ValidationSetID;
				});
			}
			else{
				return null;
			}
		},
		getFieldVSOptions: function(field){
			if(field.FieldType == 'SELECT'){
				return this.vsOptions.filter(function(o){
					return o.ValidationSetID == field.ValidationSetID;
				}).sort(function(a, b){
					return a.OptionOrder - b.OptionOrder;
				});
			}
			else{
				return null;
			}
		},
	}
})