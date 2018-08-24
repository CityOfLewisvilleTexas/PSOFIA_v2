Vue.component('form-build-section', {
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
		}
	},
	template: '\
		<span>\
			<input v-model="section.SectionTitle"></input>\
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