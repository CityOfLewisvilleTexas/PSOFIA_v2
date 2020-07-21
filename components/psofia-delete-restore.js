Vue.component('psofia-delete-restore', {
    // declare the props
    props: {
    	stateName:{
			type: String,
			required: false,
			default: 'datatables'
		},
		storeName:{	// formsList, recordsList
			type: String,
			required: true
		},
		storeId:{	// FormID, ID (NOT RECORDNUMBER)
			type: Number,
			required: false
		},
    },
    template: `
    	<v-dialog v-model="showDialog" max-width="290" persistent>
            <v-card>
                <v-card-title class="headline" primary-title>
                	<span v-if="!returnValues && failed == 0">{{setActive ? 'Restore ' : 'Delete '}}{{showTable=='forms' ? 'Form' : 'Record'}}</span>
                	<span v-if="returnValues && failed == 0">{{showTable=='forms' ? 'Form ' : 'Record '}}{{setActive ? 'Restored' : 'Deleted'}}</span>
                    <span v-if="failed > 0">{{showTable=='forms' ? 'Form ' : 'Record '}}{{setActive ? 'Not Restored' : 'Not Deleted'}}</span>
                </v-card-title>

                <v-card-text v-if="!isExecuting">
                    <div v-if="!returnValues && failed == 0">
                    	Are you sure you want to {{setActive ? 'restore' : 'delete'}} this record?
                    </div>
                    <div v-if="failed == 1">
                    	Webservice failed. Wait a few moments and try again. If problem persists contact ITS.
                    </div>
                    <div v-if="failed == 2">
                    	Confirm that your device is connected to the internet and try again.
                    </div>
                    <div v-if="returnValues && failed == 0">
                    	{{returnValues.Message}}
                    </div>
                </v-card-text>

                <v-card-text v-if="isExecuting">
                    Please wait...
                    <v-progress-linear indeterminate color="primary" class="mb-0"></v-progress-linear>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text v-if="!returnValues" @click.stop="closeDialog" :disabled="isExecuting">
                    	Cancel
                    </v-btn>
                    <v-btn text v-if="!returnValues && failed == 0" @click.stop="execDeleteRestore" :disabled="!hasInternet || isExecuting"
                    	:color="setActive ? 'green' : 'red'">
                        Yes
                    </v-btn>
                    <v-btn text v-if="!returnValues && failed > 0" @click.stop="execDeleteRestore" :disabled="!hasInternet || isExecuting"
                    	color="primary">
                    	Try Again
                    </v-btn>
                    <v-btn text v-if="returnValues && failed == 0" @click.stop="closeDialog" :disabled="isExecuting">
                    	Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `,
    data: function(){
        return{
            isLoading: true,
            isExecuting: false,
            sharedState: store.state,
            
            formID: '',
            showDialog: false,
            setActive: null,
            returnValues: null,
            failed: 0,
            closeTimeout: null,
            
            debug: false,
        }
    },
    created: function(){
        if(this.debug) console.log("\t\tCreated");
    },
    mounted: function(){
        var self = this;
        if(this.debug) console.log("\t\tMounted");
        Vue.nextTick(function(){
            self.initialize();
        });
    },
    beforeDestroy: function() { 
        var self = this;
        if(this.debug) console.log('\t\tDestroy')
        if(this.closeTimeout) clearTimeout(self.closeTimeout);
    },
    watch:{
        
    },
    computed:{
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return this.sharedState.user.email; },
        isDev: function(){ return this.sharedState.user.isDev; },

        payload: function(){
			return {stateName: this.stateName, storeName: this.storeName, id: this.storeId};
		},
		item: function(){
			return store.getDataObj(this.payload);
		},
		storeIdPropname: function(){
        	return store.getStoreTableID(this.payload);
        },
        showTable: function(){
        	return this.storeName.replace('List', '');
        },
    },
    methods:{
        initialize: function(){
            if(this.debug) console.log("\t\tinitialize");

            this.formID = this.$route.params.formid;
            this.setActive = !(this.item.Active.val);
            this.showDialog = true;
        },

        closeDialog: function(){
            var self = this;
            if(this.debug) console.log('closeDialog')
            //this.setActive = 0;
            //this.returnValues = null;
            //this.failed = 0;
            if(this.closeTimeout) clearTimeout(self.closeTimeout);
            //this.isExecuting = false;
            this.showDialog = false;
            Vue.nextTick(function(){ self.$emit('close-delete-restore'); });
        },
        execDeleteRestore: function(){
            var self = this;
            this.isExecuting = true;

            if(this.hasInternet){
                if(this.showTable == 'records'){
                    var checktime = moment();
                    $.post('https://query.cityoflewisville.com/v2/',{
                        webservice : 'PSOFIAv2/Delete-Restore Record',
                        formID: this.formID,
                        recordNumber: this.item.RecordNumber,
                        setActive: this.setActive,
                        username: this.userEmail,
                        userToken: localStorage.colAuthToken,
                        AUTH_TOKEN: localStorage.colAuthToken,
                    },
                    function(data){
                        self.failed = 0;
                        self.returnValues = data.ReturnValues[0];
                        self.isExecuting = false;
                        Vue.nextTick(function(){
                            if(!self.returnValues.Error && !self.returnValues.Warning){
                                self.closeTimeout = setTimeout(self.closeDialog, 5000);
                                self.$emit('refresh-records');
                                store.setLastChange(moment());
                            }
                            else{
                                self.closeTimeout = setTimeout(self.closeDialog, 10000);
                            }
                        });
                    })
                    .fail(function(data){
                        store.setConnectionsOnWSFail(data, checktime);
                        console.error ("Webservice Fail: Delete-Restore Record");
                        if(self.debug) console.log(data);

                        Vue.nextTick(function(){
                            if(self.hasInternet) self.failed = 1;
                            else self.failed = 2;
                            self.isExecuting = false;
                        });
                    });
                }
                else{
                    console.log('incomplete');
                    this.isExecuting = false;
                    this.showDialog = false;
                }
            }
            else{
                console.error('OFFLINE');
                this.failed = 2;
            }
        },
    }
})