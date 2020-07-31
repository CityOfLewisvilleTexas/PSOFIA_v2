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
        if(store.routeDebug) console.warn('\t\tBefore enter');
        //if(store.routeDebug) console.warn('\t\tBefore enter - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') );
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteUpdate (to, from, next) {
        var self = this;
        if(this.routeDebug) console.warn('\t\tBefore update');
        //if(this.routeDebug) console.warn('\t\tBefore update - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') );
        this.isLoading = true;
        // store table settings
        this.saveTableSettings();
        // clear timeouts
        if(this.wsGetTimeout){
            if(this.debug) console.warn('Need to clear GET timeout');
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },
    beforeRouteLeave (to, from, next) {
        var self = this;
        if(this.routeDebug) console.warn('\t\tBefore leave');
        //if(this.routeDebug) console.warn('\t\tBefore leave - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') );
        this.isLoading = true;
        // store table settings
        this.saveTableSettings();
        // clear timeouts
        if(this.wsGetTimeout){
            if(this.debug) console.warn('Need to clear GET timeout');
            clearTimeout(self.wsGetTimeout);
        }
        Vue.nextTick(function(){
            next();
        });
    },

// LIST
    data: function(){
        return{
            debug: false,
            isLoading: true,
            sharedState: store.state,
            
            /*storeName: null,
            params:{
                formID: null,
                valSetID: null,
                deptID: null,
            },*/
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
            isRetrying: false,
            
            wsGetTimeout: null,
            windowHeight: 0,
            windowWidth: 0,
            isVariableScreen: false,
        }
    },

// LIST
    watch: {
        '$route': {
            handler: function(to, from){
                if(this.routeDebug) console.warn ('\tRoute changed');
                //if(this.routeDebug) console.warn('\tRoute changed - ' + to.matched.length + ' matched; name: ' + to.name + '; path: ' + to.path + (to.params ? ('\nparams: ' + JSON.stringify(to.params)) : '') + (to.meta ? ('\nmeta: ' + JSON.stringify(to.meta)) : '') + (to.query ? ('\nquery: ' + JSON.stringify(to.query)) : '') );
                this.routeChanged();
            },
            deep: true,
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

        /*'$route': {
            handler(newVal, oldVal){
                if(newVal.path != oldVal.path && (newVal.name == 'formsList' || newVal.name == 'recordsList' || newVal.name == 'recordsListActions' || newVal.name == 'valSetsList') ){
                    if(this.routeDebug) console.warn('\tRoute changed - OTHER')
                    //this.routeName = newVal.name;
                    //this.routeChanged();
                }
            },
            deep: true,
        },*/
        userLoading: function(newVal, oldVal){
            if(this.debug) console.warn('\tUser Loading changed')
            if(newVal === false){
                if(this.debug) console.warn('\tUser Loading false')
                this.initialize();
            }
        },
        userEmail: function(newVal, oldVal){
            if(this.debug) console.warn('\tUser Email changed')
            this.initialize();
        },
    },

// LIST
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
        storeName: function(){
            if(this.routeName){
                if(this.routeName == 'formsList' || this.routeName == 'deptFormsList') return 'formsList';
                else if(this.routeName == 'recordsList' || this.routeName == 'recordsListActions') return 'recordsList';
            }
        },
        storeDebug: function(){ return store.debug },
        routeDebug: function(){ return store.routeDebug },
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return store.getUserEmail(); },
        isDev: function(){ return store.getUserIsDev(); },

        isSmallScreen: function(){ return (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm'); },
        isMobile: function(){ return (this.windowWidth < 600) && !(this.isVariableScreen); },
        isTablet: function(){ return (this.windowWidth >= 600) && (this.windowWidth < 960) && !(this.isVariableScreen); },
        showBuild: function(){ return this.isDev; },
        groupActions: function(){ return this.routeName === 'recordsListActions' || this.isSmallScreen},
        showDelete: function(){ return this.routeName === 'recordsListActions' && this.userEmail; },

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
                    else if(this.formID) title = 'Form ' + this.formID;
                    else if(this.formIDparam) title = 'Form ' + this.formIDparam
                    else 'UNKNOWN'
                }
                else if(this.storeName == 'formsList'){
                    title = 'All Forms';
                    if(this.deptID) title += ' - ' + this.deptID;
                    else if(this.deptIDparam) title += ' - ' + this.deptIDparam;
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
    created: function(){
        if(this.debug) console.warn('\t\tCreated');
    },
    mounted: function(){
        if(this.debug) console.warn('\t\tMounted');
        var self = this;

        this.onResize();
        window.addEventListener('resize', this.onResize, { passive: true })

        if(!this.userLoading){
            Vue.nextTick(function(){
                self.initialize();
            });
        }
        else if(this.debug) console.warn('User loading, will init on user email change')
    },
    beforeDestroy: function() { 
        if(this.debug) console.warn('\t\tDestroy');
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true }); 
        }
        // clear timeout
        if(this.wsGetTimeout){
            if(this.debug) console.warn('need to clear GET timeout');
            clearTimeout(self.wsGetTimeout);
        }
    },

