/* adds empty record - clones record with formFields filled in by default [[state.default.record; state.form.record]] */
    addDefaultFormRecord(){
        console.error("!!!addDefaultFormRecord")
        var self = this;
        var adding;
        var returnVal = false;

        if(!(this.state.form.record) || this.state.form.record.length == 0){
            if(self.state.default.record){
                adding = clone(self.state.default.record);
                adding.RecordNumber = -1;     // NEW FORM ID = -1 OR NULL???
                this.state.form.record = adding;
                if (this.debug) console.log('addDefaultFormRecord: Added default record');
                returnVal = true;
            }
            else if (this.errDebug) console.error('ERROR: addDefaultFormRecord: DEFAULT RECORD DOES NOT EXIST');
        }
        else if (this.debug) console.log('addDefaultFormRecord: Form record already exists');

        return returnVal;
    },
    /*addDefaultFormData(){
        console.error("!!!addDefaultFormData()")
        var self = this;
        var adding;
        var returnVal = false;

        if(!(this.state.form.formData)){
            if(this.state.default.formData){
                adding = clone(self.state.default.formData);
                
                // NEW FORM ID = -1 OR NULL???
                 adding.FormID = -1;

                this.state.form.formData = adding;
                returnVal = true;
                if (this.debug) console.log('addDefaultFormData: Added default formData');
            }
            else if (this.errDebug) console.error('ERROR: addDefaultFormData: DEFAULT FORMDATA DOES NOT EXIST');
        }
        else if (this.debug) console.log('addDefaultFormData: Form Data already exists');

        return returnVal;
    },*/   
    addFormSection(){
        console.error('!!! addFormSection')
        this.state.form._isLoading.formSections = true;
        var self = this;
        var newSec = clone(self.state.default.section);
        newSec.FormSectionID = this.getFormSectionID_New();
        newSec.SectionOrder = this.getFormSectionOrder_New();
        this.state.form.formSections.push(newSec);
        this.state.form._isLoading.formSections = false;
    },
    // form builder only
    addFirstSection(){
        console.error('!!! addFirstSection')
        this.state.form._isLoading.formSections = true;
        var self = this;
        var adding = clone(self.state.default.firstSection);
        adding.FormSectionID = this.getmaxOrderID() + 1;
        this.state.form.formSections.push(adding);

        this.state.form._isLoading.formSections = false;
    },
    // form builder only
    addLastSection(){
        console.error('!!! addLastSection')
        this.state.form._isLoading.formSections = true;
        var self = this;
        var adding = clone(self.state.default.lastSection);
        adding.FormSectionID = this.getFormSectionID_New();
        this.state.form.formSections.push(adding);

        this.state.form._isLoading.formSections = false;
    },



/* GET/HAS CHANGE */

    /* returns form changes one specific store */
    formStore_getChanges(storeName){
        console.log('_getChanges')
        var self = this;
        var returnVal = false;

        if (this.state.form.hasOwnProperty(storeName)){
            if (this.state.form[storeName] && (storeName == 'formData' || this.state.form[storeName].length > 0)){
                if(storeName == 'formData'){
                    returnVal = Object.keys(self.state.form[storeName]).some(function(f){
                        //console.log(self.state.form[storeName][f]);
                        if(self.state.form[storeName][f].hasOwnProperty('updateDB')){
                            return self.state.form[storeName][f].updateDB;
                        }
                        else return false;
                    });
                }
                else{
                    returnVal = this.state.form[storeName].some(function(f){
                        if(f.hasOwnProperty('updateDB')){
                            return f.updateDB;
                        }
                        else return false;
                    });
                }
            }
            else if(this.warnDebug) console.warn('WARNING: formStore_getChanges: STORE IS EMPTY - ' + storeName);
        }
        else if(this.errDebug) console.error('ERROR: formStore_getChanges: STORE DOES NOT EXIST - ' + storeName);

        if(this.debug) console.log(returnVal);
        return returnVal;
    },
    /* returns true/false if form has change in one specific store */
    formStoreHasChange(storeName){
        if(this.debug) console.log('HasChange')
        var returnVal = false;

        if (this.formStore_getChanges(storeName).length > 0){
            returnVal = true;
        }

        if(this.debug) console.log(returnVal);
        return returnVal;
    },
    /* returns true/false if form has change in all/specific stores (Record, FormData, FormSections, FormSubSections, FormFields) */
    formHasChange(storeNames){
        if(this.debug) console.log(storeNames)
        var self = this;
        var returnVal = false;

        //return (this.formRecordHasChange() || this.formDataHasChange() || this.formSectionHasChange() || this.formSubSectionHasChange() || this.formFieldHasChange() || this.formVSOptionHasChange());
        storeNames.forEach(function(storeName){
            returnVal = returnVal || self.formStoreHasChange(storeName);
        });

        if(this.debug) console.log(returnVal);
        return returnVal;
    },
    /* returns true/false if any field value in the record has been changed and requires an update to the DB [[state.form.record]] */
    formRecordHasChange: function(){
        var returnVal = false;

        for(var propertyName in this.state.form.record){
            returnVal = returnVal || this.state.form.record[propertyName].updateDB;
        }

        return returnVal;
    },
    /* returns true/false if form has change in FormData [[state.form.formData.updateDB ]] */
    formDataHasChange(){
        if(this.state.form.formData.hasOwnProperty('updateDB')){
            return this.state.form.formData.updateDB;
        }
        else return false;
    },
    /* FormSection & Section */

    /* returns true/false if form has change in formSections [[ state.form.formSections.updateDB ]]*/
    formSectionHasChange(){
        var returnVal = false;

        var changed = this.state.form.formSections.find(function(s){
            if(s.hasOwnProperty('updateDB')) return s.updateDB;
            else return false;
        });
        if(changed) returnVal = true;

        return returnVal;
    },

/* FormSubSection & SubSection */

    formSubSectionHasChange(){
        console.error('!!! formSubSectionHasChange')
        var changed = this.state.form.formSubSections.find(function(ss){
            if(ss.hasOwnProperty('updateDB')){
                return ss.updateDB;
            }
            else return false;
        });
        if(changed) return true;
        else return false;
    },

/* Form Fields */

    formFieldHasChange(){
        console.error('!!! formFieldHasChange')
        var changed = this.state.form.formFields.find(function(f){
            if(f.hasOwnProperty('updateDB')){
                return f.updateDB;
            }
            else return false;
        });
        if(changed) return true;
        else return false;
    },

/* Val Sets */

    formVSOptionHasChange(){
        console.error('!!! formFieldHasChange')
        var changed = this.state.form.formVsOptions.find(function(o){
            if(o.hasOwnProperty('updateDB')) return o.updateDB;
            else return false;
        });
        if(changed) return true;
        else return false;
    },



/* HAS REQUIRED */


    /* returns true/false if record has values for all required formFields */
    formRecordHasRequired(){
        console.error("!!!formRecordHasRequired")
        var self = this;
        var reqFields = this.getFields_Required();
        var returnVal = true;

        if(reqFields && reqFields.length > 0){
            reqFields.forEach(function(f){
                if(self.state.form.record[f.FieldHTMLID] !== null){
                    returnVal = returnVal && true;
                }
                else if(f.FieldTypeID == 6){    // if checkbox, null = false, so is allowed
                    returnVal = returnVal && true;
                }
                else{
                    returnVal = false;
                }
            });
        }

        return returnVal;
    },


   /* ALL FORMS - GETS */
    /* filters and returns forms that are active//inactive (defaults to active) [[state.form?_.allForms]] *
    // HANDLES valobjs; USED IN getForms_Ordered(), countForms() 
    getForms(stateName, isActive){
        console.error("!!! getForms()")
        /*var forms;
        var storeName = 'allForms';

        // handle if isActive was not sent, default to true
        if( typeof(isActive) === 'undefined' )  isActive = true;
        if(stateName === 'datatables') storeName = 'formsList';

        if(this.state.hasOwnProperty(stateName)){
            forms = this.state[stateName][storeName].filter(function(f){
                if(typeof(f.Active) === "object"){
                    return (f.Active.val == isActive);
                }
                return (f.Active == isActive);
            });
        }
        else if (this.errDebug) console.error('ERROR: getForms: STATE DOES NOT EXIST - ' + stateName + ', ' + isActive);

        return forms;
        */
    },
    /* RETURNS active//inactive forms ordered by CreateDate, FormID DESC (defaults to active) *
    // HANDLES valobjs; USED IN Entry & Builder - Home
    getForms_Ordered(payload){
        console.error("!!! getForms_Ordered()")
        /*var self = this;
        var returnVal = 0;
        var forms = this.getDataObj(payload);

        if(forms){
            forms.sort(function(a,b){
                returnVal = self.compareColVals(a.CreateDate, b.CreateDate, 'asc');
                if(returnVal == 0){
                    returnVal = self.compareColVals(a.FormID, b.FormID, 'asc');
                }
                return returnVal;
            });
        }

        return forms;*/
    },
    /* returns count of active//inactive forms (defaults to active) *
    // used in Entry & Builder - Home
    /*countForms: function(payload){        //payload =  {storeName (req), filters {propname: val, ...}, keepInactive, isOrig}
        var count = 0;
        console.log(payload);
        //var forms = this.getForms(stateName, isActive);
        var forms = this.getArrDataObjs(payload);
        if(forms) count = forms.length;
        return count;
    },*/


