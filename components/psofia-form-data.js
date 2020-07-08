Vue.component('psofia-form-data', {
	// declare the props
	props: {
		stateName:{ 
            type: String,
            required: false,
            default: 'form'
        },
        storeName: {
            type: String,
            required: false,
            default: 'formData'
        }
	},
	template: `
		<v-flex xs12 mb-3>
			<v-card class="card--flex-toolbar">
				<v-card-title primary-title>
					<div>
						<h3  class="headline mb-0">{{formData.FormName}}</h3>
					</div>
				</v-card-title>

				<v-progress-linear color="red" :active="appLoading" indeterminate absolute bottom></v-progress-linear>

				<v-card-text>
					<div>
						<div>Created: {{displayCreateDate}} by {{createUser}}</div>
						<div v-if="hasLastEdit">Last Edited: {{displayCreateDate}} by {{lastEditUser}}</div>
					</div>
				</v-card-text>
			</v-card>
		</v-flex>
	`,
	
	//<form-section v-for="sub in subSections"></form-section>
	data: function(){
		return{
			isLoading: true,
			sharedState: store.state,
			debug: true,
		}
	},
	computed: {
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

		formData: function(){
			return this.sharedState.form.formData;
		},
		formRecord: function(){

		},

		createDateValObj:function(){
			var self = this;
			return getBuiltInPropVal(self.formData, 'CreateDate');
		},
		displayCreateDate: function(){
			return this.createDateValObj.displayVal;
		},
		createUser:function(){
			return this.formData.CreateUser;
		},
		hasLastEdit:function(){
			if(this.formData.LastEditDate){
				return true;
			}
			else{
				return false;
			}
		},
		lastEditDateValObj:function(){
			var self = this;
			if(this.hasLastEdit){
				return getBuiltInPropVal(self.formData, 'LastEditDate');
			}
		},
		displayLastEditDate: function(){
			if(this.hasLastEdit){
				return this.lastEditDateValObj.displayVal;
			}
		},
		lastEditUser:function(){
			if(this.hasLastEdit){
				return this.formData.LastEditUser;
			}
		},
	},
	methods: {
	}
})