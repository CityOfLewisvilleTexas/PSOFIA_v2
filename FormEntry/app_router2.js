"use strict";

const eventHub = new Vue();

var Home = {
    template: `
        <v-card>
            <v-card-title>
                All Forms
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="searchStr"
                    append-icon="mdi-magnify"
                    label="Search Forms"
                    single-line
                    hide-details
                >
                </v-text-field>
            </v-card-title>
            <v-data-table
                :headers="headerCols"
                :items="orderedForms"
                :loading="appLoading"
                :server-items-length="totalForms"
                hide-default-header
                hide-default-footer
                item-key="FormID.val"
                class="elevation-1"
            >   
                <template v-slot:header="{props:{headers}}">
                    <thead>
                        <tr>
                            <th v-for="col in headerCols" :key="col.FormID" :class="getCellAlign(col)"
                                role="columnheader" aria-sort="ascending" class="sortable active asc">
                                {{ col.Label }}
                            </th>
                            <th>View Records</th>
                        </tr>
                    </thead>
                </template>
                <template v-slot:body="{items}">
                    <tbody>
                        <tr v-for="item in items" :key="item.ID">
                            <td v-for="col in headerCols" :key="col.FormID"
                                :class="getCellAlign(col)">
                                <template v-if="col.HasTooltip">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <span v-on="on">{{ item[col.ColumnName].displayVal }}</span>
                                        </template>
                                        <span v-html="getTooltip(col.ColumnName, item)"></span>
                                    </v-tooltip>
                                </template>
                                <template v-else>
                                    {{ item[col.ColumnName].displayVal }}
                                </template>
                            </td>
                            <td class="text-xs-center"><v-btn icon small :to="getRouteLink(item.FormID.val)">
                                <v-icon>mdi-view-list</v-icon>
                            </v-btn></td>
                        </tr>
                    </tbody>
                </template>
                <template v-slot:loading">
                    Loading All Forms
                </template>
                <template v-slot:no-data">
                    NO DATA
                </template>
                <template v-slot:no-results">
                    NO RESULTS
                </template>
            </v-data-table>
        </v-card>
    `,
    /*
                        <v-card-actions>
                        <v-btn @click="showSearch = true">
                            <!--<v-icon dark>mdi-add_box</v-icon>-->
                            Search Forms
                        </v-btn>
                    </v-card-actions>
    */
    /*
    <v-btn icon small flat @click="changeSort(col.ColumnName)" size="14px">
                                    <v-icon size="14px">arrow_upward</v-icon>
                                </v-btn>
    :class="['column sortable', pagination.descending ? 'desc' : 'asc', col.ColumnName === pagination.sortBy ? 'active' : '']"
    @click="changeSort(col.ColumnName)"
    <v-icon small>arrow_upward</v-icon>
    <template v-if="col.HasTooltip">
                                <v-tooltip bottom>
                                    <span slot="activator">{{ props.item[col.ColumnName].displayVal }}</span>
                                    <span v-html="getTooltip(col.ColumnName, props.item)"></span>
                                </v-tooltip>
                            </template>*/
/*
            <td class="text-xs-center">
                <v-tooltip v-if="props.item.ViewFormAddress" bottom>
                    <v-btn flat small slot="activator">Link</v-btn>
                    <span>{{props.item.ViewFormAddress}}</span>
                </v-tooltip>
            </td>
*/
    data: function(){
        return{
            isLoading: true,
            sharedState: store.state,
            tableSort: {
                sortBy: '',
                sortDesc: '',
            },
            filterTable:{
                formID: '',
                formName: '',
                department: '',
                dateCreated1: '',
                dateCreated2: '',
                dateEdited1: '',
                dateEdited2: '',
                
            },
            searchStr: '',
            debug: true,
        }
    },
    computed: {
        stateLoading: function(){
            return this.sharedState.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },
        sharedDB: function(){
            return this.sharedState.database;
        },
        sharedCols: function(){
            return this.sharedState.columns;
        },
        totalForms: function(){
            return store.countForms('database');
        },
        orderedForms: function(){
            return store.getForms_Ordered('database');
        },
        sortedForms: function(){
            return this.orderedForms.sort(function(a,b){
                return true;
            });
        },
        headerCols: function(){
            return store.getColumns_Headers('allforms');  
        },
        headerCols_Sort: function(){
            var self = this;
            var cols = this.headerCols.map(function(column){
                return {
                    text: column.Label,
                    value: column.ColumnName,
                    align: self.getCellAlign(column),
                    sortable: true
                }
            }); 
            cols.push({
                text: 'View Records',
                value: 'View Records',
                sortable: false
            })
            return cols;
            /*return this.headerCols.map(function(column){
                return {
                    ColumnName: column.ColumnName,
                    SortByIndex: null,
                    SortBy: null,
                    SearchStr: null
                }
            });*/
        },
        tableItems: function(){
            /*return this.orderForms.sortBy(funciton(forms){

            });*/
        },
        /*formHeaders: function(){
            var headers = [];
            var headerVal;
            if(this.headerCols){
                this.headerCols.forEach(function(c){
                    headerVal = c.ColumnName.toString() + '.val';
                    headers.push({text: c.Label, align: center, value: headerVal});
                });
            }
            return headers;
        }*/
    },
    created: function(){
        this.initialize();
    },
    /*beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
        console.log(to + ', ' + from);
        next();
    },*/
    watch: {
        // call method if the route changes
        '$route': {
            handler(val){
                this.routeChanged();
            },
            deep: true
        },
        router: function(newVal, oldVal){
            if(this.debug) console.log("router changed");
        }
    },
    methods: {
        initialize: function(){
            var self = this;
            this.isLoading = true;

            if(this.debug) console.log("init Home");

            // get all forms
            this.getForms();

        },
        getForms: function(){
            var self = this;
            this.isLoading = true;
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get All Forms2'
            },
            function(data){
                store.loadColumns(data.Columns, ['allforms']);
                store.loadAllForms(data.Forms);
                self.isLoading = false;
            })
            .fail(function(data){
                console.log('Webservice Fail: Get All Forms2');
                self.isLoading = false;
            });
        },
        getTooltip: function(colName, form){
            if(colName === 'FormName'){
                return 'SQL Table Name: ' + form.TableName.displayVal;
            }
            if(colName === 'Department'){
                return 'Department ID: ' + form.DepartmentID.displayVal;
            }
            if(colName === 'CreateDate'){
                return form.CreateUser.displayVal + ' - ' + this.getFullDateDisplay(form.CreateDate);
            }
            if(colName === 'LastEditDate'){
                return form.LastEditUser.displayVal + ' - ' + this.getFullDateDisplay(form.LastEditDate);
            }
        },
        getCellAlign: function(col){
            if(col.ColumnName === 'FormID'){
                return 'text-xs-right';
            }
            else if(col.ColumnName === 'FormName'){
                return 'text-xs-left';
            }
            else return 'text-xs-center';
        },
        getRouteLink: function(_formID){
            return '/form/' + _formID.toString();
        },
        routeChanged: function(){
            if(this.debug) console.log("Home - Route Changed")
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        }
    }
}

