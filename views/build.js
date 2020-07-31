var Build = {
    template: `
        <v-row v-if="isDev">
            <v-col cols="12" sm="12">
                <v-card class="mx-md-2 my-4" :loading="storeLoading">
                    <v-toolbar flat color="grey lighten-2">
                        <v-toolbar-title>
                            {{pageTitle}}
                        </v-toolbar-title>

                        <v-progress-linear color="secondary" :active="appLoading" indeterminate absolute top></v-progress-linear>

                        <v-spacer></v-spacer>

                        <!--<v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <span v-on="on">
                                    <v-btn icon to="/home">
                                        <v-icon>mdi-home</v-icon>
                                    </v-btn>
                                </span>
                            </template>
                            <span>Return to View All Forms</span>
                        </v-tooltip>-->

                        <v-btn icon>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>

                        <template v-slot:extension>
                            <v-card-subtitle v-if="formIDparam && createDate && createDate.val">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">Created: {{createDate.displayVal}}</span>
                                    </template>
                                    <span v-html="getTooltip('CreateDate')"></span>
                                </v-tooltip>
                            </v-card-subtitle>
                            <v-card-subtitle v-if="formIDparam && editDate && editDate.val">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <span v-on="on">Last Edited: {{editDate.displayVal}}</span>
                                    </template>
                                    <span v-html="getTooltip('LastEditDate')"></span>
                                </v-tooltip>
                            </v-card-subtitle>

                            <v-spacer></v-spacer>
                            
                            <v-card-subtitle>{{status}}</v-card-subtitle>
                        </template>

                    </v-toolbar>

                    <psofia-builder-form-data v-if="formData">
                    </psofia-builder-form-data>
                            
                    <psofia-builder-section v-for="s in orderedSections"
                        :key="s.FormSectionID"
                        store-name="formSections" :store-id="s.FormSectionID"
                    ></psofia-builder-section>
                        
                    <v-card-actions class="primary">
                        <v-btn @click="addNewSection" text block color="white">
                            <v-icon left>mdi-shape-square-plus</v-icon>Add New Section
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    `,

// BUILD
    beforeRouteEnter (to, from, next) {
        console.log("\t\tBUILD - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        var self = this;
        if(this.routeDebug) console.log('\t\tBUILD - Before update - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path);
        this.isLoading = true;
        if(this.wsGetTimeout){
            if(this.debug) console.log("\t\tBUILD - Need to clear timeout");
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        var self = this;
        if(this.routeDebug) console.log('\t\tBUILD - Before leave - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path);
        if(this.wsGetTimeout){
            if(this.debug) console.log("\t\tBUILD - Need to clear timeout");
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },

// BUILD
    data: function(){
        return{
            debug: true,
            isLoading: true,
            isSubmitting: false,
            sharedState: store.state,

            showInactive: false,
            //changingRoute: false,
            wsGetTimeout: null,
        }
    },

// BUILD
    created: function(){
        if(this.debug) console.log("\t\tBUILD - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\tBUILD - Mounted");
        this.initialize();
    },
    beforeDestroy: function() {
        if(this.debug) console.log("\t\tBUILD - Destroy");
    },

// BUILD
    watch: {
        $route(to, from){
            if(this.routeDebug) console.log('\t\tBUILD - Route changed - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path);
            //this.routeChanged();
        },
        '$route.params.formid': {
            immediate: true,
            handler: function(newVal, oldVal) {
                if(newVal !== undefined){
                    if(this.routeDebug) console.log('\t\tBUILD - :formid changed - oldVal: ' + oldVal + '; newVal: ' + newVal)
                }
            },
            deep: true,
        },

        '$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path && (newVal.name == 'buildForm' || newVal.name == 'editForm') ){
                    if(this.routeDebug) console.log('\t\tBUILD - Diff watch - Route changed - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path);
                    this.routeChanged();
                }
            },
            deep: true
        },
        userLoading: function(newVal, oldVal){
            if(newVal === false){
                if(this.debug) console.log("\tBUILD - User Loading changed")
                this.initialize();
            }
        },
    },

// BUILD
    computed: {
        routeName: function(){
            if(this.$route.hasOwnProperty('name') && this.$route.name) return this.$route.name
            else return null
        },
        routeMeta: function(){
            if(this.$route.hasOwnProperty('meta') && this.$route.meta) return this.$route.meta
            else return null
        },
        routeParams: function(){
            if(this.$route.hasOwnProperty('params') && this.$route.params) return this.$route.params
            else return null
        },
        formIDparam: function(){
            if(this.routeParams && this.routeParams.hasOwnProperty('formid') && this.routeParams.formid) return this.routeParams.formid
            else return null
        },
        deptIDparam: function(){
            if(this.routeParams && this.routeParams.hasOwnProperty('deptid') && this.routeParams.deptid) return this.routeParams.deptid
            else return null
        },
        storeDebug: function(){ return store.debug },
        routeDebug: function(){ return store.routeDebug },
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },

        userLoading: function(){ return store.getUserIsLoading(); },
        stateLoading: function(){ return this.sharedState.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.formLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.userLoading || this.storeLoading || this.isLoading; },

        pageTitle: function(){
            if(this.formIDparam) return 'Edit Form ' + this.formIDparam.toString()
            else return 'Create New Form'
        },
        /*showFAB: function(){
            return (!(this.appLoading) || !(this.changingRoute));
        },*/

        payload: function(){
            return {stateName: 'form', keepInactive: this.showInactive}
        },
        formDataPayload: function(){
            return Object.assign({}, this.payload, {storeName: 'formData'});
        },
        secPayload: function(){
            return Object.assign({}, this.payload, {storeName: 'formSections'});
        },


        formData: function(){
            if(!this.appLoading) return store.getDataObj(this.formDataPayload);
            else return null;
        },
        formSections: function(){
            if(!this.appLoading) return store.getArrDataObjs(this.secPayload);
            else return [];
        },

        secOrderIdPropname: function(){
            return this.getStoreOrderID(secPayload);
        },

        /*filteredFormSections: function(){
            var self = this;
            if(this.formSections.length > 0){
                return this.formSections.filter(function(sec){
                    if(!(self.showInactive)) return sec.isActive;
                    else return true;
                });
            }
        },*/
        orderedSections: function(){
            if(this.formSections && this.formSections.length > 0){
                var orderPayload = Object.assign({}, this.secPayload, {arrDataObjs: this.formSections});
                return store.orderArrDataObjs(orderPayload);
            }
        },

        unsavedChanges: function(){
            /*if(!(this.formIDparam) || store.formHasChange(['formData'])){//, 'formSections', 'subSections', 'fields','valSets','alldepartments','allSections','allsubSections','allfields','allfieldTypes','allvalSets'])){
                return true;
            }*/
            return false;
        },
        status: function(){
            if(this.unsavedChanges) return 'Unsaved Changes';
            return 'Saved to DB';
        },

        createDate: function(){
            if(this.formData) return this.formData.CreateDate;
        },
        editDate: function(){
            if(this.formData) return this.formData.LastEditDate;
        },
        createUser: function(){
            if(this.formData) return this.formData.CreateUser;
        },
        editUser: function(){
            if(this.formData) return this.formData.LastEditUser;
        },
    },

// BUILD
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\tBUILD - Route Changed")
            this.isLoading = true;
            this.initialize();
        },
        initialize: function(){
            var self = this;
            //if(this.debug) console.log('\tLIST - initialize - routeName: ' + this.routeName + '; formIDparam: ' + this.formIDparam + '; deptIDparam: ' + this.deptIDparam)

            Vue.nextTick(function(){
                if(self.debug) console.log('\tLIST - initialize nextTick - routeName: ' + self.routeName + '; formIDparam: ' + self.formIDparam + '; deptIDparam: ' + self.deptIDparam)
                //if(self.isDev) self.getFormBuilder();
                //else self.isLoading = false;
                
            });
        },
        getFormBuilder: function(){
            var self = this;

            if(this.hasInternet){
                this.isLoading = true;
                store.setStoreIsLoading({isLoading: true});

                var checktime = moment();
                $.post('https://query.cityoflewisville.com/v2/',{
                    webservice : 'PSOFIAv2/Get Form Builder2',
                    formID: self.formIDparam,
                    AUTH_TOKEN: localStorage.colAuthToken,
                },
                function(data){
                    var loadDate = moment();
                    store.loadColumns(data.Columns, ['formData', 'formSections', 'formSubSections', 'formFields','formValSets', 'formVsOptions', 'allForms', 'allDepartments', 'allSections', 'allSubSections', 'allFieldTypes', 'allValSets'], loadDate);
                    store.loadStore(data.AllDepartments, 'allDepartments', loadDate);
                    store.loadStore(data.AllSections, 'allSections', loadDate);
                    store.loadStore(data.AllSubSections, 'allSubSections', loadDate);
                    store.loadStore(data.AllFieldTypes, 'allFieldTypes', loadDate);
                    store.loadStore(data.AllValSets, 'allValSets', loadDate);
                    store.loadStore(data.AllForms, 'allForms', loadDate);
                    
                    store.loadStore(data.FormSections, 'formSections', loadDate);
                    store.loadStore(data.FormSubSections, 'formSubSections', loadDate);
                    //store.loadStore(data.FormVSECategories, 'formVseCategories');
                    //store.loadStore(data.FormVSEntries, 'formVsEntries');
                    store.loadStore(data.FormVSOptions, 'formVsOptions', loadDate);
                    store.loadStore(data.FormValSets, 'formValSets', loadDate);
                    store.loadStore(data.FormFields, 'formFields', loadDate);
                    store.loadStore(data.FormData, 'formData', loadDate);

                    Vue.nextTick(function(){

                        // if new form, insert default row for form data
                        if(!(self.formIDparam)){
                            //store.setupNewForm();
                        }

                        Vue.nextTick(function(){
                            store.setStoreIsLoading({isLoading: false, loadDate: loadDate});
                            self.isLoading = false;
                        });
                    });
                })
                .fail(function(data){
                    store.setConnectionsOnWSFail(data, checktime);
                    console.error("Webservice fail: Get Form Builder2");
                    if(self.debug) console.log(data);

                    Vue.nextTick(function(){
                        if(!self.hasInternet) self.wsGetTimeout = setTimeout(self.getFormBuilder, 1000);
                        else self.wsGetTimeout = setTimeout(self.getFormBuilder, 5000);
                    });
                });
            }
            else{
                console.error('OFFLINE')
                self.wsGetTimeout = setTimeout(self.getFormBuilder, 5000);
            }
        },

        addNewSection: function(){
            store.addDataObj(this.secPayload);
        },

        getTooltip: function(colName){
            var self = this;
            if(colName === 'CreateDate'){
                if(this.formData.CreateUser.val) return this.formData.CreateUser.displayVal + ' - ' + this.getFullDateDisplay(self.formData.CreateDate);
                else return this.getFullDateDisplay(self.formData.CreateDate);
            }
            if(colName === 'LastEditDate'){
                if(this.formData.LastEditUser.val) return this.formData.LastEditUser.displayVal + ' - ' + this.getFullDateDisplay(self.formData.LastEditDate);
                else return this.getFullDateDisplay(self.formData.LastEditDate);
            }
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        },
    }
}// BUILD