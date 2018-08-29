Vue.component('builder-form-fields-v-data-table', {
	// declare the props
	props: {
		fields:{
			type: [Object, Array],
			required: true
		},
		fieldTypes:{
			type: [Object, Array],
			required: true
		},
		validationSets:{
			type: [Object, Array],
			required: true
		}
	},
/* FIX SIZING */
	template: '<span>\
	<v-data-table hide-headers>\
				<builder-form-field v-for="f in orderedFields" \
					:key="f.FormFieldID" \
					:field="f" \
					:field-types="allFieldTypes" \
					:validation-sets="allValidationSets" \
				></builder-form-field>-->\
			</v-data-table>\
			\
		<div class="row">\
			<builder-input-size \
				:field="field"\
				field-id-start="fName" \
				prop-name="FieldName"\
				prop-label="Field Name"\
			></builder-input-size>\
			<builder-input-size\
				:field="field"\
				field-id-start="fHTML"\
				prop-name="FieldHTMLID"\
				prop-label="Field HTML ID"\
			></builder-input-size>\
			<builder-select-size \
				:field="field"\
				field-id-start="fType"\
				:set-options="fieldTypes"\
				prop-name="FieldTypeID"\
				prop-text-name="FieldType"\
				prop-label="Field Type"\
				:add-option="false"\
			></builder-select-size>\
			<builder-select-size v-if="field.FieldTypeID==7"\
				:field="field"\
				field-id-start="vSet"\
				:set-options="validationSets"\
				prop-name="ValidationSetID"\
				prop-text-name="ValidationSetName"\
				prop-label="Validation Set"\
			></builder-select-size>\
			<div class="col s2"\
				v-if="field.FieldTypeID==3">\
				<p>\
					<input type="checkbox"\
						class="filled-in"\
						v-model="checkMaxMin"/>\
					<label>Max/Min</label>\
				</p>\
			</div>\
			<builder-number-size v-if="showMaxMin">\
				:field="field"\
				field-id-start="fMin"\
				prop-name="FieldMin" \
				prop-label="Min" \
				/>\
			></builder-number-size>\
			<builder-number-size v-if="showMaxMin" \
				:field="field"\
				field-id-start="fMax"\
				prop-name="FieldMax" \
				prop-label="Max" \
			></builder-number-size>\
		</div>\
		<div class="row">\
			<div class="col s2">\
				<p>\
					<input type="checkbox" class="filled-in" v-model="field.Active" />\
					<label>Active</label>\
				</p>\
			</div>\
			<div class="col s2"><p>\
				<input type="checkbox" class="filled-in" v-model="field.Required" />\
				<label>Required</label>\
			</p></div>\
			<div class="col s4"><p>\
				<input type="checkbox" class="filled-in" v-model="field.VisibleOnEdit" />\
				<label>Visible On Edit</label>\
			</p></div>\
		</div>\
	</span>',
/*<div class="col s2"\
			v-if="field.FieldTypeID==3">\
			<p>\
				<input type="checkbox"\
					class="filled-in"\
					v-model="checkMaxMin">\
				<label>Add Max/Min</label>\
			</p>\
		</div>\
		<div class="input-field col s2" \
			v-if="showMaxMin">\
			<input\
				type="number"\
				:id="fMin + field.FormFieldID.toString()"\
				:ref="fMin + field.FormFieldID.toString()"\
				v-bind:value="field.FieldMin" \
				v-on:input="updateMin($event.target.value)"\
			/>\
			<label>Min Value</label>\
		></div>\
		<builder-number v-if="showMaxMin" \
			:field-id="fMax + field.FormFieldID.toString()" \
			prop-name="FieldMax" \
			prop-label="Max Value"\
		></builder-number>\
		\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.Active" />\
			<label>Active</label>\
		</p></div>\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.Required" />\
			<label>Required</label>\
		</p></div>\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.VisibleOnEdit" />\
			<label>Visible On Edit</label>\
		</p></div>/*/
	data: function(){
		return{
			checkMaxMin: false,
			fName: 'fName',
			fType: 'fType',
			
		}
	},
	watch:{
		/*field.fieldVal: function(val){
			this.reload(val);
		}*/
	},
	computed:{
		showMaxMin: function(){
			return this.checkMaxMin || this.field.FieldMin || this.field.FieldMax;
		}
//ADD ORDERED FIELD TYPES
	},
	methods:{
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
		updateName:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			console.log('NAME');
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
		updateType:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			console.log('TYPE');
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
		updateVSet:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			console.log('VSET');
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
		updateHTML:function(value){
			console.log('HTML');
		},
		reload: function(val){
			//var s = $(this.$el);
			
		},
		selectAll: function (event) {
			// Workaround for Safari bug
			// http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
			setTimeout(function () {
				event.target.select()
			}, 0)
		},
		/*getFieldVSet: function(field){
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
		},*/
	},
	mounted: function(){
		var vm = this;
		var s = $('#fType' + this.field.FormFieldID.toString());
		var s2 = $('#vSet' + this.field.FormFieldID.toString());

		s.on('change', function($event){
			//console.log($event.target.value);
			vm.updateType($event.target.value);
		});
		s2.on('change', function($event){
			//console.log($event.target.value);
			vm.updateVSet($event.target.value);
		});
		//console.log(s.material_select());
		s.material_select();
		
		if(this.field.FieldMax && this.field.FieldMin){
			this.checkMaxMin = true;
		}
	}
})


/*<div class="input-field col s6">\
			<input\
				type="text"\
				:field="field"\
				:field-id="fName + field.FormFieldID.toString()" \
				prop-name="FieldName"\
				prop-label="Field Name"\
			</input>\
		></div>\
		:field="field"\
			:field-id="fType + field.FormFieldID.toString()"\
			:set-options="fieldTypes"\
			prop-name="FieldTypeID"\
			prop-text-name="FieldType"\
			prop-label="Field Type"\
			:add-option="false"\
		></div>\
	<div class="input-field col s4" v-if="field.FieldTypeID==7"\
			<select \
				:field="field"\
				:field-id="vSet + field.FormFieldID.toString()"\
				:set-options="validationSets"\
				prop-name="ValidationSetID"\
				prop-text-name="ValidationSetName"\
				prop-label="Validation Set"\
				:add-option="false"\
		></builder-select>\
		<builder-input\
			:field="field"\
			:field-id="fHTML + field.FormFieldID.toString()"\
			prop-name="FieldHTMLID"\
			prop-label="HTML ID"\
		></builder-form-input>\
		<div v-if="field.FieldTypeID==3"\
			class="col s12 l10 offset-l1">\
			<p>\
				<input type="checkbox"\
					class="filled-in"\
					v-model="checkMaxMin">\
				<label>Add Max & Min</label>\
			</p>\
		</div>\
		<builder-number v-if="showMaxMin"\
			:field-id="fMin + field.FormFieldID.toString()"\
			prop-name="FieldMin" \
			prop-label="Min Value"\
		></builder-number>\
		<builder-number v-if="showMaxMin" \
			:field-id="fMax + field.FormFieldID.toString()" \
			prop-name="FieldMax" \
			prop-label="Max Value"\
		></builder-number>\
		\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.Active" />\
			<label>Active</label>\
		</p></div>\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.Required" />\
			<label>Required</label>\
		</p></div>\
		<div class="col s12 l10 offset-l1"><p>\
			<input type="checkbox" class="filled-in" v-model="field.VisibleOnEdit" />\
			<label>Visible On Edit</label>\
		</p></div>\
*/