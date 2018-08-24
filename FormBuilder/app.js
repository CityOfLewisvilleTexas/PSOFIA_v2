/*
	Modified 7/12 PM
	- unfinished, cut off at rewriting AJAX - added DB, pulled out formDefaults
	- not tested 
	- might have fully corrected for builder-form components: section & sub-section
*/

"use strict";

const eventHub = new Vue();

var app = new Vue({
    el: "#app",
    data: {
        username: '',
        hello: 'Hello!',
        isLoading: true,
        isSubmitting: false,
		fieldEditing: '',
		
		formID: '',
        data: {
			Forms: [],	// autocomplete for FormName
			Departments: [], // autocomplete for Department, modal, needs updateDB?
			Sections: [], // autocomplete for SectionTitle, needs updateDB
			SubSections: [],
			FieldTypes: [],
			ValidationSets: [],
			VSEntries: [],
/* LOOP TO ADD ORIGINAL VALUE FOR COMPARISON??? */
			FormData: {}, //  needs updateDB
			FormSections: [], // needs updateDB
			FormSubSections: [], // needs updateDB
			FormFields: [], // needs updateDB
			FormVSOptions: [], // needs updateDB
/* ADDING FOR COMPARISON??? */
			DB: {
				FormData: {}, //  needs updateDB
				FormSections: [], // needs updateDB
				FormSubSections: [], // needs updateDB
				FormFields: [], // needs updateDB
				FormVSOptions: [], // needs updateDB
			},
/* PULLING OUT OF data OBJ */
			formDefault: {
				FormData: {},
				FormSection: {}, // needs updateDB
				FormSubSection: {}, // needs updateDB
				FormField: {}, // needs updateDB
				FormVSOption: {} // needs updateDB
			},
		},
		formDefaults: {
			FormData: {},
			FormSection: {}, // needs updateDB
			FormSubSection: {}, // needs updateDB
			FormField: {}, // needs updateDB
			FormVSOption: {} // needs updateDB
		},
		
/* AUTOCOMPLETES - I DON'T THINK THIS WILL BE IN THE INDEX */
		departmentAC: [],
		sectionAC: [],
		subSectionAC: [],
    },
	
	computed:{
		orderedSections: function(){
			return this.data.FormSections.sort(function(a, b){
				return a.SectionOrder - b.SectionOrder;
			});
		},
		
/* INCOMPLETE CODE */
/* - THIS IS FROM FORM ENTRY */
/* -- EITHER HAVE TO UPDATE ENTIRE FIELD EVERY TIME, OR KEEP TRACK ELSEWHERE */
		/*fieldsModified: function(){
			return this.data.FormFields.filter(function(f){
				return f.updateDB;
			}).map(function(f){
				return{
					'FieldHTMLID': f.FieldHTMLID,
					'FieldValue': f.fieldVal
					// DON'T NEED SECTION ORDER OR SUBSECTION ORDER
				};
			});
		},*/
		
		/* MAX ID TO CREATE FAKE ID FOR ADDING TO FORM - REQUIRED FOR V-FOR KEY */
/* MAYBE ADD FIELD TO TRACK IF FAKE ?? */
		
/* CHECK: haven't written like this before */
        maxSectionID: function(){
			var ids = this.data.FormSections.reduce(function(result, section){
                if(result >= section.SectionID){
                    return result;
                }
                else{
                    return section.SectionID;
                }
            }, 0);
            return Math.max(ids);
        },
        maxSubSectionID: function(){
/* CHECK: haven't written like this before */        
            var ids = this.data.FormSubSections.reduce(function(result, subsection){
                if(result >= subsection.SubSectionID){
                    return result;
                }
                else{
                    return subsection.SubSectionID;
                }
            }, 0);
            return Math.max(ids);
        },
        maxFieldID: function(){
/* CHECK: haven't written like this before */          
            var ids = this.data.FormFields.reduce(function(result, field){
                if(result >= field.FormFieldID){
                    return result;
                }
                else{
                    return field.FormFieldID;
                }
            }, 0);
            return Math.max(ids);
        },
	},

    watch: {
        
    },
	
	created: function(){
		eventHub.$on('update-input', this.updateField);
		
		eventHub.$on('editing-field', this.setEditField);
		
		/* LISTEN FOR EVENTS TO ADD TO FORM */
		eventHub.$on('add-new-field', this.addNewField);
		eventHub.$on('add-new-section', this.addNewSection);
		eventHub.$on('add-new-sub-section', this.addNewSubSection);
	},

    // start the app once the DOM is rendered
    mounted: function() {
        this.checkForUsername();
		this.getFormBuilder();
    },

    methods: {
		// get username from COL if it exists
        checkForUsername: function() {

            // ajax
            $.get('http://ax1vnode1.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + localStorage.colEmail, function(data) {

                // set username, set hello message (above form)
                app.username = (data.length) ? data[0].givenName : ''
                app.hello = (app.username) ? 'Hello, ' + app.username + '!' : 'Hello!'

                // warning message
                if (!app.username) alert('Could not verify identity. Form may not submit correctly.')
            })
        },

       getFormBuilder: function(){
			// first check if the Form ID is in the URL, if not, webservice will return correctly for new
			this.formID = getParameterByName('formID');
			
			$.post('https://query.cityoflewisville.com/v2/',{
				webservice : 'PSOFIAv2/Get Form Builder',
				formID: this.formID
			},
			function(dataX){
				/*	var app = this;
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
				app.data.Forms = dataX.Forms;
				app.data.Departments = dataX.Departments;
				app.data.Sections = dataX.Sections;
				app.data.SubSections = dataX.SubSections;
				app.data.FieldTypes = dataX.FieldTypes;
				app.data.ValidationSets = dataX.ValidationSets;
/* MIGHT WANT TO TAKE OUT ENTRIES, RUN OTHER QUERY WHEN SELECTED */
				app.data.VSEntries = dataX.VSEntries;
				
				/* DEFAULT FORM SETUP IF NEW OR ACTUAL FORM SETUP */
				// Set DB for comparison
				// Defaults are mostly for the bits, getting rid of isDefault and only using updateDB (if it's default it will have to be updated)
				app.data.FormData = dataX.FormData.find(function(f){
					return f.updateDB === false;
				});
					app.data.DB.FormData = dataX.FormData.find(function(f){
						return f.updateDB === false;
					});

				app.data.FormSections = dataX.FormSections.filter(function(f){
					return f.updateDB === false;
				});
				app.data.FormSubSections = dataX.FormSubSections.filter(function(f){
					return f.updateDB === false;
				});
				app.data.FormFields = dataX.FormFields.filter(function(f){
					return f.updateDB === false;
				});
				app.data.FormVSOptions = dataX.FormVSOptions.filter(function(f){
					return f.updateDB === false;
				});
				app.data.formDefault.FormData = dataX.FormData.find(function(f){
					return f.updateDB === true;
				});
				
				// Hard coded default section is Main (last)
				app.data.formDefault.FormSection = dataX.FormSections.find(function(f){
					return f.updateDB === true && f.SectionID == 2;
				});
				// Hard coded separate section for Main (last)
				app.data.formDefault.FirstFormSection = dataX.FormSections.find(function(f){
					return f.updateDB === true && f.SectionID == 1;
				});
				app.data.formDefault.FormSubSection = dataX.FormSubSections.find(function(f){
					return f.updateDB === true;
				});
				app.data.formDefault.FormField = dataX.FormFields.find(function(f){
					return f.updateDB === true;
				});
				app.data.formDefault.FormVSOption = dataX.FormVSOptions.find(function(f){
					return f.updateDB === true;
				});

				Vue.nextTick(function(){
					console.log('tick');
    // FIX CODE: FIX FOR FIRST TO BY GENERAL MAIN SECTION, LAST TO BE GENERAL LAST?
				// if new form, insert default row for form data
					if(!(app.formID) || app.data.FormData.length == 0){
						app.data.FormData = app.data.formDefault.FormData;
					}
					// If no sections, automatically push the default Main (first) section
					if(app.data.FormSections.length === 0){
						var adding = app.data.formDefault.FirstFormSection;
						adding.FormSectionID = app.maxSectionID + 1;
						app.data.FormSections.push(adding);
					}
					
					Vue.nextTick(function(){
						app.isLoading = false;
					});
				});
				
				/*Vue.nextTick(function(){
					//app.initSelects();
					//app.initDatePicker();
				});*/
			})
			.fail(function(data){
				console.log('Webservice fail');
				app.isLoading = false;
			});

		},
		
		getSectionFields: function(section){
			return this.data.FormFields.filter(function(f){
				// IS NOT SectionID
				return f.FormSectionID == section.FormSectionID;
			});
		},
		getSubSections: function(section){
			return this.data.FormSubSections.filter(function(ss){
				// IS NOT FormSectionID
				return ss.SectionID == section.SectionID;
			});
		},

        /* COMPONENT EVENTS */

        updateFormData: function(payload){
            // only update data from the main app
            console.log('updateMainData');
            // check if change
// ADD CODE: KEEP SEPARATE OBJs FOR ORIGINAL DATA, COMPARE TO ORIGINAL FOR UPDATE DB
// covers if they change in app, then change back to what was in db
            if (this.data.FormData[payload.prop] != payload.val){
                this.data.FormData[payload.prop] = payload.val;
                this.data.FormData.updateDB = true;
            }
        },
        updateFormSection: function(payload){
            // only update data from the main app
            console.log('updateMainSection');
            // check if change
// ADD CODE: KEEP SEPARATE OBJs FOR ORIGINAL DATA, COMPARE TO ORIGINAL FOR UPDATE DB
// covers if they change in app, then change back to what was in db
        var s = this.data.FormSections.find(function(section){
                return section.SectionID == payload.sectionID;
            })
            if (f){
                f.fieldVal = payload.val;
                // check if the current record matches
                if(app.data.Record.length > 0){
                    if(app.data.Record[0][payload.htmlID] !== payload.ID){
                        f.updateDB = true;
                    }
                    else{
                        f.updateDB = false;
                    }
                }
                else{
                    f.updateDB = true;
                }
            }
            else{
                console.log('ERROR');
            }
        },
        updateFormField: function(payload){
            // only update data from the main app
            console.log('updateMainField');
           /* var f = this.data.Fields.find(function(field){
                return field.FormFieldID == payload.fieldID;
            })
            if (f){
                f.fieldVal = payload.val;
                // check if the current record matches
                if(app.data.Record.length > 0){
                    if(app.data.Record[0][payload.htmlID] !== payload.ID){
                        f.updateDB = true;
                    }
                    else{
                        f.updateDB = false;
                    }
                }
                else{
                    f.updateDB = true;
                }
            }
            else{
                console.log('ERROR');
            }*/
        },
		
		/* ADDING TO FORM */

		setEditField: function(payload){
			this.fieldEditing = payload.fieldID;
		},
		
/* CODE INCOMPLETE */
        addNewField: function(payload){
			console.log("add new field");
            var adding = app.data.formDefault.Field;
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
/* -- ADD CODE TO INCREASE ORDER ON FIELDS IF SPLICED */
            }
        },
/* CODE INCOMPLETE */
        addNewSection: function(payload){
			console.log("add new section");
            var adding = app.data.formDefault.FormSection;
            adding.SectionID = app.maxSectionID + 1;
            adding.SectionOrder = payload.index + 1;

            // if a simple add section at end of form
            if(this.data.FormSections.length == payload.index){
                this.data.FormSections.push(adding);
            }
            // else if inserting to middle of sections
            else{
                console.log("UNFINISHED");
                //this.data.FormSections.splice(adding);
/* -- ADD CODE TO INCREASE ORDER ON SECTIONS IF SPLICED */
            }
        },
/* CODE INCOMPLETE */
        addNewSubSection: function(payload){
			console.log("add new sub section");
            var adding = app.data.formDefault.FormSubSection;
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
/* -- ADD CODE TO INCREASE ORDER ON SUBSECTIONS IF SPLICED */
            }
        },


        // fill in the form
        autoFillForm: function() {
			/*
            // loop through the form entries
            for (var prop in this.editValues) {
                if (this.editValues.hasOwnProperty(prop)) {

                    // converts "true" / "false" string to boolean
                    if (this.editValues[prop] == "true") this.editValues[prop] = true
                    if (this.editValues[prop] == "false") this.editValues[prop] = false

                    // handle date fields
                    if (prop == 'dateAwarded' || prop == 'appdate' || prop == 'finalInspections' || prop == 'newVendor' || prop == 'purchaseOrder' || prop == 'paymentAuth' || prop == 'surveyEmailed') {

                        // manually set the datepicker
                        this.autoFillDate(prop, this.editValues[prop])
                        this.formValues[prop] = this.editValues[prop]
                    }

                    // handle select fields
                    else if (prop == 'projectStatus' || prop == 'lmi' || prop == 'isdisabled' || prop == 'is62' || prop == 'trn') {

                        // manually set the select fields
                        this.autoFillSelect(prop, this.editValues[prop])
                        this.formValues[prop] = this.editValues[prop]
                    }

                    // handle everything else except the psofia record number (no need for it on form)
                    else if (prop != 'PSOFIA_RecordNumber') {
                        this.formValues[prop] = this.editValues[prop]
                    }

                }
				
            }*/

            // re-render all the input fields (pushes the labels out of the way)
            Vue.nextTick(function() {
                Materialize.updateTextFields()
                //$('select').material_select()
            })
        },

        // fill date in manually
        autoFillDate: function(id, val) {

            // if invalid date, make it an empty string (to submit to psofia)
            if (!val || val == 'Invalid date') {
                this.editValues[id] = ''
                return
            }

            // get the <input>
            var $input = $('#'+id).pickadate()

            // get the picker object directly
            var picker = $input.pickadate('picker')

            // set the date
            picker.set('select', val, { format: 'yyyy-mm-dd' })
        },

        // fill selects in manually
        autoFillSelect: function(id, val) {
            $('#'+id).val(val)
        },

        // initialize the materialize date picker
        initDatePicker: function() {
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 15,
                today: 'Today',
                clear: 'Clear',
                close: 'Ok',
                onSet: function (ele) {
                    if(ele.select){
                        this.close()
                    }
                },
                onClose: function() {
                    $(document.activeElement).blur() // fixes the date picker opening when leaving tab and coming back
                }
            })

            // format date values when they are changed (psofia compatibility)
            Vue.nextTick(function() {
                $('.datepicker').change(function() {
                    var id = $(this).attr('id')
                    var d = new Date($(this).val())
                    app.formValues[id] = moment(d).format('YYYY-MM-DD')
                })
            })
        },

        // initialize the materialize selects
        initSelects: function() {

            // setup
            $('select').material_select()

            // set the vue values
            Vue.nextTick(function() {
                $('select').change(function() {
                    var id = $(this).attr('id')
                    app.formValues[id] = $(this).val()
                })
            })
        },
		
