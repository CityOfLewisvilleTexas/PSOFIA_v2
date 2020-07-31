"use strict";

const eventHub = new Vue();

var MainNav = {
    template: `
        <div>
            <v-app-bar app dense dark color="primary">

                <v-tooltip v-if="routeName!='formsList'" bottom>
                    <template v-slot:activator="{ on }">
                        <span v-on="on">
                            <v-btn to="/home" color="primary">
                                <v-icon>mdi-home</v-icon>
                            </v-btn>
                        </span>
                    </template>
                    <span>Return to View All Forms</span>
                </v-tooltip>
                <v-divider v-if="routeName!='formsList'" class="mx-2" inset vertical></v-divider>
                {{pageTitle}}

                <v-spacer></v-spacer>

                <v-btn icon v-if="!hasInternet">
                    <v-icon color="error">mdi-wifi-strength-alert-outline</v-icon>
                </v-btn>

                <v-divider v-if="!hasInternet" inset vertical class="mr-2 ml-4"></v-divider>


                    <v-menu v-model="accountMenu" :disabled="!accountIconOnly && userStatus<1"
                        dense bottom right transition="scale-transition" origin="top left">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" @click="autoLogin"
                                :icon="accountIconOnly" :color="statusColor" :class="statusClass">
                                <v-icon v-if="userStatus==3" :left="!accountIconOnly">mdi-account-circle</v-icon>
                                <v-icon v-if="userStatus<3" :left="!accountIconOnly">mdi-account-circle-outline</v-icon>
                                <span v-if="!accountIconOnly">{{userDisplay}}</span>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list v-if="userStatus != 0">
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <v-avatar :color="statusColor">
                                            <span class="headline" :class="statusClass">{{userChar}}</span>
                                        </v-avatar>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{userDisplay}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item three-line>
                                     <v-list-item-content>
                                        <v-list-item-title>{{userNameDisplay}}</v-list-item-title>
                                        <v-list-item-subtitle>{{userEmailDisplay}}</v-list-item-subtitle>
                                        <v-list-item-subtitle>AD Acccount: {{userAccountDisplay}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-divider v-if="userStatus==2"></v-divider>
                            <v-list v-if="userStatus==2">
                                <v-list-item @click="checkForUserAD">
                                    <v-list-item-action>
                                        <v-icon>mdi-account-reactivate</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Check for Employee Again</v-list-item-title>
                                </v-list-item>
                            </v-list>
                            <v-divider v-if="userStatus>0"></v-divider>
                            <v-list>
                                <v-list-item v-if="debug" @click="gotoLogin">
                                    <v-list-item-action>
                                        <v-icon>mdi-account</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Go to Login</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="userStatus>0" @click="logout">
                                    <v-list-item-action>
                                        <v-icon>mdi-logout</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Logout</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="userStatus > 1" @click="switchUser">
                                    <v-list-item-action>
                                        <v-icon>mdi-account-switch</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Switch User</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="userStatus==1" @click="switchUser">
                                    <v-list-item-action>
                                        <v-icon>mdi-login</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Sign in with a different email</v-list-item-title>
                                </v-list-item>
                                <v-list-item v-if="userStatus==0" @click="login">
                                    <v-list-item-action>
                                        <v-icon>mdi-login</v-icon>
                                    </v-list-item-action>
                                    <v-list-item-title>Sign in</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-menu>

                <!--
                <v-divider inset vertical class="mr-2 ml-4"></v-divider>
                <v-btn icon v-if="hasInternet">
                    <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-btn icon v-if="!hasInternet">
                    <v-icon color="error">mdi-wifi-strength-alert-outline</v-icon>
                </v-btn>
                -->

                <!--<v-divider inset v-if="isDev" vertical class="mr-2 ml-4"></v-divider>
                <v-btn icon v-if="isDev">
                    <v-icon>mdi-theme-light-dark</v-icon>
                </v-btn>-->

            </v-app-bar>

            <MainComp></MainComp>

        </div>
    `,
    components: { MainComp },

// NAV
    beforeRouteEnter (to, from, next) {
        if(store.routeDebug) console.warn('\t\tBefore enter - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        // if route requires authentication
        if (to.matched.some(record => record.meta.requiresAuth)) {
            //alert('route requires authentication - ' + to.name)
                
            // if already authenticated
            if(sessionStorage.authChecked){
                // if has token & email, store user, allow
                if(localStorage.colAuthToken && localStorage.colEmail){
                    store.setUserLS({ token: localStorage.colAuthToken, email: localStorage.colEmail })
                    next()
                }
                // else push to login page, notify & allow login, then return or redirect
                else{
                    //var toRouteRecord = to.matched.find(record => record.name == to.name)
                    var redirectOnFail = '/home'
                    if(to.name == 'recordsListActions') redirectOnFail = '/form/' + to.params.formid
                    next({ path: '/login/1', query: { redirect: to.fullPath, failredirect: redirectOnFail } })
                }
            }
            // else push to login page, immediately require login, then return or redirect
            else{
                //var toRouteRecord = to.matched.find(record => record.name == to.name)
                var redirectOnFail = '/home'
                if(to.name == 'recordsListActions') redirectOnFail = '/form/' + to.params.formid
                next({ path: '/login/1', query: { redirect: to.fullPath, failredirect: redirectOnFail } })
            }
        }
        // get email from COL if auth token in local storage
        else{
            // if already authenticated & has token & email, store user
            if(sessionStorage.authChecked && localStorage.colAuthToken && localStorage.colEmail){
                store.setUserLS({ token: localStorage.colAuthToken, email: localStorage.colEmail })
                next()
            }
            else next()
        }
    },
    beforeRouteUpdate (to, from, next) {
        if(this.routeDebug) console.warn('\t\tBefore update - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        // if route requires authentication
        if (to.matched.some(record => record.meta.requiresAuth)) {
            //alert('route requires authentication - ' + to.name)
            // user not in store
            if(!this.userEmail){
                // if already authenticated
                if(sessionStorage.authChecked){
                    // if has token & email, store user, allow
                    if(localStorage.colAuthToken && localStorage.colEmail){
                        store.setUserLS({ token: localStorage.colAuthToken, email: localStorage.colEmail })
                        next()
                    }
                    // else push to login page, notify & allow login, then return or redirect
                    else{
                        //var toRouteRecord = to.matched.find(record => record.name == to.name)
                        var redirectOnFail = '/home'
                        if(to.name == 'recordsListActions') redirectOnFail = '/form/' + to.params.formid
                        next({ path: '/login/1', query: { redirect: to.fullPath, failredirect: redirectOnFail } })
                    }
                }
                // else push to login page, immediately rquire login, then return or redirect
                else{
                    //var toRouteRecord = to.matched.find(record => record.name == to.name)
                    var redirectOnFail = '/home'
                    if(to.name == 'recordsListActions') redirectOnFail = '/form/' + to.params.formid
                    next({ path: '/login/1', query: { redirect: to.fullPath, failredirect: redirectOnFail } })
                }
            }
            // user already in store
            else next()
        }
        // get email from COL if auth token in local storage
        else{
            //alert('authentication not required')
            // user not in store
            if(!this.userEmail){
                // if already authenticated & has token & email, store user
                if(sessionStorage.authChecked && localStorage.colAuthToken && localStorage.colEmail){
                    store.setUserLS({ token: localStorage.colAuthToken, email: localStorage.colEmail })
                    next()
                }
                else next()
            }
            // user already in store
            else next()
        }
    },
    beforeRouteLeave (to, from, next) {
        if(this.routeDebug) console.warn('\t\tBefore leave')
        //if(this.routeDebug) console.warn('\t\tBefore leave - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
        if(this.wsTimeout) clearTimeout(this.wsTimeout)
        if(this.checkConnTimeout) clearTimeout(this.checkConnTimeout)
        Vue.nextTick(function(){
            next();
        });
    },

// NAV
    data: function(){
        return{
            debug: false,
            isLoading: false,
            sharedState: store.state,

            accountMenu: false,
            checking: false,
            checkConnTimeout: null,
            wsTimeout: null,
        }
    },

// NAV
    watch: {
        $route(to, from){
            if(this.routeDebug) console.warn('\tRoute changed')
            //if(this.routeDebug) console.warn('\tRoute changed - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
            //this.routeChanged();
        },
        '$route.params.formid': {
            immediate: true,
            handler: function(newVal, oldVal) {
                if(newVal !== undefined){
                    if(this.routeDebug) console.warn('\tformid changed - old: ' + oldVal + ' -> new: ' + newVal)
                }
            },
            deep: true,
        },
        userEmail: {
            immediate: false,
            handler: function(newVal, oldVal){
                if(this.debug) console.warn('\tUser email changed')
                if(newVal) this.checkUser();
            },
        }
    },

// NAV
    computed:{
// ADD TO LIVE FOLDER
        routeName: function(){ if(this.$route.hasOwnProperty('name') && this.$route.name) return this.$route.name },
        routeMeta: function(){ if(this.$route.hasOwnProperty('meta') && this.$route.meta) return this.$route.meta },
        routeParams: function(){ if(this.$route.hasOwnProperty('params') && this.$route.params) return this.$route.params },
        routeQuery: function(){ if(this.$route.hasOwnProperty('query') && this.$route.query) return this.$route.query },
        formIDparam: function(){ if(this.routeParams && this.routeParams.hasOwnProperty('formid') && this.routeParams.formid) return this.routeParams.formid },
        deptIDparam: function(){ if(this.routeParams && this.routeParams.hasOwnProperty('deptid') && this.routeParams.deptid) return this.routeParams.deptid },
        routeTitle: function(){
            var title = '?Page Title?'
            if(this.routeMeta && this.routeMeta.hasOwnProperty('title') && this.routeMeta.title) title = this.routeMeta.title
            return title
        },
        storeDebug: function(){ return store.debug },
        routeDebug: function(){ return store.routeDebug },
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        user_LS_Loading: function(){ this.sharedState.user._isLoading.local_storage },
        user_AD_Loading: function(){ this.sharedState.user._isLoading.adAccount },
        userLoading: function(){ return store.getUserIsLoading(); },
        userEmail: function(){ return store.getUserEmail(); },
        username: function(){ return store.getUsername() },
        isDev: function(){ return store.getUserIsDev(); },
        userFirstName: function(){ return store.getUserFirstName(); },
        userLastName: function(){ return store.getUserLastName(); },

        formID: function(){
            if(this.formIDparam) return this.formIDparam
            else return '?'
        },
        deptID: function(){
            if(this.deptIDparam) return this.deptIDparam
            else return '?'
        },
        deptName: function(){
            if(!this.deptIDparam) return 'No Department'
            else{
                // check store for name
                // else return just id
                return 'Department ' + this.deptIDparam
            }
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
        userDisplay: function(){
            if(this.userStatus == -1) return 'Loading...'
            if(this.userStatus == 0 ) return 'Login'
            if(this.userStatus == 1) return 'Unknown'

            if(this.userFirstName) return this.userFirstName;
            if(this.username) return this.username;
            if(this.userEmail) return store.getUserEmailShort();

            return '???'
        },
        userChar: function(){
            if(this.userStatus != -1 && this.userStatus < 2) return '?'
            if(!this.user_AD_isLoading){
                if(this.userFirstName) return this.userFirstName.slice(0,1);
                if(this.username) return this.username.slice(0,1);
                if(this.userEmail) return store.getUserEmailShort().slice(0,1);
            }
            return '.'
        },
        userNameDisplay: function(){
            if(this.userStatus == -1) return 'Loading...'
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
            if(this.userStatus == 1) return 'Emails must be @cityoflewisville.com'
            if(this.userStatus > 1 && this.userEmail) return this.userEmail
            return '???'
        },
        statusColor: function(){
            var color
            switch(this.userStatus){
                case 0:
                    color = 'white'
                    break;
                case 1:
                    color = 'grey lighten-2'
                    break;
                case 2:
                    color = 'accent'
                    break;
                case 3:
                case -1:
                    color = 'primary'
                    break;
            }
            return color
        },
        statusClass: function(){
            return{
                'white--text': (this.userStatus == -1 || this.userStatus > 1) ? true : false,
                'primary--text': (this.userStatus != -1 && this.userStatus < 2) ? true: false
            }
        },
        accountIconOnly: function(){
            if(this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm') return true;
            else return false;
        },
        pageTitle: function(){
            if(this.routeTitle){
                var title = this.routeTitle
                /*var openParam = title.indexOf('{{')
                var closeParam = title.indexOf('}}')
                if(openParam != -1 && closeParam != -1){
                    title = title.replace('')
                }*/
                if(title.includes('{{formID}}')) title = title.replace('{{formID}}', this.formID)
                if(title.includes('{{deptName}}')) title = title.replace('{{deptName}}', this.deptName)
                return title
            }
        },
    },

    // NAV
    created: function(){
        if(this.debug) console.warn('\t\tCreated');
        this.initialize();
    },
    mounted: function(){
        if(this.debug) console.warn('\t\tMounted');
    },
    beforeDestroy: function() { 
        if(this.debug) console.warn("\t\tDestroy");
    },

// NAV
    methods: {
        /*routeChanged: function(){
            if(this.debug) console.error('\tNAV - routeChanged')
            //this.checkUser()
        },*/
        initialize: function(){
            if(this.debug) console.log('\tinitialize - ' + this.routeName + (this.routeParams ? ('\nparams: ' + JSON.stringify(this.routeParams)) : '') + (this.routeMeta ? ('\nmeta: ' +  JSON.stringify(this.routeMeta)) : '') + (this.routeQuery ? ('\nquery: ' + this.routeQuery) : '') );
            this.checkConnection();
            this.checkUser();
        },
        checkConnection: function(){
            var self = this;
            var newVal = navigator.onLine
            if(this.sharedState.connections.isOnLine != newVal) store.setConnections({isOnline: newVal});
            
            if(this.sharedState.connections.unsentReq || this.sharedState.connections.serverDown || this.sharedState.connections.checkServer){
                if(this.debug) console.log('ping server');
                var checktime = moment();
                $.post('https://query.cityoflewisville.com/numberOfSocketConnections',
                function(data){
                    store.setConnectionsOnCheckReturn(checktime);
                    Vue.nextTick(function(){
                        self.checkConnectionTimeout = setTimeout(self.checkConnection, 1000);
                    });
                })
                .fail(function(data){
                    if(this.debug) console.log(data);
                    store.setConnectionsOnCheckFail(data, checktime);
                    Vue.nextTick(function(){
                        self.checkConnectionTimeout = setTimeout(self.checkConnection, 1000);
                    });
                });
            }
            else{
                this.checkConnectionTimeout = setTimeout(self.checkConnection, 1000);
            }
        },
        checkUser: function(){
            //if not loading, email set, and not set (prevents running when user ad account is still loading (userfname will be null))
            if(this.userEmail && !this.sharedState.user.adChecked && !this.checking) this.checkForUserAD()
        },
        // get user first name from COL if it exists
        checkForUserAD: function() {
            if(this.debug) console.log('\tcheckForUserAD')
            var self = this;
            if(this.hasInternet){
                if(this.userEmail && !this.checking){
                    this.checking = true
                    var checktime = moment();
                    if(this.debug) console.log('email: ' + this.userEmail)
                    $.get('http://query.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + this.userEmail,
                    function(data) {
                        var loadDate = moment()
                        store.setUserAD({ adData: data, loadDate: loadDate });
                        this.checking = false
                    })
                    .fail(function(data){
                        var loadDate = moment()
                        if(self.debug) console.error(data)
                        if(self.debug) console.log('clearing AD account?')
                        store.clearUserAD({ loadDate: loadDate, adChecked: false })
                        this.checking = false
                    })
                }
                else{
                    if(!this.userEmail) console.error('No Email')
                    else console.log('Already checking')
                }
            }
            else{
                console.error('OFFLINE');
                if(self.debug) console.log('Retrying - checkForUserAD')
                self.wsTimeout_get = setTimeout(self.checkForUserAD, 1000);
            }
        },
        goBack () {
            window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/')
        },
        autoLogin: function(){
            if(this.userStatus == 0) this.login()
        },
        login: function(){
            this.$router.push({ path: '/login/0', query: { redirect: this.$route.fullPath } })
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
            if(this.routeMeta.requiresAuth){
                if(this.routeName == 'recordsListActions'){
                    this.$router.push({ name: 'recordsList', params:{ formid: this.formIDparam } })
                }
                else{
                    this.$router.push({ name: 'formsList' })
                }
            }
        },
        gotoLogin: function(){
            if(this.routeMeta.requiresAuth){
                var redirectOnFail = 'home'
                if(tthis.routeName == 'recordsListActions') redirectOnFail = 'form/' + this.formIDparam
                this.$router.push({ path: '/account/1', query: { redirect: to.fullPath, failredirect: redirectOnFail } })
            }
            else this.$router.push({ path: '/account/0', query: { redirect: this.$route.fullPath } })
        },
    }
}// NAV



var routes = [
    { path: '/',
    component: MainNav,
    children: [
        { path: 'login/:required',
            name: 'login',
            component: Login,
            meta: {
                title: 'Login',
            }
        },
        { path: 'account/:required',
            name: 'account',
            component: Login,
            meta: {
                title: 'Login',
            }
        },
        { path: 'home',
            name: 'formsList',
            component: List,
            meta: {
                title: 'All Forms',
                fabs: [{type: 'push', isDev: true, name: 'buildForm', tooltip: 'Build Form', color: 'success', icon: 'mdi-toy-brick-plus'},
                        {type: 'push', isDev: true, name: 'valSetsList', tooltip: 'Validation Sets', color: 'primary', icon: 'mdi-beaker'}],
            }
        },
        /*{ path: 'home/dept/:deptid',
            name: 'deptFormsList',
            component: List,
            meta: {
                title: '{{deptName}} Forms',
                fabs: [{type: 'push', isDev: true, name: 'buildForm', tooltip: 'Build Form', color: 'success', icon: 'mdi-toy-brick-plus'},
                        {type: 'push', isDev: true, name: 'valSetsList', tooltip: 'Validation Sets', color: 'primary', icon: 'mdi-beaker'}],
            }
        },*/
        { path: 'build',
            name: 'buildForm',
            component: Build,
            meta: {
                requiresAuth: true,
                title: 'Form Builder',
                fabs: [{type: 'action', action: 'create', tooltip: 'Create Form', color: 'success', icon: 'mdi-database-plus'}],
            },
        },
        { path: 'build/:formid',
            name: 'editForm',
            component: Build,
            meta: {
                requiresAuth: true,
                title: 'Form Builder',
                fabs: [{type: 'action', action: 'save', tooltip: 'Save Form', color: 'success', icon: 'mdi-database-edit'}],
            },
        },
        /*{ path: 'build/validationsets',
            name: 'valSetsList',
            component: List,
            meta: {
                requiresAuth: true,
                title: 'All Validation Sets',
                fabs: [{type: 'push', isDev: true, name: 'buildSet', tooltip: 'Create Set', color: 'success', icon: 'mdi-beaker-plus'}],
            },
        },
        { path: 'build/validationsets/form/:formid',
            name: 'formValSetsList',
            component: List,
            meta: {
                requiresAuth: true,
                title: 'Form {{formID}} Validation Sets',
                fabs: [{type: 'push', isDev: true, name: 'buildSet', tooltip: 'Create Set', color: 'success', icon: 'mdi-beaker-plus'}],
            },
        },
        { path: 'build/valset',
            name: 'buildSet',
            component: BuildVS,
            meta: {
                requiresAuth: true,
                title: 'Validation Set Builder',
                fabs: [{type: 'action', action: 'create', tooltip: 'Create Set', color: 'success', icon: 'mdi-database-plus'}],
            },
        },
        { path: 'build/valset/:vsid',
            name: 'editSet',
            component: BuildVS,
            meta: {
                requiresAuth: true,
                title: 'Validation Set Builder',
                fabs: [{type: 'action', action: 'save', tooltip: 'Save Set', color: 'success', icon: 'mdi-database-edit'}],
            },
        },*/
        { path: 'form/:formid',
            name: 'recordsList',
            component: List,
            meta: {
                title: 'Form {{formID}} Records',
                fabs: [{type: 'link', url: 'http://apps.cityoflewisville.com/psofia_v2/FormEntry/index.html?formID=', color: 'success', icon: 'mdi-plus'}],
                //fabs: [{type: 'push', isDev: true, name: 'newRecord', color: 'success', icon: 'mdi-plus'}],
            },
        },
        { path: 'form/:formid/actions',
            name: 'recordsListActions',
            component: List,
            meta: {
                requiresAuth: true,
                title: 'Form {{formID}} Records',
                fabs: [{type: 'link', url: 'http://apps.cityoflewisville.com/psofia_v2/FormEntry/index.html?formID=', color: 'success', icon: 'mdi-plus'}],
                //fabs: [{type: 'push', isDev: true, name: 'newRecord', color: 'success', icon: 'mdi-plus'}],
            },
        },
        { path: 'form/:formid/*',
            redirect: to => {
                return { name: 'recordsList', params: to.params }
            }
        },
        /*{ path: 'form/:formid/entry',
            name: 'newRecord',
            component: Entry,
            meta: {
                title: 'Form {{formID}} Entry',
                fabs: [{type: 'save', color: 'success', icon: 'mdi-content-save'},
                        {type: 'push', isDev: true, name: 'editForm', tooltip: 'Edit Form', color: 'success', icon: 'mdi-toy-brick-plus'}],
            },
        },
        { path: 'form/:formid/entry/:recordnum',
            name: 'editRecord',
            component: Entry,
            meta: {
                title: 'Form {{formID}} Edit Record',
                fabs: [{type: 'action', action: 'save', color: 'success', icon: 'mdi-content-save'}],
            },
        },
        { path: 'form/:formid/view/:recordnum',
            name: 'viewRecord',
            component: EntryView,
            meta: {
                title: 'Form {{formID}} View Record',
                fabs: [{type: 'push', isDev: true, name: 'recordsList', color: 'primary', icon: 'mdi-plus'}],
            },
        },*/
        { path: '*',
            redirect: 'home'
        },
    ]},
    { path: '*', component: MainNav },
]

var router = new VueRouter({
    //mode: 'history',
    routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    if(store.routeDebug) console.log('beforeEach')
    next()
})

var app = new Vue({
    router,
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#5A348D',
                    secondary: '#9FC24C',
                    accent: '#BD712D',
                },
                dark: {
                    primary: '#5A348D',
                    secondary: '#9FC24C',
                    accent: '#BD712D',
                }
            },
        },
    }),
    
})