// LIST
    methods: {
        routeChanged: function(){
            if(this.debug) console.log('\trouteChanged');
            this.initialize();
        },
        initialize: function(){
            var self = this;
            this.isLoading = true;

            Vue.nextTick(function(){
                self.getTableSettings();
                if(self.debug) console.log('\tLIST - initialize nextTick - ' + self.routeName + (self.routeParams ? ('\nparams: ' + JSON.stringify(self.routeParams)) : ''));
                if(self.storeName == 'formsList'){
                    if(self.totalForms == 0) self.getForms();
                    else self.isLoading = false;
                }
                else if(self.storeName == 'recordsList'){
                    self.getRecords(0);
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
            if(this.debug) console.log('\tgetForms')
            var self = this;
            this.saveTableSettings();

            if(this.hasInternet){
                //this.isLoading = true;
                store.setStoreIsLoading({isLoading: true});
                if(this.deptIDparam) store.setWSProps({storeName: this.storeName, formID: this.deptIDparam});
                var checktime = moment();
                $.post('https://query.cityoflewisville.com/v2/',{
                    webservice : 'PSOFIAv2/Get All Forms2',
                    keepInactive: this.isDev,
                    deptID: this.deptIDparam,
                    username: this.userEmail,
                    userToken: localStorage.colAuthToken,
                    AUTH_TOKEN: localStorage.colAuthToken,
                },
                function(data){
                    var loadDate = moment();
                    // no specific error return?
                    self.isRetrying = false;
                    self.hasError = false;
                    self.hasWarning = false;
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
                    var loadDate = moment();
                    store.setConnectionsOnWSFail(data, checktime);
                    console.error ("Webservice Fail: Get All Forms2");
                    if(self.debug) console.log(data);

                    Vue.nextTick(function(){
                        // Forms already previously loaded, don't need to retry
                        if(self.totalForms > 0){
                            if(self.debug) console.log('Forms already previously loaded, can show');
                            self.isRetrying = false;
                            self.hasError = false;
                            self.warningMsg = 'Forms could not be reloaded. Forms listed below may not be up to date.';
                            self.hasWarning = true;
                            Vue.nextTick(function(){
                                store.setStoreIsLoading({isLoading: false, loadDate: loadDate});
                                self.isLoading = false;
                            })
                        }
                        else{
                            if(self.debug) console.log('Retrying - getForms');
                            self.isRetrying = true;
                            if(!self.hasInternet) self.wsGetTimeout = setTimeout(self.getForms, 1000);
                            else self.wsGetTimeout = setTimeout(self.getForms, 5000);
                        }
                    });
                });
            }
            else{
                console.error('OFFLINE');
                if(self.totalForms > 0){
                    if(self.debug) console.log('Forms already previously loaded, can show');
                    self.isRetrying = false;
                    self.hasError = false;
                    self.warningMsg = 'Forms could not be reloaded. Forms listed below may not be up to date.';
                    self.hasWarning = true;
                    Vue.nextTick(function(){
                        //store.setStoreIsLoading({isLoading: false, loadDate: loadDate});
                        self.isLoading = false;
                    })
                }
                else{
                    if(self.debug) console.log('Retrying - getForms');
                    self.isRetrying = true;
                    self.wsGetTimeout = setTimeout(self.getForms, 1000);
                }
            }
        },
        getRecords: function(callType){     //callTypes - 0: initial, 1: change ws settings, 2: after delete/restore
            if(this.debug) console.log('\tgetRecords')
            var self = this;
            this.saveTableSettings();
            if(this.hasInternet){
                if(this.formIDparam){
                    store.setStoreIsLoading({isLoading: true});
                    var setReturn = store.setWSProps({storeName: this.storeName, formID: this.formIDparam});
                    if(setReturn && this.debug) console.log('ws props set')

                    var checktime = moment();
                    $.post('https://query.cityoflewisville.com/v2/',{
                        webservice : 'PSOFIAv2/Get Form Records2',
                        formID: this.formIDparam,
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
                        // returned with error or warning
                        if(data.Columns[0].ID == -1){
                            self.isRetrying = false;
                            self.hasWarning = false;
                            if(callType == 0){
                                if(data.Columns[0].Error) self.errorMsg = 'Form ' + self.formIDparam + ' does not exist';
                                else if(data.Columns[0].Warning) self.errorMsg = 'Form ' + self.formIDparam + ' cannot be accessed';
                            } else self.errorMsg = 'Unknown Error';
                            self.hasError = true;
                            self.isLoading = false;
                        }
                        // returned with data
                        else{
                            self.isRetrying = false;
                            self.hasError = false;
                            self.hasWarning = false;
                            self.formID = data.FormData[0].FormID;
                            var copyReturn = store.copyWSPropsToCurrent({storeName: self.storeName});
                            if(self.debug && copyReturn) console.log('ws props copied')
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
                        }
                    })
                    .fail(function(data){
                        var loadDate = moment();
                        store.setConnectionsOnWSFail(data, checktime);
                        console.error ('Webservice Fail: Get All Records2');
                        if(self.debug) console.log(data);

                        Vue.nextTick(function(){
                            // Same Form Records alreayd previously loaded, don't need to retry
                            if(self.storeHasData){
                                if(self.debug) console.log('Same Form Records already previously loaded, can show');
                                self.isRetrying = false;
                                self.hasError = false;
                                if(callType == 0) self.warningMsg = 'Records could not be reloaded. Records listed below may not be up to date.';
                                else if(callType == 1) self.warningMsg = 'Records could not be loaded. Records listed below may not fit your search. Please wait a few moments and try again.';
                                else if(callType == 2) self.warningMsg = 'Records could not be refreshed. Records listed below will not reflect your most recent change.';
                                self.hasWarning = true;
                                Vue.nextTick(function(){
                                    store.setStoreIsLoading({isLoading: false, loadDate});
                                    self.isLoading = false;
                                });
                            }
                            else{
                                if(self.debug) console.log('Retrying - getRecords');
                                self.isRetrying = true;
                                if(!self.hasInternet) self.wsGetTimeout = setTimeout(self.getRecords(callType), 1000);
                                else self.wsGetTimeout = setTimeout(self.getRecords(callType), 5000);
                            }
                        });
                    });
                }
                else{
                    if(self.debug) console.error('No form provided');
                    if(self.storeHasData){
                        if(self.debug) console.log('Same Form Records already previously loaded, can show');
                        self.isRetrying = false;
                        self.hasError = false;
                        if(callType == 0) self.warningMsg = 'Records could not be reloaded. Records listed below may not be up to date.';
                        else if(callType == 1) self.warningMsg = 'Records could not be loaded. Records listed below may not fit your search. Please wait a few moments and try again.';
                        else if(callType == 2) self.warningMsg = 'Records could not be refreshed. Records listed below will not reflect your most recent change.';
                        self.hasWarning = true;
                        Vue.nextTick(function(){
                            //store.setStoreIsLoading({isLoading: false, loadDate});
                            self.isLoading = false;
                        });
                    }
                    else{
                        self.isRetrying = false;
                        self.hasWarning = false;
                        self.errorMsg = 'Unknown Form';
                        self.hasError = true;
                        Vue.nextTick(function(){
                            //store.setStoreIsLoading({isLoading: false, loadDate});
                            self.isLoading = false;
                        });
                    }
                }
            }
            else{
                console.error('OFFLINE');
                if(self.storeHasData){
                    if(self.debug) console.log('Same Form Records already previously loaded, can show');
                    self.isRetrying = false;
                    self.hasError = false;
                    if(callType == 0) self.warningMsg = 'Records could not be reloaded. Records listed below may not be up to date.';
                    else if(callType == 1) self.warningMsg = 'Records could not be loaded. Records listed below may not fit your search. Please wait a few moments and try again.';
                    else if(callType == 2) self.warningMsg = 'Records could not be refreshed. Records listed below will not reflect your most recent change.';
                    self.hasWarning = true;
                    Vue.nextTick(function(){
                        //store.setStoreIsLoading({isLoading: false, loadDate});
                        self.isLoading = false;
                    });
                }
                else{
                    if(self.debug) console.log('Retrying - getRecords');
                    self.isRetrying = true;
                    self.wsGetTimeout = setTimeout(self.getRecords(callType), 1000);
                }
            }
        },

        customFilter (value, search, item) {
            //return value != null && search != null && typeof value === 'string'
            if(search === null) return true;
            else{
                if(isNaN(search)){
                    if(item.FormName.val && item.FormName.val.search(search.toUpperCase()) != -1){
                        //if(this.debug) console.log('Form Name match');
                        return true;
                    }
                    else if(item.Department.val && item.Department.val.search(search.toUpperCase()) != -1){
                        //if(this.debug) console.log('Department match');
                        return true;
                    }
                    else{
                        if(this.debug) console.log('NO MATCH');
                        return false;
                    }
                }
                else{
                    //if(this.debug) console.log('search number');
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