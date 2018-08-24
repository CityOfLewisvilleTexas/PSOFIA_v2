Vue.component('builder-autocomplete', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		fieldId:{
			type: String,
			required: false
		},
		autocompleteOptions:{
			type: [Object, Array],
			required: true
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
		inputDisabled:{
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
				v-bind:value="field.fieldVal"\
				>\
				<option value="">Choose your option</option>\
				<option v-for="o in vsOptions" :key="o.VSOptionID" v-bind:value="o.EntryValue" v-bind:selected="o.EntryValue==field.fieldVal">{{o.EntryName}}</option>\
			</select>\
			<label v-if="field.FieldName">{{field.FieldName}}</label>\
		</div>\
	',
	data: function(){
		return{
			autocompleteObj: []
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
		sortedAutocompleteOptions: function(){
			this.vsOptions.sort(function(a, b){
				return a.OptionOrder - b.OptionOrder;
			});
		}
	},
	methods:{
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: value});
		},
		reload: function(val){
			//var s = $(this.$el);
			
		}
	},
	mounted: function(){
		var vm = this;

		for (var i in this.autocompleteSet) {
            autocompleteObj[this.autocompleteSet[i].SITUS] = null
        }

        $('input.autocomplete').autocomplete({

        // addresses to autocomplete
        data: objectified,

        // how many to show
        limit: 20,

        // set the address and rnumber
        onAutocomplete: function(val) {
            app.formValues.recipientAddress = val
            app.formValues.recipientRNumber = app.getRnumberFromAddress(val)
            Vue.nextTick(function() {
                Materialize.updateTextFields()
            })

        }
    })

		/*var s = $('#' + this.field.FieldHTMLID);

		s.on('change', function($event){
			//console.log($event.target.value);
			vm.updateValue($event.target.value);
		});
		//console.log(s.material_select());
		s.material_select();*/
	}
})