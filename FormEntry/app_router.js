"use strict";

const eventHub = new Vue();

var Home = {
    template: `
        <v-layout row wrap>
            <v-flex xs12>
                <v-data-table
                    :headers="formHeaders"
                    :items="forms"
                    class="elevation-1"
                    hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <td v-for="col in dataColumns" :key="col.valPropname"
                            :class="getDisplayClass(col)"
                        >
                            {{displayField(props.item, col)}}
                        </td>
                        <td><v-tooltip bottom><v-btn flat small slot="activator">Link</v-btn><span>{{props.item.ViewFormAddress}}</span></v-tooltip></td>
                        <td><v-btn icon small :to="getRouteLink(props.item.FormID)">
                            <v-icon>pageview</v-icon>
                        </v-btn></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    `,
    data: function(){
        return{
            //list vars
            /* copied from Vuetify for data-table w/ CRUD */
            isLoading: true,
            formHeaders: [
                {text: 'ID', value:'FormID', sortable: true, searchable: true, align: 'center'},
                {text: 'Name', value:'FormName', sortable: true, searchable: true, align: 'center'},
                {text: 'Table', value:'TableName', sortable: true, searchable: true, align: 'center'},
                {text: 'Department', value:'Department', sortable: true, searchable: true, align: 'center'},
                {text: 'Create Date', value:'CreateDate', sortable: true, searchable: true, align: 'center'},
                {text: 'Create User', value:'CreateUser', sortable: true, searchable: true, align: 'center'},
                {text: 'Last Edit Date', value:'LastEditDate', sortable: true, searchable: true, align: 'center'},
                {text: 'Last Edit User', value:'LastEditUser', sortable: true, searchable: true, align: 'center'},
                {text: 'View', value:'ViewFormAddress', align: 'center'},
                {text: 'View Records', align: 'center'}
            ],
            dataColumns: [],
            forms: []
        }
    },
    computed: {
        
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
        router: function(newVal, oldVal){
            console.log("router changed");
        }
    },
    methods: {
        initialize: function(){
            console.log("init Home");
            var self = this;

            // get all forms
            this.isLoading = true;
            this.fillDataColumns();
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get All Forms'
            },
            function(dataX){
                self.forms = dataX.Forms;
                store.setAllForms(dataX.Forms);
                self.isLoading = false;
            })
            .fail(function(dataX){
                console.log('Webservice Fail: Get All Forms');
                self.isLoading = false;
            });

        },
        getRouteLink: function(_formID){
            //console.log('Home getRouteLink formID = ' + _formID);
            return '/form/' + _formID.toString();
        },
        routeChanged: function(){
            console.log("Home - Route Changed")
        },
        fillDataColumns: function(){
            this.dataColumns = [{field: {FieldTypeID: null, FieldType: 'INT'},
                    valPropname: this.formHeaders[0].value,
                    header: this.formHeaders[0],
                    sortBy: 'ascending',
                    defaultSortOrder: 0},
                {field: {FieldTypeID: null, FieldType: 'TEXT'},
                    valPropname: this.formHeaders[1].value,
                    header: this.formHeaders[1],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'TEXT'},
                    valPropname: this.formHeaders[2].value,
                    header: this.formHeaders[2],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'TEXT'},
                    valPropname: this.formHeaders[3].value,
                    header: this.formHeaders[3],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'DATETIME'},
                    valPropname: this.formHeaders[4].value,
                    header: this.formHeaders[4],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'TEXT'},
                    valPropname: this.formHeaders[5].value,
                    header: this.formHeaders[5],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'DATETIME'},
                    valPropname: this.formHeaders[6].value,
                    header: this.formHeaders[6],
                    sortBy: null,
                    defaultSortOrder: null},
                {field: {FieldTypeID: null, FieldType: 'TEXT'},
                    valPropname: this.formHeaders[7].value,
                    header: this.formHeaders[7],
                    sortBy: null,
                    defaultSortOrder: null}];
        },
        getDisplayClass: function(col){
            if( col.field.FieldTypeID == 3 || col.field.FieldType == 'INT'){ // number
                return 'text-xs-right';
            }
            else if (col.field.FieldTypeID == 4 || col.field.FieldTypeID == 5 || col.field.FieldType == 'TEXT'){
                return 'text-xs-left';
            }
            else{   // date: 1, time: 2, checkbox: 6, select: 7
                return 'text-xs-center';
            }
        },
        displayField: function(record, col){
            var self = this;
            return getDisplayVal(record, col.valPropname, col.field);
        },
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
                    <v-card-title primary-title>{{data.FormData.FormName}}</v-card-title>
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
                    :headers="recordHeaders"
                    :items="sortedRecords"
                    item-key="RecordNumber"
                    :total-items="totalRecords"
                    :loading="isLoading"
                    class="elevation-1"
                    hide-actions
                >
                    <template slot="headers" slot-scope="props">
                        <th v-for="col in recordColumns" :key="col.header.text"
                            :class="['column', col.header.sortable ? 'sortable' : '', col.sortBy == 'descending' ? 'desc' : 'asc', col.sortBy == 'ascending' ? 'active' : '',  col.sortBy == 'descending' ? 'active' : '']"
                        >
                            <v-btn icon small flat v-if="col.header.sortable" @click="changeSort(col)" size="14px">
                                <v-icon size="14px">arrow_upward</v-icon>
                            </v-btn>
                            {{col.header.text}}
                            <v-btn icon small flat v-if="col.header.searchable" size="14px"><v-icon size="14px">search</v-icon></v-btn>
                        </th>
                        <th>Edit Record</th>
                    </template>
                    <template slot="items" slot-scope="props">
                        <td v-for="col in recordColumns" :key="col.valPropname"
                            :class="getDisplayClass(col)"
                        >
                            {{getDisplayData(props.item, col)}}
                        </td>
                        <td>
                            <v-btn icon :to="getRouteLink(props.item.RecordNumber)">
                                <v-icon dark>edit</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    `,
    data: function(){
        return{
            //list vars
            /* copied from Vuetify for data-table w/ CRUD */
            isLoading: true,
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
            sortedRecords: [],
            data: {
                FormData:{},
                Fields: [],
                ValSets: [],
                Records: []
            },
            recordNumHeader: {text: '', value:'RecordNumber', sortable: false, searchable: false, align: 'right'},
            defaultFormHeaders: [
                {text: 'Last Edit Date', value:'LastEditDate', sortable: true, searchable: true, align: 'center'},
                {text: 'Last Edit User', value:'LastEditUser', sortable: true, searchable: true, align: 'center'},
                {text: 'Submit Date', value:'OriginalSubmitDate', sortable: true, searchable: true, align: 'center'},
                {text: 'Submit User', value:'OriginalSubmitUser', sortable: true, searchable: true, align: 'center'}
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
        // call again the method if the route changes
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
            if(this.formID){
                return '/form/' + this.formID.toString() + '/entry/'
            }
            else{
                return '/'
            }
        },
        backRouteLink: function(){
            return '/'
        },
        totalRecords: function(){
            if(this.data.Records){
                return this.data.Records.length;
            }
            else
                return null;
        },
        primaryDateID: function(){
            if(this.data.FormData){
                return this.data.FormData.FieldHTMLID_Date;
            }
            else return null;
        },
        primaryDateField: function(){
            var self = this;
            var date = null;
            if(this.data.FormData && this.data.Fields){
                date = this.data.Fields.find(function(f){
                    return f.FieldHTMLID == self.primaryDateID;
                });
            }
            return date;
        },
        visibleFields: function(){
            var self = this;
            var fields = {};
            if(this.primaryDateField){
                fields = this.data.Fields.filter(function(f){
                    return f.FieldHTMLID != self.primaryDateID;
                });
            }
            else{
                fields = this.data.Fields;
            }

            return fields.sort(function(a,b){
                return a.FieldOrder - b.FieldOrder;
            });
        },
        recordColumns: function(){
            var self = this;
            var arr = [];
            var field, valPropname, header, sortBy, defaultSortOrder;

            field = {FieldTypeID: null, FieldType: 'INT'};
            valPropname = this.recordNumHeader.value;
            header = this.recordNumHeader;
            sortBy = 'descending';
            defaultSortOrder = 1;

            arr.push({field: field, valPropname: valPropname, header: header, sortBy: sortBy, defaultSortOrder: defaultSortOrder});


            if(this.data.FormData){
                if(this.primaryDateField){
                    field = self.primaryDateField;
                    valPropname = self.primaryDateField.FieldHTMLID;
                    header = {text: self.primaryDateField.FieldName, value: self.primaryDateField.FieldHTMLID, sortable: true, searchable: true, align: 'center'};
                    sortBy = 'descending';
                    defaultSortOrder = null;

                    arr.push({field: field, valPropname: valPropname, header: header, sortBy: sortBy, defaultSortOrder: defaultSortOrder});
                }

                this.visibleFields.forEach(function(f){
                    field = f;
                    valPropname = f.FieldHTMLID;
                    var canSort = true;
                    if(f.FieldTypeID == 5 || f.FieldTypeID == 6){
                        canSort = false;
                    }
                    header = {text:f.FieldName, value: f.FieldHTMLID, sortable: canSort, searchable: false, align: 'center'};
                    sortBy = null;
                    defaultSortOrder = null;

                    arr.push({field: field, valPropname: valPropname, header: header, sortBy: sortBy, defaultSortOrder: defaultSortOrder});
                });
            }

            this.defaultFormHeaders.forEach(function(h){
                sortBy = null;
                defaultSortOrder = null;

                valPropname = h.value;
                if(valPropname == 'LastEditDate' || valPropname == 'OriginalSubmitDate'){
                    field = {FieldTypeID: null, FieldType: 'DATETIME'};
                    if(valPropname == 'OriginalSubmitDate'){
                        sortBy = 'descending';
                        defaultSortOrder = 0;
                    }
                }
                else{
                    field = {FieldTypeID: null, FieldType: 'TEXT'};
                }
                header = h;
                /*if(h.text != 'Edit Record'){
                    valPropname = h.value;
                }
                else{
                    valPropname = null;
                }*/

                arr.push({field: field, valPropname: valPropname, header: header, sortBy: sortBy, defaultSortOrder: defaultSortOrder});
            });
            

            return arr;
        },
        recordHeaders: function(){
            var self = this;
            var headers = [];

            if(this.recordColumns){
                headers = this.recordColumns.map(function(c){
                    return c.header;
                });
            }
            headers.push(self.editHeader);
            return headers;
        },
        defaultSortColumns: function(){
            return this.recordColumns.filter(function(c){
                return c.defaultSortOrder != null;
            }).sort(function(a,b){
                return a.defaultSortOrder - b.defaultSortOrder;
            });
        },
    },
    methods: {
        initialize: function(){
            console.log("init Records");
            var self = this;

            this.formID = this.$route.params.formid;

            this.listenOnHub();

            Vue.nextTick(function(){
                self.getFormRecords();
            });
        },
        routeChanged: function(){
            console.log("FormRecords - Route Changed");
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
                webservice : 'PSOFIAv2/Get Form Records',
                formID: self.formID
            },
            function(dataX){
                //console.log(dataX);
                self.data.FormData = dataX.FormData[0];
                self.data.Fields = dataX.FormFields;
                self.data.ValSets = dataX.FormValSets;
                self.data.Records = dataX.FormRecords;

                // add store
                //store.setAllForms(dataX.Forms);

                store.loadFormData(dataX.FormData[0]);
                store.loadFormFields(dataX.FormFields);
                store.loadFormVSOptions(dataX.FormValSets);
                store.loadFormRecords(dataX.FormRecords);

                    Vue.nextTick(function(){
                        if(self.primaryDateField){
                            self.sortColumns.push(self.recordColumns.find(function(c){
                                return c.valPropname == self.primaryDateField.FieldHTMLID;
                            }));
                        }

                        self.sortedRecords = self.sortRecords();

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
        getDisplayClass: function(col){
            if( col.field.FieldTypeID == 3 || col.field.FieldType == 'INT'){ // number
                return 'text-xs-right';
            }
            else if (col.field.FieldTypeID == 4 || col.field.FieldTypeID == 5 || col.field.FieldType == 'TEXT'){
                return 'text-xs-left';
            }
            else{   // date: 1, time: 2, checkbox: 6, select: 7
                return 'text-xs-center';
            }
        },
        getDisplayData: function(record, col){
            var self = this;
            var dataObj = getPropVal(record, col.valPropname, col.field);
            return dataObj.displayVal;
        },
        changeSort: function(col){
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

            if(this.data.Records){// && (this.data.Records[0].RecordNumber != null && this.data.Records[0].OriginalSubmitDate != null)){
                return this.data.Records.sort(function(a,b){
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
        },
    }
}

var Entry = {
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
        </v-layout>
    `,
    data: function(){
        return{
            isLoading: true,
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
                self.openOldVersion();
            });
        },
        openOldVersion: function(){
            window.open(this.oldVersion);
        },
        routeChanged: function(){
            console.log("Entry - Route Changed");
            //this.initialize();
        },
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