"use strict";

const eventHub = new Vue();

var MainNav = {
    template: `
        <v-app-bar app dense dark color="primary">

            <v-tooltip v-if="currPath!='/home'" bottom>
                <template v-slot:activator="{ on }">
                    <span v-on="on">
                        <v-btn to="/home" color="primary">
                            <v-icon>mdi-home</v-icon>
                        </v-btn>
                    </span>
                </template>
                <span>Return to View All Forms</span>
            </v-tooltip>
            <v-divider v-if="currPath!='/home'" class="mx-2" inset vertical></v-divider>
            {{pageTitle}}

            <v-spacer></v-spacer>

            <v-btn icon v-if="!hasInternet">
                <v-icon color="error">mdi-wifi-strength-alert-outline</v-icon>
            </v-btn>

            <v-divider v-if="!hasInternet" inset vertical class="mr-2 ml-4"></v-divider>

            <v-menu v-model="accountMenu" dense bottom right transition="scale-transition" origin="top left">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" :icon="accountIconOnly" :color="!accountIconOnly ? 'primary' : ''">
                        <v-icon v-if="accountStatus==1" :left="!accountIconOnly">mdi-account-circle</v-icon>
                        <v-icon v-if="accountStatus!=1" :left="!accountIconOnly">mdi-account-circle-outline</v-icon>
                        <span v-if="accountStatus==1 && !accountIconOnly">{{userFname}}</span>
                        <span v-if="accountStatus==2 && !accountIconOnly">{{username}}</span>
                    </v-btn>
                </template>
                <v-card>
                    <v-list v-if="accountStatus!=3">
                        <v-list-item>
                            <v-list-item-avatar>
                                <v-avatar color="primary">
                                    <span class="white--text headline">{{statusChar}}</span>
                                </v-avatar>
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{statusText}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                             <v-list-item-content>
                                <v-list-item-subtitle>{{userEmail}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-divider v-if="accountStatus==2"></v-divider>
                    <v-list v-if="accountStatus==2">
                        <v-list-item v-if="accountStatus==2" @click="checkForUserFname">
                            <v-list-item-action>
                                <v-icon>mdi-account-convert</v-icon>
                            </v-list-item-action>
                            <v-list-item-title>Check Email Again</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <v-divider v-if="accountStatus!=3"></v-divider>
                    <v-list>
                        <v-list-item v-if="accountStatus!=3" @click="logout">
                            <v-list-item-action>
                                <v-icon>mdi-logout</v-icon>
                            </v-list-item-action>
                            <v-list-item-title>Change User</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="accountStatus==3" @click="login">
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

            <v-divider inset v-if="isDev" vertical class="mr-2 ml-4"></v-divider>
            <v-btn icon v-if="isDev">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>

            <!--<template v-slot:extension>
                <v-tooltip v-if="currPath!='/home'" bottom>
                    <template v-slot:activator="{ on }">
                        <span v-on="on">
                            <v-btn to="/home">
                                <v-icon>mdi-home</v-icon>
                            </v-btn>
                        </span>
                    </template>
                    <span>Return to View All Forms</span>
                </v-tooltip>
                <v-divider v-if="currPath!='/home'" class="mx-2" inset vertical></v-divider>
                {{pageTitle}}

                <v-spacer></v-spacer>

                <span v-if="accountStatus!=3" class="caption font-weight-light d-none d-sm-flex grey--text">{{userEmail}}</span>
                <v-divider v-if="accountStatus==3 || !hasInternet" inset vertical class="mr-2 ml-4"></v-divider>
                <v-icon v-if="accountStatus==3" small color="error">mdi-account-off</v-icon>
                <v-icon v-if="!hasInternet" small color="error">mdi-wifi-strength-alert-outline</v-icon>
                <v-divider v-if="accountStatus==3 || !hasInternet" inset vertical class="ml-2"></v-divider>
            </template>-->

        </v-app-bar>
    `,

// NAV
    beforeRouteEnter (to, from, next) {
        //console.warn("\t\tNAV - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.debug) console.warn("\t\tNAV - Before update");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.debug) console.error("\t\tNAV - Before leave");
        Vue.nextTick(function(){
            next();
        });
    },

// NAV
    data: function(){
        return{
            isLoading: false,
            sharedState: store.state,
            prevPath: null,
            currPath: null,
            accountMenu: false,
            checkConnectionTimeout: null,
            wsGetTimeout: null,
            debug: false,
        }
    },

// NAV
    created: function(){
        if(this.debug) console.log("\t\t\tNAV - Created");
        this.initialize();
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tNAV - Mounted");
    },

// NAV
    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path){
                    this.prevPath = oldVal.path;
                    this.currPath = newVal.path;
                    this.routeChanged();
                }
            },
            deep: true
        },
        userEmail: function(newVal, oldVal){
            if(newVal && newVal != oldVal){
                if(this.debug) console.log("\tNAV - User email changed")
                this.checkForUserFname();
            }
        },
    },

// NAV
    computed:{
// ADD TO LIVE FOLDER
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userLoading: function(){ return store.getUserIsLoading(); },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },
        username: function(){ return store.getUsername() || store.getUserEmailShort(); },
        userFname: function(){ return store.getUserFirstName(); },
        // 3: no email in local storage, 2: no user found for email, 1: user fully logged in
        accountStatus: function(){
            var stat = 3;
            if(this.userEmail){
                stat--;
            }
            if(this.userFname){
                stat--;
            }
            return stat;
        },
        accountIconOnly: function(){
            if(this.accountStatus == 3 || this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm') return true;
            else return false;
        },
        statusChar: function(){
            var char = '?';
            if(this.accountStatus == 1){
                char = this.userFname.slice(0,1);
            }
            return char;
        },
        statusText: function(){
            var str = 'No account';
            if(this.accountStatus == 2){
                str = 'Unknown employee'
            }
            else if(this.accountStatus == 1){
                str = this.userFname;
            }
            return str;
        },
        pageTitle: function(){
            var str
            if(this.currPath == '/home'){
                str = 'All Forms';
            }
            else if(this.currPath.startsWith('/build')){
                if(this.currPath.startsWith('/build/vs')) str = 'All Validation Sets'
                else if(this.currPath.startsWith('/build/valset')) str = 'Validation Set Builder';
                else str = 'Form Builder';
            }
            else if(this.currPath.startsWith('/form/')){
                if(this.currPath.search('/entry') != -1) str = 'Form Entry'
                else if(this.currPath.search('/view/') != -1) str = 'Form Entry';
                else str = 'Form ' + this.$route.params.formid + ' Records';
            }
            return str;
        },
    },

// NAV
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tNAV - Route Changed")
            //this.showFAB = true;
        },
        initialize: function(){
            if(this.debug) console.log("\tNAV - initialize")
            this.currPath = this.$route.path;
            //this.showFAB = true;

            this.checkConnection();

            if(this.userEmail){
                this.checkForUserFname();
            }
            /*else if(localStorage.colAuthToken) this.getEmail();*/
        },
// ADD TO LIVE FOLDER
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
        // get user first name from COL if it exists
        checkForUserFname: function() {
            var self = this;
            if(this.hasInternet){
                var checktime = moment();
                $.get('http://query.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + this.userEmail, function(data) {
                    store.setUserADAccount(data, checktime);
                    // warning message
                    Vue.nextTick(function(){
                        if(!self.userFname || self.userFname == ''){
                            alert("Could not verify identity. Form may not submit correctly.")
                        }
                    });
                })
                // this happens on application load, and isn't needed since checkServer is true initially
                /*.fail(function(data){
                    console.log(data)
                    store.setConnectionsOnWSFail(data, checktime);
                });*/
            }
            else{
                console.error("OFFLINE - getUserByEmail");
                self.wsGetTimeout = setTimeout(self.checkForUserFname, 1000);
            }
        },
        goBack () {
            window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/')
        },
        login: function(){
            let securityScript = document.createElement('script')
            securityScript.setAttribute('src', 'http://eservices.cityoflewisville.com/COLSecurity/col_security.js')
            document.head.appendChild(securityScript)
        },
        logout: function(){
            localStorage.removeItem('colEmail');
            localStorage.removeItem('colAuthToken');
            this.login();
        },
    }
}// NAV



var Main = {
    template: `
        <div>
            <MainNav></MainNav>
            <v-main>
                <v-container :fluid="($route.name == 'recordsList' || $route.name == 'recordsListActions') ? true : false">
                    <transition>
                        <!--<keep-alive>-->
                            <router-view :key="$route.name"></router-view>
                        <!--</keep-alive>-->
                    </transition>

                    <v-fab-transition v-if="activeFab">
                        <v-btn v-if="activeFab.path"
                            :to="activeFab.path" :key="activeFab.color" :color="activeFab.color"
                            class="v-btn--main-btn" fab large bottom right>
                            <v-icon>{{ activeFab.icon }}</v-icon>
                        </v-btn>
                        <v-btn v-if="!activeFab.path"
                            :href="getFormLink()" target="_blank"
                            :key="activeFab.color" :color="activeFab.color"
                            class="v-btn--main-btn" fab large bottom right>
                            <v-icon>{{ activeFab.icon }}</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-container>
            </v-main>
        </div>
    `,

// MAIN
    components: { MainNav },
    beforeRouteEnter (to, from, next) {
        //console.warn("\t\tMAIN - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.debug) console.warn("\t\tMAIN - Before update");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.debug) console.error("\t\tMAIN - Before leave");
        Vue.nextTick(function(){
            next();
        });
    },

// MAIN
    data: function(){
        return{
            isLoading: false,
            sharedState: store.state,
            prevPath: null,
            currPath: null,
            userFname: '',
            accountMenu: false,
            formID: '',
            showFAB: false,
            fabs: {
                toBuild: {color: 'primary', icon: 'mdi-plus', path: '/build'},
                toListVS: {color: 'primary', icon: 'mdi-plus', path: '/build/vs'},
                toBuildVS: {color: 'primary', icon: 'mdi-plus', path: '/build/valset'},
                save: {color: 'success', icon: 'mdi-content-save'},
                toEntry: {color: 'primary', icon: 'mdi-plus'}, //path: this.currPath + '/entry'
            },
            debug: false,

        }
    },

// MAIN
    watch:{
        // call again the method if the route changes
        
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path){
                    this.prevPath = oldVal.path;
                    this.currPath = newVal.path;
                    this.routeChanged();
                }
            },
            deep: true
        },
    },

