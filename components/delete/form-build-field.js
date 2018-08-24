Vue.component('form-build-field', {
	// declare the props
	props: {
		field:{
			type: [Object],
			required: true
		}
	},
	template: '\
		<span>\
			<input></input>\
			<form-field v-for="f in fields" :field="f"></form-field>\
		</span>\
	',
	//			<form-section v-for="sub in subSections"></form-section>
	data: function(){
		return{
			//list vars
		}
	},
})