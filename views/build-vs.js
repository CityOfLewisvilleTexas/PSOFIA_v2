var BuildVS = {
    template: `
        <v-row no-gutters>
            <v-col cols="12" sm="12">
                <v-card outlined class="mx-md-2 my-4">
                    <v-toolbar flat dark color="primary">
                        <v-toolbar-title>
                            {{title}}
                        </v-toolbar-title>

                        <v-progress-linear color="secondary" :active="appLoading" indeterminate absolute bottom></v-progress-linear>

                        <v-spacer></v-spacer>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">
                                    <v-btn icon to="/home">
                                        <v-icon>mdi-home</v-icon>
                                    </v-btn>
                                </span>
                            </template>
                            <span>Return to View All Validation Sets</span>
                        </v-tooltip>
                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title>
                                {{title}}
                            </v-card-title>
                        </div>
                        <div>
                            <v-card-subtitle>Work In Progress</v-card-subtitle>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <!--<v-col cols="12" sm="12" style="height:80px">
                <v-fab-transition>
                    <v-btn v-if="!isSubmitting" v-on:click="submitForm" :key="changingRoute"
                    fab large bottom right class="v-btn--main-btn" color="green">
                          <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                </v-fab-transition>
            </v-col>-->
        </v-row>
    `,

    beforeRouteEnter (to, from, next) {
        console.warn("\t\tBUILD VS - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.debug) console.warn("\t\tBUILD VS - Before update");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.debug) console.error("\t\tBUILD VS - Before leave");
        Vue.nextTick(function(){
            next();
        });
    },

// BUILD VS
    data: function(){
        return{
            isLoading: true,
            isSubmitting: false,
            sharedState: store.state,
            valSetID: '',
            debug: true,
        }
    },


    created: function(){
        if(this.debug) console.log("\t\t\tBUILD VS - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tBUILD VS - Mounted");
        this.initialize();
    },


    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path.startsWith('/build/valset')) this.routeChanged();
            },
            deep: true
        },
        userLoading: function(newVal, oldVal){
            if(newVal === false){
                if(this.debug) console.log("\tLIST - User Loading changed")
                this.initialize();
            }
        },
    },

// BUILD VS
    computed: {
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },

        stateLoading: function(){ return this.sharedState.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.formLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.storeLoading || this.isLoading; },

        title: function(){
            if(this.valSetID) return 'Edit Validation Set ' + this.valSetID.toString();
            else return 'Create New Validation Set'
        },
    },

// BUILD VS
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tBUILD VS - Route Changed")
            //this.initialize();
        },
        initialize: function(){
            var self = this;
            this.valSetID = this.$route.params.vsid

            //Vue.nextTick(function(){
            //    self.getFormBuilder();
            //});
        },
        getTooltip: function(col, item){
            var self = this;
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        },
    }
}// BUILD VS