// MAIN
    created: function(){
        if(this.debug) console.log("\t\t\tMAIN - Created");
        this.initialize();
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tMAIN - Mounted");
    },

// MAIN
    computed: {
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        isDev: function(){ return store.getUserIsDev(); },
        activeFab: function(){
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
        },
    },

// MAIN
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tMAIN - Route Changed")
            this.formID = this.$route.params.formid
            //this.showFAB = true;
        },
        initialize: function(){
            if(this.debug) console.log("\tMAIN - initialize")
            this.currPath = this.$route.path;
            this.formID = this.$route.params.formid
            //this.showFAB = true;

            /*else if(localStorage.colAuthToken){
                this.getEmail();
            }*/
        },
        getFormLink: function(){
            return 'http://apps.cityoflewisville.com/psofia_v2/FormEntry/index.html?formID=' + this.formID;
        },
    }
}



var List = {
    template: `
        <v-row no-gutters>
            <v-col cols="12" sm="12">
                <v-card :loading="isLoading">
                    <v-toolbar flat>
                        <psofia-webservice-settings :store-name="storeName" :form-id="formID"
                            v-if="!isLoading && storeHasData && storeName=='recordsList'"
                            v-on:refresh-records="getRecords(1)"
                        ></psofia-webservice-settings>

                        <v-toolbar-title>
                            {{pageTitle}}
                            <div class="caption" v-if="!appLoading && pageSubtitle">
                                {{pageSubtitle}}
                                <span v-if="countInactive > 0 && (wsProps.keepInactive || isDev)">
                                    <v-btn text x-small @click="showHideInactive">[{{tableSettings.showInactive ? 'Hide' : 'Show'}}]</v-btn>
                                </span>
                            </div>
                        </v-toolbar-title>

                        <v-spacer></v-spacer>

                        <psofia-table-settings :store-name="storeName" :count-inactive="countInactive"
                            v-if="!appLoading && (isDev || debug)"
                            v-on:save-setting="copyTableSettings_dialog"
                        ></psofia-table-settings>

                    </v-toolbar>
                    <v-card-subtitle v-if="storeName=='formsList' && !appLoading && storeHasData">
                        <v-row dense justify="center">
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field v-model="tableSettings.searchStr"
                                    label="Search Forms" single-line hide-details dense
                                    prepend-icon="mdi-magnify" append-outer-icon="mdi-close" @click:append-outer="tableSettings.searchStr = ''"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-subtitle>

                    <v-banner v-if="hasError">
                        {{errorMsg}}
                    </v-banner>
                    <v-banner v-if="hasWarning" color="accent" dark>
                        <v-avatar slot="icon" color="white" size="40"><v-icon icon="mdi-lock" color="accent">mdi-alert</v-icon></v-avatar>
                        {{warningMsg}}
                        <template v-slot:actions>
                            <v-btn text v-if="newWSRequest">Search Again</v-btn>
                            <v-btn text v-else>Refresh Records</v-btn>
                        </template>
                    </v-banner>

                    <v-data-table v-if="!isLoading && storeHasData"
                        :headers="tableHeaders2"
                        :items="filteredItems"
                        :custom-sort="customSort"
                        :multi-sort="true"
                        :sort-by.sync="tableSettings.tableSort.sortBy"
                        :sort-desc.sync="tableSettings.tableSort.sortDesc"
                        :items-per-page.sync="tableSettings.perPage"
                        :footer-props="{itemsPerPageOptions: tableSettings.perPageOpts}"
                        :loading="storeLoading" loading-text="Loading... Please wait"
                        :fixed-header="true"
                        :hide-default-footer="storeLoading || filteredItems.length == 0"
                        :item-key="storeName=='formsList' ? 'FormID' : 'ID'"
                        class="elevation-1 listDataTable" :class="dataTableClasses"
                    ><!-- :custom-sort="customFilter" :search="tableSettings.searchStr" -->
                        <template v-slot:top v-if="!storeLoading && tableSettings.showDetails">
                            <div>{{tableDetails}}</div>
                        </template>
                        <template v-slot:header="{props:{headers}}" v-if="storeName=='recordsList' && tableParentHeaders.length > 0 && !isSmallScreen">
                            <thead class="v-data-table-header">
                                <tr>
                                    <th v-if="!groupActions && isDev" :colspan="viewURL ? 3 : 2" class="parent-header"></th>
                                    <th v-if="!groupActions && !isDev" :colspan="viewURL ? 2 : 1" class="parent-header"></th>
                                    <th v-if="groupActions" :colspan="1" class="parent-header"></th>
                                    <th v-for="(col, index) in tableParentHeaders" :colspan="col.colspan"
                                        class="text-center v-data-table__divider parent-header">
                                        {{ col.Label }}
                                    </th>
                                </tr>
                            </thead>
                        </template>
                        <template v-slot:body="{items}" v-if="filteredItems.length > 0">
                            <tbody v-if="!storeLoading">
                                <tr v-for="item in items" :key="storeName=='formsList' ? item.FormID : item.RecordNumber" :class="!item.Active.val ? 'red lighten-5' :''">
                                    
                                    <td v-if="!groupActions && storeName=='recordsList' && viewURL" class="text-center px-1">
                                        <v-btn icon small :href="getFullViewURL(item.RecordNumber)" target="_blank">
                                            <v-icon>mdi-view-list</v-icon>
                                        </v-btn>
                                    </td>
                                    <td v-if="!groupActions && storeName=='recordsList'" class="text-center px-1">
                                        <v-btn icon small :href="getOldEntryURL(item.RecordNumber)" target="_blank" color="primary">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </td>
                                    <td v-if="!groupActions && storeName=='recordsList' && isDev" @click.stop="delResID = item.ID"
                                        class="text-center px-1">
                                        <v-btn icon small class="px-1 mx-2" :color="item.Active.val ? 'red darken-4' : 'green darken-2'">
                                            <v-icon v-if="item.Active.val">mdi-delete</v-icon>
                                            <v-icon v-if="!(item.Active.val)">mdi-delete-restore</v-icon>
                                        </v-btn>
                                    </td>
                                    
                                    <td v-if="groupActions && storeName=='recordsList'" class="text-center px-1">
                                        <v-btn icon small v-if="viewURL" :href="getFullViewURL(item.RecordNumber)" target="_blank"
                                            class="px-1 mx-1">
                                            <v-icon>mdi-view-list</v-icon>
                                        </v-btn>
                                        <v-btn icon small :href="getOldEntryURL(item.RecordNumber)" target="_blank"
                                            class="px-1 mx-1" color="primary">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn v-if="showDelete" icon small @click.stop="delResID = item.ID"
                                            class="px-1 mx-2" :color="item.Active.val ? 'red darken-4' : 'green darken-2'">
                                            <v-icon v-if="item.Active.val">mdi-delete</v-icon>
                                            <v-icon v-if="!(item.Active.val)">mdi-delete-restore</v-icon>
                                        </v-btn>
                                    </td>

                                    <td v-for="col in filterTableHeaders" :key="col.ID"
                                        :class="getCellClasses(col, item)">
                                        <template v-if="col.HasTooltip">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <span v-on="on">
                                                        {{getColDisplay(col, item)}}
                                                    </span>
                                                </template>
                                                <div>{{getTooltip(col, item)}}</div>
                                            </v-tooltip>
                                        </template>
                                        <template v-else>
                                            {{getColDisplay(col, item)}}
                                            <v-icon v-if="showColCheck(col, item)">mdi-check</v-icon>
                                        </template>
                                    </td>

                                    <td v-if="!groupActions && storeName=='formsList'" class="text-center px-1">
                                        <v-btn icon small :to="getFormLink(item.FormID, 'view')">
                                            <v-icon>mdi-view-list</v-icon>
                                        </v-btn>
                                    </td>
                                    <td v-if="!groupActions && storeName=='formsList' && showBuild" class="text-center px-1">
                                        <v-btn icon small :to="getFormLink(item.FormID, 'build')" color="primary">
                                            <v-icon>mdi-wrench</v-icon>
                                        </v-btn>
                                    </td>
                                    <td v-if="!groupActions && storeName=='formsList' && isDev" class="text-center px-1">
                                        <v-btn icon small class="px-1 mx-2" :color="item.Active.val ? 'red darken-4' : 'green darken-2'">
                                            <v-icon v-if="item.Active.val">mdi-delete</v-icon>
                                            <v-icon v-if="!(item.Active.val)">mdi-delete-restore</v-icon>
                                        </v-btn>
                                    </td>

                                    <td v-if="groupActions && storeName=='formsList'" class="text-center px-1">
                                        <v-btn icon small :to="getFormLink(item.FormID, 'view')" class="px-1 mx-1">
                                            <v-icon>mdi-view-list</v-icon>
                                        </v-btn>
                                        <v-btn v-if="showBuild" icon small :to="getFormLink(item.FormID, 'build')" class="px-1 mx-1" color="primary">
                                            <v-icon>mdi-wrench</v-icon>
                                        </v-btn>
                                        <v-btn v-if="isDev" icon small class="px-1 mx-2" :color="item.Active.val ? 'red darken-4' : 'green darken-2'">
                                            <v-icon v-if="item.Active.val">mdi-delete</v-icon>
                                            <v-icon v-if="!(item.Active.val)">mdi-delete-restore</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                        <template v-slot:no-data v-if="allItems.length == 0">
                                No Records Available
                        </template>
                        <template v-slot:no-data v-if="filteredItems.length == 0">
                            No {{storeName=='formsList'?'Forms':'Records'}} Found
                        </template>
                    </v-data-table>


                    <!--<v-card-actions v-if="storeHasData">
                        <v-spacer></v-spacer>
                        <v-btn text :href="getOldEntryURL(null)" target="_blank" color="primary">Enter New Record</v-btn>
                    </v-card-actions>-->

                    <psofia-delete-restore :store-name="storeName" :store-id="delResID" v-if="delResID != null"
                        v-on:refresh-records="getRecords(2)" v-on:close-delete-restore="delResID=null"></psofia-delete-restore>

                </v-card>
            </v-col>
        </v-row>
    `,

// LIST
    beforeRouteEnter (to, from, next) {
        //console.warn("\t\tLIST - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        var self = this;
        if(this.debug) console.warn("\t\tLIST - Before update");
        this.isLoading = true;
        // store table settings
        this.saveTableSettings();
        // clear timeouts
        if(this.wsGetTimeout){
            if(this.debug) console.log("\t\tLIST - Need to clear GET timeout");
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        var self = this;
        if(this.debug) console.error("\t\tLIST - Before leave");
        this.isLoading = true;
        // store table settings
        this.saveTableSettings();
        // clear timeouts
        if(this.wsGetTimeout){
            if(this.debug) console.log("\t\tLIST - Need to clear GET timeout");
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },

// LIST
    data: function(){
        return{
            isLoading: true,
            sharedState: store.state,
            
            storeName: null,
            params:{
                formID: null,
                valSetID: null,
                deptID: null,
            },
            formID: null,
            deptID: null,
            valSetID: null,
            
            tableSettings:{
                searchStr: '',
                showInactive: false,
                showDetails: false,
                showIDCol: false,
                actionsPosition: 'right',
                showColFilters: false,
                perPage: -1,
                perPageOpts: [5, 10, 20, 50, -1],
                tableSort: {
                    sortBy: [],
                    sortDesc: [],
                },
            },
            
            delResID: null,

            warningMsg: 'Unknown',
            errorMsg: 'Unknown Error',
            hasWarning: false,
            hasError: false,
            
            wsGetTimeout: null,
            currRouteName: null,
            windowHeight: 0,
            windowWidth: 0,
            isVariableScreen: false,
            debug: false,
        }
    },

// LIST
    created: function(){
        if(this.debug) console.log("\t\t\tLIST - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tLIST - Mounted");
        var self = this;
        this.currRouteName = this.$route.name;
        console.log(this.$route.fullPath)
        var routeParams = this.$route.params;
        if(routeParams.formid) console.log(routeParams)
        this.onResize();
        window.addEventListener('resize', this.onResize, { passive: true })

        if(!this.userLoading){
            Vue.nextTick(function(){
                self.initialize();
            });
        }
    },
    beforeDestroy: function() { 
        if(this.debug) console.log("\t\t\tLIST - Destroy");
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true }); 
        }
        if(this.wsGetTimeout){
            if(this.debug) console.log("\t\tLIST - Need to clear GET timeout");
            clearTimeout(self.wsGetTimeout);
        }
    },

