Vue.component('form-sub-section', {
	// declare the props
	props: {
		subSection:{
			type: [Object],
			required: true
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
			<div v-if="!(subSection.HideSectionTitle)" class="col s12 l10 offset-l1">
				<h4>{{subSection.SubSectionTitle}}</h4>
				<h6 v-if="subSection.SubSectionDesc">{{subSection.SubSectionDesc}}</h6>
			</div>
			<form-field v-for="f in getOrderedFields" :key="f.FormFieldID" :field="f" :v-set="getFieldVSet(f)" :vs-options="getFieldVSOptions(f)"></form-field>
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
			return this.fields.sort(function(a, b){
				return a.FieldOrder - b.FieldOrder;
			});
		}
	},
	methods: {
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