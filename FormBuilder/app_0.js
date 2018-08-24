"use strict";

const eventHub = new Vue();

var app = new Vue({
    el: "#app",
    data: {
        username: '',
        hello: 'Hello!',
        isLoading: true,
        isSubmitting: false,
        editing: false,
		
        data: {
			Forms: [],	// autocomplete for FormName
			Departments: [], // autocomplete for Department, modal, needs updateDB?
			Sections: [], // autocomplete for SectionTitle, needs updateDB
			SubSections: [],
			FieldTypes: [],
			ValidationSets: [],
			VSEntries: [],
			FormData: [], //  needs updateDB
			FormSections: [], // needs updateDB
			FormSubSections: [], // needs updateDB
			FormFields: [], // needs updateDB
			FormVSOptions: [], // needs updateDB
			formDefault: {
				FormData: [],
				FormSection: [], // needs updateDB
				FormSubSection: [], // needs updateDB
				FormField: [], // needs updateDB
				FormVSOption: [], // needs updateDB
			},
		},
		formValues: {
			formName: '',
			tableName: '',
			viewFormAddress: '',
			active: 1,
			department: '',
			refreshOnSubmit:1
		},
        formValuesBackup: {},
        editValues: {},
		
		departmentAC: [],
		sectionAC: [],
		subSectionAC: [],
		fieldTypes: [],
		validationSets: []
    },
	
	computed:{
		// ordered sections
		formSectionsOrdered: function(){
			return this.data.FormSections.sort(function(a, b){
				return a.SectionOrder - b.SectionOrder;
			});
		},
		/*formChanges: function(){
			return this.data.Fields.filter(function(field){
				return field.updateDB;
			}).map(function(field){
				return{
					'FieldHTMLID': field.FieldHTMLID,
					'FieldValue': field.fieldVal
				};
			});
			
		}*/
	},

    watch: {
        
    },
	
	created: function(){
		eventHub.$on('update-input', this.updateField);
	},

    // start the app once the DOM is rendered
    mounted: function() {
        //this.checkForUsername();
		this.getFormBuilder();
    },

    methods: {
		// get username from COL if it exists
        /*checkForUsername: function() {

            // ajax
            $.get('http://ax1vnode1.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + localStorage.colEmail, function(data) {

                // set username, set hello message (above form)
                app.username = (data.length) ? data[0].givenName : ''
                app.hello = (app.username) ? 'Hello, ' + app.username + '!' : 'Hello!'

                // warning message
                if (!app.username) alert('Could not verify identity. Form may not submit correctly.')
            })
        },*/

       getFormBuilder: function(){
			// first check if the record number is in the URL
			this.formID = getParameterByName('formID');
			
			/*$.post('https://query.cityoflewisville.com/v2/',{
				webservice : 'PSOFIAv2/Get Form Builder',
				formID: this.formID
			},
			function(dataO){*/
			var app = this;
				var dataX = JSON.parse('{"Forms":[{"FormID":2,"FormName":"City of Lewisville Plant Report","Department":1},{"FormID":1,"FormName":"Operations Report","Department":1}],"Departments":[{"DepartmentID":1,"Department":"Wastewater Treatment"}],"Sections":[{"SectionID":5,"SectionTitle":"AMMONIA"},{"SectionID":1,"SectionTitle":"Main (first)"},{"SectionID":2,"SectionTitle":"Main (last)"},{"SectionID":4,"SectionTitle":"OPERATORS"},{"SectionID":3,"SectionTitle":"PLANT WASTING"}],"SubSections":[],"FieldTypes":[{"FieldTypeID":1,"FieldType":"DATE","FieldTypeOrder":1},{"FieldTypeID":2,"FieldType":"TIME","FieldTypeOrder":2},{"FieldTypeID":3,"FieldType":"NUMBER","FieldTypeOrder":3},{"FieldTypeID":4,"FieldType":"TEXT","FieldTypeOrder":4},{"FieldTypeID":5,"FieldType":"TEXTAREA","FieldTypeOrder":5},{"FieldTypeID":6,"FieldType":"CHECKBOX","FieldTypeOrder":6},{"FieldTypeID":7,"FieldType":"SELECT","FieldTypeOrder":7}],"ValidationSets":[{"ValidationSetID":1,"ValidationSetName":"PlantReportTime"}],"VSEntries":[{"VSEntryID":6,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"10am","EntryValue":"10am"},{"VSEntryID":12,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"10pm","EntryValue":"10pm"},{"VSEntryID":1,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"12am","EntryValue":"12am"},{"VSEntryID":7,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"12pm","EntryValue":"12pm"},{"VSEntryID":2,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"2am","EntryValue":"2am"},{"VSEntryID":8,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"2pm","EntryValue":"2pm"},{"VSEntryID":3,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"4am","EntryValue":"4am"},{"VSEntryID":9,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"4pm","EntryValue":"4pm"},{"VSEntryID":4,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"6am","EntryValue":"6am"},{"VSEntryID":10,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"6pm","EntryValue":"6pm"},{"VSEntryID":5,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"8am","EntryValue":"8am"},{"VSEntryID":11,"VSECategoryID":1,"VSECategory":"TIME","EntryName":"8pm","EntryValue":"8pm"}],"FormInfo":[],"FormSections":[{"FormSectionID":null,"SectionID":2,"SectionOrder":1,"HideSectionTitle":true,"isDefault":true,"updateDB":true},{"FormSectionID":null,"SectionID":2,"SectionOrder":null,"HideSectionTitle":true,"isDefault":true,"updateDB":true}],"FormSubSections":[{"FormSubSectionID":null,"SectionID":null,"SubSectionID":null,"SectionOrder":null,"SubSectionOrder":null,"HideSubSectionTitle":false,"isDefault":true,"updateDB":true}],"FormFields":[{"FormFieldID":null,"FormSectionID":null,"FormSubSectionID":null,"FieldTypeID":null,"FieldType":null,"ValidationSetID":null,"FieldName":null,"FieldHTMLID":null,"SectionOrder":null,"SubSectionOrder":null,"FieldOrder":null,"Active":true,"Required":false,"FieldMin":null,"FieldMax":null,"VisibleOnEdit":false,"isDefault":true,"updateDB":true}],"FormVSOptions":[{"VSOptionID":null,"ValidationSetID":null,"VSEntryID":null,"VSECategoryID":null,"VSECategory":null,"EntryName":null,"EntryValue":null,"OptionOrder":null,"Active":true,"isDefault":true,"updateDB":true}]}');
				//console.log(JSON.stringify(data));
				app.data.Forms = dataX.Forms;
				app.data.Forms = dataX.Departments;
				app.data.Sections = dataX.Sections;
				app.data.SubSections = dataX.SubSections;
				app.data.FieldTypes = dataX.FieldTypes;
				app.data.ValidationSets = dataX.ValidationSets;
				app.data.VSEntries = dataX.VSEntries;
				// These have a row with default values (mostly for the bits), used updateDB field instead of separate
				app.data.FormData = dataX.FormInfo.filter(function(f){
					return f.updateDB === 0;
				})[0];
				app.data.FormSections = dataX.FormSections.filter(function(f){
					return f.updateDB === 0;
				});
				app.data.FormSubSections = dataX.FormSubSections.filter(function(f){
					return f.updateDB === 0;
				});
				app.data.FormFields = dataX.FormFields.filter(function(f){
					return f.updateDB === 0;
				});
				app.data.FormVSOptions = dataX.FormVSOptions.filter(function(f){
					return f.updateDB === 0;
				});
				
				app.data.formDefault.FormData = dataX.FormInfo.find(function(f){
					return f.updateDB === 1;
				});
				app.data.formDefault.FormSection = dataX.FormSections.find(function(f){
					return f.updateDB === 1;
				});
				app.data.formDefault.FormSubSection = dataX.FormSubSections.find(function(f){
					return f.updateDB === 1;
				});
				app.data.formDefault.FormField = dataX.FormFields.find(function(f){
					return f.updateDB === 1;
				});
				app.data.formDefault.FormVSOption = dataX.FormVSOptions.find(function(f){
					return f.updateDB === 1;
				});
				
				// If creating brand new form, automatically push the General(main) section
				if(!this.formID){
					app.data.FormSection = app.data.FormFields;
				}
				
				app.isLoading = false;
				
				/*Vue.nextTick(function(){
					//app.initSelects();
					//app.initDatePicker();
				});*/
			/*})
			.fail(function(data){
				console.log('Webservice fail');
				app.isLoading = false;
			});*/

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
		
		setupAutocompletes: function(){
			
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