// LIST
    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path && (newVal.name == 'formsList' || newVal.name == 'recordsList' || newVal.name == 'recordsListActions' || newVal.name == 'valSetsList') ){
                    this.currRouteName = newVal.name;
                    this.routeChanged();
                }
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

// LIST
    computed: {
        // ADD TO LIVE FOLDER
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        isSmallScreen: function(){ return (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm'); },
        isMobile: function(){ return (this.windowWidth < 600) && !(this.isVariableScreen); },
        isTablet: function(){ return (this.windowWidth >= 600) && (this.windowWidth < 960) && !(this.isVariableScreen); },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },
        showBuild: function(){ return this.isDev; },
        groupActions: function(){ return this.currRouteName === 'recordsListActions' || this.isSmallScreen},
        showDelete: function(){ return this.currRouteName === 'recordsListActions' && this.userEmail; },

        userLoading: function(){ return store.getUserIsLoading(); },
        stateLoading: function(){ return this.sharedState.isLoading; },
        tableLoading: function(){ return this.sharedState.datatables.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.tableLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.userLoading || this.storeLoading || this.isLoading; },


        routePayload: function(){
            if(this.storeName == 'formsList') return {stateName: 'datatables', storeName: 'formsList'};
            else if (this.storeName =='recordsList') return {stateName: 'datatables', storeName: 'recordsList'};
            else return null;
        },
        storeHasData: function(){
            if(this.routePayload) return store.canShowData(this.routePayload);
            else return false;
        },
        newWSRequest: function(){
            if(this.routePayload) return store.newWebserviceRequest(this.routePayload);
            else return false;
        },
        allForms: function(){
            if(this.storeHasData) return store.getDataObj({stateName: 'datatables', storeName: 'formsList'});
        },
        totalForms: function(){ return (this.allForms) ? this.allForms.length : 0; },
        allRecords: function(){
            if(this.storeHasData) return store.getDataObj({stateName: 'datatables', storeName: 'recordsList'});
        },
        totalRecords: function(){ return (this.allRecords) ? this.allRecords.length : 0; },


        itemsPerPage: function(){ return (this.countFiltered > 100) ? 100 : -1},
        allItems: function(){
            if(this.storeName == 'formsList') return this.allForms;
            else if (this.storeName =='recordsList') return this.allRecords;
            else return null;
        },
        tableItems: function(){
            var self = this;
            if(this.allItems){
                return this.allItems.filter(function(item){
                    if(!(self.tableSettings.showInactive) && !(item.Active.val)) return false;
                    else return true;
                });
            }
            else return [];
        },
        filteredItems: function(){
            var searchStr = this.tableSettings.searchStr;
            //else return (this.storeName == 'formsList') ? this.filteredForms : this.filteredRecords;
            if(!this.storeLoading){
                if(this.tableItems.length > 0){
                    if(this.storeName == 'formsList'){
                        return this.tableItems.filter(function(form){
                            if(searchStr == '') return true;
                            else{
                                if(!isNaN(searchStr)){
                                    if(form.DepartmentID.val && form.DepartmentID.val == searchStr) return true;
                                }

                                if(form.FormName.val && form.FormName.val.search(searchStr.toUpperCase()) != -1) return true;
                                else if(form.Department.val && form.Department.val.search(searchStr.toUpperCase()) != -1) return true;
                                else return false;
                            }
                        });
                    }
                    else if(this.storeName == 'recordsList'){
                        return this.tableItems;
                    }
                }
                else return [];
            }
            else return [];

        },
        countTotal: function(){ return (this.allItems) ? this.allItems.length : 0; },
        countItems: function(){ return (this.tableItems) ? this.tableItems.length : 0; },
        countFiltered: function(){ return (this.filteredItems) ? this.filteredItems.length : 0; },
        countInactive: function(){
            if(this.allItems && this.allItems.length){
                return this.allItems.filter(function(item){ return !(item.Active.val); }).length;
            }
            else return 0;
        },
        //tableHeaders: function(){ return (this.storeName == 'formsList') ? this.filterFormsHeaders : this.filterRecordsHeaders; },
        //tableHeaders2: function(){ return (this.storeName == 'formsList') ? this.formsHeaders2 : this.recordsHeaders2; },
        tableHeaders: function(){
            if(this.storeHasData) return store.getColumns_Headers(this.storeName);  
        },
        filterTableHeaders: function(){
            if(this.tableHeaders) {
                var self = this;
                return this.tableHeaders.filter(function(c){
                    if(c.IsTableID && !(self.tableSettings.showIDCol)) return false;
                    else if(self.isSmallScreen && !c.ShowOnSmall) return false
                    else return true;
                });
            }
        },
        tableHeaders2: function(){
            var self = this;
            var cols = [];
            var actionsWidth = 50;
            if(this.filterTableHeaders) {
                if(this.storeName == 'formsList'){
                    if(this.showBuild) actionsWidth += 50;

                    cols = this.filterTableHeaders.map(function(column){
                        return {
                            text: column.Label,
                            value: self.getCellValue(column),
                            align: self.getCellAlign(column),
                            divider: true,
                            filterable: column.ColumnName == 'CreateDate' ? true : false,
                            sortable: true,
                        }
                    });
                }
                else if (this.storeName =='recordsList'){
                    if(this.isDev) actionsWidth += 50;
                    if(this.viewURL) actionsWidth += 50;

                    cols = this.filterTableHeaders.map(function(column){
                        return {
                            text: self.isSmallScreen && column.ColumnName=='OriginalSubmitDate' ? column.ParentHeader : column.Label,
                            value: self.getCellValue(column),
                            align: self.getCellAlign(column),
                            divider: true,
                            filterable: column.ColumnName == 'OriginalSubmitDate' ? true : false,
                            sortable: true,
                        }
                    });
                    // remove last col divider
                    if(cols.length > 0) cols[(cols.length - 1)].divider = false;
                }


                if(this.groupActions){
                    var actionsCol = { text: 'Actions', align: 'center', divider: false, filterable: false, sortable: false, width: actionsWidth, };

                    if(this.storeName == 'formsList') cols.push(actionsCol);
                    else if(this.storeName =='recordsList'){
                        // add divider
                        actionsCol.divider = true;
                        cols.unshift(actionsCol);
                    }
                }
                else{
                    var viewCol = { text: 'View', align: 'center', divider: false, filterable: false, sortable: false, width: 50, };
                    var editCol = { text: 'Edit', align: 'center', divider: false, filterable: false, sortable: false, width: 50, };
                    var deleteCol = { text: 'Delete', align: 'center', divider: false, filterable: false, sortable: false, width: 50, };

                    if(this.storeName == 'formsList'){
                        cols.push(viewCol);
                        if(this.showBuild) cols.push(editCol);
                        if(this.isDev) cols.push(deleteCol);
                    }
                    else if(this.storeName =='recordsList'){
                        if(this.isDev){
                            // add divider
                            deleteCol.divider = true;
                            cols.unshift(deleteCol);
                        }
                        else editCol.divider = true;
                        cols.unshift(editCol);
                        if(this.viewURL) cols.unshift(viewCol);
                    }
                }
                return cols;
            }
        },
        tableParentHeaders:function(){
            var parentHeaders = [];
            if(this.storeName == 'recordsList' && this.filterTableHeaders && this.filterTableHeaders.length > 0){
                var lastI = -1, lastParentI = -1;
                this.filterTableHeaders.forEach(function(col, index){
                    lastI = index - 1;
                    lastParentI = parentHeaders.length - 1;
                    if(lastParentI < 0){
                        parentHeaders.push({Label: col.ParentHeader, colspan: 1});
                    }
                    else if(col.ParentHeader !== parentHeaders[lastParentI].Label){
                        parentHeaders.push({Label: col.ParentHeader, colspan: 1});
                    }
                    else{
                        parentHeaders[lastParentI].colspan++;
                    }
                });
            }
            return parentHeaders;
        },


        storeTableSettings: function(){ return store.getTableSettings({storeName: this.storeName}); },
        wsProps: function(){ return store.getWSProps({storeName: this.storeName}); },
        perPage: function(){ return this.tableSettings.perPage; },
        defaultPerPage: function(){
            var perPage = -1;
            if(this.isMobile && !this.isVariableScreen) perPage = 5;
            //else if(this.isTablet && != this.isVariableScreen) perPage = 20;
            else if(this.countFiltered > 100) perPage = 50;
            return perPage;
        },
        tableDetails: function(){
            return '[Total: ' + this.countTotal + ', Table: ' + this.countItems + ', Filtered: ' + this.countFiltered + ', Inactive: ' + this.countInactive + ']'
        },


        pageTitle: function(){
            var title = 'Loading...';
            if(!this.isLoading){
                if(this.storeName == 'recordsList'){
                    if(this.storeHasData && this.formData) title = this.formData.FormName.displayVal;
                    else title = 'Form ' + this.formID;
                }
                else if(this.storeName == 'formsList'){
                    title = 'All Forms';
                    if(this.deptID) title += ' - ' + this.deptID;
                }
            }
            return title;
        },
        pageSubtitle: function(){
            var subtitle = null;
            var inactiveStr = '' + this.countInactive + ' Inactive ';
            if(!this.isLoading){
                if(this.formID){
                    subtitle = 'Showing All Records'
                    if(this.wsProps.historicalSearch != null || (this.wsProps.historicalSearchStart != null && this.wsProps.historicalSearchEnd != null)){
                        subtitle = 'Historical Search: ' + subtitle;
                        if(this.wsProps.historicalSearchColumn == 'OriginalSubmitDate') subtitle += ' submitted ';
                        else if(this.wsProps.historicalSearchColumn == 'LastEditDate') subtitle += ' edited ';
                        else{
                            if(this.wsProps.historicalSearch != null) subtitle += ' from ';
                            else subtitle += ' between ';
                        }

                        if(this.wsProps.historicalSearch != null){
                            subtitle += getDateStr(this.wsProps.historicalSearch, 'M/D/YY');
                        }
                        else subtitle += getDateStr(this.wsProps.historicalSearchStart, 'M/D/YY') + ' ~ ' + getDateStr(this.wsProps.historicalSearchEnd, 'M/D/YY');
                    }

                    // if > 50 forms in db or historical search date range too large and all records won't be returned
                    if(this.totalRecords == this.wsProps.count) subtitle = subtitle.replace('All', 'Last ' + this.wsProps.count);

                    if(this.wsProps.onlyInactive) subtitle = subtitle.replace ('Records', 'Deleted Records')
                    if(this.wsProps.keepInactive && (!(this.wsProps.onlyInactive) || this.isDev)) subtitle += '  -  ' + inactiveStr;
                }
                else{
                    if(this.isDev) subtitle = inactiveStr;
                }
            }
            return subtitle;
        },

        formData: function(){
            if(this.storeName=='recordsList' && this.storeHasData) return store.getDataObj({stateName: 'database', storeName: 'formData'});
        },
        viewURL: function(){
            if(this.formData){
                var dbVal = this.formData['ViewFormAddress'].dbVal;
                if(dbVal && dbVal.includes('.com')) return dbVal;
                else return null;
            }
            else return null;
        },

        formFieldsPayload: function(){
            return {storeName: 'formFields', stateName: 'database'}
        },
        formFields: function(){
            if(this.storeName=='recordsList' && this.storeHasData) return store.getDataObj(this.formFieldsPayload);
        },
        primaryDateField: function(){
            if(this.formFields){
                return this.formFields.find(function(field){
                    return field.PrimaryDateField.val == 1;
                });
            }
            else return null;
        },

        dataTableClasses: function(){
            return {
                'recordsDataTable': this.storeName == 'recordsList',
                'formsDataTable': this.storeName == 'formsList',
                'smallDataTable': this.isSmallScreen,
            }
        },
    },

// LIST
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tLIST - Route changed");
            this.isLoading = true;
            this.initialize();
        },
        initialize: function(){
            var self = this;
            this.isLoading = true;
            console.log('init')

            if(this.$route.name == 'formsList' || this.$route.name == 'formsListDept') this.storeName = 'formsList';
            else if(this.$route.name == 'recordsList' || this.$route.name == 'recordsListActions') this.storeName = 'recordsList';

            if(this.$route.params.hasOwnProperty('formid')) this.params.formID = this.$route.params.formid
            if(this.$route.params.hasOwnProperty('deptid')) this.params.deptID = this.$route.params.deptid

            Vue.nextTick(function(){
                self.getTableSettings();
                if(self.storeName == 'formsList'){
                    if(self.totalForms == 0) self.getForms();
                    else self.isLoading = false;
                }
                else if(self.storeName == 'recordsList'){
                    if(self.params.formID){
                        self.getRecords(0);
                    }
                }
            });
        },
        getTableSettings: function(){
            // reset user changed (already saved in store)
           // this.tableSettings.perPageChanged = false;
            if(this.countFiltered){
                if(this.countFiltered > 100){
                    if(this.storeName == 'formsList') this.tableSettings.perPageOpts = [5, 10, 20, 50, -1];
                    else this.tableSettings.perPageOpts = [5, 10, 20, 50, 100];
                }
                else{
                    this.tableSettings.perPageOpts = [-1];
                    if(this.countFiltered > 5){
                        if(this.countFiltered > 10){
                            if(this.countFiltered > 20){
                                if(this.countFiltered > 50) this.tableSettings.perPageOpts.unshift(50);
                                this.tableSettings.perPageOpts.unshift(20);
                            }
                            this.tableSettings.perPageOpts.unshift(10);
                        }
                        this.tableSettings.perPageOpts.unshift(5);
                    }
                }
            }
            else this.tableSettings.perPageOpts = [5, 10, 20, 50, -1];

            this.copyTableSettings();
        },
        copyTableSettings: function(){
            var copyParamSpecific = false;

            // always copy from store
            this.tableSettings.showDetails = this.storeTableSettings.showDetails;
            this.tableSettings.showIDCol = this.storeTableSettings.showIDCol;
            this.tableSettings.showColFilters = this.storeTableSettings.showColFilters;

            // storename specific copy from store
            if(this.storeName == 'formsList') copyParamSpecific = true;
            else if(this.storeName == 'recordsList'){
                if(!this.storeTableSettings.formID || (this.formID && this.formID == this.storeTableSettings.formID)) copyParamSpecific = true;
                if(this.copyParamSpecific && this.debug) console.log('same form, copy all table settings')
            }
            if(copyParamSpecific){
                this.tableSettings.searchStr = this.storeTableSettings.searchStr;
                this.tableSettings.tableSort.sortBy = this.storeTableSettings.sortBy;
                this.tableSettings.tableSort.sortDesc = this.storeTableSettings.sortDesc;
            }
            else{   // reset
                if(this.tableSettings.searchStr) this.tableSettings.searchStr = '';
                if(this.tableSettings.tableSort.sortBy.length > 0) this.tableSettings.tableSort.sortBy = [];
                if(this.tableSettings.tableSort.sortDesc.length > 0) this.tableSettings.tableSort.sortDesc = [];
            }

            // conditional copy from store
            if(this.wsProps.onlyInactive) this.tableSettings.showInactive = true;
            else if(this.wsProps.keepInactive) this.tableSettings.showInactive = this.storeTableSettings.showInactive;
            else this.tableSettings.showInactive = false;

            // conditional copy from store
            if(this.storeTableSettings.perPage){
                if(this.countFiltered > 100){
                    if(this.storeName != 'formsList' && this.storeTableSettings.perPage == -1) this.tableSettings.perPage = 100;
                    else this.tableSettings.perPage = this.storeTableSettings.perPage
                }
                else{
                    if(this.tableSettings.perPageOpts.includes(this.storeTableSettings.perPage)) this.tableSettings.perPage = this.storeTableSettings.perPage;
                    else this.tableSettings.perPage = this.defaultPerPage;
                }
            }
            else this.tableSettings.perPage = this.defaultPerPage;
        },
        copyTableSettings_dialog: function(setting){
            this.tableSettings[setting] = this.storeTableSettings[setting];
        },
        showHideInactive: function(){
            this.tableSettings.showInactive = !this.tableSettings.showInactive;
            this.saveTableSettings();
        },
        saveTableSettings: function(){
            var payload = {};
            var settings;
            var canCheckStore = false;

            // always save if changed
            if(this.tableSettings.showDetails != this.storeTableSettings.showDetails) payload = Object.assign({}, payload, {showDetails: this.tableSettings.showDetails});
            if(this.tableSettings.showIDCol != this.storeTableSettings.showIDCol) payload = Object.assign({}, payload, {showIDCol: this.tableSettings.showIDCol});
            if(this.tableSettings.showColFilters != this.storeTableSettings.showColFilters) payload = Object.assign({}, payload, {showColFilters: this.tableSettings.showColFilters});
            
            // storename specific save if changed
            // storename specific copy from store
            if(this.storeName == 'formsList') canCheckStore = true;
            else if(this.storeName == 'recordsList'){
                if(!this.storeTableSettings.formID || (this.formID && this.formID == this.storeTableSettings.formID)) canCheckStore = true;
            }

            if((canCheckStore && this.tableSettings.searchStr != this.storeTableSettings.searchStr) || this.tableSettings.searchStr) payload = Object.assign({}, payload, {searchStr: this.tableSettings.searchStr});
                // arrays
            if((canCheckStore && !this.arrayEquals(this.tableSettings.tableSort.sortBy, this.storeTableSettings.sortBy)) || this.tableSettings.tableSort.sortBy.length > 0) payload = Object.assign({}, payload, {sortBy: this.tableSettings.tableSort.sortBy});
            if((canCheckStore && !this.arrayEquals(this.tableSettings.tableSort.sortDesc, this.storeTableSettings.sortDesc)) || this.tableSettings.tableSort.sortDesc.length > 0) payload = Object.assign({}, payload, {sortDesc: this.tableSettings.tableSort.sortDesc});

            // conditional save if changed (only for when both active and inactive shown)
            if(!this.wsProps.onlyInactive && this.wsProps.keepInactive && this.tableSettings.showInactive != this.storeTableSettings.showInactive) payload = Object.assign({}, payload, {showInactive: this.tableSettings.showInactive});

            // conditional save if changed (only for not default, 100 instead of -1 for long lists)
            if(this.tableSettings.perPage != this.defaultPerPage && ( !this.storeTableSettings.perPage || this.tableSettings.perPage != this.storeTableSettings.perPage || (this.tableSettings.perPage == 100 && this.storeTableSettings.perPage != -1) )){
                if(this.tableSettings.perPage == 100) payload = Object.assign({}, payload, {perPage: -1});
                else payload = Object.assign({}, payload, {perPage: this.tableSettings.perPage});
            }

            settings = Object.keys(payload);

            if(settings.length > 0){
                if(this.debug) console.log('saveTableSettings: ' + settings)
                payload = Object.assign({}, payload, {storeName: this.storeName});
                if(settings.includes('searchStr') || settings.includes('sortBy') || settings.includes('sortDesc')){
                    if(this.formID) payload = Object.assign({}, payload, {formID: this.formID});
                    if(this.valSetID) payload = Object.assign({}, payload, {valSetID: this.valSetID});
                }
                store.setTableSettings(payload);
            }
        },
        getForms: function(){
            var self = this;
            this.saveTableSettings();

            if(this.hasInternet){
                //this.isLoading = true;
                store.setStoreIsLoading({isLoading: true});
                if(this.params.deptID) store.setWSProps({storeName: this.storeName, formID: this.params.deptID});

                var checktime = moment();
                $.post('https://query.cityoflewisville.com/v2/',{
                    webservice : 'PSOFIAv2/Get All Forms2',
                    keepInactive: this.isDev,
                    deptID: this.params.deptID,
                    username: this.userEmail,
                    userToken: localStorage.colAuthToken,
                    AUTH_TOKEN: localStorage.colAuthToken,
                },
                function(data){
                    var loadDate = moment();
                    store.loadColumns(data.Columns, ['formsList'], loadDate);
                    store.loadDataTable(data.Forms, 'formsList', loadDate);

                    Vue.nextTick(function(){
                        self.getTableSettings();
                        Vue.nextTick(function(){
                            store.setStoreIsLoading({isLoading: false, loadDate: loadDate});
                            self.isLoading = false;
                        });
                    });
                })
                .fail(function(data){
                    store.setConnectionsOnWSFail(data, checktime);
                    console.error ("Webservice Fail: Get All Forms2");
                    console.log(data);

                    Vue.nextTick(function(){
                        if(self.totalForms > 0) store.setStoreIsLoading({isLoading: false});

                        if(!self.hasInternet) self.wsGetTimeout = setTimeout(self.getForms, 1000);
                        else self.wsGetTimeout = setTimeout(self.getForms, 5000);
                    });
                });
            }
            else{
                console.error("OFFLINE - Get All Forms");
                self.wsGetTimeout = setTimeout(self.getForms, 1000);
            }
        },
        getRecords: function(callType){     //callTypes - 0: initial, 1: change ws settings, 2: after delete/restore
            var self = this;
            this.saveTableSettings();
            if(this.hasInternet){
                if(this.params.formID){
                    store.setStoreIsLoading({isLoading: true});
                    var setReturn = store.setWSProps({storeName: this.storeName, formID: this.params.formID});
                    if(setReturn) console.log('ws props set')

                    var checktime = moment();
                    $.post('https://query.cityoflewisville.com/v2/',{
                        webservice : 'PSOFIAv2/Get Form Records2',
                        formID: this.params.formID,
                        count: this.wsProps.count,
                        historicalSearch: this.wsProps.historicalSearch,
                        historicalSearchStart: this.wsProps.historicalSearchStart,
                        historicalSearchEnd: this.wsProps.historicalSearchEnd,
                        historicalSearchColumn: this.wsProps.historicalSearchColumn,
                        keepInactive: this.wsProps.keepInactive,
                        onlyInactive: this.wsProps.onlyInactive,
                        username: this.userEmail,
                        userToken: localStorage.colAuthToken,
                        AUTH_TOKEN: localStorage.colAuthToken,
                    },
                    function(data){
                        var loadDate = moment();
                        if(data.Columns[0].ID == -1){
                            if(callType == 0){
                                if(data.Columns[0].Error) self.errorMsg = 'Form ' + self.params.formID + ' does not exist';
                                else if(data.Columns[0].Warning) self.errorMsg = 'Form ' + self.params.formID + ' cannot be accessed';
                            } else self.errorMsg = 'Unknown Error';
                            self.hasError = true;
                            self.isLoading = false;
                        }
                        else{
                            console.log('returned')
                            self.hasError = false;
                            self.hasWarning = false;
                            self.formID = data.FormData[0].FormID;
                            var copyReturn = store.copyWSPropsToCurrent({storeName: self.storeName});
                            if(copyReturn) console.log('ws props copied')
                            store.loadColumns(data.Columns, ['recordsList', 'formData', 'formFields'], loadDate);
                            store.loadStore(data.FormData, 'formData', loadDate);
                            store.loadDataTable(data.FormRecords, 'recordsList', loadDate);
                            store.loadStore(data.FormFields, 'formFields', loadDate);
                            //store.loadStore(data.FormVSOptions, 'formVsOptions');

                            Vue.nextTick(function(){
                                self.getTableSettings();
                                Vue.nextTick(function(){
                                    //setTimeout(function(){
                                        store.setStoreIsLoading({isLoading: false, loadDate});
                                        self.isLoading = false;
                                    //}, 4000);
                                });
                            });
                            //}
                            //else console.error('idk')
                        }
                    })
                    .fail(function(data){
                        store.setConnectionsOnWSFail(data, checktime);
                        console.error ("Webservice Fail: Get All Records2");
                        if(self.debug) console.log(data);

                        Vue.nextTick(function(){
                            if(self.storeHasData){
                                if(callType == 1) self.warningMsg = 'Records could not be loaded. Records listed below may not fit your search. Please wait a few moments and try again.';
                                else if(callType == 2) self.warningMsg = 'Records could not be refreshed. Records listed below will not reflect your most recent change.';
                                self.hasWarning = true;
                                store.setStoreIsLoading({isLoading: false});
                            }
                            else{
                                if(!self.hasInternet) self.wsGetTimeout = setTimeout(self.getRecords(callType), 1000);
                                else self.wsGetTimeout = setTimeout(self.getRecords(callType), 5000);
                            }
                        });
                    });
                } else console.error('No form provided');
            }
            else{
                console.error('OFFLINE');
                self.wsGetTimeout = setTimeout(self.getRecords(callType), 1000);
            }
        },

        customFilter (value, search, item) {
            //return value != null && search != null && typeof value === 'string'
            if(search === null) return true;
            else{
                if(isNaN(search)){
                    if(item.FormName.val && item.FormName.val.search(search.toUpperCase()) != -1){
                        if(this.debug) console.log('Form Name match');
                        return true;
                    }
                    else if(item.Department.val && item.Department.val.search(search.toUpperCase()) != -1){
                        if(this.debug) console.log('Department match');
                        return true;
                    }
                    else{
                        if(this.debug) console.log('NO MATCH');
                        return false;
                    }
                }
                else{
                    if(this.debug) console.log('search number');
                    if(item.DepartmentID.val && item.DepartmentID.val == search){
                        return true;
                    }
                    else return false;
                }
            }
        },
        customSort: function(items, sortBy, sortDesc){
            var returnVal;
            var self = this;
            items.sort(function(a,b){
                if(sortBy.length > 0){
                    sortBy.some(function(col2, index){
                        var col = col2.replace('.val','');
                        //if(self.debug) console.log(a[col])
                        returnVal = store.compareColVals(a[col], b[col], sortDesc[index] ? 'desc' : 'asc');
                        if(returnVal != 0) return true;
                        else return false;
                    });
                    // forms: Sort by Form Name if not already included in sort
                    if(returnVal == 0 && self.storeName == 'formsList' && sortBy.indexOf('FormName') == -1){
                        return store.compareColVals(a.FormName, b.FormName, 'asc');
                    }
                    // forms; ALWAYS sort by FormID last
                    if(returnVal == 0 && self.storeName == 'formsList') return store.compareColVals(a.FormID, b.FormID, 'asc');
                    if(returnVal == 0 && self.storeName == 'recordsList') return store.compareColVals(a.ID, b.ID, 'asc');
                    return returnVal;
                }
                else{
                    if(self.storeName == 'formsList') return store.compareColVals(a.FormID, b.FormID, 'asc');
                    if(self.storeName == 'recordsList') return store.compareColVals(a.ID, b.ID, 'asc');
                }
            });
            return items;
        },

        getColDisplay: function(col, item){
            var displayStr;
            var userShort, symbolI = -1, datetimeStr = '';

            if(col.IsTableID) displayStr = item[col.ColumnName];
            else if(col.ColumnTypeID == 6) displayStr = ''
            else if(col.ColumnName === 'CreateUser' || col.ColumnName == 'OriginalSubmitUser'|| col.ColumnName === 'LastEditUser'){
                userShort = item[col.ColumnName].displayVal;
                symbolI = userShort.indexOf('@');
                if(symbolI > 0) userShort =  userShort.slice(0, symbolI);
                displayStr = userShort;
            }

            //getDateTimeStr(sqlDate, dateFormat, timeFormat, excludeMidnight); getDateStr(sqlDate, dateFormat)
            // Forms only show create Date
            else if(col.ColumnName === 'CreateDate') displayStr = getDateStr(item[col.ColumnName].val, 'M/D/YY');
            else if(col.ColumnName === 'OriginalSubmitDate'){
                // Records show Date & Time, keep midnights
                if(!this.isSmallScreen){
                    displayStr = getDateTimeStr(item[col.ColumnName].val, 'M/D/YY', 'h:mmA', false, null, null);
                }
                // Records small screen show User - Date & Time, keep midnights, either submitted or last edit (if submitted is null)
                else{
                    if(item[col.ColumnName].val){
                        userShort = item.OriginalSubmitUser.displayVal;
                        datetimeStr = getDateTimeStr(item[col.ColumnName].val, 'M/D/YY', 'h:mmA', false, null, null);
                    }
                    else if(item.LastEditDate.val){
                        userShort = item.LastEditUser.displayVal;
                        datetimeStr = getDateTimeStr(item.LastEditDate.val, 'M/D/YY', 'h:mmA', false, null, null);
                    }
                    symbolI = userShort.indexOf('@');
                    if(symbolI > 0) userShort =  userShort.slice(0, symbolI);
                    if(userShort) displayStr = datetimeStr + ' by ' + userShort;
                    else displayStr = datetimeStr;
                }
            }
            // BOTH Forms & Records, only show last edit Date
            else if(col.ColumnName === 'LastEditDate') displayStr = getDateStr(item[col.ColumnName].val, 'M/D/YY');

            else displayStr = item[col.ColumnName].displayVal;

            return displayStr;
        },
        showColCheck:function(col, item){
            if(col.ColumnTypeID == 6 && item[col.ColumnName].dbVal) return true;
            else return false;
        },
        getTooltip: function(col, item){
            var str = '';
            if(col.ColumnType == 'VALSET') str = 'Value: ' + item[col.ColumnName + '_EntryValue'].displayVal;
            else if(col.ColumnName === 'FormName') str = 'SQL Table Name: ' + item.TableName.displayVal;
            else if(col.ColumnName === 'Department') str = 'Department ID: ' + item.DepartmentID.displayVal;

            //getFullDateStr(sqlDate, dateFormat, timeFormat, excludeMidnight, dayFormat, dayPlacement); getDateTimeStr(sqlDate, dateFormat, timeFormat, excludeMidnight)
            else if(col.ColumnName === 'CreateDate'){
                // Forms: show created User - Full Date & Time, exclude midnight
                if(!this.isSmallScreen){
                    if(item.CreateDate.val) str = item.CreateUser.displayVal + ' - ' + getFullDateStr(item.CreateDate.val, 'default', 'default', true, 'default', 'prepend');
                }
                // Forms small screen: show either created or last edit User - Date & Time (can't nicely show both on two lines)
                else{
                    if(item.CreateDate.val) str = 'Created: ' + item.CreateUser.displayVal + ' - ' + getDateTimeStr(item.CreateDate.val, 'default', 'default', true);
                    else if(item.LastEditDate.val) str = 'Last Edited: ' + item.LastEditUser.displayVal + ' - ' + getDateTimeStr(item.LastEditDate.val, 'default', 'default', true);
                }
            }
            else if(col.ColumnName === 'OriginalSubmitDate'){
                // Records: show submitted Full Date & Time, keep midnigths (user is separate column)
                if(!this.isSmallScreen) str = getFullDateStr(item.OriginalSubmitDate.val, 'default', 'default', false, 'default', 'prepend');
                // Records small screen: show either submitted or last edit User - Date & Time, keep midnights (can't nicely show both on two lines)
                else{
                    if(item.OriginalSubmitDate.val) str += 'Submitted: ' + item.OriginalSubmitUser.displayVal + ' - ' + getDateTimeStr(item.OriginalSubmitDate.val, 'default', 'default', false);
                    else if(item.LastEditDate.val) str += 'Last Edited: ' + item.LastEditUser.displayVal + ' - ' + getDateTimeStr(item.LastEditDate.val, 'default', 'default', false);
                }
            }
            else if(col.ColumnName === 'LastEditDate'){
                // Records: show last edit User - Full Date & Time, keep midnights
                if(this.storeName == 'recordsList') str = item.LastEditUser.displayVal + ' - ' + getFullDateStr(item.LastEditDate.val, 'default', 'default', false, 'default', 'prepend');
                // Forms same, exclude midnights
                else str = item.LastEditUser.displayVal + ' - ' + getFullDateStr(item.LastEditDate.val, 'default', 'default', true, 'default', 'prepend');
            }

            else if(this.storeName == 'recordsList' && col.ColumnName === 'ID') str = 'Record Number: ' + item.RecordNumber;

            else if(col.ColumnName === 'CreateUser') str = item.CreateUser.displayVal;
            else if(col.ColumnName === 'OriginalSubmitUser') str = item.OriginalSubmitUser.displayVal;
            else if(col.ColumnName === 'LastEditUser') str = item.LastEditUser.displayVal;

            return str;
        },

        getCellValue: function(col){
            if(col.IsTableID){
                if(this.storeName == 'recordsList' && col.ColumnName === 'RecordNumber') return 'ID';
                else return col.ColumnName;

            }
            else return col.ColumnName + '.val'
        },
        getCellAlign: function(col){
            if(col.IsTableID) return 'text-right';
            else if(col.ColumnName === 'FormName') return 'text-left';
            else return 'text-center';
        },
        getCellVisibility: function(col){
            if(!col.ShowOnSmall){
                return 'd-none d-md-table-cell';
            }
        },
        getCellClasses: function(col, item){
            var alignClass = this.getCellAlign(col);
            var visClass = this.getCellVisibility(col);
            var allClasses = '';
            if(alignClass && visClass) allClasses =  alignClass + ' ' + visClass;
            else if(alignClass) allClasses = alignClass;
            else if(visClass) allClasses = visClass;
            if(col.ColumnName == 'OriginalSubmitDate' && this.isSmallScreen && !(item.OriginalSubmitDate.val)) allClasses += ' font-italic'
            return allClasses;
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        },

        getFormLink: function(_formID, _route){
            if(_route == 'build') return '/build/' + _formID;
            else return '/form/' + _formID;
        },
        getRecordLink: function(_recordNum, _route){
            if(_route == 'edit') return '/form/' + this.formID + '/entry/' + _recordNum;
            else if(_route == 'view') return '/form/' + this.formID + '/entry/' + _recordNum;
            else return ''
        },
        getFullViewURL: function(_recordNum){
            return 'http://' + this.viewURL + _recordNum;
        },
        getOldEntryURL: function(_recordNum){
            if(_recordNum) return 'http://apps.cityoflewisville.com/psofia_v2/FormEntry/index.html?formID=' + this.formID + '&recordNumber=' + _recordNum;
            else return 'http://apps.cityoflewisville.com/psofia_v2/FormEntry/index.html?formID=' + this.formID
        },


        onResize: function() {
            if(this.windowWidth != 0 && this.windowWidth != window.innerWidth) this.isVariableScreen = true;
            this.windowHeight = window.innerHeight;
            this.windowWidth = window.innerWidth;
        },

        arrayEquals: function (array1, array2) {
            var self = this;
            // if the other array is a falsy value, return
            if ((array1 && !array2) || (!array1 && array2))
                return false;

            // compare lengths - can save a lot of time 
            if (array1.length != array2.length)
                return false;

            for (var i = 0, l=array1.length; i < l; i++) {
                // Check if we have nested arrays
                if (array1[i] instanceof Array && array2[i] instanceof Array) {
                    // recurse into the nested arrays
                    if (!self.arrayEquals(array1[i], array2[i]))
                        return false;       
                }           
                else if (array1[i] != array2[i]) { 
                    // Warning - two different object instances will never be equal: {x:20} != {x:20}
                    return false;   
                }           
            }       
            return true;
        }
    }
}// LIST



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
        console.warn("\t\tBUILD - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        var self = this;
        if(this.debug) console.warn("\t\tBUILD - Before update");
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
        if(this.debug) console.error("\t\tBUILD - Before leave");
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
            isLoading: true,
            isSubmitting: false,
            sharedState: store.state,
            formID: '',
            showInactive: false,
            //changingRoute: false,
            wsGetTimeout: null,
            debug: true,
        }
    },

