const storeX = new Vuex.Store({
  state: {
    debug: {
      getters: false,
      mutations: true,
      actions: true,
      load: false
    },
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


  getters: {
    minFormSectionID: function(state, getters){
      return state.form.sections.reduce(function(min, section){
          return section.FormSectionID < min ? section.FormSectionID : min;
      }, 0);
    },
    newFormSectionID: function(state, getters){
        return getters.minFormSectionID - 1;
    },
    maxFormSectionOrder: function(state, getters){
        return state.form.sections.reduce(function(max, section){
            return section.SectionOrder > max ? section.SectionOrder : max;
        }, 0);
    },
    newFormSectionOrder: function(state, getters){
        return getters.maxFormSectionOrder + 1;
    },
    minFormFieldID: function(state, getters){
        return state.form.fields.reduce(function(min, field){
            return field.FormFieldID < min ? field.FormFieldID : min;
        }, 0);
    },
    newFormFieldID: function(state, getters){
      return getters.minFormFieldID - 1;
    },

    formSection: function(state, getters){return function(formSectionID){
        var section = state.form.sections.find(function(sec){
            return sec.FormSectionID == formSectionID;
        });
        if(section){
            return section;
        }
        else{
            if (state.debug.getters) console.log('getters: section(' + formSectionID + '): no section found');
            return null;
        }
    }},
    formSubSection_bySecID: function(state, getters){return function(sectionID){
        return state.form.subSections.filter(function(ssec){
            return ssec.SectionID == sectionID;
        });
    }},

  },


  mutations: {
    updateFormSection: function(state, payload) {
      var sec = state.form.sections.find(function(section){
        return section.FormSectionID == payload.FormSectionID;
      });
      sec[payload.propname] = payload.val;
    },
    addSection: function(state, payload) {
      state.form.sections.push(payload.section);
    },


    loadAllForms: function(state, payload) {
        if (state.debug.load) console.log('loadAllForms triggered')
        this.state.forms = clone(payload.newValue);
    },
    loadAllDepartments: function(state, payload) {
        if (state.debug.load) console.log('loadAllDepartments triggered')
        this.state.departments = clone(payload.newValue);
    },
    loadAllSections: function(state, payload) {
        if (state.debug.load) console.log('loadAllSections triggered')
        this.state.sections = clone(payload.newValue);
    },
    loadAllSubSections: function(state, payload) {
        if (state.debug.load) console.log('loadAllSubSections triggered')
        this.state.subSections = clone(payload.newValue);
    },
    loadAllFieldTypes: function(state, payload) {
        if (state.debug.load) console.log('loadAllFieldTypes triggered')
        this.state.fieldTypes = clone(payload.newValue);
    },

    loadDefaultFormData: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultFormData triggered')
        this.state.default.formData = clone(payload.newValue);
    },
    loadDefaultSection: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultSection triggered')
        this.state.default.section = clone(payload.newValue);
    },
    loadDefaultFirstSection: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultFirstSection triggered')
        this.state.default.firstSection = clone(payload.newValue);
    },
    loadDefaultLastSection: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultLastSection triggered')
        this.state.default.lastSection = clone(payload.newValue);
    },
    loadDefaultSubSection: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultSubSection triggered')
        this.state.default.subSection = clone(payload.newValue);
    },
    loadDefaultField: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultField triggered')
        this.state.default.field = clone(payload.newValue);
    },
    loadDefaultVSOption: function(state, payload) {
        if (state.debug.load) console.log('loadDefaultVSOption triggered')
        this.state.default.vsOption = clone(payload.newValue);
    },
    /*loadAllValidationSets: function(state, payload) {
        if (state.debug.load) console.log('loadAllValidationSets triggered')
        this.state.validationSets = clone(payload.newValue);
    },*/

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
  },


  actions: {
    /*addDefaultSection: function(context, payload) {
      var adding;
      adding = clone(state.default.section);
      adding.FormSectionID = getNewFormSectionID();
      adding.SectionOrder = getNewFormSectionOrder();
      self.state.form.sections.push(adding);
      state.count += payload.amount
    }*/
  }
})