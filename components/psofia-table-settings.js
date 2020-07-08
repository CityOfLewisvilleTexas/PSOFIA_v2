Vue.component('psofia-table-settings', {
    // declare the props
    props: {
        storeName:{ // formsList, recordsList
            type: String,
            required: true,
        },
        countInactive:{
            type: Number,
            required: true,
        },
    },
    template: `
        <v-dialog v-model="showDialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-cog</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="headline" primary-title>Table Settings</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col v-if="countInactive > 0" cols="12" sm="12" md="6">
                                <v-checkbox v-model="showInactive" label="Show Inactive"></v-checkbox>
                            </v-col>
                            <v-col v-if="isDev" cols="12" sm="12" md="6">
                                <v-checkbox v-model="showDetails" label="Show Table Details"></v-checkbox>
                            </v-col>
                            <v-col v-if="isDev" cols="12" sm="12" md="6">
                                <v-checkbox v-model="showIDCol" label="Show ID Column"></v-checkbox>
                            </v-col>
                            <v-col v-if="debug" cols="12" sm="12" md="6">
                                <v-checkbox v-model="showColFilters" label="Show Column Filters"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `,
    data: function(){
        return{
            isLoading: true,
            //sharedState: store.state,
            
            showDialog: false,
            showDetails: false,
            showInactive: false,
            showIDCol: false,
            showColFilters: false,
            
            debug: true,
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
    },
    watch:{
        showDialog: function(newVal, oldVal){
            if(newVal){
                this.copyTableSettings();
            }
        },
        showDetails: function(newVal, oldVal){
            var self = this;
            store.setTableSettings({storeName: this.storeName, showDetails: newVal});
            Vue.nextTick(function(){ self.$emit('save-setting', 'showDetails'); });
        },
        showInactive: function(newVal, oldVal){
            var self = this;
            store.setTableSettings({storeName: this.storeName, showInactive: newVal});
            Vue.nextTick(function(){ self.$emit('save-setting', 'showInactive'); });
        },
        showIDCol: function(newVal, oldVal){
            var self = this;
            store.setTableSettings({storeName: this.storeName, showIDCol: newVal});
            Vue.nextTick(function(){ self.$emit('save-setting', 'showIDCol'); });
        },
        showColFilters: function(newVal, oldVal){
            var self = this;
            store.setTableSettings({storeName: this.storeName, showColFilters: newVal});
            Vue.nextTick(function(){ self.$emit('save-setting', 'showColFilters'); });
        },
    },
    computed:{
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },
        storeTableSettings: function(){ return store.getTableSettings({storeName: this.storeName}); },
    },
    methods:{
        initialize: function(){
            if(this.debug) console.log("\t\tinitialize");
            this.copyTableSettings();
        },
        copyTableSettings: function(){
            this.showDetails = this.storeTableSettings.showDetails;
            this.showInactive = this.storeTableSettings.showInactive;
            this.showIDCol = this.storeTableSettings.showIDCol;
            this.showColFilters = this.storeTableSettings.showColFilters;
        },
    }
})