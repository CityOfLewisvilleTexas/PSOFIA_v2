Vue.component('builder-select', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		fieldId:{
			type: String,
			required: true
		},
		setOptions:{
			type: [Object, Array],
			required: false
		},
		selectLabel:{
			type: String,
			required: false
		},
		propName:{
			type: String,
			required: true
		},
		propTextName:{
			type: String,
			required: true
		},
		propLabel:{
			type: String,
			required: true
		},
		fieldHasText:{
			type: Boolean,
			required: false,
			default: false
		},
		addOption:{
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: '\
		<div class="input-field col s12 l10 offset-l1">\
			<select\
				:id="fieldId"\
				:ref="fieldId"\
				v-bind:value="field[propName]"\
			>\
				<option value="">Choose an Option</option>\
				<option v-for="o in setOptions" :key="o[propName]" v-bind:value="o[propName]" v-bind:selected="o[propName]==field[propName]">{{o[propTextName]}}</option>\
				<option v-if="addOption" disabled>Add New</option>\
				<!-- ADD NEW MODAL -->\
			</select>\
			<label>{{propLabel}}</label>\
		</div>\
	',
	data: function(){
		return{
			//list vars
		}
	},
	watch:{
		/*field.fieldVal: function(val){
			this.reload(val);
		}*/
	},
	computed:{
		isSelected: function(){
			
		},
		sortedOptions: function(){
			return this.vsOptions.sort(function(a, b){
				return a.OptionOrder - b.OptionOrder;
			});
		}
	},
	methods:{
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			console.log("comp function");
			//console.log(value);
			eventHub.$emit('update-builder-select', {fieldID: this.fieldId, propName:this.propName, propTextName: this.propTextName, val: value});
		},
		reload: function(val){
			//var s = $(this.$el);
			
		}
	},
	mounted: function(){
		var vm = this;
		var s = $('#' + this.fieldId);

		s.on('change', function($event){
			//console.log($event.target.value);
			vm.updateValue($event.target.value);
		});
		//console.log(s.material_select());
		s.material_select();
	}
})