Vue.component('psofia-builder-form-data', {
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
		<v-card outlined>
            <v-toolbar flat>
                <v-toolbar-title>Form Data</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-toolbar>


            <v-progress-linear color="red" :active="appLoading" indeterminate absolute bottom></v-progress-linear>

			<v-card-text>
				<psofia-input v-for="(field, index) in inputFields" :key="index"
					:store-name="storeName" :val-propname="field"
				></psofia-input>

                <v-row v-if="inputFields">
                    <v-col cols="12" xs="12" sm="6" md="4" lg="3">
                        <psofia-checkbox :store-name="storeName" val-propname="HasGUID"></psofia-checkbox>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="3">
                        <psofia-checkbox :store-name="storeName" val-propname="RefreshOnSubmit"></psofia-checkbox>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6" md="4" lg="3">
                        <psofia-checkbox :store-name="storeName" val-propname="Active"></psofia-checkbox>
                    </v-col>
                </v-row>

                <v-row v-if="inputFields">
                    <v-col cols="12" xs="12" md="3">
                        <psofia-checkbox :store-name="storeName" val-propname="OAUTH_Required"></psofia-checkbox>
                    </v-col>
                    <v-col v-if="showAuth" disabled cols="12" xs="12" md="3">
                        <psofia-checkbox :store-name="storeName" val-propname="AllowedADGroups"></psofia-checkbox>
                    </v-col>
                    <v-col v-if="showAuth" disabled cols="12" xs="12" md="3">
                        <psofia-checkbox :store-name="storeName" val-propname="HasAuthProcedure"></psofia-checkbox>
                    </v-col>
                </v-row>

			</v-card-text>
		</v-card>
	`,
    /*  <v-col v-if="showAuth" cols="12" xs="12" md="6">
            AllowedAD Groups (not functional)
        </v-col>
    */
    /*  <v-flex xs12 mb-3>
    */
	data: function(){
		return{
            isLoading: true,
            sharedState: store.state,
            debug: true,
		}
	},
    created: function(){
        if(this.debug) console.log("\t\t\tBUILDER FORM DATA - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tBUILDER FORM DATA - Mounted");
        this.isLoading = false;
    },
	watch:{
	},
	computed:{
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

        inputFields: function(){
            var self = this;
            if(this.formData){
                return Object.keys(self.formData).filter(function(field){
                    return (self.formData[field].isInput && !(self.formData[field].isHidden) && (self.formData[field].valType !== 'boolean'));
                });
            }
        },
        /*ckboxFields: function(){
            var self = this;
            if(this.formData){
                return Object.keys(self.formData).filter(function(field){
                    return (self.formData[field].isInput  && !(self.formData[field].isHidden) && (self.formData[field].valType === 'boolean'));
                });
            }
        },*/

        showAuth: function(){
            if (this.formData) return this.formData.OAUTH_Required.val;
        },
	},
	methods:{
		
	},
})