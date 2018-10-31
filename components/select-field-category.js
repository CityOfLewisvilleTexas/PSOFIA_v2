Vue.component('select-field-category', {
	// declare the props
	props: {
		field:{
			type: Object,
			required: true
		},
		vSet:{
			type: Object,
			required: false
		},
		vsOptions:{
			type: [Object, Array],
			required: false
		}
	},
	template: `
		<div class="input-field col s12 l10 offset-l1">
			<select
				:id="field.FieldHTMLID"
				:ref="field.FormFieldID"
				v-bind:value="field.fieldVal"
				>
				<option value="">Choose your option</option>
				<optgroup v-for="cat in vseCategories" :label="cat.VSECategory">
					<option v-for="o in getSortedOptionsInCat(cat)"
						:key="o.VSOptionID"
						v-bind:value="o.EntryValue" 
						v-bind:selected="o.EntryValue==field.fieldVal"
					>{{o.EntryName}}</option>
				</optgroup>
			</select>
			<label v-if="field.FieldName">{{field.FieldName}}</label>
		</div>
	`,
	/*v-bind:value="field.value"\
				v-on:input="updateValue($event.target.value)"\
				v-on:focus="selectAll"\
				v-on:blue="formatValue"\
				*/
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
		},
		vseCategories: function(){
			var allCategories = [];
			this.sortedOptions.forEach(function(option){
				var arrLen = allCategories.length;
				if(arrLen == 0 || (allCategories[(arrLen - 1)].VSECategoryID != option.VSECategoryID)){
					var newCategory = {
						VSECategoryID: option.VSECategoryID,
						VSECategory: option.VSECategory
					}
					allCategories.push(newCategory);
				}
			});
			return allCategories;
		}
	},
	methods:{
		getSortedOptionsInCat: function(category){
			return this.sortedOptions.filter(function(option){
				return option.VSECategoryID == category.VSECategoryID;
			});
		},
		updateValue:function(value){
			// Emit the value through the hub (to top level)
			//eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, val: Number(formattedValue)});
			console.log("comp function");
			//console.log(value);
			eventHub.$emit('update-input', {fieldID: this.field.FormFieldID, htmlID: this.field.FieldHTMLID, val: value});
		},
		reload: function(val){
			//var s = $(this.$el);
			
		}
	},
	mounted: function(){
		var vm = this;
		var s = $('#' + this.field.FieldHTMLID);

		s.on('change', function($event){
			//console.log($event.target.value);
			vm.updateValue($event.target.value);
		});
		//console.log(s.material_select());
		s.material_select();
	}
})