/* ALL DEPARTMENTS - GETS / UPDATES */

    /* returns departments ordered alphabetically *
    getDepartments_Ordered(){
        console.error('!!! getDepartments_Ordered')
        return this.state.departments.sort(function(a,b){
            return a.Department - b.Department;
        });
    },
    /* finds minimum DepartmentID *
    // used in getDepartmentID_New()
    getDepartmentID_Min(){
        console.error('!!! getDepartmentID_Min')
        return this.state.departments.reduce(function(min, dept){
            return dept.DepartmentID < min ? dept.DepartmentID : min;
        }, 0);
    },
    /* returns new Department ID = 1 less than minimum *
    // used in addDepartmentTitle()
    getDepartmentID_New(){
        console.error('!!! getDepartmentID_New')
        return this.getDepartmentID_Min() - 1;
    },
    /* returns department with provided ID parameter *
    getDepartment(departmentID){
        console.error('!!! getDepartment')
        return this.state.departments.find(function(dept){
            return dept.DepartmentID == departmentID;
        });
    },
    /* adds new department provided in payload parameter, returns id/null of new department *
    // used in Builder
    addDepartmentTitle(payload){    // payload: {department (req), departmentID}
        console.error('!!! addDepartmentTitle')
        var returnVal = null;

        if(payload.hasOwnProperty('department')){
            var newDept = {
                DepartmentID: null,
                Department: payload.department
            }

            if(payload.hasOwnProperty('departmentID') && payload.departmentID){
                newDept.DepartmentID = payload.departmentID;
            }
            else{   // if ID wasn't provided, set to new ID
                newDept.DepartmentID = this.getDepartmentID_New();
            }

            this.state.departments.push(newDept);
            if (this.debug) console.log('addDepartmentTitle: Added department - ' + newDept.Department + ', DepartmentID: ' + newDept.DepartmentID);
            returnVal = newDept.DepartmentID;
        }
        else if (this.errDebug) console.error('ERROR: addDepartmentTitle: PAYLOAD - ' + this.payloadToStr(payload));

        return returnVal;
    },

/* FORM RECORD */

    /* returns count of records for form [[state.form.records]] *
    countFormRecords: function(){
        console.error("!!!countFormRecords")
        var count = 0;

        if(this.state.form.records){
            count =  this.state.form.records.length;
        }

        return count;
    },
    /* returns editing/original record property in resultset specified - ex. getRecordProp({'RecordNumber'}) *
    getRecordProp(payload){    // payload = {propname (req), isOrig}
        console.error("!!!getRecordProp")
        var payload2 = Object.assign({}, payload, {storeName: 'record'});
        return this.getObjProp(payload2);
    },

    /* returns forms ordered by CreateDate, FormID DESC [[state.form]] *
    // HANDLES (REQUIRES?) VALUES AS OBJECTS;
    getFormRecords_Ordered(){
        console.error("!!!getFormRecords_Ordered")
        var self = this;
        var returnVal = 0;
        var pDate = this.getField_PrimaryDate();
        
        return this.state.form.records.sort(function(a,b){
            returnVal = 0;
            if(pDate){
                returnVal = self.compareColVals(a[pDate.FieldHTMLID], b[pDate.FieldHTMLID], 'desc')
            }
            if(returnVal == 0){
                returnVal = self.compareColVals(a.OriginalSubmitDate, b.OriginalSubmitDate, 'desc');
            }
            if(returnVal == 0){
                returnVal = self.compareColVals(a.RecordNumber, b.RecordNumber, 'desc');
            }
            return returnVal;
        });
    },

/* Form Data *

    /* updates formData property on state.form, compares to database.form *
    updateFormDataProp(payload){    //  payload = {propname, newVal, valObj}
        console.error('!!! updateFormDataProp')
        var self = this;
        var payload2 = Object.assign({}, payload, {storeName: 'formData'});
        this.updateObjProp(payload2);

        /*if(formD && formD.hasOwnProperty(payload.propname)){
            if(payload.hasOwnProperty('valObj') && payload.valObj){
                this.updateDataObj(formD, origFormD, payload);
            }
            else if(payload.propname.toUpperCase() == 'DEPARTMENT' || payload.propname.toUpperCase() == 'DEPT'){
                this.updateFormDepartment(payload);
            }
            else{
                if(formD[payload.propname] != payload.newVal){
                    formD[payload.propname] = payload.newVal;
                    this.compareOrig(editSec);
                }
            }
        }
        if (this.debug) console.log('DEFAULT ADDED: updateFormDataProp');*/
    },
    /* USE UPDATEFORMDATAPROP
    // form builder only
    updateFormDepartment(payload){  // payload = {departmentID}
        var editForm = this.state.form.formData;
        var dept = this.getDepartment(payload.departmentID);
        if(!dept){
            this.addDepartmentTitle(payload);
        }

        if(editForm.DepartmentID != payload.departmentID){
            editForm.DepartmentID = payload.departmentID;
            this.compareOrig(editForm);
        }
    },*/


