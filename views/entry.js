var Entry = {
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
                            <span>Return to View All Forms</span>
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
                            <v-card-subtitle v-if="formID && createDate && createDate.val">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">Created: {{createDate.displayVal}}</span>
                                    </template>
                                    <span v-html="getTooltip('CreateDate')"></span>
                                </v-tooltip>
                            </v-card-subtitle>
                            <v-card-subtitle v-if="formID && editDate && editDate.val">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">Last Edited: {{editDate.displayVal}}</span>
                                    </template>
                                    <span v-html="getTooltip('LastEditDate')"></span>
                                </v-tooltip>
                            </v-card-subtitle>
                        </div>
                        <div>
                            <v-card-subtitle>{{status}}</v-card-subtitle>
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
        console.warn("\t\tENTRY - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.debug) console.warn("\t\tENTRY - Before update");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.debug) console.error("\t\tENTRY - Before leave");
        Vue.nextTick(function(){
            next();
        });
    },

// ENTRY
    data: function(){
        return{
            isLoading: true,
            isSubmitting: false,
            sharedState: store.state,
            formID: '',
            recordNumber: '',
            debug: true,
        }
    },


    created: function(){
        if(this.debug) console.log("\t\t\tENTRY - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tENTRY - Mounted");
        this.initialize();
    },


    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path.startsWith('/entry')) this.routeChanged();
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

// ENTRY
    computed: {
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return this.sharedState.user.email; },

        userLoading: function(){ return store.getUserIsLoading(); },
        stateLoading: function(){ return this.sharedState.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.formLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.userLoading || this.storeLoading || this.isLoading; },

        title: function(){
            if(this.recordNumber) return 'Edit Record';
            else return 'New Record'
        },
    },

// ENTRY
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tENTRY - Route Changed")
            //this.initialize();
        },
        initialize: function(){
            var self = this;
            this.formID = this.$route.params.formid
            this.recordNumber = this.$route.params.recordnum

            //Vue.nextTick(function(){
            //    self.getFormBuilder();
            //});
        },
        getTooltip: function(colName){
            var self = this;
            /*if(colName === 'CreateDate'){
                if(this.formData.CreateUser.val) return this.formData.CreateUser.displayVal + ' - ' + this.getFullDateDisplay(self.formData.CreateDate);
                else return this.getFullDateDisplay(self.formData.CreateDate);
            }
            if(colName === 'LastEditDate'){
                if(this.formData.LastEditUser.val) return this.formData.LastEditUser.displayVal + ' - ' + this.getFullDateDisplay(self.formData.LastEditDate);
                else return this.getFullDateDisplay(self.formData.LastEditDate);
            }*/
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        },
    }
}// Entry