var FormRecords = {
    template: `
        <v-layout row wrap>
            <v-flex xs12>
                <v-spacer></v-spacer>
                <v-btn icon :to="backRouteLink">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>{{sharedState.form.formData.FormName}}</v-card-title>
                    <v-card-actions>
                        <v-btn :to="nextRouteLink">
                            <v-icon dark>add_box</v-icon>
                            New Record
                        </v-btn>
                        <v-btn @click="showSearch = true">
                            <!--<v-icon dark>mdi-add_box</v-icon>-->
                            Search Records
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-card v-if="showSearch">
                    <v-card-title>
                        Search Records
                        <v-spacer></v-spacer>
                        <v-btn @click="showSearch = false"><v-icon>close</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <builder-date-picker-v
                                    :field="searchObj"
                                    id-text="searchStart"
                                    label-text="Date"
                                    val-propname="dateStart"
                                    data-portion="search"
                                ></builder-date-picker-v>
                            </v-flex>
                            <v-flex xs6>
                                <builder-date-picker-v
                                    :field="searchObj"
                                    id-text="searchEnd"
                                    label-text="Date"
                                    val-propname="dateEnd"
                                    data-portion="search"
                                ></builder-date-picker-v>
                            </v-flex>

                            <!--<v-flex xs4>
                                <v-text-field
                                    v-model="searchObj.searchStr"
                                    append-icon="search"
                                    label="Search Records"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-flex>-->
                        </v-layout>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-data-table
                    :items="records_defaultOrdered"
                    item-key="RecordNumber.val"
                    :total-items="totalRecords"
                    :loading="isLoading"
                    class="elevation-1"
                    hide-actions
                >
                    <template slot="headers" slot-scope="props">
                        <th>Edit</th>
                        <th v-if="primaryDateField">
                            <v-btn icon small flat @click="changeSort(primaryDateField)" size="14px">
                                <v-icon size="14px">arrow_upward</v-icon>
                            </v-btn>
                            {{primaryDateField.FieldName}}
                            <v-btn icon small flat size="14px"><v-icon size="14px">search</v-icon></v-btn>
                        </th>
                        <th v-for="field in visibleFields" :key="field.FormFieldID">
                            <v-btn icon small flat @click="changeSort(field)" size="14px">
                                <v-icon size="14px">arrow_upward</v-icon>
                            </v-btn>
                            {{field.FieldName}}
                            <v-btn icon small flat size="14px"><v-icon size="14px">search</v-icon></v-btn>
                        </th>
                        <th>Submitted</th>
                        <th>Last Edited</th>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-center">
                            <v-btn icon :to="getRouteLink(props.item.RecordNumber.val)">
                                <v-icon dark>edit</v-icon>
                            </v-btn>
                        </td>
                        <td v-if="primaryDateField" class="text-xs-center">
                            {{getColDisplayVal(props.item, primaryDateField)}}
                        </td>
                        <td v-for="field in visibleFields" :key="getColKey(props.item, field)"
                            :class="getDisplayClass(field)"
                        >
                            {{getColDisplayVal(props.item, field)}}
                        </td>
                        <td class="text-xs-center"><v-tooltip bottom>
                            <span slot="activator">{{props.item.OriginalSubmitDate.displayVal}}</span>
                            <span>{{props.item.OriginalSubmitUser}} - {{getFullDateDisplay(props.item.OriginalSubmitDate)}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-tooltip bottom>
                            <span slot="activator">{{props.item.LastEditDate.displayVal}}</span>
                            <span>{{props.item.LastEditUser}} - {{getFullDateDisplay(props.item.LastEditDate)}}</span>
                        </v-tooltip></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    `,
    //:class="['column', 'sortable', col.sortBy == 'descending' ? 'desc' : 'asc', col.sortBy == 'ascending' ? 'active' : '',  col.sortBy == 'descending' ? 'active' : '']"

    data: function(){
        return{
            isLoading: true,
            sharedState: store.state,
            formID: '',
            showSearch: false,
            searchObj: {
                dateStart: null,
                dateEnd: null,
                count: null,
                searchStr: null
            },
            sortColumns: [],
            pagination: {},
            tableRecords: [],
            defaultFormHeaders: [
                {text: 'Submitted', value:'OriginalSubmitDate', sortable: true, searchable: true, align: 'center'},
                {text: 'Last Edited', value:'LastEditDate', sortable: true, searchable: true, align: 'center'},
            ],
            editHeader: {text: 'Edit Record', sortable: false, searchable: false, align: 'center'},
        }
    },
    created: function(){
        this.initialize();
    },
    /*beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
        console.log(to + ', ' + from);
        next();
    },*/
    watch: {
        // call method if the route changes
        '$route': {
            handler(val){
                this.routeChanged();
            },
            deep: true
        },
        /*primaryDateID: function(newVal, oldVal){
            if(newVal && (!oldVal || newVal != oldVal)){
                this.pagination.sortBy = newVal;
            }
        }*/
        /*sortColumns: function(newVal, oldVal){
            var self = this;
            if(newVal){
                self.sortedRecords = self.sortRecords();
            }
        }*/
    },
    computed:{
        nextRouteLink: function(){
            var url = '/'
            if(this.formID){
                url = '/form/' + this.formID.toString() + '/entry/'
            }
            return url;
        },
        backRouteLink: function(){
            return '/'
        },
        totalRecords: function(){
            return store.countFormRecords();
        },
        records_defaultOrdered: function(){
            return store.getFormRecords_Ordered();
        },
        primaryDateField: function(){
            return store.getField_PrimaryDate();
        },
        visibleFields: function(){
            return store.getFieldsInHeader_Ordered();
        },
    },
    methods: {
        initialize: function(){
            console.log("init Records");
            var self = this;
            this.isLoading = true;

            this.formID = this.$route.params.formid;

            this.listenOnHub();

            Vue.nextTick(function(){
                self.getFormRecords();
            });
        },
        routeChanged: function(){
            if(this.debug) console.log("FormRecords - Route Changed");
            //this.initialize();
        },
        listenOnHub: function(){
            var self = this;
            eventHub.$on('update-section-data', self.updateSectionData);
            eventHub.$on('update-input', self.updateFormField);
            eventHub.$on('update-search-data', self.updateSearch);
            
            //eventHub.$on('editing-field', self.setEditField);

            //eventHub.$on('add-new-field', self.addNewField);
            //eventHub.$on('add-new-section', self.addNewSection);
            //eventHub.$on('add-new-sub-section', self.addNewSubSection);
        },
        getFormRecords: function(){
           console.log("getFormRecords");
            var self = this;

            self.isLoading = true;
            
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Form Records2',
                formID: self.formID
            },
            function(data){
                store.loadColumns(data.Columns, ['allforms', 'formData', 'fields','vsOptions','record']);
                store.loadFormData(data.FormData);
                store.loadFormFields(data.FormFields);
                store.loadFormVSOptions(data.FormVSOptions);
                store.loadFormRecords(data.FormRecords);

                Vue.nextTick(function(){
                    self.isLoading = false;
                });
            })
            .fail(function(dataX){
                console.log('Webservice Fail: Get All Forms');
                self.isLoading = false;
            });
        },
        updateSearch: function(payload){
            var self = this;
            console.log('updating search data');
            console.log(payload);

            if(payload.val){
                console.log(payload.val);
                console.log(this.searchObj[payload.valPropname])
                if(this.searchObj[payload.valPropname] != payload.val){
                    this.searchObj[payload.valPropname] = payload.val;
                }
            }
            else{
                this.searchObj[payload.valPropname] = null;
            }
        },
        getRouteLink: function(_recordID){
            //console.log("FormRecords getRouteLink recordID = " + _recordID);
            if(this.formID){
                if(_recordID){
                    return this.nextRouteLink + _recordID.toString();
                }
                else{
                    return this.nextRouteLink;
                }
            }
            else{
                return '/';
            }
        },
        getDisplayClass: function(field){
            if( field.FieldTypeID == 3 || field.FieldType == 'INT'){ // number
                return 'text-xs-right';
            }
            else if (field.FieldTypeID == 4 || field.FieldTypeID == 5 || field.FieldType == 'TEXT'){
                return 'text-xs-left';
            }
            else{   // date: 1, time: 2, checkbox: 6, select: 7
                return 'text-xs-center';
            }
        },
        getColDisplayVal: function(record, field){
            var colObj = record[field.FieldHTMLID];
            return colObj.displayVal;
        },
        getColKey: function(record, field){
            var keyStr = record.RecordNumber.val + '-' + field.FormFieldID;
            console.log(keyStr);
            return keyStr;
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        },
        /*changeSort: function(col){
            var self = this;
            if(!(col.sortBy)){
                col.sortBy = 'ascending';
                self.sortColumns.push(col);
            }
            else if (col.sortBy == 'ascending'){
                col.sortBy = 'descending';
            }
            else if (col.sortBy == 'descending'){
                if(col.defaultSortOrder == 0 || col.defaultSortOrder > 0){
                    col.sortBy = 'ascending';
                }
                else{
                    col.sortBy = null;
                    var i = self.sortColumns.findIndex(function(c){
                        return c.valPropname == col.valPropname;
                    });
                    if(i > -1){
                        self.sortColumns.splice(i, 1);
                    }
                }
            }
            Vue.nextTick(function(){
                self.sortedRecords = self.sortRecords();
            });
        },
        sortRecords: function(){
            var self = this;
            var sortA;
            var sortB;
            var moDiff;
            var returnVal;

            if(this.sharedState.form.records){// && (this.data.Records[0].RecordNumber != null && this.data.Records[0].OriginalSubmitDate != null)){
                return this.sharedState.form.records.sort(function(a,b){
                    returnVal = 0;

                    // if user has chosen column field to be sorted
                    self.sortColumns.forEach(function(col){
                        if(returnVal == 0){
                            returnVal = compareByPropForSort(col.sortBy, a, b, col.valPropname, col.field);
                        }
                    });
                    if(returnVal == 0){
                        //console.log('defaultsort');
                        self.defaultSortColumns.forEach(function(col){
                            if(returnVal == 0){
                                returnVal = compareByPropForSort(col.sortBy, a, b, col.valPropname, col.field);
                            }
                        });
                    }
                    return returnVal;
                });
            }
            else{
                return [];
            }
        },*/
    }
}

