Vue.component('builder-form-field-min', {
	// declare the props
	props: {
		field:{
			type: Object,
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
	template: '\
		<span>\
		<div class="row">\
			<div class="col s8">\
				<h5>{{field.FieldName}}</h5>\
			</div>\
			<div class="col s2">\
				<a class="waves-effect waves-light btn" \
					v-on:click="editField($event.target)"\
				>Edit</a>\
			</div>\
			<div class="col s1">\
				<a class="waves-effect waves-light btn" \
					v-on:click="moveFieldUp($event.target)"\
				><i class="material-icons right">arrow_upward</i></a>\
			</div>\
			<div class="col s1">\
				<a class="waves-effect waves-light btn" \
					v-on:click="moveFieldDown($event.target)"\
				><i class="material-icons right">arrow_downward</i></a>\
			</div>\
		</div>\
		<div class="row">\
			<div class="col s10 offset-l1">\
				<div class="chip">\
					HTML ID: {{field.FieldHTMLID}}\
				</div>\
				<div class="chip">\
					FieldType: {{fieldTypeName}}\
					<span v-if="field.FieldMin || field.FieldMax">[Max: {{field.FieldMax}}, Min: {{field.FieldMin}}]</span>\
					<span v-if="field.FieldType==7">[Validation Set: {{field.ValidationSetID}}]</span>\
				</div>\
				<div class="chip" v-if="field.Required">Required</div>\
				<div class="chip" v-if="field.VisibleOnOpen">Visible</div>\
				<div class="chip" v-if="field.Active">Active</div>\
			</div>\
		</div>\
		</span>\
	',
	data: function(){
		return{
			checkMaxMin: false,
		}
	},
	computed:{
		showMaxMin: function(){
			return this.checkMaxMin || this.field.FieldMin || this.field.FieldMax;
		},
		fieldTypeName: function(){
			var vm = this;
			var found = this.fieldTypes.find(function(f){
				return f.FieldTypeID == vm.field.FieldTypeID;
			});
			if (found){
				return found.FieldType;
			}
		},
//ADD ORDERED FIELD TYPES
	},
	methods:{
		editField:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			//console.log(value);
			eventHub.$emit('editing-field', {fieldID: this.field.FormFieldID});
		},
		moveFieldUp:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
		moveFieldDown:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			//console.log("comp function");
			//console.log(value);
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, prop: val: value});
		},
	},
	mounted: function(){
		if(this.field.FieldMax && this.field.FieldMin){
			this.checkMaxMin = true;
		}
	}
})