/* FormSection & Section *

    /* returns count of records for form [[ state.form.formSections  ]] *
    countFormSections(){
        console.error('!!! countFormSections')
        var count = 0;

        if(this.state.form.formSections) count =  this.state.form.formSections.length;

        return count;
    },
    /* returns formSections ordered by SectionOrder *
    // Used in Builder - Build
    getFormSections_Ordered(){
        console.error('!!! getFormSections_Ordered')
        /*return this.state.form.formSections.sort(function(a,b){
            return a.SectionOrder.val - b.SectionOrder.val;
        });
    },
    /* returns minimum FormSectionID *
    getFormSectionID_Min(){
        console.error('!!! getFormSectionID_Min')
        /*var self = this;
        return this.state.form.formSections.reduce(function(min, sec){
            if(self.debug) console.log(min + ', ' + sec.FormSectionID)
            return sec.FormSectionID < min ? sec.FormSectionID : min;
        }, 0);
    },
    /* returns new FormSectionID = 1 less than minimum *
    getFormSectionID_New(){
        console.error('!!! getFormSectionID_New')
        /*return this.getFormSectionID_Min() - 1;*
    },
    /* returns minimum SectionID *
    getSectionID_Min(){
        console.error('!!! getSectionID_Min')
        /*return this.state.formSections.reduce(function(min, sec){
            return sec.SectionID < min ? sec.SectionID : min;
        }, 0);*
    },
    /* returns new SectionIDID = 1 less than minimum */
    getSectionID_New(){
        console.error('!!! getSectionID_New')
        /*return this.getSectionID_Min() - 1;*
    },
    getFormSectionOrder_Max(){
        console.error('!!! getFormSectionOrder_Max')
        /*return this.state.form.formSections.reduce(function(max, sec){
            return sec.SectionOrder > max ? sec.SectionOrder : max;
        }, 0);*
    },
    getFormSectionOrder_New(){
        console.error('!!! getFormSectionOrder_New')
        /*return this.getFormSectionOrder_Max() + 1;*
    },
    
    // handle state.form for editing and state.database for compare
    getFormSection(payload){    //payload = {formSectionID, isOrig}
        console.error('!!! getFormSection')
        /*var payload2 = Object.assign({}, payload, {storeName: 'formSections'});
        return this.getDataObj(payload2);*
    },
    // only from form for editing
    getFormSectionBefore(sectionOrder){
        console.error('!!! getFormSectionBefore')
        /*return this.state.form.formSections.find(function(s){
            return s.SectionOrder == (sectionOrder - 1);
        });
    },
    // only from form for editing
    getFormSectionAfter(sectionOrder){
        console.error('!!! getFormSectionAfter')
        /*return this.state.form.formSections.find(function(s){
            return s.SectionOrder == (sectionOrder + 1);
        });*
    },
    /*???*
    getSection(sectionID){
        console.error('!!! getSection')
        /*return this.state.formSections.find(function(s){
            return s.SectionID == sectionID;
        });*
    },
    getFormSectionProp(formSectionID, propname, isOrig){
        console.error('!!! getFormSectionProp')
        /*var fsec = this.getFormSection(formSectionID, isOrig);
        var sec;
        var prop;
        if(fsec){
            if(fsec.hasOwnProperty(propname)){
               prop = fsec[propname];
            }
            else{
                if (this.debug) console.log('getFormSectionProp: formsection has no prop ' + propname);
                sec = this.getSection(fsec.SectionID);
                if(sec){
                    if(sec.hasOwnProperty(propname)){
                       prop = sec[propname];
                    }
                    else if (this.debug) console.log('getFormSectionProp: section has no prop ' + propname);
                }
                else if (this.debug) console.log('getFormSectionProp: no section for prop ' + propname);
            }
        }
        else if (this.debug) console.log('getFormSectionProp: no form section for prop ' + propname);
        
        return prop;*
    },
    // form builder only
    addSectionTitle(payload){
        console.error('!!! addSectionTitle')
        /*var newSec = {
            SectionID: payload.sectionID,
            SectionTitle: payload.sectionTitle
        }
        this.state.formSections.push(newSec);*
    },
    // form builder only, only update form, isOrig always false
    updateFormSectionProp(payload){
        console.error('!!! updateFormSectionProp')
        /*var editSec = this.getFormSection(payload.formSectionId, false);
        if(editSec && editSec.hasOwnProperty(payload.propname)){
            if(payload.propname == 'SectionID'){
                this.updateFormSectionTitle(payload);
            }
            else if(payload.propname == 'SectionOrder'){
                this.updateFormSectionOrder(payload);
            }
            else{
                if(editSec[payload.propname] != payload.val){
                    editSec[payload.propname] = payload.val;
                    this.compareOrig(editSec);
                }
            }
        }*
    },
    // form builder only
    updateFormSectionTitle(payload){
        console.error('!!! updateFormSectionTitle')
        /*var editSec = this.getFormSection(payload.formSectionId, false);
        var sec = this.getSection(payload.sectionID);
        if(!sec){
            this.addSectionTitle(payload);
        }
        if(editSec.SectionID != payload.sectionID){
            editSec.SectionID = payload.sectionID;
            this.compareOrig(editSec);
        }*
    },
    // form builder only
    updateFormSectionOrder(payload){
        console.error('!!! updateFormSectionOrder')
        /*var editSec = this.getFormSection(payload.formSectionId, false);
        var editSec2;
        if(payload.move == 'UP' && (editSec.SectionOrder > 1)){
            editSec2 = this.getFormSectionBefore(editSec.SectionOrder);
            if(editSec2){
                editSec2.SectionOrder++;
                editSec.SectionOrder--;
                this.compareOrig(editSec);
                this.compareOrig(editSec2);
            }
        }
        else if (payload.move == 'DOWN' && (editSec.SectionOrder < this.getFormSectionOrder_Max())){
            editSec2 = this.getFormSectionAfter(editSec.SectionOrder);
            if(editSec2){
                editSec2.SectionOrder--;
                editSec.SectionOrder++;
                this.compareOrig(editSec);
                this.compareOrig(editSec2);
            }
        }*
    },

/* FormSubSection & SubSection */

    getFormSubSectionID_Min(){
        console.error('!!! getFormSubSectionID_Min')
        /*return this.state.form.formSubSections.reduce(function(min, subsec){
            return subsec.FormSubSectionID < min ? subsec.FormSubSectionID : min;
        }, 0);*
    },
    getFormSubSectionID_New(){
        console.error('!!! getFormSubSectionID_New')
        /*return this.getFormSubSectionID_Min() - 1;*
    },
    getFormSubSectionOrder_Max(){
        console.error('!!! getFormSubSectionOrder_Max')
        /*return this.state.form.subSections.reduce(function(max, subsec){
            return subsec.SubSectionOrder > max ? subsec.SubSectionOrder : max;
        }, 0);*
    },
    getFormSubSectionOrder_New(){
        console.error('!!! getFormSubSectionOrder_New')
        /*return this.getFormSubSectionOrder_Max() + 1;*
    },

    getFormSubSection(formSubSectionID){
        console.error('!!! getFormSubSection')
        /*return this.state.form.formSubSections.find(function(ss){
            return ss.FormSubSectionID == formSubSectionID;
        });*/
    },
    getOrigFormSubSection(formSubSectionID){    //payload = {id: formSubSectionID}
        console.error('!!! getOrigFormSubSection')
        /*var payload2 = Object.assign({}, payload, {storeName: 'formSubSections'});
        return this.getDataObj(payload2);*/
        /*return this.state.database.subSections.find(function(ss){
            return ss.FormSubSectionID == formSubSectionID;
        });*
    },
    getFormSubSectionBefore(subSectionOrder){
        console.error('!!! getFormSubSectionBefore')
        /*return this.state.form.formSubSections.find(function(s){
            return s.SubSectionOrder == (subSectionOrder - 1);
        });*
    },
    getFormSubSectionAfter(subSectionOrder){
        console.error('!!! getFormSubSectionAfter')
        /*return this.state.form.formSubSections.find(function(s){
            return s.SubSectionOrder == (subSectionOrder + 1);
        });*
    },
    getSubSection(subSectionID){
        console.error('!!! getSubSection')
        /*return this.state.formSubSections.find(function(ss){
            return ss.SubSectionID == subSectionID;
        });*
    },

    getFormSubSections_OrderedInSec(payload){   //payload = {formSectionID}
        console.error('!!! getFormSubSections_OrderedInSec')
        /*var fsec = this.getFormSection(payload);
        var secID;
        if(fsec){
            secID = fsec.SectionID;
            if(secID){
                return this.state.form.formSubSections.filter(function(ss){
                    return ss.SectionID == secID;
                }).sort(function(a,b){
                    return a.SubSectionOrder - b.SubSectionOrder;
                });
            }
        }*
    },
    getFormSubSectionProp(formSubSectionID, propname){
        console.error('!!! getFormSubSectionProp')
        /*var fsec = this.getFormSubSection(formSubSectionID);
        var sec;
        var prop;
        if(fsec){
            if(fsec.hasOwnProperty(propname)){
               prop = fsec[propname];
            }
            else{
                if (this.debug) console.log('getFormSubSectionProp: formSubSections has no prop ' + propname);
                sec = this.getSubSection(fsec.SubSectionID);
                if(sec){
                    if(sec.hasOwnProperty(propname)){
                       prop = sec[propname];
                    }
                    else if (this.debug) console.log('getFormSubSectionProp: formSubSections has no prop ' + propname);
                }
                else if (this.debug) console.log('getFormSubSectionProp: no formSubSections for prop ' + propname);
            }
        }
        else if (this.debug) console.log('getFormSubSectionProp: no formSubSections for prop ' + propname);
        return prop;*
    },
    // form builder only
    /*addFormSubSection(){
        var self = this;
        var newSec = clone(self.state.default.subSection);
        newSec.FormSubSectionID = this.getFormSubSectionID_New();
        newSec.SubSectionOrder = this.getFormSubSectionOrder_New();
        this.state.form.subSections.push(newSec);
    },*
    // form builder only
    addSubSectionTitle(payload){
        console.error('!!! addSubSectionTitle')
        /*var newSec = {
            SubSectionID: payload.subSectionID,
            SubSectionTitle: payload.subSectionTitle
        }
        this.state.subSections.push(newSec);*
    },
    // form builder only
    updateFormSubSectionProp(payload){
        console.error('!!! updateFormSubSectionProp')
        /*var editSec = this.getFormSubSection(payload.formSubSectionId);
        if(editSec && editSec.hasOwnProperty(payload.propname)){
            if(payload.propname == 'SubSectionID'){
                this.updateFormSubSectionTitle(payload);
            }
            else if(payload.propname == 'SubSectionOrder'){
                this.updateFormSubSectionOrder(payload);
            }
            else{
                if(editSec[payload.propname] != payload.val){
                    editSec[payload.propname] = payload.val;
                    this.compareOrig(editSec);
                }
            }
        }*
    },
    // form builder only
    updateFormSubSectionTitle(payload){
        console.error('!!! updateFormSubSectionTitle')
        /*var editSec = this.getFormSubSection(payload.formSubSectionId);
        var sec = this.getSubSection(payload.subSectionID);
        if(!sec){
            this.addSubSectionTitle(payload);
        }

        if(editSec.SectionID != payload.sectionID){
            editSec.SectionID = payload.sectionID;
            this.compareOrig(editSec);
        }*
    },
    // form builder only
    updateFormSubSectionOrder(payload){
        console.error('!!! updateFormSubSectionOrder')
        /*var editSec = this.getFormSubSection(payload.formSubSectionId);
        var editSec2;
        if(payload.move == 'UP' && (editSec.SubSectionOrder > 1)){
            editSec2 = this.getFormSubSectionBefore(editSec.SubSectionOrder);
            if(editSec2){
                editSec2.SubSectionOrder++;
                editSec.SubSectionOrder--;
                this.compareOrig(editSec);
                this.compareOrig(editSec2);
            }
        }
        else if(payload.move == 'UP'){
            console.error('new feature');
        }
        else if (payload.move == 'DOWN' && (editSec.SubSectionOrder < this.getFormSubSectionOrder_Max())){
            editSec2 = this.getFormSubSectionAfter(editSec.SubSectionOrder);
            if(editSec2){
                editSec2.SubSectionOrder--;
                editSec.SubSectionOrder++;
                this.compareOrig(editSec);
                this.compareOrig(editSec2);
            }
        }
        else if(payload.move == 'DOWN'){
            console.error('new feature');
        }*/
    },

/* Form Fields */

    /* Filters active formFields *
    getFormFields(){
        console.error('!!! getFormFields')
        /*return this.state.form.formFields.filter(function(f){
            return f.Active;
        });*
    },
    /* Filters inactive formFields *
    getFormFields(){
        console.error('!!! getFormFields')
        /*return this.state.form.formFields.filter(function(f){
            return f.Active == 0 || f.Active === null;
        });*
    },
    getFormFields_Ordered(){
        console.error('!!! getFormFields_Ordered')
        /*return this.getFormFields().sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });*
    },
    /* Finds min FormFieldID (includes inactive FormFields) *
    getFormFieldID_Min(){
        console.error('!!! getFormFieldID_Min')
        /*return this.state.form.formFields.reduce(function(min, field){
            return field.FormFieldID < min ? field.FormFieldID : min;
        }, 0);*
    },
    getFormFieldID_New(){
        console.error('!!! getFormFieldID_New')
        /*return this.getFormFieldID_Min() - 1;*
    },
    getFormFieldOrder_Max(){
        console.error('!!! getFormFieldOrder_Max')
        /*return this.state.form.formFields.reduce(function(max, field){
            return field.FieldOrder > max ? field.FieldOrder : max;
        }, 0);*
    },
    getFormFieldOrder_New(){
        console.error('!!! getFormFieldOrder_New')
        /*return this.getFormFieldOrder_Max() + 1;*
    },
    getFieldOrder_MinInSec(payload){  //formSectionID
        console.error('!!! getFieldOrder_MinInSec')
        /*var sFields = this.getFormFields_OrderedInSec(payload);
        var firstOrder;
        if(sFields && sFields.length > 0){
            firstOrder = sFields[0].FieldOrder;
        }
        return firstOrder;*
    },
    getFieldOrder_MaxInSec(payload){    //formSectionID
        console.error('!!! getFieldOrder_MaxInSec')
        /*var sFields = this.getFormFields_OrderedInSec(payload);
        var lastOrder;
        if(sFields && sFields.length > 0){
            lastOrder = sFields[(sFields.length - 1)].FieldOrder;
        }
        return lastOrder;*
    },
    getFieldOrder_MinInSubSec(formSubSectionID){
        console.error('!!! getFieldOrder_MinInSubSec')
        /*var sFields = this.getFormFields_OrderedInSubSec(formSubSectionID);
        var firstOrder;
        if(sFields && sFields.length > 0){
            firstOrder = sFields[0].FieldOrder;
        }
        return firstOrder;*
    },
    getFieldOrder_MaxInSubSec(formSubSectionID){
        console.error('!!! getFieldOrder_MaxInSubSec')
        /*var sFields = this.getFormFields_OrderedInSubSec(formSubSectionID);
        var lastOrder;
        if(sFields && sFields.length > 0){
            lastOrder = sFields[(sFields.length - 1)].FieldOrder;
        }
        return lastOrder;*
    },
    getField_PrimaryDate(){
        console.error('!!! getField_PrimaryDate')
        /*return this.state.form.formFields.find(function(field){
            return field.PrimaryDateField == true && field.FieldTypeID == 1;
        });*
    },
    getFields_Required(){
        console.error('!!! getFields_Required')
        /*return this.state.form.formFields.filter(function(f){
            return f.Active;
        });*
    },
    // Does NOT include Primary Date Field
    getFieldsInHeader_Ordered(){
        console.error('!!! getFieldsInHeader_Ordered')
        /*return this.state.form.formFields.filter(function(f){
            return (f.VisibleInHeader == 1 && (!(f.PrimaryDateField) || (f.PrimaryDateField == true && f.FieldTypeID != 1)));
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });*
    },
    getFormField(payload){  // payload={formFieldID, isOrig}
        console.error('!!! getFormField')
        /*var payload2 = Object.assign({}, payload, {storeName: 'formFields'});
        return this.getDataObj(payload2);*/
        /*return this.state.form.formFields.find(function(field){
            return field.FormFieldID == formFieldID;
        });*
    },
    getFormFieldBefore(fieldOrder){
        console.error('!!! getFormFieldBefore')
        /*return this.state.form.formFields.find(function(f){
            return f.FieldOrder == (fieldOrder - 1);
        });*
    },
    getFormFieldAfter(fieldOrder){
        console.error('!!! getFormFieldAfter')
        /*return this.state.form.formFields.find(function(f){
            return f.FieldOrder == (fieldOrder + 1);
        });*
    },
    getDefaultField_ForSection(formSectionID){
        console.error('!!! getDefaultField_ForSection')
        /*var newField = clone(this.state.default.field);
        newField.FormSectionID = formSectionID;
        return newField;*
    },
    getDefaultField_ForSubSection(formSubSectionID, formSectionID){
        console.error('!!! getDefaultField_ForSubSection')
        /*var newField = this.getDefaultFieldForSection(formSectionID);
        newField.FormSubSectionID = formSubSectionID;
        return newField;*
    },
    getFieldType(fieldTypeID){
        console.error('!!! getFieldType')
        /*return this.state.fieldTypes.find(function(ft){
            return ft.FieldTypeID == fieldTypeID;
        });*
    },
    getFormFieldType(formFieldID){
        console.error('!!! getFormFieldType')
        /*var field = this.getFormField(formFieldID);
        var fieldType;
        if(field){
            if(field.hasOwnProperty('FieldType') && field.FieldType){
                fieldType = field.FieldType;
            }
            else if(field.hasOwnProperty('FieldTypeID' && field.FieldTypeID)){
                fieldType = this.getFieldType(field.FieldTypeID);
            }
            else{
                if(this.debug){'ERROR: getFormFieldType - no field type info found ' + formFieldID};
            }
        }
        return fieldType;*
    },
    getFormFields_OrderedInSec(payload){    //formSectionID
        console.error('!!! getFormFields_OrderedInSec')
        /*return this.state.form.formFields.filter(function(f){
            return (f.FormSectionID == payload.id && !(f.FormSubSectionID));
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });*
    },
    getFormFields_OrderedInSubSec(payload){    //formSubSectionID
        console.error('!!! getFormFields_OrderedInSubSec')
        /*return this.state.form.formFields.filter(function(f){
            return f.FormSubSectionID == payload.id;
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });*
    },
    // form builder only
    addFormField(){
        console.error('!!! addFormField')
        /*var self = this;
        var newField = clone(self.state.default.field);
        newField.FormFieldID = this.getFormFieldID_New();
        newField.FieldOrder = this.getFormFieldOrder_New();
        this.state.form.formFields.push(newField);*
    },
    addFormField_InSection(payload){    //formSectionID
        console.error('!!! addFormField_InSection')
        /*var newField = clone(this.state.default.field);
        var maxFieldOrder = this.getFieldOrder_MaxInSec(payload);
        var fFields = this.getFormFields_Ordered();

        newField.FormFieldID = this.getFormFieldID_New();
        newField.FormSectionID = payload.id;
        newField.FieldOrder = (maxFieldOrder + 1);
        // increase order of future fields
        if (fFields && fFields.length > maxFieldOrder){
            this.fFields.forEach(function(f){
                if(f.FieldOrder > maxFieldOrder){
                    f.FieldOrder++;
                }
            })
        }
        this.state.form.formFields.push(newField);*
    },
    addFormField_InSubSection(formSubSectionID, formSectionID){
        console.error('!!! addFormField_InSubSection')
        /*var newField = clone(this.state.default.field);
        var maxFieldOrder = this.getFieldOrder_MaxInSubSec(formSubSectionID);
        var fFields = this.getFormFields_Ordered();

        newField.FormFieldID = this.getFormFieldID_New();
        newField.FormSectionID = formSectionID;
        newField.FormSubSectionID = formSubSectionID;
        newField.FieldOrder = (maxFieldOrder + 1);
        // increase order of future fields
        if (fFields && fFields.length > maxFieldOrder){
            this.fFields.forEach(function(f){
                if(f.FieldOrder > maxFieldOrder){
                    f.FieldOrder++;
                }
            })
        }
        this.state.form.formFields.push(newField);*
    },
    // form builder only
    updateFormFieldProp(payload){
        console.error('!!! updateFormFieldProp')
        /*var editField = this.getFormField(payload.formFieldId);
        if(editField && editField.hasOwnProperty(payload.propname)){
            if(payload.propname == 'FieldOrder'){
                this.updateFormFieldOrder(payload);
            }
            else{
                if(editField[payload.propname] != payload.val){
                    editField[payload.propname] = payload.val;
                    this.compareOrig(editField);
                }
            }
        }*
    },
    // form builder only
    updateFormFieldType(payload){
        console.error('!!! updateFormFieldType')
        /*var editField = this.getFormField(payload.formFieldId);

        if(editField.FieldTypeID != payload.fieldTypeID){
            editField.FieldTypeID = payload.fieldTypeID;
            this.compareOrig(editField);
        }*
    },
    // form builder only
    updateFormFieldOrder(payload){
        console.error('!!! updateFormFieldOrder')
        /*var editField = this.getFormField(payload.formFieldId);
        var secOrder;
        var subSecOrder;
        var editField2;
        if(payload.move == 'UP' && (editField.FieldOrder > 1)){
            editField2 = this.getFormFieldBefore(editField.FieldOrder);
            //secOrder = this.getFieldOrder_MinInSec(editField.FormSectionID);
            //subSecOrder = this.getFieldOrder_MinInSubSec(editField.FormSubSectionID);

            if(editField.FormSubSectionID != editField2.FormSubSectionID){
                editField.FormSubSectionID = editField2.FormSubSectionID;
            }
            if(editField.FormSectionID != editField2.FormSectionID){
                editField.FormSectionID = editField2.FormSectionID;
            }
            editField2.FieldOrder++;
            editField.FieldOrder--;
            this.compareOrig(editField);
            this.compareOrig(editField2);
        }
        else if (payload.move == 'DOWN' && (editField.FieldOrder < this.getFormFieldOrder_Max())){
            editField2 = this.getFormFieldAfter(editField.FieldOrder);
            if(editField.FormSubSectionID != editField2.FormSubSectionID){
            editField.FormSubSectionID = editField2.FormSubSectionID;
            }
            if(editField.FormSectionID != editField2.FormSectionID){
                editField.FormSectionID = editField2.FormSectionID;
            }
            editField2.FieldOrder--;
            editField.FieldOrder++;
            this.compareOrig(editField);
            this.compareOrig(editField2);
        }*
    },
    getFormFieldProp(fieldID, propname){
        console.error('!!! getFormFieldProp')
        /*var fsec = this.getFormSubSection(formSubSectionID);
        var sec;
        var prop;
        if(fsec){
            if(fsec.hasOwnProperty(propname)){
               prop = fsec[propname];
            }
            else{
                if (this.debug) console.error('getFormSubSectionProp: form subsection has no prop ' + propname);
                sec = this.getSubSection(fsec.SubSectionID);
                if(sec){
                    if(sec.hasOwnProperty(propname)){
                       prop = sec[propname];
                    }
                    else if (this.debug) console.log('getFormSubSectionProp: subsection has no prop ' + propname);
                }
                else if (this.debug) console.log('getFormSubSectionProp: no subsection for prop ' + propname);
            }
        }
        else if (this.debug) console.log('getFormSubSectionProp: no form subsection for prop ' + propname);
        
        return prop;*
    },


/* Val Sets */
/*
    getFormVSOptions_OrderedInSet(valSetID){
        console.error('!!! getFormVSOptions_OrderedInSet')
        return this.state.form.formVsOptions.filter(function(o){
            return o.Active && o.ValidationSetID == valSetID;
        }).sort(function(a,b){
            return compareVSOptions(a, b, {byCategory: true, alphabetically: false});
        });
    },
    getFormVSOptions_OrderedInSet_ExCategory(valSetID){
        console.error('!!! getFormVSOptions_OrderedInSet_ExCategory')
        var self = this;
        return this.state.form.formVsOptions.filter(function(o){
            return o.Active && o.ValidstionSetID == valSetID;
        }).sort(function(a,b){
            return self.compareVSOptions(a, b, {byCategory: false, alphabetically: false});
        });
    },
    /*setValSetOptions(_valSetID){
        var self = this;

        if (this.debug) console.log('getValOptions triggered for vsID=' + _valSetID);

        if(_valSetID){
            this.state.isLoading = true;
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Validation Set',
                vsID: _valSetID
            },
            function(returnData){
                self.state.database.formValSets = clone(returnData.VSOptions);
                self.state.valSetID = _valSetID;
                self.state.isLoading = false;
            })
            .fail(function(dataX){
                if (this.debug) console.log('Webservice Fail: Get Validation Set: ' + _valSetID);
                self.state.valSetID = null;
                self.state.isLoading = false;
            });
        }
    },*/








/* JOIN / SELECT TYPE (NOT VALSET) */


    /*else if(fieldT.indexOf('JOIN') > -1){
        valType = 'combobox';
        if(joinSet){
            if(currVal !== null && (self.state.form[joinSet].length > 0 || self.state.database[joinSet].length > 0)){
                if(self.state.form[joinSet].length > 0){
                    subset = 'form';
                }
                else{
                    subset = 'database';
                }

                if(self.state[subset][joinSet].length > 0 && self.state[subset][joinSet][0].hasOwnProperty(payload.Column.ValColumn)){
                    valObj = self.state[subset][joinSet].find(function(s){
                        if(typeof(s[payload.Column.ValColumn]) === "object"){
                            return s[payload.Column.ValColumn].val == currVal;
                        }
                        else{
                            return s[payload.Column.ValColumn] == currVal;
                        }
                    });
                    if(valObj){
                        if(typeof(valObj[payload.Column.TextColumn]) === "object"){
                            val = valObj[payload.Column.TextColumn].val;
                            displayVal = valObj[payload.Column.TextColumn].displayVal;
                        }
                        else{
                            val = valObj[payload.Column.TextColumn];
                            displayVal = valObj[payload.Column.TextColumn].displayVal;
                        }
                    }
                    else{
                        if(this.errDebug) console.error('ERROR: getValObj - NOT FOUND IN STATE.' + subset + '.' + joinSet + ' - ' + currVal);
                        val = null;
                        displayVal = '';
                    }
                    *valObj = self.state[subset][joinSet].find(function(s){
                        if(typeof s[payload.Column.ForeignKey] === "object"){
                            return s[payload.Column.ForeignKey].val == currVal;
                        }
                        else{
                            return s[payload.Column.ForeignKey] == currVal;
                        }
                    });
                    if(valObj){
                        dbVal = valObj[payload.Column.ValColumn];
                        val = currVal;
                        displayVal = valObj[payload.Column.TextColumn].displayVal;
                    }
                    else{
                        //if(this.errDebug) console.log('ERROR: getValObj - NOT FOUND IN STATE.' + subset + '.' + joinSet + ' - ' + currVal);
                        dbVal = -1;
                        val = currVal.toString().toUpperCase();
                        displayVal = currVal.toString();
                    }*
                }
            }
            else if(currVal !== null){
                if(this.errDebug) console.error('ERROR: getValObj - ' + joinSet + ' NOT LOADED')
                val = currVal;
                displayVal = currVal.toString();
            }
            else{
                val = null;
                displayVal = '';
            }
        }
        else {
            if(self.errDebug) console.error('ERROR: getValObj - NO JOINSET SPECIFIED')
            val = currVal;
            displayVal = currVal.toString();
        }
    }*/
            /*else if (fieldT.indexOf('SELECT') > -1){
                    valType = 'select';

                    //builder
                        else{

                            options = self.state.form.allSections.filter(function(v){
                                return v.ValidationSetID == payload.ValidationSetID;
                            });
                            objID = valObj.EntryID;
                            if(self.state.form.vsEntries.length > 0){
                                valObj2 = self.state.form.vsEntries.find(function(v){
                                    return v.VSEntryID == payload.ValidationSetID && v.VSEntryID == payload.colVal;
                                });
                                valObj = Object.assign({}, valObj2, valObj);
                            }
                            val = valObj.EntryValue;
                            displayVal = valObj.EntryName.toString();
                        }
            }*/

    /* slight diff in commented section of SELECT */
   /*valObj = self.state[subset][joinSet].find(function(s){
        if(typeof s[payload.Column.ForeignKey] === "object"){
            return s[payload.Column.ForeignKey].val == currVal;
        }
        else{
            return s[payload.Column.ForeignKey] == currVal;
        }
    });
    if(valObj){
        dbVal = valObj[payload.Column.ValColumn];
        val = currVal;
        displayVal = valObj[payload.Column.TextColumn].displayVal;
    }
    else{
        if(this.errDebug) console.log('ERROR: getValObj - NOT FOUND IN STATE.' + subset + '.' + joinSet + ' - ' + currVal);
        //dbVal = null;
        //val = null;
        //displayVal = '';
    }*/












/* SET */
    /* Use SET functions if newVal is only the actual values for that resultset */
    /* Sets both an editable resultset  (state.form) and a live resultset for comparison (state.database) */

/*setColumns (newValue, storeName) {
        this.state.columns[storeName] = clone(newValue);
    },
    setDatatable (newValue, tableName) {
        this.state.datatables[tableName] = clone(newValue);
    },
    setFormData (newValue, stateName) {
        this.state[stateName].formData = clone(newValue);
    },
    setFormSections (newValue, stateName) {
        this.state[stateName].formSections = clone(newValue);
    },
    setDefaultFormSections (newValue, defaultName) {
        this.state.default[defaultName] = clone(newValue);
    },
    setFormSubSections (newValue, stateName) {
        this.state[stateName].formSubSections = clone(newValue);
    },
    setFormFields (newValue, stateName) {
        this.state[stateName].formFields = clone(newValue);
    },
    setFormValSets (newValue, stateName) {
        this.state[stateName].formValSets = clone(newValue);
    },
    setFormVSOptions (newValue, stateName) {
        this.state[stateName].formVsOptions = clone(newValue);
    },*/
    /*setFormVSEntries (newValue, stateName) {
        this.state[stateName].formVsEntries = clone(newValue);
    },
    setFormVSECategories (newValue, stateName) {
        this.state[stateName].formVseCategories = clone(newValue);
    },*/
    /*setFormRecord(newValue, stateName){
        this.state[stateName].formRecord = clone(newValue);
    },
    setFormRecords(newValue, stateName){
        this.state[stateName].formRecords = clone(newValue);
    },
    setAllForms (newValue, stateName) {
        this.state[stateName].allForms = clone(newValue);  
    },
    setAllDepartments (newValue, stateName) {
        this.state[stateName].allDepartments = clone(newValue);
    },
    setAllSections (newValue, stateName) {
        this.state[stateName].allSections = clone(newValue);
    },
    setAllSubSections (newValue, stateName) {
        this.state[stateName].allSubSections = clone(newValue);
    },
    setAllFieldTypes (newValue, stateName) {
        this.state[stateName].allFieldTypes = clone(newValue);
    },
    setAllValSets (newValue, stateName) {
        this.state[stateName].allValSets = clone(newValue);
    },*/



/* LOAD */
    /* Use LOAD functions to add all return sets from Webservice */

    /*loadFormData (newValue) {
        var self = this;
        var editable = false;
        var newVal; 

        this.state.database.isLoading = true;

        editable = newValue[0].hasOwnProperty('updateDB');

        if(newValue && newValue.length === 1){
            newVal = clone(newValue[0]);
            this.setColumnValObjs(newVal, 'formData');
            if(editable){
                this.state.default.isLoading = true;
                this.state.form.isLoading = true;

                if(newVal.updateDB === false){
                    this.setState(newVal, 'database', 'formData');
                    this.setState(newVal, 'form', 'formData');
                }
                else if(newVal.updateDB === true){
                    this.setState(newVal, 'default', 'formData');
                    //store.addDefaultFormData();
                }
            }
            else{
                this.setState(newVal, 'database', 'formData');
            }

            if (this.debug) console.log(editable ? 'loadFormData: states set: database, form, default' : 'loadFormData: states set: database');
        }
        else if(newVal && newVal.length > 1){
            if (this.errDebug) console.log('ERROR: loadFormData: MULTIPLE FORMDATA RESULTS');
        }
        else{
            if (this.errDebug) console.log('ERROR: loadFormData: NO FORMDATA RESULTS');   
        }

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormSections (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(fSection){
            self.setColumnValObjs(fSection, 'formSections');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var sd = newVal.find(function(fSection){
                return fSection.updateDB === true && fSection.SectionID.val === null;
            });
            this.setState(sd, 'default', 'formSections');

            var sd1 = newVal.find(function(fSection){
                return fSection.updateDB === true && fSection.SectionID.val == 1;
            });
            this.setDefaultFormSections(sd1, 'firstSection');
            //this.setState(sd1, 'default', 'firstSection');

            var sd2 = newVal.find(function(fSection){
                return fSection.updateDB === true && fSection.SectionID.val == 2;
            });
            this.setDefaultFormSections(sd2, 'lastSection');
            //this.setState(sd2, 'default', 'lastSection');

            var formSections = newVal.filter(function(fSection){
                return fSection.updateDB === false;
            });
            this.setState(formSections, 'database', 'formSections');
            this.setState(formSections, 'form', 'formSections');
        }
        else{
            this.setState(newVal, 'database', 'formSections');
        }

        if (this.debug) console.log(editable ? 'loadFormSections: states set: database, form, default' : 'loadFormSections: states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormSubSections (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(sub){
            self.setColumnValObjs(sub, 'formSubSections');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var ssd = newVal.find(function(sub){
                return sub.updateDB === true;
            });
            this.setState(ssd, 'default', 'formSubSections');

            var subsections = newVal.filter(function(sub){
                return sub.updateDB === false;
            });
            if(subsections && subsections.length > 0){
                this.setState(subsections, 'database', 'formSubSections');
                this.setState(subsections, 'form', 'formSubSections');
            }
        }
        else{
            this.setState(newVal, 'database', 'formSubSections');
        }

        if (this.debug) console.log(editable ? 'loadFormSubSections - states set: database, form, default' : 'loadFormSubSections - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormFields (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(field){
            self.setColumnValObjs(field, 'formFields');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var fd = newVal.find(function(field){
                return field.updateDB === true;
            });
            this.setState(fd, 'default', 'formFields');

            var fFields = newVal.filter(function(field){
                return field.updateDB === false;
            });
            if(fFields && fFields.length > 0){
                this.setState(fFields, 'database', 'formFields');
                this.setState(fFields, 'form', 'formFields');
            }
        }
        else{
            this.setState(newVal, 'database', 'formFields');
        }

        if (this.debug) console.log(editable ? 'loadFormFields triggered - states set: database, form, default' : 'loadFormFields triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormValSets (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(valSet){
            self.setColumnValObjs(valSet, 'formValSets');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var vsd = newVal.find(function(valSet){
                return valSet.updateDB === true;
            });
            this.setState(vsd, 'default', 'formValSets');

            var fValSets = newVal.filter(function(valSet){
                return valSet.updateDB === false;
            });
            if(fValSets && fValSets.length > 0){
                this.setState(fValSets, 'database', 'formValSets');
                this.setState(fValSets, 'form', 'formValSets');
            }
        }
        else{
            this.setState(newVal, 'database', 'formValSets');
        }

        if (this.debug) console.log(editable ? 'loadFormValSets triggered - states set: database, form, default' : 'loadFormValSets triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormVSOptions (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(vsO){
            self.setColumnValObjs(vsO, 'formVsOptions');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var vsod = newVal.find(function(vsO){
                return vsO.updateDB === true;
            });
            this.setState(vsod, 'default', 'formVsOptions');

            var fVsOptions = newVal.filter(function(vsO){
                return vsO.updateDB === false;
            });
            if(fVsOptions && fVsOptions.length > 0){
                this.setState(formVsOptions, 'database', 'formVsOptions');
                this.setState(formVsOptions, 'form', 'formVsOptions');
            }
        }
        else{
            this.setState(newVal, 'database', 'formVsOptions');
        }

        if (this.debug) console.log(editable ? 'loadFormVSOptions triggered - states set: database, form, default' : 'loadFormVSOptions triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },*/
    /*loadFormVSEntries (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(vsE){
            self.setColumnValObjs(vsE, 'formVsEntries');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var vsed = newVal.find(function(vsE){
                return vsE.updateDB === true;
            });
            this.setFormVSEntries(vsed, 'default');

            var fVsEntries = newVal.filter(function(vsE){
                return vsE.updateDB === false;
            });
            if(fVsEntries && fVsEntries.length > 0){
                this.setFormVSEntries(fVsEntries, 'database');
                this.setFormVSEntries(fVsEntries, 'form');
            }
        }
        else{
            this.setFormVSEntries(newVal, 'database');
        }

        if (this.debug) console.log(editable ? 'loadFormVSEntries triggered - states set: database, form, default' : 'loadFormVSEntries triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadFormVSECategories (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(vseC){
            self.setColumnValObjs(vseC, 'formVsOptions');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var vsecd = newVal.find(function(vseC){
                return vseC.updateDB === true;
            });
            this.setFormVSECategories(vsecd, 'default');

            var fVseCategories = newVal.filter(function(vseC){
                return vseC.updateDB === false;
            });
            if(fVseCategories && fVseCategories.length > 0){
                this.setFormVSECategories(fVseCategories, 'database');
                this.setFormVSECategories(fVseCategories, 'form');
            }
        }
        else{
            this.setState(newVal, 'database', 'formVSECategories');
        }

        if (this.debug) console.log(editable ? 'loadFormVSECategories triggered - states set: database, form, default' : 'loadFormVSECategories triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },*/
    /*loadFormRecord (newValue) {
        // MAYBE THIS NEEDS TO BE UPDATED TO HANDLE 0 RECORDS & ADD NULL, OR WEBSERVICE UPDATED TO RETURN NULL ROW
        var editable = false;
        var newVal;

        this.state.database.isLoading = true;

        if(newValue && newValue.length === 1){
            newVal = clone(newValue[0]);
            this.setColumnValObjs(newVal, 'formRecord');
            editable = newVal.hasOwnProperty('updateDB');

            if(editable){
                this.state.default.isLoading = true;
                this.state.form.isLoading = true;

                if(newVal.updateDB === false){
                    this.setState(newVal, 'database', 'formRecord');
                    this.setState(newVal, 'form', 'formRecord');
                }
                else if(newVal.updateDB === true){
                    this.setState(newVal, 'default', 'formRecord');
                    //store.addDefaultRecord();
                }
            }
            else{
                this.setState(newVal, 'database', 'formRecord');
            }

            if (this.debug) console.log(editable ? 'loadFormRecord triggered - states set: database, form, default' : 'loadFormRecord triggered - states set: database');
        }
        else if(newVal && newVal.length > 1){
            if (this.debug) console.log('loadFormRecord error: Multiple Record results');
        }
        else{
            if (this.debug) console.log('loadFormRecord error: No Record results');   
        }

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadAllForms (newValue) {
        var self = this;

        this.state.database.isLoading = true;
        this.state.form.isLoading = true;

        var newVal = clone(newValue);
        newVal.forEach(function(form){
            self.setColumnValObjs(form, 'allForms');
        });

        this.setState(newVal, 'database', 'allForms');
        this.setState(newVal, 'form', 'allForms');

        if (this.debug) console.log('loadAllForms triggered - states set: database, form');

        this.state.database.isLoading = false;
        this.state.form.isLoading = false;
    },
    loadAllDepartments (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(dept){
            self.setColumnValObjs(dept, 'allDepartments');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var dd = newVal.find(function(dept){
                return dept.updateDB === true;
            });
            this.setState(dd, 'default', 'allDepartments');

            var deptartments = newVal.filter(function(dept){
                return dept.updateDB === false;
            });
            if(deptartments && deptartments.length > 0){
                this.setState(deptartments, 'database', 'allDepartments');
                this.setState(deptartments, 'form', 'allDepartments');
            }
        }
        else{
            this.setState(newVal, 'database', 'allDepartments');
        }

        if (this.debug) console.log(editable ? 'loadAllDepartments triggered - states set: database, form, default' : 'loadAllDepartments triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadAllSections (newValue) {
        var self = this;
        var editable = false;
        var newValObj;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(section){
            newValObj = self.setColumnValObjs(section, 'allSections');
            section = newValObj;
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var sd = newVal.find(function(section){
                return section.updateDB === true;
            });
            this.setState(sd, 'default', 'allSections');

            var sections = newVal.filter(function(section){
                return section.updateDB === false;
            });
            if(sections && sections.length > 0){
                this.setState(sections, 'database', 'allSections');
                this.setState(sections, 'form', 'allSections');
            }
        }
        else{
            this.setState(newVal, 'database', 'allSections');
        }

        if (this.debug) console.log(editable ? 'loadAllSections triggered - states set: database, form, default' : 'loadAllSections triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadAllSubSections (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(sub){
            self.setColumnValObjs(sub, 'allSubSections');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var ssd = newVal.find(function(sub){
                return sub.updateDB === true;
            });
            this.setState(ssd, 'default', 'allSubSections');

            var subsections = newVal.filter(function(sub){
                return sub.updateDB === false;
            });
            if(subsections && subsections.length > 0){
                this.setState(subsections, 'database', 'allSubSections');
                this.setState(subsections, 'form', 'allSubSections');
            }
        }
        else{
            this.setState(newVal, 'database', 'allSubSections');
        }

        if (this.debug) console.log(editable ? 'loadAllSubSections triggered - states set: database, form, default' : 'loadAllSubSections triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadAllFieldTypes (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(ftype){
            self.setColumnValObjs(ftype, 'allFieldTypes');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var ftd = newVal.find(function(ftype){
                return ftype.updateDB === true;
            });
            this.setState(ftd, 'default', 'allFieldTypes');

            var fieldtypes = newVal.filter(function(ftype){
                return ftype.updateDB === false;
            });
            if(fieldtypes && fieldtypes.length > 0){
                this.setState(fieldtypes, 'database', 'allFieldTypes');
                this.setState(fieldtypes, 'form', 'allFieldTypes');
            }
        }
        else{
            this.setState(newVal, 'database', 'allFieldTypes');
        }

        if (this.debug) console.log(editable ? 'loadAllFieldTypes triggered - states set: database, form, default' : 'loadAllFieldTypes triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },
    loadAllValSets (newValue) {
        var self = this;
        var editable = false;

        this.state.database.isLoading = true;

        if(newValue && newValue.length > 0){
            editable = newValue[0].hasOwnProperty('updateDB');
        }

        var newVal = clone(newValue);
        newVal.forEach(function(valSet){
            self.setColumnValObjs(valSet, 'allValSets');
        });

        if(editable){
            this.state.default.isLoading = true;
            this.state.form.isLoading = true;

            var vsd = newVal.find(function(valSet){
                return valSet.updateDB === true;
            });
            this.setState(vsd, 'default', 'allValSets');

            var valSets = newVal.filter(function(valSet){
                return valSet.updateDB === false;
            });
            if(valSets && valSets.length > 0){
                this.setState(valSets, 'database', 'allValSets');
                this.setState(valSets, 'form', 'allValSets');
            }
        }
        else{
            this.setState(newVal, 'database', 'allValSets');
        }

        if (this.debug) console.log(editable ? 'loadAllValSets triggered - states set: database, form, default' : 'loadAllValSets triggered - states set: database');

        this.state.database.isLoading = false;
        if(editable){
            this.state.default.isLoading = false;
            this.state.form.isLoading = false;
        }
    },*/








    /*getObjPropVal(payload){ // payload = {objName (req), idPropname, id, propname (req), isOrig}
        var obj = this.getDataObj(payload);
        var propVal;

        if(payload.hasOwnProperty('fieldObj') && payload.fieldObj){
            if (obj && obj.hasOwnProperty(payload.propname)){
                propVal = getPropVal(obj, payload.propname, payload.fieldObj);
            }
            else{
                propVal = getNullPropVal_Field(payload.fieldObj);
                if (this.debug) console.log('ERROR: getObjPropVal - ' + this.payloadToStr(payload));
            }
        }
        else if (obj && obj.hasOwnProperty(payload.propname)){
            propVal = getBuiltInPropVal(obj, payload.propname);
        }
        else{
            propVal = getNullPropVal();
            if (this.debug) console.log('ERROR: getObjPropVal - ' + this.payloadToStr(payload));
        }

        return propVal;
    },
    updateDataObj(dataObj, origDataObj, payload){
        var self = this;
        var editValObj = getBuiltInPropVal(payload.propname, dataObj);
        var origValObj = getBuiltInPropVal(payload.propname, origDataObj);

        if(payload.valObj.val){
            // check if change to form val
            if (dataObj[payload.valObj.valPropname] != payload.valObj.val){
                dataObj[payload.valObj.valPropname] = payload.valObj.val;

                //check if change from original val: if original val is null or original val is different
                if (!(origDataObj) || origDataObj[payload.valObj.valPropname] != payload.valObj.val){
                    dataObj.updateDB = true;
                }
                else{
                    dataObj.updateDB = false;
                }

                // only null text prop if already set (no need for text if val)
                if (dataObj.hasOwnProperty(payload.valObj.textPropname)){
                    dataObj[payload.valObj.textPropname] = null;
                }
            }
        }
        // if only text was sent
        else if(payload.valObj.text){
            if(!(dataObj.hasOwnProperty(payload.valObj.textPropname))){
                Vue.set(dataObj, payload.valObj.textPropname, payload.valObj.text);
                dataObj[payload.valObj.valPropname] = null;
                dataObj.updateDB = true;
            }
            else if (dataObj.hasOwnProperty(payload.valObj.textPropname) && dataObj[payload.valObj.textPropname] != payload.valObj.text){
                dataObj[payload.valObj.textPropname] = payload.valObj.text;
                dataObj[payload.valObj.valPropname] = null;
                dataObj.updateDB = true;
            }
        }
        // if input cleared
        else{
            console.log('null field');
            dataObj[payload.valObj.valPropname] = null;

            if(dataObj.hasOwnProperty(payload.valObj.textPropname)){
                dataObj[payload.valObj.textPropname] = null;
            }
            if(!(origDataObj) || !(origDataObj[payload.valObj.valPropname])){
                dataObj.updateDB = false;
            }
            else{
                dataObj.updateDB = true;
            }
        }
    },*/

        /* returns editing/original record propVal in resultset specified - ex. getRecordPropVal('CreateDate', FormSectionID, 1, SectionTitle, false) */
    /*getRecordPropVal(payload){   // payload = {propname (req), fieldObj, isOrig}
        var payload2 = Object.assign({objName: 'record'}, payload);
        return this.getObjPropVal(payload2);
    },*/


/*        var self = this; 
        var newVal = clone(newValue);

        // Get ValObjects for columns that require it for sorting/searching
        if(typeof(newVal.RecordNumber) == 'string' && newVal.RecordNumber.indexOf('-') > -1){
            newVal.RecordNumber = self.getColValObj({colVal: newVal.RecordNumber, FieldType: 'GUID'});
        }
        else{
            newVal.RecordNumber = self.getColValObj({colVal: newVal.RecordNumber, FieldType: 'INT'});
        }
        newVal.OriginalSubmitDate = self.getColValObj({colVal: newVal.OriginalSubmitDate, FieldType: 'DATETIME'});
        newVal.LastEditDate = self.getColValObj({colVal: newVal.LastEditDate, FieldType: 'DATETIME'});
        // Get ValObjects for all Fields
        if(self.state.form.fields.length > 0){
            self.state.form.fields.forEach(function(field){
                if(newVal.hasOwnProperty(field.FieldHTMLID)){
                    newVal[field.FieldHTMLID] = self.getColValObj({colVal: newVal[field.FieldHTMLID], FieldTypeID: field.FieldTypeID, FieldType: field.FieldType, ValidationSetID: field.ValidationSetID});
                }
            });
        }

        this.state.form.record = newVal;
        this.state.database.record = clone(newVal);
        */



    /*if (this.debug) console.log('setFormRecords triggered');

        var self = this;
        var newVal = clone(newValue);
        var pDate = this.getField_PrimaryDate();
        var headerFields = this.getFieldsInHeader_Ordered();


        newVal.forEach(function(record){
            this.setAllValObjs(record, 'records');
            // Get ValObjects for columns that require it for sorting/searching
            if(typeof(record.RecordNumber) == 'string' && record.RecordNumber.indexOf('-') > -1){
                record.RecordNumber = self.getColValObj({colVal: record.RecordNumber, FieldType: 'GUID'});
            }
            else{
                record.RecordNumber = self.getColValObj({colVal: record.RecordNumber, FieldType: 'INT'});
            }
            record.OriginalSubmitDate = self.getColValObj({colVal: record.OriginalSubmitDate, FieldType: 'DATETIME'});
            record.LastEditDate = self.getColValObj({colVal: record.LastEditDate, FieldType: 'DATETIME'});
            // Get ValObjects for columns visible in header
            // primary date
            if(pDate){
                if(record.hasOwnProperty(pDate.FieldHTMLID)){
                    record[pDate.FieldHTMLID] = self.getColValObj({colVal: record[pDate.FieldHTMLID], FieldTypeID: pDate.FieldTypeID, FieldType: pDate.FieldType, ValidationSetID: pDate.ValidationSetID});
                }
            }
            if(headerFields){
                headerFields.forEach(function(field){
                    console.log(field.FieldHTMLID + ' ' + field.FieldTypeID)
                    if(field.FieldHTMLID == 'Employee_ID'){
                        console.log(record);
                    }
                    if(record.hasOwnProperty(field.FieldHTMLID)){
                        console.log(field.FieldHTMLID + ' ' + field.FieldTypeID);
                        record[field.FieldHTMLID] = self.getColValObj({colVal: record[field.FieldHTMLID], FieldTypeID: field.FieldTypeID, FieldType: field.FieldType, ValidationSetID: field.ValidationSetID});
                    }
                });
            }
        });

        this.state.form.records = newVal;
        this.state.database.records = clone(newVal);*/


        /*setFormRecord_Null(){
        if (this.debug) console.log('setFormRecord_Null triggered');

        var self = this;
        var newVal = {};

        // Get ValObjects for ?
        Vue.set( newVal, 'RecordNumber', self.getColValObj({colVal: null, FieldType: 'INT'}) );

        Vue.set( newVal, 'OriginalSubmitDate', self.getColValObj({colVal: null, FieldType: 'DATETIME'}) );
        Vue.set( newVal, 'LastEditDate', self.getColValObj({colVal: null, FieldType: 'DATETIME'}) );
        // Get ValObjects for all Fields
        if(self.state.form.fields.length > 0){
            self.state.form.fields.forEach(function(field){
                Vue.set( newVal, field.FieldHTMLID, self.getColValObj({colVal: null, FieldTypeID: field.FieldTypeID, FieldType: field.FieldType, ValidationSetID: field.ValidationSetID}) );
            });
        }

        this.state.form.record = newVal;
        this.state.database.record = clone(newVal);
    },*/