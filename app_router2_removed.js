
        /* COMPONENT EVENTS */
        // only update data from the main app

        /*updateFormData: function(payload){
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
        },*/
        
        /* ADDING TO FORM */

        /*setEditField: function(payload){
            this.fieldEditing = payload.fieldID;
        },

        /* CODE INCOMPLETE */
        addNewSection: function(payload){
            var self = this;
            var adding;
            if(this.debug) console.log("add new section");
            //store.addNewSection();

            this.newFormSectionID--;
            adding = clone(this.formDefaults.FormSection);
            adding.FormSectionID = self.newFormSectionID;
            adding.SectionOrder.dbVal = self.sectionCount;
            adding.SectionOrder.dbVal++;
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