// BUILD
    created: function(){
        if(this.debug) console.log("\t\t\tBUILD - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tBUILD - Mounted");
        this.initialize();
    },

// BUILD
    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path && (newVal.name == 'buildForm' || newVal.name == 'editForm') ){
                    this.routeChanged();
                }
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

// BUILD
    computed: {
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        isDev: function(){ return store.getUserIsDev(); },

        userLoading: function(){ return store.getUserIsLoading(); },
        stateLoading: function(){ return this.sharedState.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.formLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.userLoading || this.storeLoading || this.isLoading; },

        pageTitle: function(){
            if(this.formID) return 'Edit Form ' + this.formID.toString()
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
            /*if(!(this.formID) || store.formHasChange(['formData'])){//, 'formSections', 'subSections', 'fields','valSets','alldepartments','allSections','allsubSections','allfields','allfieldTypes','allvalSets'])){
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
            if(this.debug) console.log("\t\tBUILD - Route Changed")
            this.isLoading = true;
            this.initialize();
        },
        initialize: function(){
            var self = this;
            this.formID = this.$route.params.formid

            Vue.nextTick(function(){
                if(self.isDev) self.getFormBuilder();
                else self.isLoading = false;
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
                    formID: self.formID,
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
                        if(!(self.formID)){
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



var EntryView = {
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
        console.warn("\t\tENTRY VIEW - Before enter");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        if(this.debug) console.warn("\t\tENTRY VIEW - Before update");
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        if(this.debug) console.error("\t\tENTRY VIEW - Before leave");
        Vue.nextTick(function(){
            next();
        });
    },

// ENTRY VIEW
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
        if(this.debug) console.log("\t\t\tENTRY VIEW - Created");
    },
    mounted: function(){
        if(this.debug) console.log("\t\t\tENTRY VIEW - Mounted");
        this.initialize();
    },


    watch: {
        '$route': {
            handler(newVal, oldVal){
                if(newVal.path.startsWith('/view')) this.routeChanged();
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

// ENTRY VIEW
    computed: {
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return this.sharedState.user.email; },

        userLoading: function(){ return store.getUserIsLoading(); },
        stateLoading: function(){ return this.sharedState.isLoading; },
        databaseLoading: function(){ return this.sharedState.database.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        storeLoading: function(){ return this.stateLoading || this.databaseLoading || this.colsLoading; },
        appLoading: function(){ return this.userLoading || this.storeLoading || this.isLoading; },

        title: function(){
            return 'View Record'
        },
    },

// ENTRY VIEW
    methods: {
        routeChanged: function(){
            if(this.debug) console.log("\t\tENTRY VIEW - Route Changed")
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
}// Entry VIEW



var routes = [
    { path: '/',
    //name: 'nav',
    //component: Nav,
    component: Main,
    children: [
        { path: 'home',
            name: 'formsList',
            component: List,
            /*meta: {
                auth: true,
                title: 'Forms'
            }*/
        },
        /*{ path: 'home/dept/:deptid',
            name: 'formsListDept',
            component: List,
        },
        { path: 'build',
            name: 'buildForm',
            component: Build
        },
        { path: 'build/:formid',
            name: 'editForm',
            component: Build
        },
        { path: 'build/vs',
            name: 'valSetsList',
            component: List
        },
        { path: 'build/valset',
            name: 'buildSet',
            component: BuildVS
        },
        { path: 'build/valset/:vsid',
            name: 'editSet',
            component: BuildVS
        },*/
        { path: 'form/:formid',
            name: 'recordsList',
            component: List
        },
        { path: 'form/:formid/actions',
            name: 'recordsListActions',
            component: List
        },
        /*{ path: 'form/:formid/entry',
            name: 'newRecord',
            component: Entry
        },
        { path: 'form/:formid/entry/:recordnum',
            name: 'editRecord',
            component: Entry
        },
        { path: 'form/:formid/view/:recordnum',
            name: 'viewRecord',
            component: EntryView
        },*/
        { path: '*',
            redirect: 'home'
        },
    ]},
    { path: '*', component: Main },
]

