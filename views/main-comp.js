var MainComp = {
    template: `
            <v-main>
                <v-container :fluid="($route.name == 'recordsList' || $route.name == 'recordsListActions') ? true : false">
                    <transition>
                        <!--<keep-alive>-->
                            <router-view></router-view>
                        <!--</keep-alive>-->
                    </transition>

                    <v-fab-transition>
                        <v-btn v-if="showFAB" :key="routeName"
                            @click="clickFAB(firstFab)"
                            :color="firstFab.color"
                            class="v-btn--main-btn" fab large bottom right>
                            <v-icon>{{ firstFab.icon }}</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-container>
            </v-main>
    `,

// MAIN
    components: {},
    beforeRouteEnter (to, from, next) {
        if(store.routeDebug) console.warn('\t\tBefore enter');
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.routeDebug) console.warn('\t\tBefore update');
        this.routeChanging = true;
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.routeDebug) console.warn('\t\tBefore leave');
        Vue.nextTick(function(){
            next();
        });
    },

// MAIN
    data: function(){
        return{
            debug: false,
            isLoading: false,
            sharedState: store.state,
            routeChanging: false,

            //showFAB: false,
            /*fabs: {
                toBuild: {color: 'primary', icon: 'mdi-plus', path: '/build'},
                toListVS: {color: 'primary', icon: 'mdi-plus', path: '/build/vs'},
                toBuildVS: {color: 'primary', icon: 'mdi-plus', path: '/build/valset'},
                save: {color: 'success', icon: 'mdi-content-save'},
                toEntry: {color: 'primary', icon: 'mdi-plus'}, //path: this.currPath + '/entry'
            },*/

        }
    },

// MAIN
    watch:{
        $route(to, from){
            if(this.routeDebug) console.warn('\tRoute changed');
            //if(this.routeDebug) console.warn('\tRoute changed - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
            this.routeChanged();
        },
        userState: function(newVal, oldVal){
            if(!self.username){
                console.warn('Could not verify identity. Form may not submit correctly.')
            }
        }
    },

// MAIN
    computed: {
        routeName: function(){ if(this.$route.hasOwnProperty('name') && this.$route.name) return this.$route.name },
        routeMeta: function(){ if(this.$route.hasOwnProperty('meta') && this.$route.meta) return this.$route.meta },
        routeParams: function(){ if(this.$route.hasOwnProperty('params') && this.$route.params) return this.$route.params },
        routeQuery: function(){ if(this.$route.hasOwnProperty('query') && this.$route.query) return this.$route.query },
        formIDparam: function(){ if(this.routeParams && this.routeParams.hasOwnProperty('formid') && this.routeParams.formid) return this.routeParams.formid },
        deptIDparam: function(){ if(this.routeParams && this.routeParams.hasOwnProperty('deptid') && this.routeParams.deptid) return this.routeParams.deptid },
        metaFabs: function(){
            if(this.routeMeta && this.routeMeta.hasOwnProperty('fabs') && this.routeMeta.fabs && Array.isArray(this.routeMeta.fabs) && this.routeMeta.fabs.length > 0) return this.routeMeta.fabs
            else return []
        },
        storeDebug: function(){ return store.debug },
        routeDebug: function(){ return store.routeDebug },
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userLoading: function(){ return store.getUserIsLoading(); },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },

        userStatus: function(){
            var status = 0
            if(this.userEmail) status = 1
            if(this.userEmail && this.username) status = 2
            return status;
        },

        showFAB: function(){
            if(!this.routeChanging && this.filteredfabs.length > 0) return true
            else return false
        },
        filteredfabs: function(){
            var self = this
            return this.metaFabs.filter(function(fab){
                if(fab.hasOwnProperty('isDev')){
                    if(self.userLoading) return false
                    else return self.isDev == fab.isDev
                }
                else return true
            })
        },
        firstFab: function(){
            if(this.filteredfabs.length > 0) return this.filteredfabs[0]
        },
        /*activeFab: function(){
            var fab = null;
            if(this.currPath == '/home'){
                // NEEDS UPDATE - make multiple, add toListVS
                if(this.isDev) fab = this.fabs.toBuild;
            }
            else if(this.currPath.startsWith('/build')){
                // Valset list
                if(this.currPath.startsWith('/build/vs')) fab = this.fabs.toBuildVS;
                // Build new form, Edit form, Build new ValSet, Edit ValSet
                else fab = this.fabs.save;
            }
            else if(this.currPath.startsWith('/form')){
                // Submit new entry, Edit entry
                if(this.currPath.search('/entry') != -1) fab = this.fabs.save;
                // View Entry
                else if(this.currPath.search('/view') != -1){
                    fab = this.fabs.toEntry;
                    fab.path = this.currPath.replace('view', 'entry');
                }
                //All Records
                else fab = this.fabs.toEntry
            }
            return fab;
        },*/
    },

// MAIN
    created: function(){
        if(this.debug) console.warn("\t\tCreated");
        //this.initialize();
    },
    mounted: function(){
        if(this.debug) console.warn("\t\tMounted");
    },
    beforeDestroy: function() { 
        if(this.debug) console.warn("\t\tDestroy");
    },


// MAIN
    methods: {
        routeChanged: function(){
            if(this.debug) console.warn('\trouteChanged')
            this.routeChanging = false;
        },
        /*initialize: function(){
            var self = this;
            //if(self.debug) console.warn('\tMAIN - initialize - ' + self.routeName + (self.routeParams ? ('\nparams: ' + JSON.stringify(self.routeParams)) : '') + (self.routeMeta ? ('\nmeta: ' +  JSON.stringify(self.routeMeta)) : '') + (self.routeQuery ? ('\nquery: ' + self.routeQuery) : '') );

            Vue.nextTick(function(){
                if(self.debug) console.warn('\tMAIN - initialize nextTick - ' + self.routeName + (self.routeParams ? ('\nparams: ' + JSON.stringify(self.routeParams)) : '') + (self.routeMeta ? ('\nmeta: ' +  JSON.stringify(self.routeMeta)) : '') + (self.routeQuery ? ('\nquery: ' + self.routeQuery) : '') );
            });
        },*/
        clickFAB: function(fab){
            if(this.showFAB && fab && fab.type){
                if(fab.type == 'push'){
                    this.pushFABRoute(fab)
                }
                else if(fab.type == 'link'){
                    this.gotoFABLink(fab)
                }
                // save/create button
                else if(fab.type == 'action'){
                    console.log(fab.action)
                }
            }
        },
        pushFABRoute: function(fab){
            if(this.showFAB && fab && fab.type && fab.type == 'push' && fab.name){
                var newRoute;
                if(this.formIDparam) newRoute = { name: fab.name, params:{ formid: this.formIDparam } }
                else newRoute = { name: fab.name }
                this.$router.push(newRoute)
            }
        },
        gotoFABLink: function(fab){
            if(this.showFAB && fab && fab.type == 'link' && fab.url){
                var url
                if(this.formIDparam) url = fab.url + this.formIDparam
                else url = fab.url
                window.open(url, '_blank');
            }
        },
    }
}