var store = {
    debug: true,
    state: {
        isLoading: false,
        columns: {
            isloading: false,
            formData: [],
            sections: [],       //RESULT SET: FormSections
            subSections: [],        //RESULT SET: FormSubSections
            fields: [],          //RESULT SET: FormFields
            valSets: [],        //RESULT SET: FormValSets
            vsOptions: [],      //RESULT SET: FormVSOptions - this may be just the data from ValidationSetOptions table, or combo of Options, Entries, and Category tables
            vsEntries: [],      //RESULT SET: FormVSEntries
            vseCategories: [],      //RESULT SET: FormVSECategories
            records:[],             //RESULT SET: FormRecords
            record:[],      //RESULT SET: FormRecord

            allforms: [],
            alldepartments: [],
            allsections: [],
            allsubSections: [],
            allfieldTypes: [],
            allvalSets: [],
        },
        database:{
            isloading: false,
            formData: {},
            sections: [],       //RESULT SET: FormSections
            subSections: [],        //RESULT SET: FormSubSections
            fields: [],          //RESULT SET: FormFields
            valSets: [],        //RESULT SET: FormValSets
            vsOptions: [],      //RESULT SET: FormVSOptions - this may be just the data from ValidationSetOptions table, or combo of Options, Entries, and Category tables
            vsEntries: [],      //RESULT SET: FormVSEntries
            vseCategories: [],      //RESULT SET: FormVSECategories
            records: [],             //RESULT SET: FormRecords
            record:{},      //RESULT SET: FormRecord

            allforms: [],
            alldepartments: [],
            allsections: [],
            allsubSections: [],
            allfieldTypes: [],
            allvalSets: [],
        },
        form:{
            isloading: false,
            formData: {},
            sections: [],
            subSections: [],
            fields: [],
            //valSets: [],
            vsOptions: [],
            vsEntries: [],
            vseCategories: [],
            records: [],
            record:{},

            //allforms: [],
            alldepartments: [],
            allsections: [],
            allsubSections: [],
            allfieldTypes: [],
            allvalSets: [],
        },
        default:{
            isloading: false,
            formData: {},
            section: {},
            firstSection: {},
            lastSection: {},
            subSection: {},
            field: {},
            valSet: {},
            vsOption: {},
            vsEntry: {},
            vseCategory: {}

            //allforms: [],
            alldepartments: [],
            allsections: [],
            allsubSections: [],
            allfieldTypes: [],
            allvalSets: [],
        }
    },

    /* GENERIC - GETS / UPDATES */

    /* returns editing/original object in resultset specified - ex. getDataObj('sections', FormSectionID, 1, false); getDataObj('formData', null, null, false) */
    getDataObj(payload){ // payload = {objName (req), idPropname, id, isOrig}
        var obj;
        var subState = 'form';
        if(payload.hasOwnProperty('isOrig')){
            subState = 'database';
        }

        if(this.state[subState].hasOwnProperty(payload.objName)){
            if( (payload.hasOwnProperty('id') && payload.id) && (payload.hasOwnProperty('idPropname') && payload.idPropname) ){
                obj = this.state[subState][payload.objName].find(function(o){
                    return o[payload.idPropname] == payload.id;
                });
            }
            else{   //formData, record
                obj = this.state[subState][payload.objName];
            }
        }
        else if (this.debug) console.log('ERROR: getDataObj - ' + this.payloadToStr(payload));

        return obj;
    },
    /* returns editing/original object property in resultset specified - ex. getObjProp('sections', FormSectionID, 1, SectionTitle, false) */
    getObjProp(payload){   // payload =  {objName (req), idPropname, id, propname (req), isOrig}
        var obj = this.getDataObj(payload);
        var objProp;

        if (obj && obj.hasOwnProperty(payload.propname)){
            objProp =  obj[payload.propname];    
        }
        else if (this.debug) console.log('ERROR: getObjProp - ' + this.payloadToStr(payload));

        return objProp;
    },
    updateObjProp(payload){
        var self = this;
        var formObj = this.getObjProp(payload);
        var payload2 = Object.assign({}, payload, {isOrig: true});
        var origObj = this.getObjProp(payload2);

        formObj = Object.assign(formObj, payload.valObj);

        var compareResult = this.compareColValObjs(formObj, origObj, false);
        console.log(compareResult);
        if (compareResult != 0){
            formObj.updateDB = true;
        }
        else if(compareResult == 0){
            formObj.updateDB = false;
        }

        return formObj.displayVal;
    },

    getColumns(storeName){
        return this.state.columns[storeName];
    },
    getColumns_Headers(storeName){
        this.getColumns(storeName).filter(function(c){
            if(c.hasOwnProperty('ShowInHeader')){
                return c.ShowInHeader;
            }
            else return false;
        });
    },


    /* ALL FORMS - GETS */

    /* filters forms that are active - state.form */
    // used in getForms_Ordered(), countForms()
    getForms(stateName){
        return this.state[stateName].allforms.filter(function(f){
            return f.Active;
        });
    },
    /* filters forms that are inactive */
    // used in countForms_Inactive()
    getForms_Inactive(stateName){
        return this.state[stateName].allforms.filter(function(f){
            return (f.Active == false);
        });
    },
    /* returns active forms ordered by CreateDate, FormID DESC */
    // used in Entry & Builder - Home  
    getForms_Ordered(stateName){
        var self = this;
        var returnVal = 0;
        return this.getForms(stateName).sort(function(a,b){
            returnVal = self.compareColVals(a.CreateDate, b.CreateDate, 'desc');
            if(returnVal == 0){
                returnVal = self.compareColVals(a.FormID, b.FormID, 'desc');
            }
            return returnVal;
        });
    },
    /* returns count of active forms */
    // used in Entry & Builder - Home
    countForms: function(stateName){
        return this.getForms(stateName).length;
        /*var count = 0;
        if(this.getForms(stateName)){
            count =  this.getForms(stateName).length;
        }
        return count;*/
    },
    /* returns count of inactive forms */
    countForms_Inactive: function(stateName){
        return this.getForms_Inactive(stateName).length;
        /*var count = 0;
        if(this.getForms_Inactive(stateName)){
            count =  this.getForms_Inactive(stateName).length;
        }
        return count;*/
    },


    /* ALL DEPARTMENTS - GETS / UPDATES */

    /* returns departments ordered alphabetically */
    getDepartments_Ordered(){
        return this.state.departments.sort(function(a,b){
            return a.Department - b.Department;
        });
    },
    /* finds minimum DepartmentID */
    // used in getDepartmentID_New()
    getDepartmentID_Min(){
        return this.state.departments.reduce(function(min, dept){
            return dept.DepartmentID < min ? dept.DepartmentID : min;
        }, 0);
    },
    /* returns new Department ID = 1 less than minimum */
    // used in addDepartmentTitle()
    getDepartmentID_New(){
        return this.getDepartmentID_Min() - 1;
    },
    /* returns department with provided ID parameter */
    getDepartment(departmentID){
        return this.state.departments.find(function(dept){
            return dept.DepartmentID == departmentID;
        });
    },
    /* adds new department provided in payload parameter */
    // used in Builder
    addDepartmentTitle(payload){    // paylod: {department (req), departmentID}
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
        if (this.debug) console.log('ADDED: addDepartmentTitle - ' + newDept.Department + ', DepartmentID: ' + newDept.DepartmentID);
    },


    /* GENERAL FORM - GETS */

    /* returns true/false if form has change in Record, FormData, FormSections, FormSubSections, FormFields */
    formHasChange(){
        return (this.formRecordHasChange() || this.formDataHasChange() || this.formSectionHasChange() || this.formSubSectionHasChange() || this.formFieldHasChange() || this.formVSOptionHasChange());
    },


    /* FORM RECORD, FORM RECORDS - GETS / UPDATES */

    formRecordHasChange: function(){
        var returnVal = false;
        for(var propertyName in this.state.form.record){
            returnVal = returnVal || this.state.form.record[propertyName].updateDB;
        }
        return returnVal;
    },
    /* checks if record has values for all required fields */
    formRecordHasRequired(){
        var reqFields = this.getFields_Required();
        var returnVal = true;
        if(reqFields && reqFields.length > 0){
            reqFields.forEach(f){
                if(this.state.form.record[f.FieldHTMLID] !== null){
                    returnVal = returnVal && true;
                }
                else if(f.FieldTypeID == 6){    // if checkbox, null = false, so is allowed
                    returnVal = returnVal && true;
                }
                else{
                    returnVal = false;
                }
            }
        }
    },
    /* returns count of records for form - state.form */
    countFormRecords: function(){
        var count = 0;
        if(this.state.form.records){
            count =  this.state.form.records.length;
        }
        return count;
    },
    /* returns editing/original record property in resultset specified - ex. getRecordProp({'RecordNumber'}) */
    getRecordProp(payload){    // payload = {propname (req), isOrig}
        var payload2 = Object.assign({}, payload, {objName: 'record'});
        return this.getObjProp(payload2);
    },

    /* returns forms ordered by CreateDate, FormID DESC - state.form */ 
    getFormRecords_Ordered(){
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


    /* Form Data & Department*/

    /* returns true/false if form has change in FormData */
    formDataHasChange(){
        if(this.state.form.formData.hasOwnProperty('updateDB')){
            return this.state.form.formData.updateDB;
        }
        else return false;
    },
    /* adds default formData to state.form */
    addDefaultFormData(){
        var self = this;
        var adding;
        if(!this.state.form.formData){
            adding = clone(self.state.default.formData);
            adding.FormID = -1;     // NEW FORM ID = -1 OR NULL???
            this.state.form.formData = adding;
        }
        if (this.debug) console.log('DEFAULT ADDED: addDefaultFormData');
    },
    /* updates formData property on state.form, compares to database.form */
    updateFormDataProp(payload){    //  payload = {propname, newVal, valObj}
        var self = this;
        var payload2 = Object.assign({}, payload, {objName: 'formData'});
        this.updateObjProp(payload2);

        if(formD && formD.hasOwnProperty(payload.propname)){
            
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
        if (this.debug) console.log('DEFAULT ADDED: updateFormDataProp');
    },
    // form builder only
    updateFormDepartment(payload){  // payload = {departmentID}
        var editForm = this.state.form.formData;
        var dept = this.getDepartment(payload.departmentID);
        if(!dept){
            this.addDepartment(payload);
        }

        if(editForm.DepartmentID != payload.departmentID){
            editForm.DepartmentID = payload.departmentID;
            this.compareOrig(editForm);
        }
    },


    /* FormSection & Section */

    formSectionHasChange(){
        var changed = this.state.form.sections.find(function(s){
            if(s.hasOwnProperty('updateDB')){
                return s.updateDB;
            }
            else return false;
        });
        if(changed){
            return true;
        }
        else return false;
    },
    countFormSections(){
        var c = 0;
        if (this.state.form.sections){
            c = this.state.form.sections.length;
        }
        return c;
    },
    /* Return all sections in order of section order */ // Used in Builder - Build
    getFormSections_Ordered(){
    	return this.state.form.sections.sort(function(a,b){
    		return a.SectionOrder - b.SectionOrder;
    	});
    },
    getFormSectionID_Min(){
        return this.state.form.sections.reduce(function(min, sec){
            return sec.FormSectionID < min ? sec.FormSectionID : min;
        }, 0);
    },
    getFormSectionID_New(){
        return this.getFormSectionID_Min() - 1;
    },
    getSectionID_Min(){
        return this.state.sections.reduce(function(min, sec){
            return sec.SectionID < min ? sec.SectionID : min;
        }, 0);
    },
    getSectionID_New(){
        return this.getSectionID_Min() - 1;
    },
    getFormSectionOrder_Max(){
        return this.state.form.sections.reduce(function(max, sec){
            return sec.SectionOrder > max ? sec.SectionOrder : max;
        }, 0);
    },
    getFormSectionOrder_New(){
        return this.getFormSectionOrder_Max() + 1;
    },
    
    // handle state.form for editing and state.database for compare
    getFormSection(payload){    //payload = {formSectionID, isOrig}
        var payload2 = Object.assign({}, payload, {objName: 'sections', idPropname: 'FormSectionID'});
        return this.getDataObj(payload2);
    },
    // only from form for editing
    getFormSectionBefore(sectionOrder){
    	return this.state.form.sections.find(function(s){
    		return s.SectionOrder == (sectionOrder - 1);
    	});
    },
    // only from form for editing
    getFormSectionAfter(sectionOrder){
    	return this.state.form.sections.find(function(s){
    		return s.SectionOrder == (sectionOrder + 1);
    	});
    },
    /*???*/
    getSection(sectionID){
    	return this.state.sections.find(function(s){
    		return s.SectionID == sectionID;
    	});
    },

    getFormSectionProp(formSectionID, propname, isOrig){
        var fsec = this.getFormSection(formSectionID, isOrig);
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
        
        return prop;
    },

    // form builder only
    addFormSection(){
        var self = this;
    	var newSec = clone(self.state.default.section);
    	newSec.FormSectionID = this.getFormSectionID_New();
    	newSec.SectionOrder = this.getFormSectionOrder_New();
    	this.state.form.sections.push(newSec);
    },
    // form builder only
    addFirstSection(){
        var self = this;
        var adding = clone(self.state.default.firstSection);
        adding.FormSectionID = this.getNewFormSectionID();
        this.state.form.sections.push(adding);
    },
    // form builder only
    addLastSection(){
        var self = this;
        var adding = clone(self.state.default.lastSection);
        adding.FormSectionID = this.getNewFormSectionID();
        this.state.form.sections.push(adding);
    },
    // form builder only
    addSectionTitle(payload){
    	var newSec = {
    		SectionID: payload.sectionID,
    		SectionTitle: payload.sectionTitle
    	}
    	this.state.sections.push(newSec);
    },
    // form builder only, only update form, isOrig always false
    updateFormSectionProp(payload){
    	var editSec = this.getFormSection(payload.formSectionId, false);
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
	    }
    },
    // form builder only
    updateFormSectionTitle(payload){
        var editSec = this.getFormSection(payload.formSectionId, false);
        var sec = this.getSection(payload.sectionID);
        if(!sec){
            this.addSectionTitle(payload);
        }

        if(editSec.SectionID != payload.sectionID){
            editSec.SectionID = payload.sectionID;
            this.compareOrig(editSec);
        }
    },
    // form builder only
    updateFormSectionOrder(payload){
        var editSec = this.getFormSection(payload.formSectionId, false);
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
        }
    },


    /* FormSubSection & SubSection */

    formSubSectionHasChange(){
        var changed = this.state.form.subSections.find(function(ss){
            if(ss.hasOwnProperty('updateDB')){
                return ss.updateDB;
            }
            else return false;
        });
        if(changed){
            return true;
        }
        else return false;
    },
    getFormSubSectionID_Min(){
        return this.state.form.subSections.reduce(function(min, subsec){
            return subsec.FormSubSectionID < min ? subsec.FormSubSectionID : min;
        }, 0);
    },
    getFormSubSectionID_New(){
        return this.getFormSubSectionID_Min() - 1;
    },
    getFormSubSectionOrder_Max(){
        return this.state.form.subSections.reduce(function(max, subsec){
            return subsec.SubSectionOrder > max ? subsec.SubSectionOrder : max;
        }, 0);
    },
    getFormSubSectionOrder_New(){
        return this.getFormSubSectionOrder_Max() + 1;
    },

    getFormSubSection(formSubSectionID){
    	return this.state.form.subSections.find(function(ss){
    		return ss.FormSubSectionID == formSubSectionID;
    	});
    },
    getOrigFormSubSection(formSubSectionID){    //payload = {id: formSubSectionID}
        var payload2 = Object.assign({}, payload, {objName: 'subSections', idPropname: 'FormSubSectionID'});
        return this.getDataObj(payload2);
        /*return this.state.database.subSections.find(function(ss){
            return ss.FormSubSectionID == formSubSectionID;
        });*/
    },
    getFormSubSectionBefore(subSectionOrder){
        return this.state.form.subSections.find(function(s){
            return s.SubSectionOrder == (subSectionOrder - 1);
        });
    },
    getFormSubSectionAfter(subSectionOrder){
        return this.state.form.subSections.find(function(s){
            return s.SubSectionOrder == (subSectionOrder + 1);
        });
    },
    getSubSection(subSectionID){
    	return this.state.subSections.find(function(ss){
    		return ss.SubSectionID == subSectionID;
    	});
    },

    getFormSubSections_OrderedInSec(payload){   //payload = {formSectionID}
        var fsec = this.getFormSection(payload);
        var secID;
        if(fsec){
            secID = fsec.SubSectionID;
            if(secID){
                return this.state.form.subSections.filter(function(ss){
                    return ss.SectionID == secID;
                }).sort(function(a,b){
                    return a.SubSectionOrder - b.SubSectionOrder;
                });
            }
        }
    },

    getFormSubSectionProp(formSubSectionID, propname){
        var fsec = this.getFormSubSection(formSubSectionID);
        var sec;
        var prop;
        if(fsec){
            if(fsec.hasOwnProperty(propname)){
               prop = fsec[propname];
            }
            else{
                if (this.debug) console.log('getFormSubSectionProp: form subsection has no prop ' + propname);
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
        
        return prop;
    },

    // form builder only
    /*addFormSubSection(){
        var self = this;
        var newSec = clone(self.state.default.subSection);
        newSec.FormSubSectionID = this.getFormSubSectionID_New();
        newSec.SubSectionOrder = this.getFormSubSectionOrder_New();
        this.state.form.subSections.push(newSec);
    },*/
    // form builder only
    addSubSectionTitle(payload){
        var newSec = {
            SubSectionID: payload.subSectionID,
            SubSectionTitle: payload.subSectionTitle
        }
        this.state.subSections.push(newSec);
    },
    // form builder only
    updateFormSubSectionProp(payload){
        var editSec = this.getFormSubSection(payload.formSubSectionId);
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
        }
    },
    // form builder only
    updateFormSubSectionTitle(payload){
        var editSec = this.getFormSubSection(payload.formSubSectionId);
        var sec = this.getSubSection(payload.subSectionID);
        if(!sec){
            this.addSubSectionTitle(payload);
        }

        if(editSec.SectionID != payload.sectionID){
            editSec.SectionID = payload.sectionID;
            this.compareOrig(editSec);
        }
    },
    // form builder only
    updateFormSubSectionOrder(payload){
        var editSec = this.getFormSubSection(payload.formSubSectionId);
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
            console.log('new feature');
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
            console.log('new feature');
        }
    },


    /* Form Fields */

    formFieldHasChange(){
        var changed = this.state.form.fields.find(function(f){
            if(f.hasOwnProperty('updateDB')){
                return f.updateDB;
            }
            else return false;
        });
        if(changed){
            return true;
        }
        else return false;
    },
    /* Filters active form fields */
    getFormFields(){
        return this.state.form.fields.filter(function(f){
            return f.Active;
        });
    },
    /* Filters inactive form fields */
    getFormFields(){
        return this.state.form.fields.filter(function(f){
            return f.Active == 0 || f.Active === null;
        });
    },
    getFormFields_Ordered(){
        return this.getFormFields().sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });
    },
    /* Finds min FormFieldID (includes inactive FormFields) */
    getFormFieldID_Min(){
        return this.state.form.fields.reduce(function(min, field){
            return field.FormFieldID < min ? field.FormFieldID : min;
        }, 0);
    },
    getFormFieldID_New(){
        return this.getFormFieldID_Min() - 1;
    },
    getFormFieldOrder_Max(){
        return this.state.form.fields.reduce(function(max, field){
            return field.FieldOrder > max ? field.FieldOrder : max;
        }, 0);
    },
    getFormFieldOrder_New(){
        return this.getFormFieldOrder_Max() + 1;
    },
    getFieldOrder_MinInSec(formSectionID){
        var sFields = this.getFormFields_OrderedInSec(formSectionID);
        var firstOrder;
        if(sFields && sFields.length > 0){
            firstOrder = sFields[0].FieldOrder;
        }
        return firstOrder;
    },
    getFieldOrder_MaxInSec(formSectionID){
        var sFields = this.getFormFields_OrderedInSec(formSectionID);
        var lastOrder;
        if(sFields && sFields.length > 0){
            lastOrder = sFields[(sFields.length - 1)].FieldOrder;
        }
        return lastOrder;
    },
    getFieldOrder_MinInSubSec(formSubSectionID){
        var sFields = this.getFormFields_OrderedInSubSec(formSubSectionID);
        var firstOrder;
        if(sFields && sFields.length > 0){
            firstOrder = sFields[0].FieldOrder;
        }
        return firstOrder;
    },
    getFieldOrder_MaxInSubSec(formSubSectionID){
        var sFields = this.getFormFields_OrderedInSubSec(formSubSectionID);
        var lastOrder;
        if(sFields && sFields.length > 0){
            lastOrder = sFields[(sFields.length - 1)].FieldOrder;
        }
        return lastOrder;
    },
    getField_PrimaryDate(){
        return this.state.form.fields.find(function(field){
            return field.PrimaryDateField == true && field.FieldTypeID == 1;
        });
    },
    getFields_Required(){
        return this.state.form.fields.filter(function(f){
            return f.Active;
        });
    },
    // Does NOT include Primary Date Field
    getFieldsInHeader_Ordered(){
        return this.state.form.fields.filter(function(f){
            return (f.VisibleInHeader == 1 && (!(f.PrimaryDateField) || (f.PrimaryDateField == true && f.FieldTypeID != 1)));
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });
    },

    getFormField(payload){  // payload={formFieldID, isOrig}
        var payload2 = Object.assign({}, payload, {objName: 'fields', idPropname: 'FormFieldID'});
        return this.getDataObj(payload2);
        /*return this.state.form.fields.find(function(field){
            return field.FormFieldID == formFieldID;
        });*/
    },
    getFormFieldBefore(fieldOrder){
        return this.state.form.fields.find(function(f){
            return f.FieldOrder == (fieldOrder - 1);
        });
    },
    getFormFieldAfter(fieldOrder){
        return this.state.form.fields.find(function(f){
            return f.FieldOrder == (fieldOrder + 1);
        });
    },
    getDefaultField_ForSection(formSectionID){
        var newField = clone(this.state.default.field);
        newField.FormSectionID = formSectionID;
        return newField;
    },
    getDefaultField_ForSubSection(formSubSectionID, formSectionID){
        var newField = this.getDefaultFieldForSection(formSectionID);
        newField.FormSubSectionID = formSubSectionID;
        return newField;
    },
    getFieldType(fieldTypeID){
        return this.state.fieldTypes.find(function(ft){
            return ft.FieldTypeID == fieldTypeID;
        });
    },
    getFormFieldType(formFieldID){
        var field = this.getFormField(formFieldID);
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
        return fieldType;
    },

    getFormFields_OrderedInSec(formSectionID){
        return this.state.form.fields.filter(function(f){
            return (f.FormSectionID == formSectionID && !(f.FormSubSectionID));
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });
    },
    getFormFields_OrderedInSubSec(formSubSectionID){
        return this.state.form.fields.filter(function(f){
            return f.FormSubSectionID == formSubSectionID;
        }).sort(function(a,b){
            return a.FieldOrder - b.FieldOrder;
        });
    },

    // form builder only
    addFormField(){
        var self = this;
        var newField = clone(self.state.default.field);
        newField.FormFieldID = this.getFormFieldID_New();
        newField.FieldOrder = this.getFormFieldOrder_New();
        this.state.form.fields.push(newField);
    },
    addFormField_InSection(formSectionID){
        var newField = clone(this.state.default.field);
        var maxFieldOrder = this.getFieldOrder_MaxInSec(formSectionID);
        var fields = this.getFormFields_Ordered();

        newField.FormFieldID = this.getFormFieldID_New();
        newField.FormSectionID = formSectionID;
        newField.FieldOrder = (maxFieldOrder + 1);
        // increase order of future fields
        if (fields && fields.length > maxFieldOrder){
            this.fields.forEach(function(f){
                if(f.FieldOrder > maxFieldOrder){
                    f.FieldOrder++;
                }
            })
        }
        this.state.form.fields.push(newField);
    },
    addFormField_InSubSection(formSubSectionID, formSectionID){
        var newField = clone(this.state.default.field);
        var maxFieldOrder = this.getFieldOrder_MaxInSubSec(formSubSectionID);
        var fields = this.getFormFields_Ordered();

        newField.FormFieldID = this.getFormFieldID_New();
        newField.FormSectionID = formSectionID;
        newField.FormSubSectionID = formSubSectionID;
        newField.FieldOrder = (maxFieldOrder + 1);
        // increase order of future fields
        if (fields && fields.length > maxFieldOrder){
            this.fields.forEach(function(f){
                if(f.FieldOrder > maxFieldOrder){
                    f.FieldOrder++;
                }
            })
        }
        this.state.form.fields.push(newField);
    },

    // form builder only
    updateFormFieldProp(payload){
        var editField = this.getFormField(payload.formFieldId);
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
        }
    },
    // form builder only
    updateFormFieldType(payload){
        var editField = this.getFormField(payload.formFieldId);

        if(editField.FieldTypeID != payload.fieldTypeID){
            editField.FieldTypeID = payload.fieldTypeID;
            this.compareOrig(editField);
        }
    },
    // form builder only
    updateFormFieldOrder(payload){
        var editField = this.getFormField(payload.formFieldId);
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
        }
    },

    getFormFieldProp(fieldID, propname){
        var fsec = this.getFormSubSection(formSubSectionID);
        var sec;
        var prop;
        if(fsec){
            if(fsec.hasOwnProperty(propname)){
               prop = fsec[propname];
            }
            else{
                if (this.debug) console.log('getFormSubSectionProp: form subsection has no prop ' + propname);
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
        
        return prop;
    },


    /* Val Sets */

    formVSOptionHasChange(){
        var changed = this.state.form.vsOptions.find(function(o){
            if(o.hasOwnProperty('updateDB')){
                return o.updateDB;
            }
            else return false;
        });
        if(changed){
            return true;
        }
        else return false;
    },
    getFormVSOptions_OrderedInSet(valSetID){
        return this.state.form.vsOptions.filter(function(o){
            return o.Active && o.ValidationSetID == valSetID;
        }).sort(function(a,b){
            return compareVSOptions(a, b, {byCategory: true, alphabetically: false});
        });
    },
    getFormVSOptions_OrderedInSet_ExCategory(valSetID){
        var self = this;
        return this.state.form.vsOptions.filter(function(o){
            return o.Active && o.ValidstionSetID == valSetID;
        }).sort(function(a,b){
            return self.compareVSOptions(a, b, {byCategory: false, alphabetically: false});
        });
    },

    setValSetOptions(_valSetID){
        var self = this;

        if (this.debug) console.log('getValOptions triggered for vsID=' + _valSetID);

        if(_valSetID){
            this.state.isLoading = true;
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get Validation Set',
                vsID: _valSetID
            },
            function(returnData){
                self.state.validationSets = clone(returnData.VSOptions);
                self.state.valSetID = _valSetID;
                self.state.isLoading = false;
            })
            .fail(function(dataX){
                if (this.debug) console.log('Webservice Fail: Get Validation Set: ' + _valSetID);
                self.state.valSetID = null;
                self.state.isLoading = false;
            });
        }
    },
    /* Used by getFormVSOptions_OrderedInSet, getFormVSOptions_OrderedInSet_ByCategory, compareColValObjs */
    compareVSOptions(vsOptA, vsOptB, sortPayload){
        var returnVal = 0;
        if(sortPayload){
            if(sortPayload.byCategory){
                // put options without category at beginning
                if(vsOptA.VSECategory === null && colObjB.valObj.VSECategory === null){
                    returnVal = 0;
                }
                else if(vsOptA.VSECategory === null){
                    returnVal = -1;
                }
                else if(vsOptB.VSECategory === null){
                    returnVal = 1;
                }
                // compare option category text
                else if(vsOptA.VSECategory == vsOptB.VSECategory){
                    returnVal = 0;
                }
                else if(vsOptA.VSECategory < vsOptB.VSECategory){
                    returnVal = -1;
                }
                else if(vsOptA.VSECategory > vsOptB.VSECategory){
                    returnVal = 1;
                }
            }

            if(returnVal == 0){
                if(!(sortPayload.alphabetically)){
                    if(vsOptA.OptionOrder < vsOptB.OptionOrder){
                        returnVal = -1;
                    }
                    else if(vsOptA.OptionOrder > vsOptB.OptionOrder){
                        returnVal = 1;
                    }
                }
                else if(sortPayload.alphabetically){   // compare EntryName
                    if(vsOptA.EntryName < vsOptB.EntryName){
                        returnVal = -1;
                    }
                    else if(vsOptA.EntryName > vsOptB.EntryName){
                        returnVal = 1;
                    }
                }
            }
        }
        else{
            if(vsOptA.EntryValue == vsOptB.EntryValue){
                returnVal = 0;
            }
            else if(vsOptA.EntryValue < vsOptB.EntryValue){
                returnVal = -1;
            }
            else if(vsOptA.EntryValue > vsOptB.EntryValue){
                returnVal = 1;
            }
        }

        return returnVal;
    },


    compareFieldOrder(a, b){
        var returnVal = 0;
        if(a.SectionOrder < b.SectionOrder){
            returnVal = -1;
        }
        else if(a.SectionOrder > b.SectionOrder){
            returnVal = 1;
        }
        else if((a.SubSectionOrder ) || (b.SubSectionOrder)){
            if(!(a.SubSectionOrder ) && (b.SubSectionOrder)){
                returnVal = -1;
            }
            else if((a.SubSectionOrder ) && !(b.SubSectionOrder)){
                returnVal = 1;
            }
            else if(a.SubSectionOrder < b.SubSectionOrder){
                returnVal = -1;
            }
            else if(a.SubSectionOrder > b.SubSectionOrder){
                returnVal = 1;
            }
        }
        else if(a.FieldOrder < b.FieldOrder){
            returnVal = -1;
        }
        else if(a.FieldOrder > b.FieldOrder){
            returnVal = 1;
        }
        return returnVal;
    },


    payloadToStr(payload){
        var msg = '';

        if(payload.hasOwnProperty('objName') && payload.objName){
            msg += 'obj: '+ payload.objName;
        }

        if( (payload.hasOwnProperty('id') && payload.id) && (payload.hasOwnProperty('idPropname') && payload.idPropname) ){
            msg += ', id (' + payload.idPropname + '): ' + payload.id;
        }

        if(payload.hasOwnProperty('propname') && payload.propname){
            msg += ', prop: ' + payload.propname; 
        }

        if(payload.hasOwnProperty('fieldObj') && payload.fieldObj){
            msg += '; fieldObj - ';

            if (payload.fieldObj.hasOwnProperty('fieldTypeID') && payload.fieldObj.fieldTypeID){
                msg += 'fieldTypeID: ' + payload.fieldObj.fieldTypeID;
            }
            else if(payload.fieldObj.hasOwnProperty('FieldTypeID') && payload.fieldObj.FieldTypeID){
                msg += 'FieldTypeID: ' + payload.fieldObj.FieldTypeID;
            }
            else if (payload.fieldObj.hasOwnProperty('fieldType') && payload.fieldObj.fieldType){
                msg += 'fieldType: ' + payload.fieldObj.fieldType;
            }
            else if(payload.fieldObj.hasOwnProperty('FieldType') && payload.fieldObj.FieldType){
                msg += 'FieldType: ' + payload.fieldObj.FieldType;
            }
            else{
               msg += '? (should be logged above)';
               console.log(payload.fieldObj);
            }
        }

        if(payload.hasOwnProperty('isOrig') && payload.isOrig){
            msg += '; (DB)'; 
        }
    },


