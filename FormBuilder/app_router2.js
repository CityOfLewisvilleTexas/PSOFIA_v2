"use strict";

const eventHub = new Vue();


var Home = {
    template: `
        <v-layout row wrap>
            <v-flex xs12>
                <v-btn to="/build/">Create New</v-btn>
            </v-flex>
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>All Forms</v-card-title>
                    <v-card-actions>
                        <v-btn to="/build/">
                            <v-icon dark>add_box</v-icon>
                            New Form
                        </v-btn>
                        <v-btn @click="showSearch = true">
                            <!--<v-icon dark>mdi-add_box</v-icon>-->
                            Search Forms
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-data-table
                    :headers="formHeaders"
                    :items="orderedForms"
                    item-key="FormID.val"
                    :total-items="totalForms"
                    class="elevation-1"
                    hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-right">{{props.item.FormID.displayVal}}</td>
                        <td class="text-xs-left"><v-tooltip bottom>
                            <span slot="activator">{{props.item.FormName}}</span>
                            <span>SQL Table Name: {{props.item.TableName}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-tooltip bottom>
                            <span slot="activator">{{props.item.Department}}</span>
                            <span>Department ID: {{props.item.DepartmentID}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-tooltip bottom>
                            <span slot="activator">{{props.item.CreateDate.displayVal}}</span>
                            <span>{{props.item.CreateUser}} - {{getFullDateDisplay(props.item.CreateDate)}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-tooltip bottom>
                            <span slot="activator">{{props.item.LastEditDate.displayVal}}</span>
                            <span>{{props.item.LastEditUser}} - {{getFullDateDisplay(props.item.LastEditDate)}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-tooltip v-if="props.item.ViewFormAddress" bottom>
                            <v-btn flat small slot="activator">Link</v-btn>
                            <span>{{props.item.ViewFormAddress}}</span>
                        </v-tooltip></td>
                        <td class="text-xs-center"><v-btn icon small :to="getRouteLink(props.item.FormID.val)">
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
            sharedState: store.state.database,
            formHeaders: [
                {text: 'ID', value:'FormID.val', sortable: false, searchable: true, align: 'center'},
                {text: 'Name', value:'FormName', sortable: false, searchable: true, align: 'center'},
                {text: 'Department', value:'Department', sortable: false, searchable: true, align: 'center'},
                {text: 'Created', value:'CreateDate.val', sortable: false, searchable: true, align: 'center'},
                {text: 'Last Edited', value:'LastEditDate.val', sortable: false, searchable: true, align: 'center'},
                {text: 'View', value:'ViewFormAddress', sortable: false, align: 'center'},
                {text: 'View Records', sortable: false, align: 'center'}
            ],
            dataColumns: []
        }
    },
    computed: {
        orderedForms: function(){
            return store.getForms_Ordered('database');
        },
        totalForms: function(){
            return store.countForms('database');
        },
        headerCols: function(){
            return store.getColumns_Headers('allForms');  
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
        router: function(newVal, oldVal){
            console.log("router changed");
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
        getRouteLink: function(_formID){
            return '/build/' + _formID.toString() + '/';
        },
        routeChanged: function(){
            console.log("Home - Route Changed");
        },
        getFullDateDisplay: function(dateObj){
            if(dateObj.val){
                return getFullDateStr(dateObj.val, 'default', 'default', true, 'default', 'prepend');
            }
            else return dateObj.displayVal;
        }
    }
}

var Build = {
    template: `
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12 sm6>
                        <h4 class="display-2">{{title}}</h4><v-progress-circular indeterminate v-if="isLoading" color="primary"></v-progress-circular>
                        <span class="subheading">Created: {{createDate}}</span>
                        <span class="subheading">Last Edited: {{editDate}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 class="text-lg-right">
                        <span class="subheading">{{status}}</span>
                        <v-btn to="/">Return to View All</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs12>
                <builder-form-data-v>
                </builder-form-data-v>
            </v-flex>
                        
            <!--MAKE A COMPONENT FOR EACH SECTION / SUBSECTION-->
                        
            <v-flex xs12>
                <builder-form-section-v v-for="s in orderedSections"
                    :key="s.FormSectionID"
                    :form-section-id="s.FormSectionID"
                ></builder-form-section-v>
            </v-flex>
                    
            <v-flex xs12>
                <v-btn @click="addNewSection">Add New Section</v-btn>
                <!--<v-card dark color="primary">
                    <v-card-text class="px-0">
                        <a class="waves-effect waves-light btn">Add New Section</a>
                    </v-card-text>
                </v-card>-->
            </v-flex>

            <!--<div class="fixed-action-btn" v-on:click="submitForm()">
                <a class="btn-floating btn-large red" v-if="!isSubmitting">
                  <i class="large material-icons">done</i>
                </a>
            </div>-->
        </v-layout>
    `,
    data: function(){
        return{
            sharedState: store.state,
            isLoading: true,
            formID: '',
            debug: true,
        }
    },
    created: function(){
        console.log("app_router build created");
        this.initialize();
    },
    watch: {
        // call again the method if the route changes
        /*'$route': function(to, from){
            this.routeChanged();
        }*/
    },
    computed: {
        title: function(){
            if(this.formID){
                return 'Edit Form ' + this.formID.toString();
            }
            return 'Create New Form'
        },
        unsavedChanges: function(){
            if(!(this.formID) || store.formHasChange()){
                return true;
            }
            return false;
        },
        status: function(){
            if(this.unsavedChanges){
                return 'Unsaved Changes';
            }
            return 'Saved to DB';
        },
        formData: function(){
            sharedState.form.formData;
        },
        createDate: function(){
            sharedState.form.formData.CreateDate.displayVal;
        },
        editDate: function(){
            sharedState.form.formData.LastEditDate.displayVal;
        },
        orderedSections: function(){
            store.getFormSections_Ordered();
        }

    },
    methods: {
        initialize: function(){
            var self = this;
            this.isLoading = true;

            if(this.debug) console.log("init Build");

            this.formID = this.$route.params.formid

            Vue.nextTick(function(){
                self.getFormBuilder();
            });
        },
        routeChanged: function(){
            if(this.debug) console.log("Build - Route Changed")
        },
        getFormBuilder: function(){
            var self = this;
            this.isLoading = true;

            if(this.debug) console.log("getFormBuilder");
            
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Form Builder2',
                formID: self.formID
            },
            function(dataX){
                //NEEDS TO BE FIXED
                store.loadColumns(data.Columns, ['formData', 'sections', 'subSections', 'fields','valSets', 'vsOptions','record']);
                /*  var app = this;
                    var dataX = JSON.parse('{"Forms":[{"FormID":2,"FormName":"City of Lewisville Plant Report","Department":1},{"FormID":1,"FormName":"Operations Report","Department":1}],\
                        "Departments":[{"DepartmentID":1,"Department":"Wastewater Treatment"}],\
                        "Sections":[{"SectionID":5,"SectionTitle":"AMMONIA"},{"SectionID":1,"SectionTitle":"Main (first)"},{"SectionID":2,"SectionTitle":"Main (last)"},{"SectionID":4,"SectionTitle":"OPERATORS"},{"SectionID":3,"SectionTitle":"PLANT WASTING"}],\
                        "SubSections":[],\
                        "FieldTypes":[{"FieldTypeID":1,"FieldType":"DATE","FieldTypeOrder":1},{"FieldTypeID":2,"FieldType":"TIME","FieldTypeOrder":2},{"FieldTypeID":3,"FieldType":"NUMBER","FieldTypeOrder":3},{"FieldTypeID":4,"FieldType":"TEXT","FieldTypeOrder":4},{"FieldTypeID":5,"FieldType":"TEXTAREA","FieldTypeOrder":5},{"FieldTypeID":6,"FieldType":"CHECKBOX","FieldTypeOrder":6},{"FieldTypeID":7,"FieldType":"SELECT","FieldTypeOrder":7}],\
                        "ValidationSets":[{"ValidationSetID":1,"ValidationSetName":"PlantReportTime"}],\
                        "VSEntries":[{"VSEntryID":6,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"10am","EntryValue":"10am"},{"VSEntryID":12,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"10pm","EntryValue":"10pm"},{"VSEntryID":1,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"12am","EntryValue":"12am"},{"VSEntryID":7,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"12pm","EntryValue":"12pm"},{"VSEntryID":2,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"2am","EntryValue":"2am"},{"VSEntryID":8,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"2pm","EntryValue":"2pm"},{"VSEntryID":3,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"4am","EntryValue":"4am"},{"VSEntryID":9,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"4pm","EntryValue":"4pm"},{"VSEntryID":4,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"6am","EntryValue":"6am"},{"VSEntryID":10,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"6pm","EntryValue":"6pm"},{"VSEntryID":5,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"8am","EntryValue":"8am"},{"VSEntryID":11,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"8pm","EntryValue":"8pm"}],\
                        "FormData":[],\
                        "FormSections":[{"FormSectionID":null,"SectionID":2,"SectionOrder":1,"HideSectionTitle":true,"isDefault":true,"updateDB":true},{"FormSectionID":null,"SectionID":2,"SectionOrder":null,"HideSectionTitle":true,"isDefault":true,"updateDB":true}],\
                        "FormSubSections":[{"FormSubSectionID":null,"SectionID":null,"SubSectionID":null,"SectionOrder":null,"SubSectionOrder":null,"HideSubSectionTitle":false,"isDefault":true,"updateDB":true}],\
                        "FormFields":[{"FormFieldID":null,"FormSectionID":null,"FormSubSectionID":null,"FieldTypeID":null,"FieldType":null,"ValidationSetID":null,"FieldName":null,"FieldHTMLID":null,"SectionOrder":null,"SubSectionOrder":null,"FieldOrder":null,"Active":true,"Required":false,"FieldMin":null,"FieldMax":null,"VisibleOnEdit":false,"isDefault":true,"updateDB":true}],\
                        "FormVSOptions":[{"VSOptionID":null,"ValidationSetID":null,"VSEntryID":null,"VSECategoryID":null,"VSECategory":null,"EntryName":null,"EntryValue":null,"OptionOrder":null,"Active":true,"isDefault":true,"updateDB":true}]\
                    }');
                */
                //console.log(JSON.stringify(data));

                /* adding store */
                store.setAllForms(dataX.Forms);
                store.setAllDepartments(dataX.Departments);
                store.setAllSections(dataX.Sections);
                store.setAllSubSections(dataX.SubSections);
                store.setAllFieldTypes(dataX.FieldTypes);
                store.setAllValidationSets(dataX.ValidationSets);
                
                var f;

                /* FORM SETUP - New or FormID */
                // Set DB for comparison
                // Defaults are mostly for the bits, getting rid of isDefault and only using updateDB (if it's default it will have to be updated)
                store.loadFormData(dataX.FormData);
                store.loadFormSections(dataX.FormSections);
                store.loadFormSubSections(dataX.FormSubSections);
                store.loadFormFields(dataX.FormFields);
                store.loadFormVSOptions(dataX.FormValSets);
                store.loadFormVSOptions(dataX.FormVSOptions);
                store.loadFormVSEntries(dataX.FormVSEntries);
                store.loadFormVSECategories(dataX.FormVSECategories);

                var adding;
    // FIX CODE: FIX FOR FIRST TO BY GENERAL MAIN SECTION, LAST TO BE GENERAL LAST?
                // if new form, insert default row for form data
                if(!(self.formID)){
                    console.log("adding data");
                    store.addDefaultFormData();
                }
                // If no sections, automatically push the default Main (first) section
                if(self.fData.FormSections.length === 0){
                    console.log("adding section");
                    store.addFirstSection();
                }

                Vue.nextTick(function(){
                    self.isLoading = false;
                });
            })
            .fail(function(dataX){
                console.log('Webservice fail: Get Form Builder');
                self.isLoading = false;
            });

        },

        /* get by ids */
        getSectionByID: function(id){
            return this.fData.FormSections.find(function(section){
                return section.FormSectionID == id;
            });
        },
        getOriginalByID: function(set, id, idProp){
            return set.find(function(s){
                return s[idProp] == id;
            });
        },
        getOriginalSectionByID: function(id){
            return this.db.FormSections.find(function(section){
                return section.FormSectionID == id;
            });
        },
        getSubSectionByID: function(id){
            var s = null;
            s = this.fData.FormSubSections.find(function(subsection){
                return subsection.FormSubSectionID == id;
            });
            return s;
        },
        getOriginalSubSectionByID: function(id){
            return this.db.FormSubSections.find(function(subsection){
                return subsection.FormSubSectionID == id;
            });
        },
        getFieldByID: function(id){
            return this.fData.FormFields.find(function(field){
                return field.FormFieldID == id;
            });
        },
        getOriginalFieldByID: function(id){
            return this.db.FormFields.find(function(field){
                return field.FormFieldID == id;
            });
        },


        /* COMPONENT EVENTS */
        // only update data from the main app

        updateFormData: function(payload){
            var self = this;
            console.log('updating form data');
            console.log(payload);

            // if value sent
            if(payload.val){
                console.log('val ' + payload.valPropname);
                // check if change to form val
                if (self.fData.FormData[payload.valPropname] != payload.val){
                    self.fData.FormData[payload.valPropname] = payload.val;
                    
                    //check if change from original val: if original val is null or original val is different
                    if (!(this.db.FormData) || this.db.FormData[payload.valPropname] != payload.val){
                        this.fData.FormData.updateDB = true;
                    }
                    else{
                        this.fData.FormData.updateDB = false;
                    }

                    // only null text prop if already set (no need for text if val)
                    if (this.fData.FormData.hasOwnProperty(payload.textPropname)){
                        this.fData.FormData[payload.textPropname] = null;
                    }
                }
            }
            // if only text was sent
            else if(payload.text){
                console.log('text');
                if(!(this.fData.FormData.hasOwnProperty(payload.textPropname))){
                    Vue.set(this.fData.FormData, payload.textPropname, payload.text);
                    this.fData.FormData[payload.valPropname] = null;
                    this.fData.FormData.updateDB = true;
                }
                else if (this.fData.FormData.hasOwnProperty(payload.textPropname) && this.fData.FormData[payload.textPropname] != payload.text){
                    this.fData.FormData[payload.textPropname] = payload.text;
                    this.fData.FormData[payload.valPropname] = null;
                    this.fData.FormData.updateDB = true;
                }
            }
            // if input cleared
            else{
                console.log('null field');
                this.fData.FormData[payload.valPropname] = null;

                if(this.fData.FormData.hasOwnProperty(payload.textPropname)){
                    this.fData.FormData[payload.textPropname] = null;
                }
                if(!(this.db.FormData) || !(this.db.FormData[payload.valPropname])){
                    this.fData.FormData.updateDB = false;
                }
                else{
                    this.fData.FormData.updateDB = true;
                }
            }
        },
        updateSectionData: function(payload){
            console.log('updating section data');

            var sec = this.getSectionByID(payload.formSectionID);
            var origSec = this.getOriginalSectionByID(payload.formSectionID);

            if (sec){
                // if value sent
                if(payload.val){
                    console.log('val ' + payload.valPropname);
                    // check if change to form val
                    if(sec[payload.valPropname] != payload.val){
                        sec[payload.valPropname] = payload.val;

                        //check if change from original val: if original section exists and val the same
                        if(!(origSec) || origSec[payload.valPropname] != payload.val){
                            sec.updateDB = true;
                        }
                        else{
                            sec.updateDB = false;
                        }
                        // only update text prop if already set
                        if (sec.hasOwnProperty(payload.textPropname)){
                            sec[payload.textPropname] = null;
                        }
                    }
                }
                // else if only text was sent
                else if (payload.text){
                    console.log('text');
                    if(!(sec.hasOwnProperty(payload.textPropname))){
                        Vue.set(sec, payload.textPropname, payload.text);
                        sec[payload.valPropname] = null;
                        sec.updateDB = true;
                    }
                    else if(sec.hasOwnProperty(payload.textPropname) && sec[payload.textPropname] != payload.text){
                        sec[payload.textPropname] = payload.text;
                        sec[payload.valPropname] = null;
                        sec.updateDB = true;
                    }
                }
                else{
                    console.log('null field');
                    sec[payload.valPropname] = null;
                    if(sec.hasOwnProperty(payload.textPropname)){
                        sec[payload.textPropname] = null;
                    }
                    if(!(origSec) || !(origSec[payload.valPropname])){
                        sec.updateDB = false;
                    }
                    else{
                        sec.updateDB = true;
                    }
                }
            }
            else{
                console.log('ERROR');
            }
            
        },
        updateFormField: function(payload){
            // only update data from the main app
            console.log('updateMainField');

            var field = this.getFieldByID(payload.formFieldID);
            var origField = this.getOriginalFieldByID(payload.formFieldID);

            if (field){
                // if value sent
                if(payload.val){
                    console.log('val ' + payload.valPropname);
                    // check if change to form val
                    if(field[payload.valPropname] != payload.val){
                        field[payload.valPropname] = payload.val;

                        //check if change from original val: if original section exists and val the same
                        if(!(origField) || origField[payload.valPropname] != payload.val){
                            field.updateDB = true;
                        }
                        else{
                            field.updateDB = false;
                        }
                        // only update text prop if already set
                        if (field.hasOwnProperty(payload.textPropname)){
                            field[payload.textPropname] = null;
                        }
                    }
                }
                // else if only text was sent
                else if (payload.text){
                    console.log('text');
                    if(!(field.hasOwnProperty(payload.textPropname))){
                        Vue.set(field, payload.textPropname, payload.text);
                        field[payload.valPropname] = null;
                        field.updateDB = true;
                    }
                    else if(field.hasOwnProperty(payload.textPropname) && field[payload.textPropname] != payload.text){
                        field[payload.textPropname] = payload.text;
                        field[payload.valPropname] = null;
                        field.updateDB = true;
                    }
                }
                else{
                    console.log('null field');
                    field[payload.valPropname] = null;
                    if(field.hasOwnProperty(payload.textPropname)){
                        field[payload.textPropname] = null;
                    }
                    if(!(origField) || !(origField[payload.valPropname])){
                        field.updateDB = false;
                    }
                    else{
                        field.updateDB = true;
                    }
                }
            }
            else{
                console.log('ERROR');
            }
        },
        
        /* ADDING TO FORM */

        /*setEditField: function(payload){
            this.fieldEditing = payload.fieldID;
        },

        /* CODE INCOMPLETE */
        addNewSection: function(payload){
            var self = this;
            var adding;
            console.log("add new section");
            //store.addNewSection();

            this.newFormSectionID--;
            adding = clone(this.formDefaults.FormSection);
            adding.FormSectionID = self.newFormSectionID;
            adding.SectionOrder = self.sectionCount;
            adding.SectionOrder++;
            this.fData.FormSections.push(adding);

            // if a simple add section at end of form
            //if(this.fData.FormSections.length == payload.index){
            /*    this.fData.FormSections.push(adding);
            //}
            // else if inserting to middle of sections
            //else{
                console.log("UNFINISHED");
                //this.data.FormSections.splice(adding);
/* -- ADD CODE TO INCREASE ORDER ON SECTIONS IF SPLICED *
            }*/
        },
        
/* CODE INCOMPLETE *
        addNewField: function(payload){
            console.log("add new field");
            var adding = app.formDefaults.Field;
            adding.FormFieldID = app.maxFieldID + 1;
            adding.FieldOrder = payload.index + 1;

            // if a simple add section at end of form
            if(this.data.FormFields.length == payload.index){
                this.data.FormFields.push(adding);
            }
            // else if inserting to middle of sections
            else{
                console.log("UNFINISHED");
                //this.data.FormFields.splice(adding);
/* -- ADD CODE TO INCREASE ORDER ON FIELDS IF SPLICED *
            }
        },
/* CODE INCOMPLETE *
        addNewSubSection: function(payload){
            console.log("add new sub section");
            var adding = app.formDefaults.FormSubSection;
            adding.SubSectionID = app.maxSubSectionID + 1;
            adding.SubSectionOrder = payload.index + 1;

            // if a simple add section at end of form
            if(this.data.FormSubSections.length == payload.index){
                this.data.FormSubSections.push(adding);
            }
            // else if inserting to middle of sections
            else{
                console.log("UNFINISHED");
                //this.data.FormSubSections.splice(adding);
/* -- ADD CODE TO INCREASE ORDER ON SUBSECTIONS IF SPLICED *
            }
        }
        */
    }
}

var routes = [
    { path: '/', component: Home },
    { path: '/build/', component: Build},
    { path: '/build/:formid/', component: Build}
]

var router = new VueRouter({
    routes: routes // short for `routes: routes`
})

var app = new Vue({
    router: router,
    el: '#app',
    data:{
        isLoading: false,
        username: ''
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
        }
    }
})