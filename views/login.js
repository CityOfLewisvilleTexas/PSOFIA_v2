var Login = {
    template: `
        <v-row no-gutters>
            <v-col cols="12" sm="12">
                <v-overlay :value="!dialog">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
                <v-dialog v-model="dialog" max-width="500">
                    <v-card>
                        <v-card-title>
                            {{title}}
                        </v-card-title>
                        <v-card-subtitle>
                            {{statusDisplay}}
                        </v-card-subtitle>
                        <v-card-text>
                            {{message}}
                        </v-card-text>

                        <v-list v-if="status == 3">
                            <v-list-item>
                                 <v-list-item-content>
                                    <v-list-item-title>Email: {{userEmailDisplay}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                 <v-list-item-content>
                                    <v-list-item-title>AD Acccount: {{userAccountDisplay}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                 <v-list-item-content>
                                    <v-list-item-title>Name: {{userNameDisplay}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>

                        <v-card-actions>
                            <v-btn text v-if="status == 3 && userStatus > 1" @click="switchUser"
                                class="error--text">
                                Change Account
                            </v-btn>
                            <v-btn text v-if="status == 3 && userStatus > 1" @click="logout"
                                class="primary--text">
                                Log Out
                            </v-btn>
                            <v-btn text v-if="status == 0 || status == 2" @click="login"
                                class="primary--text">
                                {{status == 2 ? 'Change Account' : 'Log In'}}
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn text v-if="loginRequired && (status == 0 || status == 2)" @click="gotoFailRedirect"
                                class="error--text">
                                Cancel
                            </v-btn>
                            <v-btn text v-if="(loginRequired && status > 2) || !loginRequired" @click="gotoRedirect"
                                class="success--text">
                                {{ loginRequired ? 'Continue' : 'Return' }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
    `,

// LOGIN
    beforeRouteEnter (to, from, next) {
        //if(store.routeDebug) console.warn('\t\tBefore enter');
        if(store.routeDebug) console.warn('\t\tBefore enter - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        //if(this.routeDebug) console.warn('\t\tBefore update');
        if(this.routeDebug) console.warn('\t\tBefore update - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        // clear timeouts
        if(this.checkTimeout) clearTimeout(this.checkTimeout)
        if(this.redirectTimeout) clearTimeout(this.redirectTimeout)
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        //if(this.routeDebug) console.warn('\t\tBefore leave');
        if(this.routeDebug) console.warn('\t\tBefore leave - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        // clear timeouts
        if(this.checkTimeout) clearTimeout(this.checkTimeout)
        if(this.redirectTimeout) clearTimeout(this.redirectTimeout)
        Vue.nextTick(function(){
            next();
        });
    },

// LOGIN
    data: function(){
        return{
            debug: false,
            statusDebug: [],
            isLoading: true,
            sharedState: store.state,

            dialog: false,
            authImmediate: false,
            status: null,
            countCallAuth: 0,
            checkTimeout: null,
            redirectTimeout: null,
        }
    },

// LOGIN
    watch:{
        $route(to, from){
            if(this.routeDebug) console.log('\t\tRoute changed');
            this.routeChanged();
        },
        userEmail(newVal, oldVal){
            if(this.debug) console.log('\tuserEmail changed - old: ' + oldVal + ' -> new: ' + newVal)
        },
        status: {
            immediate: false,
            handler: function(newVal, oldVal) {
                if(this.debug) this.statusDebug.unshift(newVal)
                if(this.debug) console.log('\tstatus - ' + this.statusDebug)
                if(newVal == 3){
                    this.dialog = false
                    this.gotoRedirect()
                }
            },
        },
    },

// LOGIN
    computed: {
        routeName: function(){ if(this.$route.hasOwnProperty('name') && this.$route.name) return this.$route.name },
        routeMeta: function(){ if(this.$route.hasOwnProperty('meta') && this.$route.meta) return this.$route.meta },
        routeParams: function(){ if(this.$route.hasOwnProperty('params') && this.$route.params) return this.$route.params },
        routeQuery: function(){ if(this.$route.hasOwnProperty('query') && this.$route.query) return this.$route.query },
        requiredParam: function(){ if(this.routeParams && this.routeParams.hasOwnProperty('required')) return this.routeParams.required },
        queryRedirect: function(){ if(this.routeQuery && this.routeQuery.hasOwnProperty('redirect') && this.routeQuery.redirect) return this.routeQuery.redirect },
        queryFailRedirect: function(){ if(this.routeQuery && this.routeQuery.hasOwnProperty('failredirect') && this.routeQuery.failredirect) return this.routeQuery.failredirect },

        storeDebug: function(){ return store.debug },
        routeDebug: function(){ return store.routeDebug },
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userLoading: function(){ return store.getUserIsLoading(); },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },
        username: function(){ return store.getUsername() },
        userFirstName: function(){ return store.getUserFirstName(); },
        userLastName: function(){ return store.getUserLastName(); },

        loginRequired: function(){
            return this.requiredParam == 1;
        },
        failedRedirect: function(){
            var redirectOnFail = 'home'
            if(to.name == 'recordsListActions') redirectOnFail = 'form/' + to.params.formid
        },

        // 0: never signed in; 1: signed in, no localstorage (not @col), 2: email only (no AD account), 1: user fully logged in (email & AD)
        userStatus: function(){
            var status = 0
            if(this.userLoading) status = -1
            else if(this.userEmail){
                if(this.username) status = 3
                else status = 2
            }
            else if(sessionStorage.authChecked) status = 1
            return status;
        },
        userNameDisplay: function(){
            if(this.userStatus == -1) return 'Loading...'
            if(this.userStatus == 0) return 'None'
            if(this.userStatus == 1) return 'Unknown'
            if(this.userStatus == 2) return 'Unknown employee'
            if(this.userStatus == 3){
                if(this.userFirstName && this.userLastName) return this.userFirstName + ' ' + this.userLastName
                else if(this.userFirstName) return this.userFirstName + '(first name)'
                else if(this.userLastName) return this.userLastName + '(last name)'
                else return 'Name unavailable'
            }
            return '???'
        },
        userAccountDisplay: function(){
            if(this.userStatus == -1) return 'Loading...'
            if(this.userStatus < 3) return 'None'
            if(this.userStatus == 3 && this.username) return this.username;
            return '???'
        },
        userEmailDisplay: function(){
            if(this.userStatus == -1) return 'Loading...'
            if(this.userStatus == 0) return 'None'
            if(this.userStatus == 1) return 'Emails must be @cityoflewisville.com'
            if(this.userStatus > 1 && this.userEmail) return this.userEmail
            return '???'
        },
        title: function(){
            var title = 'Login'
            if(this.loginRequired) title = 'Login Required'
            return title
        },
        statusDisplay: function(){
            var str = ''
            if(this.status == 3) str = 'Account verified.'
            else if(this.status == 2){
                if(this.loginRequired) str = 'Access denied.'
                else str = 'Unregistered email'
            }
            else if(this.status == 1) str = 'Logging in...'
            return str
        },
        message: function(){
            var msg = ''
            if(this.status == 2 || this.status == 0){
                msg = 'You are not currently logged in to a City of Lewisville account.'
                if(this.status == 2 && this.loginRequired) msg += ' Log in with a different account, or you will be redirected.'
                else if(this.status == 0 && this.loginRequired) msg += ' Please login to continue.'
            }
            if(this.status == 3){
                msg = 'You are logged in to the following City of Lewisville account:'
            }
            return msg
        },
    },

// LOGIN
    created: function(){
        if(this.debug) console.log('\t\tLOGIN - Created');
    },
    mounted: function(){
        if(this.debug) console.log('\t\tLOGIN - Mounted');
        this.initialize();
    },
    beforeDestroy: function() { 
        if(this.debug) console.log('\t\tLOGIN - Destroy');
        // clear timeouts
        if(this.checkTimeout) clearTimeout(checkTimeout)
        if(this.redirectTimeout) clearTimeout(redirectTimeout)
    },


// LOGIN
    methods: {
        routeChanged: function(){
            if(this.debug) console.log('\trouteChanged')
            this.initialize();
        },
        initialize: function(){
            var self = this
            if(this.debug) console.log('\tinitialize - ' + this.routeName + (this.routeParams ? ('\nparams: ' + JSON.stringify(this.routeParams)) : '') + (this.routeQuery ? ('\nquery: ' + this.routeQuery) : '') );
            if(this.routeName == 'login'){
                this.authImmediate = true;
                this.$router.push({ path: '/account/' + this.requiredParam, query: this.routeQuery })
            }
            else{
                if(this.authImmediate){
                    if(this.debug) console.log('call immediately')
                    this.callAuthenticate();
                }
                else{
                    this.dialog = true
                    if(this.debug) console.log('call on click')
                    this.checkStorage()
                }
            }
        },
        checkStorage: function(){
            var self = this
            if(sessionStorage.authChecked && localStorage.colAuthToken && localStorage.colEmail) this.status = 3
            else if(sessionStorage.authChecked && !(localStorage.colAuthToken && localStorage.colEmail)) this.status = 2
            else if(this.countCallAuth > 0){
                this.status = 1
                this.checkTimeout = setTimeout(self.checkStorage, 100)
            }
            else this.status = 0
        },
        callAuthenticate: function(){
            this.authImmediate = false
            this.countCallAuth++
            this.checkStorage()
            authenticate()
        },
        gotoRedirect: function(){
            this.$router.replace({ path: this.queryRedirect })
        },
        gotoFailRedirect: function(){
            this.$router.replace({ path: this.queryFailRedirect })
        },
        login: function(){
            sessionStorage.removeItem('authChecked');
            this.callAuthenticate()
        },
        switchUser: function(){
            store.logout({ loadDate: moment() });
            localStorage.removeItem('colEmail');
            localStorage.removeItem('colAuthToken');
            sessionStorage.removeItem('authChecked');
            this.login();
        },
        logout: function(){
            store.logout({ loadDate: moment() });
            localStorage.removeItem('colEmail');
            localStorage.removeItem('colAuthToken');
            sessionStorage.removeItem('authChecked');
        },
    }
}