/* MUTATIONS */

    setColumnValObjs(newVal, storeName){   //setAllValObjs
        var cols = this.getColumns(storeName);
        var payload = {};
        cols.forEach(c){
            payload = Object.assign(payload, {colVal: newVal[c.ColumnName], FieldType: c.ColumnType, Column: c});

            if (c.hasOwnProperty('FieldTypeID')){
                payload = Object.assign(payload, {FieldTypeID: c.FieldTypeID});
            }
            if (c.hasOwnProperty('ValidationSetID')){
                payload = Object.assign(payload, {ValidationSetID: c.ValidationSetID});
            }
            if (c.hasOwnProperty('JoinSet')){
                payload = Object.assign(payload, {JoinSet: c.JoinSet, ValueProp: c.ForeignKey, TextProp: c.TextColumn});
            }

            if (c.hasOwnProperty('Label')){
                payload = Object.assign(payload, {Label: c.Label});
            }
            if (c.hasOwnProperty('UserInput')){
                payload = Object.assign(payload, {isInput: c.UserInput, required: c.Required});
            }
            if (c.hasOwnProperty('Calculated')){
                payload = Object.assign(payload, {calculated: c.Calculated});
            }
            if (c.hasOwnProperty('ShowInHeader')){
                payload = Object.assign(payload, {isHeader: c.ShowInHeader, inTooltip: c.HasTooltip, tooltipCol: c.TooltipForCol});
            }

            if(newVal.hasOwnProperty(c.ColumnName)){
                newVal[c.ColumnName] = self.getColValObj(payload);
            }
            else{
                Vue.set( newVal, c.ColumnName, self.getColValObj(payload) );
            }
        }
    },

    /* Use SET functions if newVal is only the actual values for that resultset */
    /* Sets both an editable resultset  (state.form) and a live resultset for comparison (state.database) */
    setColumns (newValue, storeName) {
        this.state.columns[storeName] = clone(newValue);
    },
    setFormData (newValue, stateName) {
        this.state[stateName].formData = clone(newVal);
    },
    setFormSections (newValue, stateName) {
        this.state[stateName].sections = clone(newValue);
    },
    setFormSubSections (newValue, stateName) {
        this.state[stateName].subSections = clone(newValue);
    },
    setFormFields (newValue, stateName) {
        this.state[stateName].fields = clone(newValue);
    },
    setFormValSets (newValue, stateName) {
        this.state[stateName, stateName].valSets = clone(newValue);
    },
    setFormVSOptions (newValue, stateName) {
        this.state[stateName].vsOptions = clone(newValue);
    },
    setFormVSEntries (newValue, stateName) {
        this.state[stateName].vsEntries = clone(newValue);
    },
    setFormVSECategories (newValue, stateName) {
        this.state[stateName].vseCategories = clone(newValue);
    },
    setFormRecord(newValue, stateName){
        this.state[stateName].record = clone(newValue);
    },
    setFormRecords(newValue, stateName){
        this.state[stateName].records = clone(newValue);
    },
    setAllForms (newValue, stateName) {
        this.state[stateName].allforms = clone(newValue);  
    },
    setAllDepartments (newValue, stateName) {
        this.state[stateName].alldepartments = clone(newValue);
    },
    setAllSections (newValue, stateName) {
        this.state[stateName].allsections = clone(newValue);
    },
    setAllSubSections (newValue, stateName) {
        this.state[stateName].allsubSections = clone(newValue);
    },
    setAllFieldTypes (newValue, stateName) {
        this.state[stateName].allfieldTypes = clone(newValue);
    },
    setAllValidationSets (newValue, stateName) {
        this.state[stateName].allvalSets = clone(newValue);
    },

    /* Use LOAD functions to add all return sets from Webservice */
    loadColumns(newValue, storeNames){
        var fCols;
        this.state.columns.isloading = true;

        storeNames.forEach(storeName){
            fCols = newValue.filter(function(col){
                return col.StoreName = storeName;
            });
            if(fCols & fCols.length > 0){
                this.setColumns(fCols, storeName);
            }
        }

        this.state.columns.isloading = false;
    },
    loadFormData (newValue) {
        if (this.debug) console.log('loadFormData triggered');
        var addDefault = false;

        if(newValue.length > 0){
            // BUILDER
            if(newValue[0].hasOwnProperty('updateDB')){
                var f1 = newValue.find(function(f){
                    return f.updateDB === false;
                });
                if(f1 === undefined){
                    addDefault = true;
                }
                else{
                    this.setFormData(f1, true);
                }

                var f2 = newValue.find(function(f){
                    return f.updateDB === true;
                });
                this.setDefaultFormData(f2, true);

                if(addDefault){
                    if (this.debug) console.log('loadFormData: Adding Default FormData');
                    store.addDefaultFormData();
                }
            }
            // ENTRY
            else if (newValue.length == 0){
                this.setFormData(newValue[0], false);
            }
            else{
                if (this.debug) console.log('loadFormData: Multiple FormData results');
            }
        }
    },
    loadFormSections (newValue) {
        if (this.debug) console.log('loadFormSections triggered');
        var addDefault = false;

        if(newValue.length > 0){
            // BUILDER
            if(newValue[0].hasOwnProperty('updateDB')){
                var f1 = newValue.filter(function(f){
                    return f.updateDB === false;
                });
                this.setFormSections(f1);

                var f2 = newValue.find(function(f){
                    return f.updateDB === true && !(f.SectionID);
                });
                this.setDefaultSection(f2);

                var f3 = newValue.find(function(f){
                    return f.updateDB === true && f.SectionID == 2;
                });
                this.setDefaultLastSection(f3);

                var f4 = newValue.find(function(f){
                    return f.updateDB === true && f.SectionID == 1;
                });
                this.setDefaultFirstSection(f4);
            }
            else if()
        }
    },
    loadFormSubSections (newValue) {
        if (this.debug) console.log('loadFormSubSections triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormSubSections(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        this.setDefaultFormSubSection(f2);
    },
    loadFormFields (newValue) {
        if (this.debug) console.log('loadFormFields triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormFields(f1);

        var f2 = dataX.FormVSOptions.find(function(f){
            return f.updateDB === true;
        });
        this.setDefaultFormField(f2);
    },
    loadFormValSets (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormValSets(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormValSet(f2);
    },
    loadFormVSOptions (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormVSOptions(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormVSOption(f2);
    },
    loadFormVSEntries (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormVSEntries(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormVSEntry(f2);
    },
    loadFormVSECategories (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormVSECategories(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormVSECategory(f2);
    },
    loadFormRecord (newValue) {
        if (this.debug) console.log('loadFormRecord triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormRecord(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormRecord(f2);
    },
    loadFormRecords (newValue) {
        if (this.debug) console.log('loadFormRecords triggered')
        var f1 = newValue.filter(function(f){
            return f.updateDB === false;
        });
        this.setFormRecords(f1);

        var f2 = newValue.find(function(f){
            return f.updateDB === true;
        });
        store.setDefaultFormRecords(f2);
    },

    loadAllForms (newValue) {
        var self = this;
        var newVal = clone(newValue);
        newVal.forEach(function(f){
            this.setColumnValObjs(newVal, 'allforms');
        });

        this.setAllForms(newVal, 'database');
    },
    loadAllDepartments (newValue) {
        var setDefaults = false;
        if(newValue && newValue.length > 0){
            setDefaults = newValue[0].hasOwnProperty('updateDB');
        }
        if (this.debug) console.log('setAllDepartments triggered - database set: false, defaults set: ' + setDefaults.toString());
        var self = this;
        var newVal = clone(newValue);
        newVal.forEach(function(f){
            // Get ValObjects
            f.FormID = self.getColValObj({colVal: f.FormID, FieldType: 'INT'});
            f.CreateDate = self.getColValObj({colVal: f.CreateDate, FieldType: 'DATETIME'});
            f.LastEditDate = self.getColValObj({colVal: f.LastEditDate, FieldType: 'DATETIME'});
        });
        this.state.alldepartments = newVal;
        this.state.database.alldepartments = clone(newVal);


        /*if (this.debug) console.log('setAllDepartments triggered')
        var self = this;
        var newVal = clone(newValue);
        newVal.forEach(function(f){
            // Get ValObjects
            f.FormID = self.getColValObj({colVal: f.FormID, FieldType: 'INT'});
            f.CreateDate = self.getColValObj({colVal: f.CreateDate, FieldType: 'DATETIME'});
            f.LastEditDate = self.getColValObj({colVal: f.LastEditDate, FieldType: 'DATETIME'});
        });
        this.state.alldepartments = newVal;
        this.state.database.alldepartments = clone(newVal);*/

    },
    loadAllSections (newValue) {
        if (this.debug) console.log('setAllSections triggered')
        this.state.allsections = clone(newValue);
        this.state.database.allsections = clone(newValue);
    },
    loadAllSubSections (newValue) {
        if (this.debug) console.log('setAllSubSections triggered')
        this.state.allSubSections = clone(newValue);
        this.state.database.allsubSections = clone(newValue);
    },
    loadAllFieldTypes (newValue) {
        if (this.debug) console.log('setAllFieldTypes triggered')
        this.state.allFieldTypes = clone(newValue);
        this.state.database.allfieldTypes = clone(newValue);
    },
    loadAllValidationSets (newValue) {
        this.state.allValSets = clone(newValue);
        this.state.database.allvalSets = clone(newValue);
    },



    compareColVals(colA, colB, sortBy){
        var returnVal = 0;

        if(typeof(colA) == 'object' && typeof(colB) == 'object'){
            var returnVal = this.compareColValObjs(colA, colB, {byCategory: false, alphabetically: false});
        }
        else if(typeof(colA) == 'object'){
            if (this.debug) console.log("ERROR: comparing different types: (" + colA.valType + ") " + colA.val + " ? " + colB);
            returnVal = 0;
        }
        else if(typeof(colB) == 'object'){
            if (this.debug) console.log("ERROR: comparing different types: " + colA + " ? " + " (" + colB.valType + ") " + colB.val);
            returnVal = 0;
        }
        else{
            // check for null, nulls at end
            if(colA === null && colB === null){
                returnVal = 0;
            }
            else if(colA === null){
                returnVal = -1;
            }
            else if(colB === null){
                returnVal = 1;
            }
            else if(colA > colB){
                returnVal = 1;
            }
            else if(colA < colB){
                returnVal - 1;
            }
        }
        // don't change sign if comparison included a null
        if(sortBy && sortBy.toUpperCase() == 'DESCENDING' || sortBy.toUpperCase() == 'DESC'){
            returnVal = returnVal * -1;
        }
        return returnVal;
    },

    /* Used by updateObjProp, compareColVals */
    compareColValObjs(colObjA, colObjB, sortPayload){
        var returnVal = 0;

        //console.log(colObjA.val + " : " + colObjB.val);

        // check for null, nulls at end
        if(colObjA.val === null && colObjB.val === null){
            returnVal = 0;
        }
        else if(colObjA.valType != 'boolean' && colObjA.val === null){
            returnVal = -1;
        }
        else if(colObjB.valType != 'boolean' && colObjB.val === null){
            returnVal = 1;
        }
        else if(colObjA.valType == 'moment' && colObjB.valType == 'moment'){
            moDiff = colObjA.val.diff(colObjB.val);
            if(moDiff == 0){
                returnVal = 0;
            }
            else if(moDiff < 0){
                returnVal = -1;
            }
            else if(moDiff > 0){
                returnVal = 1;
            }
        }
        else if (colObjA.valType == 'set' && colObjB.valType == 'set'){
            if(colObjA.valObj && colObjB.valObj){
                this.compareVSOptions(colObjA.valObj, colObjB.valObj, sortPayload);
            }
            else{
                if(colObjA.val == colObjB.val){
                    returnVal = 0;
                }
                else if(colObjA.val < colObjB.val){
                    returnVal = -1;
                }
                else if(colObjA.val > colObjB.val){
                    returnVal = 1;
                }
            }
        }
        else if (colObjA.valType == 'boolean' && colObjB.valType == 'boolean'){
            if(colObjA.val == colObjB.val){
                returnVal = 0;
            }
            else if(colObjA.val && !(colObjB.val)){
                returnVal = 1;
            }
            else if(!(colObjA.val) && colObjB.val){
                returnVal = -1;
            }
        }
        else if (colObjA.valType == colObjB.valType){
            if(colObjA.val == colObjB.val){
                returnVal = 0;
            }
            else if(colObjA.val < colObjB.val){
                returnVal = -1;
            }
            else if(colObjA.val > colObjB.val){
                returnVal = 1;
            }
        }
        // prop types don't match
        else{
            if (this.debug) console.log("COMPARING TWO DIFFERENT TYPES - " + colObjA.valType + ' ? ' + colObjB.valType);
            if(colObjA.valType == 'boolean' && colObjB.valType != 'boolean'){
                returnVal = 1;
            }
            else if(colObjA.valType != 'boolean' && colObjB.valType == 'boolean'){
                returnVal = -1;
            }
            else{
                if(colObjA.val == colObjB.val){
                    returnVal = 0;
                }
                else if(colObjA.val < colObjB.val){
                    returnVal = -1;
                }
                else if(colObjA.val > colObjB.val){
                    returnVal = 1;
                }
            }
        }

        return returnVal;
    },

    getColValObj(payload){    // colVal (req), FieldType, FieldTypeID, showTimestamp, showDay, setDefault
        var self = this;
        var colValObj = {dbVal: payload.colVal, updateDB: false};

        //fieldtype: fieldType, valType: valType, valObj: valObj
        var fieldType = payload.hasOwnProperty('FieldType') ? payload.FieldType: null;
        colValObj = Object.assign({}, colValObj, {Fieldtype: fieldType});

        if(payload.hasOwnProperty('Label')){    colValObj = Object.assign({}, colValObj, {Label: payload.Label});    }
        if(payload.hasOwnProperty('isInput')){    colValObj = Object.assign({}, colValObj, {isInput: payload.isInput});    }
        if(payload.hasOwnProperty('required')){    colValObj = Object.assign({}, colValObj, {required: payload.required});    }
        if(payload.hasOwnProperty('calculated')){    colValObj = Object.assign({}, colValObj, {calculated: payload.calculated});    }
        if(payload.hasOwnProperty('isHeader')){    colValObj = Object.assign({}, colValObj, {isHeader: payload.isHeader});    }
        if(payload.hasOwnProperty('inTooltip')){    colValObj = Object.assign({}, colValObj, {inTooltip: payload.inTooltip});    }
        if(payload.hasOwnProperty('tooltipCol')){    colValObj = Object.assign({}, colValObj, {tooltipCol: payload.inTooltip});    }
        if(payload.hasOwnProperty('ValidationSetID')){  colValObj = Object.assign({}, colValObj, {ValSetID: payload.ValidationSetID});  }

        var joinSet, valProp, textProp;
        if(payload.hasOwnProperty('JoinSet')){
            joinSet = payload.JoinSet;
            valProp = payload.ValProp;
            textProp = payload.TextProp;
            colValObj = Object.assign({}, colValObj, {JoinSet: joinSet, ValProp: valProp, TextProp: textProp});
        }

        var valType;
        var val;
        var displayVal;
        var valObj;

        if(payload.hasOwnProperty('FieldTypeID') && payload.FieldTypeID > 0 && payload.FieldTypeID <= 7){

            switch(parseInt(payload.FieldTypeID)){
                case 1: // date
                    valType = 'moment';
                    if(payload.colVal !== null){
                        val = moment();
                    }
                    else if(payload.hasOwnProperty('setDefault') && payload.setDefault){
                        val = moment();
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                break;
                case 2: // time ??
                    valType = 'moment';
                    if(payload.colVal !== null){
                        val = moment.utc(payload.colVal);
                    }
                    // set null dates to current date?
                    else if(payload.hasOwnProperty('setDefault') && payload.setDefault){
                        val = moment();
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                break;
                case 3: // number
                    valType = 'number';
                    if(payload.colVal !== null){
                        valObj = Number(payload.colVal);
                        val = parseFloat(payload.colVal);
                        displayVal = payload.colVal.toString();
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                break;
                case 4: // text,
                case 5: // text area
                    valType = 'string';
                    if(payload.colVal !== null){
                        displayVal = payload.colVal.toString();
                        val = payload.colVal.toString().toUpperCase();
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                break;
                case 6: // checkbox
                    valType = 'boolean';
                    // allow for bits to be null
                    if(payload.colVal === null){
                        val = false;
                    }
                    else{
                        val = payload.colVal;
                    }
                    displayVal = val ? 'true' : 'false';
                break;
                case 7: // valset
                    valType = 'set';
                    if(payload.colVal !== null && (self.state.form.vsOptions.length > 0 || self.state.database.vsOptions.length > 0)){
                        // entry
                        if(self.state.form.vsOptions.length > 0 && self.state.form.vsOptions[0].hasOwnProperty('EntryValue')){
                            valObj = self.state.form.vsOptions.find(function(v){
                                return v.ValidationSetID == payload.ValidationSetID && v.EntryValue == payload.colVal;
                            });
                            val = valObj.EntryValue;
                            displayVal = valObj.EntryName.toString();
                        }
                        else if(self.state.database.vsOptions.length > 0 && self.state.database.vsOptions[0].hasOwnProperty('EntryValue')){
                            valObj = self.state.database.vsOptions.find(function(v){
                                return v.ValidationSetID == payload.ValidationSetID && v.EntryValue == payload.colVal;
                            });
                            val = valObj.EntryValue;
                            displayVal = valObj.EntryName.toString();
                        }
                        //builder
                        /*else{
                            var options;
                            var valObj2;
                            var objID;

                            options = self.state.form.vsOptions.filter(function(v){
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
                        }*/
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                break;
            }
        }
        else if(payload.hasOwnProperty('FieldType')){
            // dates / times
            if(fieldType.toUpperCase().indexOf('DATETIME') > -1){
                valType = 'moment';
                if(payload.colVal !== null){
                    val = moment.utc(payload.colVal);
                }
                // set null dates to current date?
                else if(payload.hasOwnProperty('setDefault') && payload.setDefault){
                    val = moment();
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else if(fieldType.toUpperCase().indexOf('DATE') > -1){
                valType = 'moment';
                if(payload.colVal !== null){
                    val = moment();
                }
                else if(payload.hasOwnProperty('setDefault') && payload.setDefault){
                    val = moment();
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else if(fieldType.toUpperCase().indexOf('TIME') > -1){
                valType = 'moment';
                if(payload.colVal !== null){
                    val = moment.utc(payload.colVal);
                }
                // set null dates to current date?
                else if(payload.hasOwnProperty('setDefault') && payload.setDefault){
                    val = moment();
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            // Numbers / GUIDs
            else if(fieldType.toUpperCase().indexOf('GUID') > -1){
                valType = 'string';
                val = payload.colVal.toString().toUpperCase();
                displayVal = '';
            }
            else if(fieldType.toUpperCase().indexOf('INT') > -1){
                valType = 'number';
                if(payload.colVal !== null){
                    valObj = Number(payload.colVal);
                    val = parseInt(payload.colVal);
                    displayVal = payload.colVal.toString();;
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else if(fieldType.toUpperCase().indexOf('DOUBLE') > -1 || fieldType.toUpperCase().indexOf('NUMBER') > -1){
                valType = 'number';
                if(payload.colVal !== null){
                    valObj = Number(payload.colVal);
                    val = parseFloat(payload.colVal);
                    displayVal = payload.colVal.toString();;
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else if (fieldType.toUpperCase().indexOf('TEXT') > -1 || fieldType.toUpperCase().indexOf('URL') > -1 || fieldType.toUpperCase().indexOf('USER') > -1 || fieldType.toUpperCase().indexOf('HTMLID') > -1){
                valType = 'string';
                if(payload.colVal !== null){
                    displayVal = payload.colVal.toString();
                    val = payload.colVal.toString().toUpperCase();
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else if (fieldType.toUpperCase().indexOf('BOOL') > -1 || fieldType.toUpperCase().indexOf('BOOLEAN') > -1){
                valType = 'boolean';
                // allow for bits to be null
                if(payload.colVal === null){
                    val = false;
                }
                else{
                    val = payload.colVal;
                }
                displayVal = val ? 'true' : 'false';
            }
            else if(payload.FieldType.toUpperCase().indexOf('JOIN') > -1){
                valType = 'set';
                if(payload.colVal !== null && (self.state.form[joinset].length > 0 || self.state.database[joinset].length > 0)){
                    if(self.state.form[joinset].length > 0 && self.state.form[joinset][0].hasOwnProperty(valProp)){
                        valObj = self.state.form[joinset].find(function(s){
                            return s[valProp] == payload.colVal;
                        });
                    }
                    else if(self.state.database[joinset].length > 0 && self.state.database[joinset][0].hasOwnProperty(valProp)){
                        valObj = self.state.database[joinset].find(function(s){
                            return s[valProp] == payload.colVal;
                        });
                    }

                    if(valObj){
                        val = valObj[valProp];
                        if(valObj.hasOwnProperty(textProp)){
                            displayVal = valObj[textProp].toString();
                        }
                        else{
                            displayVal = val.toString();
                        }
                    }
                    else{
                        val = null;
                        displayVal = '';
                    }
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
            else{
                valType = 'unknown';
                if(payload.colVal !== null){
                    val = payload.colVal;
                    displayVal = val.toString();
                }
                else{
                    val = null;
                    displayVal = '';
                }
            }
        }

        // set display for moments
        if(valType == 'moment' && val){
            if(payload.FieldType.toUpperCase().indexOf('DATETIME') > -1){
                    if(payload.hasOwnProperty('showDay') && payload.showDay && payload.hasOwnProperty('showTimestamp') && payload.showTimestamp){
                        displayVal = val.format('ddd M/D/YY h:mmA');
                    }
                    else if(payload.hasOwnProperty('showDay') && payload.showDay){
                        displayVal = val.format('ddd M/D/YY');
                    }
                    else if(payload.hasOwnProperty('showTimestamp') && payload.showTimestamp){
                        displayVal = val.format('M/D/YY h:mmA');
                    }
                    else{
                        displayVal = val.format('M/D/YY');
                    }
            }
            else if(payload.FieldType.toUpperCase().indexOf('DATE') > -1){
                displayVal = val.format('M/D/YY');
            }
            else if(payload.FieldType.toUpperCase().indexOf('TIME') > -1){
                displayVal = val.format('h:mmA');
            }
        }

        colValObj = Object.assign({}, colValObj, {val: val, displayVal: displayVal, valType: valType, valObj: valObj});
        return colValObj;
    },
}


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