var Entry = {
    template: `
        <v-layout row wrap v-if="!isLoading">
            <v-flex xs12>
                <v-spacer></v-spacer>
                <v-btn icon :to="backRouteLink">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <div class="headline">Record Entry:</div>
                            <span class="grey--text">Form {{formID}}: {{!(recordNum) ? "NEW " : ""}}Record {{recordNum || ""}}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        Vuetify version in progress. The Material Version should have opened in a new window.
                    </v-card-text>
                    <v-card-actions>
                        <v-btn flat small color="orange" @click="openOldVersion">Open Window Again</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <psofia-form-data>
            </psofia-form-data>
            <psofia-form-section v-for="section in orderedSections" :key="section.FormSectionID"
                :form-section-id="section.FormSectionID">
            </psofia-form-section>
        </v-layout>
    `,
    data: function(){
        return{
            isLoading: true,
            sharedState: store.state,
            formID: '',
            recordNum: '',
        }
    },
    computed:{
        href: function(){
            return window.location.href;
        },
        hostname: function(){
            return window.location.hostname;
        },
        oldVersion: function(){
            var self = this;
            var oldVer = 'index.html?formID=' + this.formID.toString();
            if(this.recordNum){
                oldVer += '&recordNumber=' + this.recordNum.toString();
            }
            return this.href.substr(0, self.href.indexOf('index')) + oldVer;
        },
        backRouteLink: function(){
            if(this.formID){
                return '/form/' + this.formID.toString()
            }
            else{
                return '/'
            }
        },
        orderedSections:function (){
            var self = this;
            return store.getFormSections_Ordered();
        },
    },
    created: function(){
        this.initialize();
    },
    /*beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
        console.log(to + ', ' + from);
        next();
    },*/
    watch: {
        // call again the method if the route changes
        '$route': {
            handler(val){
                this.routeChanged();
            },
            deep: true
        },
    },
    methods: {
        initialize: function(){
            console.log("init Entry");
            var self = this;

            this.formID = this.$route.params.formid;
            this.recordNum = this.$route.params.recordnum;

            Vue.nextTick(function(){
                //self.openOldVersion();
                self.getFormEntry();
            });
        },
        openOldVersion: function(){
            window.open(this.oldVersion);
        },
        routeChanged: function(){
            console.log("Entry - Route Changed");
            //this.initialize();
        },
        getFormEntry:function(){
            console.log("getFormEntry");
            var self = this;

            self.isLoading = true;
            console.log(this.recordNum);
            
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Form Entry2',
                formID: this.formID,
                recordNumber: this.recordNum
            },
            function(data){
                store.loadColumns(data.Columns, ['formData', 'sections', 'subSections', 'fields','valSets', 'vsOptions','record']);
                store.loadFormData(data.FormData);
                store.setFormSections(data.FormSections);
                store.setFormSubSections(data.FormSubSections);
                store.setFormFields(data.FormFields);
                store.setFormValSets(data.FormValSets);
                store.setFormVSOptions(data.FormVSOptions);

                if(data.FormRecord.length > 0){
                    store.setFormRecord(data.FormRecord[0]);
                }
                else{
                    store.setFormRecord_Null();
                }

                Vue.nextTick(function(){
                    self.isLoading = false;
                });
            })
            .fail(function(data){
                console.log('Webservice fail: Get Form Entry');
                self.isLoading = false;
            });
        }
    }
}