var router = new VueRouter({
    //mode: 'history',
    routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    // get email from COL if auth token in local storage
    if(!store.state.user.email){
        if(localStorage.colAuthToken && localStorage.colEmail){
            store.setUser({token: localStorage.colAuthToken, email: localStorage.colEmail});
            next();
        }
        else if(localStorage.colAuthToken){
            console.log('Get email from token')
            store.setUser({token: localStorage.colAuthToken});
            if(store.state.connections.isOnLine && !store.state.connections.unsentReq){
                var checktime = moment();
                $.post('https://query.cityoflewisville.com/v2/',{
                    webservice: 'ITS/Verify Auth Token',
                    AUTH_TOKEN: localStorage.colAuthToken,
                },
                function(data){
                    if(data.Verification[0].VERIFIED){
                        store.setUser({email: data.Verification[0].EMAIL});
                        localStorage.colEmail = data['Verification'][0]['EMAIL'];
                    }
                    else{
                        store.setUser({token: null, email: null});
                        localStorage.removeItem('colEmail');
                        localStorage.removeItem('colAuthToken');
                    }
                    next();
                })
                .fail(function(data){
                    console.error("Webservice Fail: Verify Auth Token");
                    store.setUser({email: null});
                    next();
                });
            }
            else{
                console.error('OFFLINE');
            }
        }
        else next();
    }
    else next();
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




/* GENERAL *

    //scroll-target=".v-data-table__wrapper"

/*
    beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    },
    beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
    },
    beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
    }
*/


/* NAV */
        // get username from COL if it exists
        /*getEmail: function() {
            if(this.debug) console.log("getEmail")
            var self = this;
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice: 'ITS/Verify Auth Token',
                AUTH_TOKEN: localStorage.colAuthToken,
            },
            function(data){
                if(data.Verification[0].VERIFIED){
                    store.setUserEmail(data.Verification[0].EMAIL);
                    self.checkForUsername();
                }
                else{

                }
            })
            .fail(function(data){
                console.error("Webservice Fail: Verify Auth Token");
                self.isLoading = false;
            });
        },*/

/*          if(this.currPath == '/home'){
                str = 'All Forms';
            }
            else if(this.currPath.startsWith('/build')){
                if(this.currPath == '/build' || this.currPath == '/build/') str = 'Create New Form'
                else if(this.currPath.startsWith('/build/vs')) str = 'All Validation Sets'
                else if(this.currPath == '/build/valset' || this.currPath == '/build/valset/') str = 'Create New Validation Set'
                else if(this.currPath.startsWith('/build/valset/')) str = 'Edit Validation Set ' + this.$route.params.vsid;
                else str = 'Edit Form ' + this.$route.params.formid;
            }
            else if(this.currPath.startsWith('/form/')){
                if(this.currPath.search('/entry') != -1){
                    if(this.currPath.endsWith('/entry') || this.currPath.endsWith('/entry/')) str = 'Submit New Record (Form ' + this.$route.params.formid  + ')';
                    else str = 'Edit Record (Form ' + this.$route.params.formid  + ')';
                }
                else if(this.currPath.search('/view/') != -1) str = 'View Record (Form ' + this.$route.params.formid  + ')';
                // New
                else if(this.currPath.endsWith('/entry')){
                    str = 'Submit New Record (Form ' + this.$route.params.formid  + ')';
                }
                //All Records
                else{
                    str = 'Form ' + this.$route.params.formid + ' Entries';
                }
            }*/

/* LIST */
/*              <v-btn @click="showSearch = true">
                            <v-icon dark left>mdi-magnify</v-icon>
                            Search Forms
                        </v-btn>
                    </v-card-actions>
                </v-card>


                formsList:{
                    searchStr: '',
                    showDialog: false,
                    showInactive: false,
                    showColFilters: false,
                    perPage: -1,
                    perPageUser: false,
                    perPageOpts: [5, 10, 20, 50, -1],
                    tableSort: {
                        sortBy: [],
                        sortDesc: [],
                    },
                },
                recordsList:{
                    searchStr: '',
                    showDialog: false,
                    showInactive: false,
                    showColFilters: false,
                    perPage: -1,
                    perPageUser: false,
                    perPageOpts: [5, 10, 20, -1],
                    tableSort: {
                        sortBy: [],
                        sortDesc: [],
                    },
                },


        forms: function(){
            var self = this;
            if(this.allForms){
                return this.allForms.filter(function(form){
                    if(!(self.tableSettings.showInactive) && !(form.Active.val)) return false;
                    else return true;
                });
            }
            else return [];
        },
        filteredForms: function(){
            var self = this;
            var searchStr = this.tableSettings.searchStr;
            if(this.forms.length > 0){
                return this.forms.filter(function(form){
                    if(searchStr == '') return true;
                    else{
                        if(!isNaN(searchStr)){
                            if(form.DepartmentID.val && form.DepartmentID.val == searchStr) return true;
                        }

                        if(form.FormName.val && form.FormName.val.search(searchStr.toUpperCase()) != -1) return true;
                        else if(form.Department.val && form.Department.val.search(searchStr.toUpperCase()) != -1) return true;
                        else return false;
                    }
                });
            }
            else return [];
        },
        countForms: function(){ return (this.forms) ? this.forms.length : 0; },
        countFilteredForms: function(){ return (this.filteredForms) ? this.filteredForms.length : 0; },
        countInactiveForms: function(){
            if(this.allForms && this.allForms.length){
                return this.allForms.filter(function(form){ return !(form.Active.val); }).length;
            }
            else return 0;
        },
        //formsPerPage: function(){ return this.tableSettings.perPage; },
        formsHeaders: function(){
            if(this.allForms) return store.getColumns_Headers('formsList');  
        },
        filterFormsHeaders: function(){
            if(this.formsHeaders) {
                var self = this;
                return this.formsHeaders.filter(function(c){
                    if(c.IsTableID && !(self.tableSettings.showIDCol)) return false;
                    else if(self.isSmallScreen && !c.ShowOnSmall) return false
                    else return true;
                });
            }
        },
        formsHeaders2: function(){
            if(this.filterFormsHeaders) {
                var self = this;
                var cols = [];
                cols = this.filterFormsHeaders.map(function(column){
                    return {
                        text: column.Label,
                        value: self.getCellValue(column),
                        align: self.getCellAlign(column),
                        divider: true,
                        filterable: column.ColumnName == 'CreateDate' ? true : false,
                        sortable: true,
                    }
                });
                if(this.groupActions){
                    cols.push({
                        text: 'Actions',
                        align: 'center',
                        filterable: false,
                        sortable: false,
                        width: this.isDev ? 150 : 100,
                    })
                }
                else{
                    cols.push({
                        text: 'View',
                        align: 'center',
                        filterable: false,
                        sortable: false,
                        width: 50,
                    });
                    if(this.showBuild){
                        cols.push({
                            text: 'Edit',
                            align: 'center',
                            filterable: false,
                            sortable: false,
                            width: 50,
                        });
                    } 
                    if(this.isDev){
                        cols.push({
                            text: 'Delete',
                            align: 'center',
                            filterable: false,
                            sortable: false,
                            width: 50,
                        });
                    } 
                }
                return cols;
            }
        },
        
        allRecords: function(){
            return store.getDataObj({storeName: 'recordsList', stateName: 'datatables'});
        },
        records: function(){
            var self = this;
            if(this.allRecords){
                return this.allRecords.filter(function(record){
                    if(!(self.tableSettings.showInactive) && !(record.Active.val)) return false;
                    else return true;
                });
            }
            else return [];
        },
        filteredRecords: function(){
            var self = this;
            var searchStr = this.tableSettings.searchStr;
            if(this.records.length > 0){
                return this.records.filter(function(form){
                    if(searchStr == '') return true;
                    else return true;
                });
            }
            else return [];
        },
        /*countRecords: function(){ return (this.records) ? this.records.length : 0; },
        countFilteredRecords: function(){ return (this.filteredRecords) ? this.filteredRecords.length : 0; },
        countInactiveRecords: function(){
            if(this.allRecords && this.allRecords.length){
                return this.allRecords.filter(function(record){
                    return !(record.Active.val);
                }).length;
            }
            else return 0;
        },*
        //recordsPerPage: function(){ return this.tableSettings.perPage; },
        recordsDefaultPerPage: function(){
            var perPage = -1;
            if(this.isMobile) perPage = 5;
            //else if(this.isTablet) perPage = 15;
            else if(this.countFiltered > 100) perPage = 50;
            else perPage = -1;
            return perPage;
        },
        recordsHeaders: function(){
            if(this.records) return store.getColumns_Headers('recordsList');  
        },
        filterRecordsHeaders: function(){
            if(this.recordsHeaders) {
                var self = this;
                return this.recordsHeaders.filter(function(c){
                    if(c.IsTableID && !(self.tableSettings.showIDCol)) return false;
                    else if(self.isSmallScreen && !c.ShowOnSmall) return false
                    else return true;
                });
            }
        },
        recordsHeaders2: function(){
            if(this.filterRecordsHeaders) {
                var self = this;
                var cols = []
// ADD TO LIVE FOLDER
                var actionsWidth = 50
                if(this.showDelete) actionsWidth += 50;
                if(this.viewURL) actionsWidth += 50;
                cols = this.filterRecordsHeaders.map(function(column){
                    return {
                        text: self.isSmallScreen && column.ColumnName=='OriginalSubmitDate' ? column.ParentHeader : column.Label,
                        value: self.getCellValue(column),
                        align: self.getCellAlign(column),
                        divider: column.ColumnName == 'LastEditDate' ? false : true,
                        filterable: column.ColumnName == 'OriginalSubmitDate' ? true : false,
                        sortable: true,
                    }
                });
                if(this.groupActions){
                    cols.unshift({
                        text: 'Actions',
                        align: 'center',
                        divider: true,
                        filterable: false,
                        sortable: false,
                        width: actionsWidth,
                    })
                }
                else{
                    cols.unshift({
                        text: 'Edit',
                        align: 'center',
                        divider: true,
                        filterable: false,
                        sortable: false,
                        width: 50,
                    })
                    if(this.viewURL){
                        cols.unshift({
                            text: 'View',
                            align: 'center',
                            filterable: false,
                            sortable: false,
                            width: 50,
                        })
                    }
                }
                return cols;
            }
        },
        recordsParentHeaders:function(){
            var parentHeaders = [];
            if(this.filterRecordsHeaders && this.filterRecordsHeaders.length > 0){
                var lastI = -1, lastParentI = -1;
                this.filterRecordsHeaders.forEach(function(col, index){
                    lastI = index - 1;
                    lastParentI = parentHeaders.length - 1;
                    if(lastParentI < 0){
                        parentHeaders.push({Label: col.ParentHeader, colspan: 1});
                    }
                    else if(col.ParentHeader !== parentHeaders[lastParentI].Label){
                        parentHeaders.push({Label: col.ParentHeader, colspan: 1});
                    }
                    else{
                        parentHeaders[lastParentI].colspan++;
                    }
                });
            }
            return parentHeaders;
        },
        



                        if(self.allForms.length){
                            if(!(self.tableSettings.showInactive)){
                                self.forms = clone(
                                    self.allForms.filter(function(form){
                                        if(form.hasOwnProperty('Active')){
                                            if(!(form.Active.val)) return false;
                                        }
                                        return true;
                                    })
                                )
                            }
                            else{
                                self.forms = clone(self.allForms)
                            }
                        }

                        if(!(self.tableSettings.showInactive) && self.records.length){
                            if(self.debug) console.log('filter inactive')
                            self.records = clone(
                                self.allRecords.filter(function(record){
                                    if(record.hasOwnProperty('Active')){
                                        if(typeof(record.Active) === "object" && !(record.Active.val)) return false;
                                        if(typeof(record.Active) !== "object" && !(record.Active)) return false;
                                    }
                                    if(record.hasOwnProperty('isActive')){
                                        if(typeof(record.isActive) === "object" && !(record.isActive.val)) return false;
                                        if(typeof(record.isActive) !== "object" && !(record.isActive)) return false;
                                    }
                                    return true;
                                })
                            )
                        }
                        else self.records = clone(self.allRecords)
*/


/* BUILD */

                /* <!--<v-col cols="12" sm="12" style="height:80px">
                    <v-fab-transition>
                        <v-btn v-if="!isSubmitting" v-on:click="submitForm()" :key="changingRoute"
                        fab large bottom right class="v-btn--main-btn" color="green">
                              <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </v-col>--> */
                /*<v-row>
                    <v-col xs12 sm6>
                        <h4 class="display-1">{{title}}</h4><v-progress-circular indeterminate v-if="appLoading" color="primary"></v-progress-circular>
                        <span class="subheading" v-if="formID && createDate && createDate.val">
                            <v-tooltip bottom>
                                <span slot="activator">Created: {{createDate.displayVal}}</span>
                                <span v-html="getTooltip('CreateDate')"></span>
                            </v-tooltip>
                        </span>
                        <span class="subheading" v-if="formID && editDate && editDate.val">
                            <v-tooltip bottom>
                                <span slot="activator">Last Edited: {{editDate.displayVal}}</span>
                                <span v-html="getTooltip('LastEditDate')"></span>
                            </v-tooltip>
                        </span>
                    </v-col>
                    <v-col xs12 sm6 class="text-lg-right">
                        <span class="subheading">{{status}}</span>
                        <v-btn to="/">Return to View All</v-btn>
                    </v-col>
                </v-row>*/
                /*<div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                        <v-card-title>
                            {{pageTitle}}
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
                </div>*/


