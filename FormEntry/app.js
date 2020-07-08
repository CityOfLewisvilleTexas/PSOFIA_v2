"use strict";

const eventHub = new Vue();

var app = new Vue({
    el: "#app",
    data: {
		useremail: '',
        username: '',
        hello: 'Hello!',
        isLoading: true,
        isSubmitting: false,
        editing: false,
		showInvalid: false,
		
		formID: '',
		recordNum: '',
		data: {
			FormData: [],
			Sections: [],
			SubSections: [],
			Fields: [],
			ValidationSets: [],
			VSOptions: [],
			Record: [],
		},
		fieldValues:{
        },
        fieldValuesBackup: {},
        editValues: {},
		
		selectTest: ''
    },
	computed:{
		// ordered sections
		formSections: function(){
			return this.data.Sections.sort(function(a, b){
				return a.SectionOrder - b.SectionOrder;
			});
		},
		requiredFields: function(){
			return this.data.Fields.filter(function(field){
				return field.Required;
			});
		},
		valuesInRequiredFields: function(){
			return this.requiredFields.every(function(field){
				return field.fieldVal && field.fieldVal != "";
			});
		},
		newFormValues: function(){
			return this.data.Fields.filter(function(field){
				return field.updateDB;
			}).map(function(field){
				return{
					'FieldHTMLID': field.FieldHTMLID,
					'FieldValue': field.fieldVal
				};
			});
			
		}
	},

    // update rnumber as you type addresses
    watch: {
        
    },
	created: function(){
		eventHub.$on('update-input', this.updateField);
	},

    // start the app once the DOM is rendered
    mounted: function() {
		//eventHub.$on('update-input', this.updateField);
		this.checkForUsername();
		this.getFormEntry();
		//this.initSelects();
    },

    methods: {

		getFormEntry: function(){
			// first check if the record number is in the URL
			this.formID = getParameterByName('formID');
            if (!this.formID) {
                this.isLoading = false;
                return;
            }
			this.recordNum = getParameterByName('recordNumber');
			
			$.post('https://query.cityoflewisville.com/v2/',{
				webservice : 'PSOFIAv2/Get Form Entry',
				formID: this.formID,
				recordNumber: this.recordNum,
				auth_token: localStorage.colAuthToken
			},
			function(data){
				app.data.FormData = data.FormData;
				app.data.Sections = data.Sections;
				app.data.SubSections = data.SubSections;
				app.data.Fields = data.Fields;
				app.data.ValidationSets = data.ValidationSets;
				app.data.VSOptions = data.VSOptions;
				app.data.Record = data.Record;
				
				app.data.Fields.forEach(function(field){
					// testing
					field.Required = true;
					Vue.set(field, 'updateDB', false);
					if(app.data.Record && app.data.Record.length > 0){
						
						//Vue.set(field, 'fieldVal', app.data.Record[0][field.FieldHTMLID]);
						
						switch(field.FieldType){
							case 'DATE':
								Vue.set(field, 'fieldVal', moment(app.data.Record[0][field.FieldHTMLID], 'YYYY-MM-DD').format('YYYY-MM-DD'));
								break;
							case 'YEAR':
								Vue.set(field, 'fieldVal', moment(app.data.Record[0][field.FieldHTMLID], 'YYYY').format('YYYY'));
								break;
							case 'TIME':
								//???
								Vue.set(field, 'fieldVal', moment(app.data.Record[0][field.FieldHTMLID]).HTML5_FMT.TIME_SECONDS);
								break;
							case 'CHECKBOX':
								if(app.data.Record[0][field.FieldHTMLID]){
									Vue.set(field, 'fieldVal', true);
								}
								else{
									Vue.set(field, 'fieldVal', false);
								}
								break;
							default:
								Vue.set(field, 'fieldVal', app.data.Record[0][field.FieldHTMLID]);
								break;
						}
					}
					else{
						var currentDate = new Date();
						switch(field.FieldType){
							case 'DATE':
								Vue.set(field, 'fieldVal', moment(currentDate).format('YYYY-MM-DD'));
								field.updateDB = true;
								break;
							case 'YEAR':
								Vue.set(field, 'fieldVal', moment(currentDate).format('YYYY'));
								field.updateDB = true;
								break;
							case 'TIME':
								//???
								Vue.set(field, 'fieldVal', moment(currentDate).HTML5_FMT.TIME_SECONDS);
								field.updateDB = true;
								break;
							case 'CHECKBOX':
								Vue.set(field, 'fieldVal', false);
								field.updateDB = true;
								break;
							case 'EMAIL':
								Vue.set(field, 'fieldVal', localStorage.colEmail);
								field.updateDB = true;
								break;
							case 'NUMBER':
								Vue.set(field, 'fieldVal', '');
								break;
							default:
								Vue.set(field, 'fieldVal', '');
								break;
						}
					}

				})

				Vue.nextTick(function() {
					Materialize.updateTextFields()
				})
				
				app.isLoading = false;
				
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
			return this.data.Fields.filter(function(f){
				return f.FormSectionID == section.FormSectionID;
			}).sort(function(a, b){
				return a.FieldOrder - b.FieldOrder;
			});
		},
		
		getSubSections: function(section){
			return this.data.SubSections.filter(function(ss){
				return ss.SectionID == section.SectionID;
			}).sort(function(a, b){
				return a.SubSectionOrder - b.SubSectionOrder;
			});
		},
		
	
        /* simply converts the string booleans into booleans in the form backup
        fixBackup: function() {
            for (var prop in app.formValuesBackup) {
                if (app.formValuesBackup.hasOwnProperty(prop)) {
                    if (this.formValuesBackup[prop] == "true") this.formValuesBackup[prop] = true
                    if (this.formValuesBackup[prop] == "false") this.formValuesBackup[prop] = false
                }
            }
        },*/
		
        // get the psofia entry for a specific record number
        /*fetchRecord: function() {

            // first check if the record number is in the URL
            if (!getParameterByName('recordnumber')) {
                app.isLoading = false
                return
            }

            // URL for getting the psofia entry
            var u = 'https://ax1vnode1.cityoflewisville.com/v2/?webservice=ITS/PSOFIAv2/Get Form Entry&'
            u += getParameterByName('formID')

            // ajax
            axios.get(u).then(function(results) {

                // set the values
                app.editValues = results.data[0][0]

                // backup this original form
                app.formValuesBackup = JSON.parse(JSON.stringify(app.editValues))
                app.fixBackup()

                // show the form
                app.editing = true
                app.isLoading = false

                // fill in the form
                Vue.nextTick(function() {
                    app.autoFillForm()
                })
            })
        },

        /* fill in the form
        autoFillForm: function() {

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
            }

            // re-render all the input fields (pushes the labels out of the way)
            Vue.nextTick(function() {
                Materialize.updateTextFields()
                $('select').material_select()
            })
        },*/

		// get username from COL if it exists
        checkForUsername: function() {
			this.useremail = localStorage.colEmail;
            // ajax
            $.get('https://query.cityoflewisville.com/ActiveDirectory/getUserByEmail/' + localStorage.colEmail, function(data) {

                // set username
                app.username = (data.length) ? data[0].givenName : '';

                Vue.nextTick(function(){
                	// set hello message to username (above form)
					if(app.username){
	                	app.hello = 'Hello, ' + app.username + '!';
	                }
	                // set hello message to useremail (above form); warning toast
	                else if (app.useremail){
	                	Materialize.toast('No username found for ' + app.useremail, 5000, 'rounded');
	                	app.hello = 'Hello, ' + app.useremail + '!'
	                }
	                // warning message
	                else{
	                	alert('Could not verify identity. Form may not submit correctly.')
	                	app.hello = 'Hello!'
	                }

				});
          		
                // check for record number
                //app.fetchRecord()
            })
        },
		
		updateField: function(payload){
			// only update data from the main app
			console.log('updateMain');
			var f = this.data.Fields.find(function(field){
				return field.FormFieldID == payload.fieldID;
			})
			if (f){
				f.fieldVal = payload.val;
				// check if the current record matches
				if(app.data.Record.length > 0){
					if(f.fieldType == 'CHECKBOX'){
						if((app.data.Record[0][payload.htmlID] && payload.val) || (!(app.data.Record[0][payload.htmlID]) && !(payload.val))){
							f.updateDB = false;
						}
						else{
							f.updateDB = true;
						}
					}
					else{
						if(app.data.Record[0][payload.htmlID] !== payload.val){
							f.updateDB = true;
						}
						else{
							f.updateDB = false;
						}
					}
				}
				else{
					f.updateDB = true;
				}

				if(f.Required && payload.val == ''){
					console.log('required');
					if(f.FieldType != 'SELECT'){
						$('#' + f.FieldHTMLID).addClass('needs-value');
					}
					else{
						$('#' + f.FieldHTMLID).siblings().filter(':text').addClass('needs-value');
					}
				}
				else if(f.Required && payload.val != ''){
					if(f.FieldType != 'SELECT'){
						$('#' + f.FieldHTMLID).removeClass('needs-value');
					}
					else{
						$('#' + f.FieldHTMLID).siblings().filter(':text').removeClass('needs-value');
					}
				}
			}
			else{
				console.log('ERROR');
			}
		},

        // submit the form
        submitForm: function() {
			console.log("submitform");
			
			if (this.newFormValues.length == 0){
				Materialize.toast('Data has already been saved', 5000, 'rounded')
			}
			// required fields
			else if(!this.valuesInRequiredFields){
				//Hightlight required fields
				this.requiredFields.forEach(function(field){
					if(field.FieldType != 'CHECKBOX' && field.Required && field.fieldVal == ''){
						console.log(field.FieldHTMLID);
						if(field.FieldType != 'SELECT'){
							$('#' + field.FieldHTMLID).addClass('needs-value');
						}
						else{
							$('#' + field.FieldHTMLID).siblings().filter(':text').addClass('needs-value');
						}
					}
				});

				Materialize.toast('Please fill in the requied fields before submitting the form', 5000, 'rounded')
			}
			// error verifying identity
			/*else if (!app.username){
				// return
			}*/
			else if (this.newFormValues.length > 0){

				var psofiaData = JSON.stringify(this.newFormValues);

				// one last error check
				if (!psofiaData)
				{
					return;
				}

				// "send off" the form, scroll to top, change the message
				$('#form').addClass('blurred');
				app.isSubmitting = true;
				$(window).scrollTop(0);
				app.hello = 'Submitting now...';

				$.post('https://query.cityoflewisville.com/v2/', {
					webservice: 'PSOFIAv2/Submit Form Values',
					//auth_token: localStorage.colAuthToken,
					user: localStorage.colEmail,
					formID: this.formID,
					recordNumber: this.recordNum,
					fields: psofiaData
				},
					function(data) {

						// success new record
						if (data.Message[0].RecordNumber && data.Message[0].SubmitOption == 1) {

							// allows animation to finish (at least)
							setTimeout(function() {
								$('#form').removeClass('blurred')
								alert('Success! ' + data.Message[0].SubmitMessage + '. Page must be reloaded.');
								//app.isSubmitting = false
								insertParam('recordNumber', data.Message[0].RecordNumber);
							}, 500)

							// set this submission as the new backup
							//app.formValuesBackup = JSON.parse(JSON.stringify(app.formValues))
							//app.fixBackup()
						}
						// success update
						else if (data.Message[0].RecordNumber && data.Message[0].SubmitOption == 2){
							setTimeout(function() {
								$('#form').removeClass('blurred')
								app.hello = 'Hello, ' + app.username + '!'
								Materialize.toast('Success! ' + data.Message[0].SubmitMessage, 5000, 'rounded')
								app.isSubmitting = false
							}, 500)
							app.getFormEntry();
						}
						// fail
						else if (data.Message[0].RecordNumber && (data.Message[0].SubmitOption == 3 || data.Message[0].SubmitOption == 4)){
							Materialize.toast('Error! ' + data.Message[0].SubmitMessage, 5000, 'rounded')
						}
						else{
							alert('Something may have gone wrong. ')
						}
					})
					.fail(function(data){
						console.log('Webservice fail');
						app.isLoading = false;
					});
			}
		},

        // when submitting an edit to an existing record number
        /*editSubmit: function() {

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
        }*/
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

function insertParam(key, value)
{
    key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i=kvp.length; var x; while(i--) 
    {
        x = kvp[i].split('=');

        if (x[0]==key)
        {
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }

    if(i<0) {kvp[kvp.length] = [key,value].join('=');}

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&'); 
}

// scrolling effect..kinda fun..but pointless
// $(window).scroll(function() {
//     $("#extended-toolbar .edge").height($(window).scrollTop() / ($(document).height() - $(window).height()) * 350 + 4)
// })