var routes = [
    { path: '/', component: Home },
    { path: '/form/:formid', component: FormRecords},
    { path: '/form/:formid/entry/', component: Entry},
    { path: '/form/:formid/entry/:recordnum', component: Entry}
]

var router = new VueRouter({
    routes: routes // short for `routes: routes`
})

var app = new Vue({
    router: router,
    el: '#app',
    vuetify: new Vuetify({
        theme: {
            themes: {
                light: {
                    primary: '#5A348D',
                    secondary: '#FFCDD2',
                    accent: '#3F51B5',
                },
                dark: {
                    primary: '#5A348D',
                    secondary: '#FFCDD2',
                    accent: '#3F51B5',
                }
            },
        },
    }),
    data:{
        isLoading: false,
        username: '',
        prevPath: null,
    },

    computed:{
        userEmail: function(){
            return localStorage.colEmail;
        },
        hello: function(){
            return (app.username) ? 'Hello, ' + app.username + '!' : 'Hello!'
        }
    },

    created: function(){
        this.checkForUsername();
         // start the app once the DOM is rendered
    },

    watch: {
        // call again the method if the route changes
        '$route': function(to, from){
            this.prevPath= from.path;
            this.routeChanged();
        }
    },

    methods: {
        // get username from COL if it exists
        checkForUsername: function() {

            // ajax
            $.get('http://ax1vnode1.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + localStorage.colEmail, function(data) {

                // set username, set hello message (above form)
                app.username = (data.length) ? data[0].givenName : ''

                // warning message
                if (!app.username) alert('Could not verify identity. Form may not submit correctly.')
            })
        },
        routeChanged: function(){
            console.log("App - Route Changed")
        },
        goBack () {
            window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/')
        }
    }
})