Vue.component('edit-departments', {
	// declare the props
	props: {
		searchText:{
			type: String,
			required: false
		},
		departments:{
			type: [Object, Array],
			required: false
		},
	},
	template: `
		<v-text>
		</v-text>

		<v-data-table
		    :headers="headers"
		    :items="departments"
		    class="elevation-1"
		>
			<template slot="items" slot-scope="props">
				<td>{{ props.item.Department }}</td>
				<td class="text-xs-right">{{ props.item.DepartmentID }}</td>
			</template>
		</v-data-table>
	`,
	data: function(){
		return{
			//inputVal: '',
			valNotes: '',
			hasError: false,
			errMsg: ''
		}
	},
	created: function(){
		//nada
	},
	mounted: function(){
		//this.origVal = this.inputVal;
	},
	computed:{
		filteredDepartments:function(){
			var self = this;
			return this.departments.filter(function(d){
				return d.Department.toLowerCase().indexOf(self.searchText);
			});
		}
	},
	methods:{
	}
}