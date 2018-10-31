var store = {
    debug: true,
    state: {
        isLoading: false,
        forms: [],
        departments: [],
        sections: [],
        subSections: [],
        fieldTypes: [],
        validationSets: [],
        valSetID: null,
        valSetOptions: [],
        default:{
            formData: {},
            section: {},
            firstSection: {},
            lastSection: {},
            subSection: {},
            field: {},
            vsOption: {}
        },
        form:{
            formData: {},
            sections: [],
            subSections: [],
            fields: [],
            vsOptions: [],
            minFieldID: -1,
            records:[],
        },
        database:{
            formData: {},
            sections: [],
            subSections: [],
            fields: [],
            vsOptions: [],
            records: [],
        }
    },
// mutations
    setAllForms (newValue) {
        if (this.debug) console.log('setAllForms triggered')
        this.state.forms = clone(newValue);
    },
    setAllDepartments (newValue) {
        if (this.debug) console.log('setAllDepartments triggered')
        this.state.departments = clone(newValue);
    },
    setAllSections (newValue) {
        if (this.debug) console.log('setAllSections triggered')
        this.state.sections = clone(newValue);
    },
    setAllSubSections (newValue) {
        if (this.debug) console.log('setAllSubSections triggered')
        this.state.subSections = clone(newValue);
    },
    setAllFieldTypes (newValue) {
        if (this.debug) console.log('setAllFieldTypes triggered')
        this.state.fieldTypes = clone(newValue);
    },

    setDefaultFormData (newValue) {
        if (this.debug) console.log('setDefaultFormData triggered')
        this.state.default.formData = clone(newValue);
    },
    setDefaultSection (newValue) {
        if (this.debug) console.log('setDefaultSection triggered')
        this.state.default.section = clone(newValue);
    },
    setDefaultFirstSection (newValue) {
        if (this.debug) console.log('setDefaultFirstSection triggered')
        this.state.default.firstSection = clone(newValue);
    },
    setDefaultLastSection (newValue) {
        if (this.debug) console.log('setDefaultLastSection triggered')
        this.state.default.lastSection = clone(newValue);
    },
    setDefaultSubSection (newValue) {
        if (this.debug) console.log('setDefaultSubSection triggered')
        this.state.default.subSection = clone(newValue);
    },
    setDefaultField (newValue) {
        if (this.debug) console.log('setDefaultField triggered')
        this.state.default.field = clone(newValue);
    },
    setDefaultVSOption (newValue) {
        if (this.debug) console.log('setDefaultVSOption triggered')
        this.state.default.vsOption = clone(newValue);
    },
    setAllValidationSets (newValue) {
        if (this.debug) console.log('setAllValidationSets triggered')
        this.state.validationSets = clone(newValue);
    },


    loadFormData (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        this.state.form.formData = clone(newValue);
        this.state.database.formData = clone(newValue);
    },
    loadFormSections (newValue) {
        if (this.debug) console.log('loadFormSections triggered')
        this.state.form.sections = clone(newValue);
        this.state.database.sections = clone(newValue);
    },
    loadFormSubSections (newValue) {
        if (this.debug) console.log('loadFormSubSections triggered')
        this.state.form.subSections = clone(newValue);
        this.state.database.subSections = clone(newValue);
    },
    loadFormFields (newValue) {
        if (this.debug) console.log('loadFormFields triggered')
        this.state.form.fields = clone(newValue);
        this.state.database.fields = clone(newValue);
    },
    loadFormVSOptions (newValue) {
        if (this.debug) console.log('loadFormData triggered')
        this.state.form.vsOptions = clone(newValue);
        this.state.database.vsOptions = clone(newValue);
    },
    loadFormRecords (newValue) {
        if (this.debug) console.log('loadFormRecords triggered')
        this.state.form.records = clone(newValue);
        this.state.database.records = clone(newValue);
    },


// computed
    getMinFormSectionID(){
        return this.state.form.sections.reduce(function(min, section){
            return section.FormSectionID < min ? section.FormSectionID : min;
        }, 0);
    },
    getNewFormSectionID(){
        return this.getMinFormSectionID() - 1;
    },
    getMaxFormSectionOrder(){
        return this.state.form.sections.reduce(function(max, section){
            return section.SectionOrder > max ? section.SectionOrder : max;
        }, 0);
    },
    getNewFormSectionOrder(){
        return this.getMaxFormSectionOrder() + 1;
    },
    getMinFormFieldID(){
        return this.state.form.fields.reduce(function(min, field){
            return field.FormFieldID < min ? field.FormFieldID : min;
        }, 0);
    },
    getNewFormFieldID(){
        return this.getMinFormFieldID() - 1;
    },


    getMinSectionID(){
        return this.state.sections.reduce(function(min, section){
            return section.SectionID < min ? section.SectionID : min;
        }, 0);
    },

// actions/computed??
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

// actions
    addDefaultFormData(){
        var self = this;
        var adding;
        if(!self.state.form.formData){
            adding = clone(self.state.default.formData);
            adding.FormID = -1;
            self.state.form.formData = adding;
        }
    },
    addNewSection(){
        var self = this;
        var adding;
        if(self.state.form.sections.length === 0){
            self.addFirstSection();
        }
        else{
            adding = clone(self.state.default.section);
            adding.FormSectionID = self.getNewFormSectionID();
            adding.SectionOrder = self.getNewFormSectionOrder();
            self.state.form.sections.push(adding);
        }
    },
    addFirstSection(){
        var self = this;
        var adding = clone(self.state.default.firstSection);
        adding.FormSectionID = self.getNewFormSectionID();
        self.state.form.sections.push(adding);
    },
    addLastSection(){
        var self = this;
        var adding = clone(self.state.default.lastSection);
        adding.FormSectionID = self.getNewFormSectionID();
        self.state.form.sections.push(adding);
    },
    getSection(sectionID){
        var sec = this.state.form.sections.find(function(section){
            return section.SectionID == sectionID;
        });
        if(sec){
            return sec;
        }
        else{
            if (this.debug) console.log('getSection: no section found for ID ' + sectionID);
            return null;
        }
    },
    getSubSection(subSectionID){
        var subsec = this.state.form.subSections.find(function(subsection){
            return subsection.SubSectionID == subSectionID;
        });
        if(subsec){
            return subsec;
        }
        else{
            if (this.debug) console.log('getSubSection: no subSection found for ID ' + subSectionID);
            return null;
        }
    },

    filterSubSections_SecID(sectionID){
        return this.state.form.subSections.filter(function(ss){
            return ss.SectionID == sectionID;
        })
    },

    getSectionProp(sectionID, propName){
        var sec = this.getSection(sectionID)
        if(sec){
            if(sec.hasOwnProperty(propName)){
                return sec[propName];
            }
            else{
                if (this.debug) console.log('getSectionProp: no prop ' + propName);
                return null;
            }
        }
        else return null;
    },
    getSubSectionProp(subSectionID, propName){
        var subsec = this.getSubSection(subSectionID);
        if(subsec){
            if(subsec.hasOwnProperty(propName)){
                return subsec[propName];
            }
            else{
                if (this.debug) console.log('getSubSectionProp: no prop ' + propName);
                return null;
            }
        }
        else return null;
    },

    getAllFieldsBySecID(sectionID){
        var formSectionID = this.getSectionProp(sectionID, 'FormSectionID');
        return this.getAllFieldsBySecID_F(formSectionID);
    },
    getFieldsBySecID(sectionID){
        var formSectionID = this.getSectionProp(sectionID, 'FormSectionID');
        return this.getFieldsBySecID_F(formSectionID);
    },

    getMaxOrderInSection(sectionID){
        var formSectionID = this.getSectionProp(sectionID, 'FormSectionID');
        return this.getMaxOrderInSection_F(formSectionID);
    },
    getDefaultFieldForSection(sectionID){
        var f = clone(this.state.default.field);
        f.FormSectionID = this.getSectionProp(sectionID, 'FormSectionID');
        f.SectionOrder =  this.getSectionProp(sectionID, 'SectionOrder');
        return f;
    },
    getDefaultFieldForSubSection(subSectionID, sectionID){
        var secID = sectionID;
        if(!secID){
            secID = this.getSubSectionProp(subSectionID, 'SectionID');
        }
        f = this.getDefaultFieldForSection(secID);
        f.FormSubSectionID = this.getSubSectionProp(subSectionID, 'FormSubSectionID');
        f.SectionOrder =  this.getSubSectionProp(subSectionID, 'SubSectionOrder');
        return f;
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



    getSection_F(formSectionID){
        var sec = this.state.form.sections.find(function(section){
            return section.FormSectionID == formSectionID;
        });
        if(sec){
            return sec;
        }
        else{
            if (this.debug) console.log('getSection_F: no section found for ID ' + formSectionID);
            return null;
        }
    },
    getOrigSection_F(formSectionID){
        var sec = this.state.database.sections.find(function(section){
            return section.FormSectionID == formSectionID;
        });
        if(sec){
            return sec;
        }
        else{
            if (this.debug) console.log('getOrigSection_F: no original section found for ID ' + formSectionID);
            return null;
        }
    },
    getSubSection_F(formSubSectionID){
        var subsec = this.state.form.subSections.find(function(subsection){
            return subsection.FormSubSectionID == formSubSectionID;
        });
        if(subsec){
            return subsec;
        }
        else{
            if (this.debug) console.log('getSubSection_F: no subSection found for ID ' + formSubSectionID);
            return null;
        }
    },
    getSectionProp_F(formSectionID, propName){
        var sec = this.getSection_F(formSectionID)
        if(sec){
            if(sec.hasOwnProperty(propName)){
                return sec[propName];
            }
            else{
                if (this.debug) console.log('getSectionProp_F: no prop ' + propName);
                return null;
            }
        }
        else return null;
    },
    getSubSectionProp_F(formSubSectionID, propName){
        var subsec = this.getSubSection_F(formSubSectionID)
        if(subsec){
            if(subsec.hasOwnProperty(propName)){
                return subsec[propName];
            }
            else{
                if (this.debug) console.log('getSubSectionProp_F: no prop ' + propName);
                return null;
            }
        }
        else return null;
    },
    getAllFieldsBySecID_F(formSectionID){
        return this.state.form.fields.filter(function(field){
            return field.FormSectionID == formSectionID;
        }).orderBy(function(a,b){
            return compareFieldOrder(a,b);
        });
    },
    getFieldsBySecID_F(formSectionID){
        var allFields = this.getAllFieldsBySecID_F(formSectionID);
        return allFields.filter(function(field){
            return !(field.FormSubSectionID);
        }).orderBy(function(a,b){
            return compareFieldOrder(a,b);
        });
    },

    getMaxOrderInSection_F(formSectionID){
        var fields = this.getFieldsBySecID(formSectionID);
        return this.state.fields.reduce(function(max, field){
            return field.FieldOrder > max ? field.FieldOrder : max;
        }, 0);
    },
    getDefaultFieldForSection_F(formSectionID){
        var f = clone(this.state.default.field);
        f.FormSectionID = formSectionID;
        f.SectionOrder =  this.getSectionProp_F(formSectionID, 'SectionOrder');
        return f;
    },

    getDefaultFieldForSubSection(formSubSectionID, formSectionID){
        var fSecID = formSectionID;
        var secID;
        if(!fSecID){
            secID = this.getSubSectionProp_F(formSubSectionID, 'SectionID');
            fSecID = this.getSubSectionProp(secID, 'FormSectionID');
        }
        f = this.getDefaultFieldForSection_F(fSecID);
        f.FormSubSectionID = formSubSectionID;
        f.SectionOrder =  this.getSubSectionProp_F(formSubSectionID, 'SubSectionOrder');
        return f;
    },


    updateDataObj(dataObj, origDataObj, valObj){
        var self = this;
        if(valObj.val){
            // check if change to form val
            if (dataObj[valObj.valPropname] != valObj.val){
                dataObj[valObj.valPropname] = valObj.val;

                //check if change from original val: if original val is null or original val is different
                if (!(origDataObj) || origDataObj[valObj.valPropname] != valObj.val){
                    dataObj.updateDB = true;
                }
                else{
                    dataObj.updateDB = false;
                }

                // only null text prop if already set (no need for text if val)
                if (dataObj.hasOwnProperty(valObj.textPropname)){
                    dataObj[valObj.textPropname] = null;
                }
            }
        }
        // if only text was sent
        else if(valObj.text){
            if(!(dataObj.hasOwnProperty(valObj.textPropname))){
                Vue.set(dataObj, valObj.textPropname, valObj.text);
                dataObj[valObj.valPropname] = null;
                dataObj.updateDB = true;
            }
            else if (dataObj.hasOwnProperty(valObj.textPropname) && dataObj[valObj.textPropname] != valObj.text){
                dataObj[valObj.textPropname] = valObj.text;
                dataObj[valObj.valPropname] = null;
                dataObj.updateDB = true;
            }
        }
        // if input cleared
        else{
            console.log('null field');
            dataObj[valObj.valPropname] = null;

            if(dataObj.hasOwnProperty(valObj.textPropname)){
                dataObj[valObj.textPropname] = null;
            }
            if(!(origDataObj) || !(origDataObj[valObj.valPropname])){
                dataObj.updateDB = false;
            }
            else{
                dataObj.updateDB = true;
            }
        }
    },
    updateFormData(payload){
        var dataObj = this.state.form.formData;
        var origDataObj = this.state.database.formData;
    },
    updateSectionData(sectionID, payload){

    },
    updateField(fieldID, payload){

    }
}