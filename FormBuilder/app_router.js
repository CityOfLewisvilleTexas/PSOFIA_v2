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
            sharedState: store.state,
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
    created: function(){
        this.initialize();
    },
    watch: {
        // call again the method if the route changes
        /*'$route': function(to, from){
            this.routeChanged();
        }*/
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
            return '/build/' + _formID.toString();
        },
        routeChanged: function(){
            console.log("Home - Route Changed");
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

var Build = {
    template: `
        <v-layout row wrap>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12 sm6>
                        <h4 class="display-2">{{title}}</h4><v-progress-circular indeterminate v-if="isLoading" color="primary"></v-progress-circular>
                        <span class="subheading">Created: {{fData.FormData.CreateDate}}</span>
                        <span class="subheading">Last Edited: {{fData.FormData.LastEditDate}}</span>
                    </v-flex>
                    <v-flex xs12 sm6 class="text-lg-right">
                        <span class="subheading">{{status}}</span>
                        <v-btn to="/">Return to View All</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs12>
                <builder-form-data-v
                    :form-data="fData.FormData"
                    :orig-form-data="db.FormData"
                    :departments="fData.Departments"
                >
                </builder-form-data-v>
            </v-flex>
                        
            <!--MAKE A COMPONENT FOR EACH SECTION / SUBSECTION-->
                        
            <v-flex xs12>
                <builder-form-section-v v-for="s in fData.FormSections"
                    :key="s.FormSectionID"
                    :section="s"
                    :orig-section="getOriginalSectionByID(s.FormSectionID)"
                    :sub-sections="getSubSections(s)"
                    :fields="getSectionFields(s)"
                    :orig-sub-sections="db.FormSubSections"
                    :orig-fields="db.FormFields"
                    :form-defaults="formDefaults"
                    :all-sections="fData.Sections"
                    :all-sub-sections="fData.SubSections"
                    :all-field-types="fData.FieldTypes"
                    :all-validation-sets="fData.ValidationSets"
                ></builder-form-section-v>
            </v-flex>
                    
            <v-flex xs12>
                <v-card dark color="primary">
                    <v-card-text class="px-0">
                        <a class="waves-effect waves-light btn">Add New Section</a>
                    </v-card-text>
                </v-card>
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
            //list vars
            // adding store
            sharedState: store.state,
            isLoading: true,
            formID: '',
            fData: {
                Forms: [],  // autocomplete for FormName
                Departments: [], // autocomplete for Department, modal, needs updateDB?
                Sections: [], // autocomplete for SectionTitle, needs updateDB
                SubSections: [],
                FieldTypes: [],
                ValidationSets: [],
                VSEntries: [],
    /* LOOP TO ADD ORIGINAL VALUE FOR COMPARISON??? - No, that will be in component */
    /* remember to add reset orig val for dialog and such, not re-created, but have to reset orig val?*/
                FormData: {}, //  needs updateDB
                FormSections: [], // needs updateDB
                FormSubSections: [], // needs updateDB
                FormFields: [], // needs updateDB
                FormVSOptions: [], // needs updateDB
    /* ADDING FOR COMPARISON??? */
            },
            db: {
                FormData: {}, //  needs updateDB
                FormSections: [], // needs updateDB
                FormSubSections: [], // needs updateDB
                FormFields: [], // needs updateDB
                FormVSOptions: [], // needs updateDB
            },
            formDefaults: {
                FormData: {},
                FormSection: {}, // needs updateDB
                FormSubSection: {}, // needs updateDB
                FormField: {}, // needs updateDB
                FormVSOption: {} // needs updateDB
            },
            newSectionID: 0,
            newSubSectionID: 0,
            newFieldID: 0
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
        status: function(){
            if(this.unsavedChanges){
                return 'Unsaved Changes';
            }
            return 'Saved to DB';
        },
        unsavedChanges: function(){
            if(!(this.formID) || this.fData.FormData.updateDB || this.sectionChanged || this.subSectionChanged || this.fieldChanged || this.vsOptionChanged){
                return true;
            }
            return false;
        },
        sectionChanged: function(){
            var f = this.fData.FormSections.find(function(s){
                return s.updateDB == true;
            });
            if(f){
                return true;
            }
            return false;
        },
        subSectionChanged: function(){
            var f = this.fData.FormSubSections.find(function(ss){
                return ss.updateDB == true;
            });
            if(f){
                return true;
            }
            return false;
        },
        fieldChanged: function(){
            var f = this.fData.FormFields.find(function(ff){
                return ff.updateDB == true;
            });
            if(f){
                return true;
            }
            return false;
        },
        vsOptionChanged: function(){
            var f = this.fData.FormVSOptions.find(function(o){
                return o.updateDB == true;
            });
            if(f){
                return true;
            }
            return false;
        }

    },
    methods: {
        initialize: function(){
            console.log("init Build");
            var self = this;

            this.listenOnHub();

            this.formID = this.$route.params.formid

            Vue.nextTick(function(){
                self.getFormBuilder();
            });
        },
        routeChanged: function(){
            console.log("Build - Route Changed")
        },
        listenOnHub: function(){
            var self = this;
            eventHub.$on('update-form-data', self.updateFormData);
            eventHub.$on('update-section-data', self.updateSectionData);
            eventHub.$on('update-field', self.updateFormField);
            
            //eventHub.$on('editing-field', self.setEditField);

            eventHub.$on('add-new-field', self.addNewField);
            eventHub.$on('add-new-section', self.addNewSection);
            eventHub.$on('add-new-sub-section', self.addNewSubSection);
        },
        getFormBuilder: function(){
            console.log("getFormBuilder");
            var self = this;

            self.isLoading = true;
            
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Form Builder',
                formID: self.formID
            },
            function(dataX){
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
                
                /* FULL POSIBILITIES */
                self.fData.Forms = dataX.Forms;
                self.fData.Departments = dataX.Departments;
                self.fData.Sections = dataX.Sections;
                self.fData.SubSections = dataX.SubSections;
                self.fData.FieldTypes = dataX.FieldTypes;
                self.fData.ValidationSets = dataX.ValidationSets;

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
                f = dataX.FormData.find(function(f){
                    return f.updateDB === false;
                });
                    self.fData.FormData = f;
                    self.db.FormData = clone(f);
                    store.loadFormData(f);

                f = dataX.FormSections.filter(function(f){
                    return f.updateDB === false;
                });
                    self.fData.FormSections = f;
                    self.db.FormSections = clone(f);
                    store.loadFormSections(f);

                f = dataX.FormSubSections.filter(function(f){
                    return f.updateDB === false;
                });
                    self.fData.FormSubSections = f;
                    self.db.FormSubSections = clone(f);
                    store.loadFormSubSections(f);

                f = dataX.FormFields.filter(function(f){
                    return f.updateDB === false;
                });
                    self.fData.FormFields = f;
                    self.db.FormFields = clone(f);
                    store.loadFormFields(f);

                f = dataX.FormVSOptions.filter(function(f){
                    return f.updateDB === false;
                });
                    self.fData.FormVSOptions = f;
                    self.db.FormVSOptions = clone(f);
                    store.loadFormVSOptions(f);


                f = dataX.FormData.find(function(f){
                    return f.updateDB === true;
                });
                self.formDefaults.FormData = f;
                store.setDefaultFormData(f);
                // Hard coded default section is Main (last)
                f = dataX.FormSections.find(function(f){
                    return f.updateDB === true && f.SectionID == 2;
                });
                self.formDefaults.FormSection = f;
                store.setDefaultSection(f);
                // Hard coded separate section for Main (first)
                f = dataX.FormSections.find(function(f){
                    return f.updateDB === true && f.SectionID == 1;
                });
                self.formDefaults.FirstFormSection = f;
                store.setDefaultFirstSection(f);
                f = dataX.FormSubSections.find(function(f){
                    return f.updateDB === true;
                });
                self.formDefaults.FormSubSection = f;
                store.setDefaultSubSection(f);
                f = dataX.FormFields.find(function(f){
                    return f.updateDB === true;
                });
                self.formDefaults.FormField = f;
                store.setDefaultField(f);
                f = dataX.FormVSOptions.find(function(f){
                    return f.updateDB === true;
                });
                self.formDefaults.FormVSOption = f;
                store.setDefaultVSOption(f);


                Vue.nextTick(function(){
                    console.log("tick1");
                    var adding;
    // FIX CODE: FIX FOR FIRST TO BY GENERAL MAIN SECTION, LAST TO BE GENERAL LAST?
                // if new form, insert default row for form data
                    if(!(self.formID) || self.fData.FormData.length === 0){
                        console.log("adding data");
                        adding = self.formDefaults.FormData;
                        adding.FormID = -1;
                        //self.data.fData.FormData = self.formDefaults.FormData;
                        self.fData.FormData = adding;
                    }
                    // If no sections, automatically push the default Main (first) section
                    if(self.fData.FormSections.length === 0){
                        console.log("adding section");
                        self.newSectionID--;
                        adding = self.formDefaults.FirstFormSection;
                        adding.FormSectionID = self.newSectionID;
                        self.fData.FormSections.push(adding);
                    }
                    
                    Vue.nextTick(function(){
                        console.log("tick2");
                        self.isLoading = false;
                    });
                });
            })
            .fail(function(dataX){
                console.log('Webservice fail: Get Form Builder');
                self.isLoading = false;
            });

        },

        getSectionFields: function(section){
            return this.fData.FormFields.filter(function(f){
                // IS NOT SectionID
                return f.FormSectionID == section.FormSectionID;
            });
        },
        getSubSections: function(section){
            return this.fData.FormSubSections.filter(function(ss){
                // IS NOT FormSectionID
                return ss.SectionID == section.SectionID;
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

        /* CODE INCOMPLETE *
        addNewSection: function(payload){
            var self = this;
            console.log("add new section");

            this.newSectionID--;
            adding = this.formDefaults.FormSection;
            adding.FormSectionID = self.newSectionID;
            self.data.FormSections.push(adding);
            adding.SectionOrder = payload.index + 1;

            // if a simple add section at end of form
            if(this.data.FormSections.length == payload.index){
                this.data.FormSections.push(adding);
            }
            // else if inserting to middle of sections
            else{
                console.log("UNFINISHED");
                //this.data.FormSections.splice(adding);
/* -- ADD CODE TO INCREASE ORDER ON SECTIONS IF SPLICED *
            }
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
    { path: '/build', component: Build},
    { path: '/build/:formid', component: Build}
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