/*
        // submit the form
        submitForm: function() {

            // error verifying identity
            if (!app.username) return

            // make all uppercase address
            app.formValues.recipientAddress = app.formValues.recipientAddress.toUpperCase()

            // update rnumber (just a fallback in case earlier checking failed)
            if (!app.formValues.recipientRNumber) {
                app.formValues.recipientRNumber = app.getRnumberFromAddress(app.formValues.recipientAddress)
                if (!app.formValues.recipientRNumber) {
                    alert('No RNumber found with this address. Be sure to select an address from the autocomplete.')
                    return
                }
                else
                    Vue.nextTick(function() {
                        Materialize.updateTextFields()
                    })
            }

            // set up object for psofia api
            var psofiaData = [{
                'User': localStorage.colEmail,
                'Form': '78'
            }]

            // if editing, use different URL
            if (app.editing) {
                app.editSubmit()
                return
            }

            // loop through form and build json object array
            for (var prop in this.formValues) {
                if (this.formValues.hasOwnProperty(prop)) {
                    if (this.formValues[prop] == 'Invalid date') this.formValues[prop] = ''
                    var obj = (prop) ? { Id: prop, Value: this.formValues[prop] } : {}
                    if (obj.Id)
                        psofiaData.push(obj);
                }
            }

            // to string!
            psofiaData = JSON.stringify(psofiaData);

            // one last error check
            if (!psofiaData) return

            // "send off" the form, scroll to top, change the message
            $('#form').addClass('blurred')
            app.isSubmitting = true
            $(window).scrollTop(0)
            app.hello = 'Submitting now...'

            // ajax
            $.post('https://ax1vnode1.cityoflewisville.com/v2/', {
                webservice: 'PSOFIA/AddAPI',
                auth_token: localStorage.colAuthToken,
                data: psofiaData
            }, function(data) {

                // success
                if (data.return[0].RecordNumber) {

                    // allows animation to finish (at least)
                    setTimeout(function() {
                        $('#form').removeClass('blurred')
                        app.hello = 'Hello, ' + app.username + '!'
                        Materialize.toast('Success!', 5000, 'rounded')
                        app.isSubmitting = false
                    }, 500)

                    // set this submission as the new backup
                    app.formValuesBackup = JSON.parse(JSON.stringify(app.formValues))
                    app.fixBackup()
                }

                // fail
                else {
                    alert('Something may have gone wrong')
                }
            });

        },

        // when submitting an edit to an existing record number
        editSubmit: function() {

            var changeMade = false;
            var editsMade = [];

            // loop through backup
            for (var prop in app.formValuesBackup) {
                if (app.formValuesBackup.hasOwnProperty(prop)) {

                    // if the backup is different from the current values (change has been made)
                    if (app.formValuesBackup[prop] != app.formValues[prop]) {

                        // dont worry about record number (not needed from backup)
                        if (prop != 'PSOFIA_RecordNumber') {

                            // at least one change made
                            changeMade = true

                            // fix invalid date if it slipped by
                            if (this.formValues[prop] == 'Invalid date') {
                                this.formValues[prop] = ''
                            }

                            // build object
                            var data = [{
                                "recordNumber": app.editValues.PSOFIA_RecordNumber,
                                "User": localStorage.colEmail,
                                "Form": '78',
                                "Id": prop,
                                "Value": app.formValues[prop]
                            }]

                            // build list of edits made
                            editsMade.push(data)
                            console.log(prop, ':', this.formValuesBackup[prop], '->', this.formValues[prop]) // document change in console
                        }
                    }
                }
            }

            // if changes were actually made to the form
            if (changeMade) {

                // build array of ajax calls
                var promiseArray = editsMade.map(function(data) {
                        return axios.post('http://ax1vnode1.cityoflewisville.com/v2/?webservice=PSOFIA/UpdateAPI', {
                            auth_token: localStorage.colAuthToken,
                            data: JSON.stringify(data)
                        })
                    })

                // "send off" the form, scroll to top, change the message
                $('#form').addClass('blurred')
                app.isSubmitting = true
                $(window).scrollTop(0)
                app.hello = 'Submitting now...'

                // ajax
                axios.all(promiseArray).then(function(results) {

                        // check if all edits were successful
                        var allGood = true;
                        for (var i in results) {
                            if (results[i].status != 200) allGood = false;
                        }

                        // all edits were NOT successful
                        if (!allGood) Materialize.toast('Something went wrong', 10000, 'rounded')

                        // success!
                        else {

                            // allows animation to finish (at least)
                            setTimeout(function() {
                                $('#form').removeClass('blurred')
                                app.hello = 'Hello, ' + app.username + '!'
                                Materialize.toast('Success!', 5000, 'rounded')
                                app.isSubmitting = false
                            }, 500)

                            // set this submission as the new backup
                            app.formValuesBackup = JSON.parse(JSON.stringify(app.formValues))
                            app.fixBackup()
                        }
                    });

            }

            // no changes were made to the form
            else alert('No fields were changed in the form.')
        }
		*/
    }
});

// grabs the value of a url parameter from an (optional) url
// from stackoverflow.. dont ask how it works (regex)
function getParameterByName(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}

// scrolling effect..kinda fun..but pointless
// $(window).scroll(function() {
//     $("#extended-toolbar .edge").height($(window).scrollTop() / ($(document).height() - $(window).height()) * 350 + 4)
// })