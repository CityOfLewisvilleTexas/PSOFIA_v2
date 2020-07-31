var store = {
    routeDebug: false,
    debug: false,
    warnDebug: true,
    errDebug: true,
    state: {
        isLoading: false,
        lastLoad: null,
        lastChange: null,
        connections:{
            isOnLine: true,
            unsentReq: false,
            checkServer: true,
            serverDown: false,
            sqlDown: false,
            unsentChecktime: null,
            serverChecktime: null,
        },
        nightView: false,

        user:{
                _isLoading:  {local_storage:false, adAccount:false},
                _lastLoad:  {local_storage:null, adAccount:null},
            adChecked: false,
            token: null, email: null, username: null, firstName: null, lastName: null, inITS: false, hideDev: false,
        },

        columns: {
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false, formsList:false, recordsList:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null, formsList:null, recordsList:null},
            formData: [], formRecord: [],
                formSections: [], formSubSections: [], formFields: [], formValSets: [], formVsOptions: [],
                //formVsEntries: [], formVseCategories: [],
            allForms: [], allDepartments: [], allSections: [], allSubSections: [], allFieldTypes: [], allValSets: [],
            formsList: [], recordsList: [],
        },
        tableIDs:{
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null},
            formData: null, formRecord: null,
                formSections: null, formSubSections: null, formFields: null, formValSets: null, formVsOptions: null,
            allForms: null, allDepartments: null, allSections: null, allSubSections: null, allFieldTypes: null, allValSets: null,
        },
        orderIDs:{
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null},
            formData: null, formRecord: null,
                formSections: null, formSubSections: null, formFields: null, formValSets: null, formVsOptions: null,
            allForms: null, allDepartments: null, allSections: null, allSubSections: null, allFieldTypes: null, allValSets: null,
        },

        datatables:{
            isLoading: false,
                _isLoading:  {formsList:false, recordsList:false},
            lastLoad: null,
                _lastLoad:  {formsList:null, recordsList:null},
            formsList: [],          //RESULT SET: Forms (used in List - Forms)
            recordsList: [],        //RESULT SET: Records (used in List - Records)
            //recordsList_formID: null,   //ugh
            recordsList_formData: null,
            recordsList_fields: [],        //RESULT SET: FormFields (used in List - Records)
            recordsList_vsOptions: [],        //RESULT SET: FormVSOptions (used in List - Records)
            valSetsList: [],        //RESULT SET: ValSets (used in List - Val Sets)
            vsOptionsList: [],        //RESULT SET: ValSetOptions (used in List - Val Sets)
            settings: {
                formsList:{
                    tableSettings:{
                        showInactive: false, showDetails: false, showIDCol: false, actionsPosition: 'right', showColFilters: false, perPage: null,
                        searchStr: '', sortBy: [], sortDesc: [],
                    },
                    wsProps:{ deptID: null, keepInactive: false, onlyInactive: false, },
                    currentWSProps:{ deptID: null, keepInactive: false, onlyInactive: false, },
                },
                recordsList:{
                    tableSettings:{
                        showInactive: false, showDetails: false, showIDCol: false, actionsPosition: 'left', showColFilters: false, perPage: null,
                        formID: null, searchStr: '', sortBy: [], sortDesc: [],  //paramSpecific - alt: { default: {searchStr: '', sortBy: [], sortDesc: [],}, },        //[formID]: {searchStr: '', sortBy: [], sortDesc: [],},
                    },
                    wsProps:{ formID: null, count: 50, historicalSearch: null, historicalSearchStart: null, historicalSearchEnd: null, historicalSearchColumn: null, keepInactive: false, onlyInactive: false, },
                    currentWSProps:{ formID: null, count: 50, historicalSearch: null, historicalSearchStart: null, historicalSearchEnd: null, historicalSearchColumn: null, keepInactive: false, onlyInactive: false, },
                },
                valSetsList:{
                    tableSettings:{
                        showInactive: false, showDetails: false, showIDCol: false, actionsPosition: 'right', showColFilters: false, perPage: null,
                        searchStr: '', sortBy: [], sortDesc: [],
                    },
                    wsProps:{ keepInactive: false, onlyInactive: false, },
                    currentWSProps:{ keepInactive: false, onlyInactive: false, },
                },
                vsOptionsList:{
                    tableSettings:{
                        showInactive: false, showDetails: false, showIDCol: false, actionsPosition: 'right', showColFilters: false, perPage: null,
                        valSetID: null, searchStr: '', sortBy: [], sortDesc: [],  //paramSpecific - alt: { default: {searchStr: '', sortBy: [], sortDesc: [],}, },        //[valSetID]: {searchStr: '', sortBy: [], sortDesc: [],},
                    },
                    wsProps:{ valSetID: null, keepInactive: false, onlyInactive: false, },
                    currentWSProps:{ valSetID: null, keepInactive: false, onlyInactive: false, },
                },
            },
        },

        database:{
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null},
            formData: null, formRecord: null,
                formSections: [], formSubSections: [], formFields: [], formValSets: [], formVsOptions: [],
                //formVsEntries: [], formVseCategories: [],      //vsOptions may be just the data from ValidationSetOptions table, or combo of Options, Entries, and Category tables
            allForms: [], allDepartments: [], allSections: [], allSubSections: [], allFieldTypes: [], allValSets: [],
        },
        // same as database
        form:{
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null},
            formData: null, formRecord: null,
                formSections: [], formSubSections: [], formFields: [], formValSets: [], formVsOptions: [],
                //formVsEntries: [], formVseCategories: [],      //vsOptions may be just the data from ValidationSetOptions table, or combo of Options, Entries, and Category tables
            allForms: [], allDepartments: [], allSections: [], allSubSections: [], allFieldTypes: [], allValSets: [],
        },
        // specify first and last section, same as database otherwise
        default:{
            isLoading: false,
                _isLoading:  {formData:false, formRecord:false, formSections:false, formSubSections:false, formFields:false, formValSets:false, formVsOptions:false, allForms:false, allDepartments:false, allSections:false, allSubSections:false, allFieldTypes:false, allValSets:false},
            lastLoad: null,
                _lastLoad:  {formData:null, formRecord:null, formSections:null, formSubSections:null, formFields:null, formValSets:null, formVsOptions:null, allForms:null, allDepartments:null, allSections:null, allSubSections:null, allFieldTypes:null, allValSets:null},
            formData: null, formRecord: null,
                formSections: null, firstSection: null, lastSection: null, formSubSections: null, formFields: null, formValSets: null, formVsOptions: null,
            allForms: null, allDepartments: null, allSections: null, allSubSections: null, allFieldTypes: null, allValSets: null,
        },
        // builder only, formFields, (department, validationSets?)
        dialog:{
            isLoading: false,
                _isLoading:  {formFields:false, allDepartments:false, allFieldTypes:false, allValSets: false},
            lastLoad: null,
                _lastLoad:  {formFields:null, allDepartments:null, allFieldTypes:null, allValSets: null},
            formFields: [],  //formValSets: [], formVsOptions: [], //formVsEntries: [], formVseCategories: [],      //vsOptions may be just the data from ValidationSetOptions table, or combo of Options, Entries, and Category tables
            allDepartments: [], allFieldTypes: [], allValSets: [],
        },

        dialogSettings:{
            storeName: null,
            id: null,
            isOpen: false,
            isNew: false,
        },
    },

/* GENERAL NOTES:
    stateName: first level under this.state - database, form, dialog, default
    storeName: corresponds to tables in SQL, second level under this.state - formData, formRecords, formSections, formFields
    vars in functions:
        storeObj: selected storeName object
            can be either an object (formData, formRecord), or an array of objects (formSections, formFields, etc), unless specified (usually called storeObjs);
        dataObj: a specific object in storeObj or the storeObj itself (always for formData, formRecord, if id isn't in payload for storeObj that is an array)
        storeObjs/storeArr: must be a storeObj that is an array (formSection, formFields, etc)
            will be filtered?: automatically filters out inactive, unless payload.isActive is sent, filters out anything based on payload.props if included (payload.id should NOT be included);
*/


// ADD TO LIVE FOLDER
    setUnsentReq(newVal, checktime){
        if(!this.state.connections.unsentChecktime || checktime.isAfter(this.state.connections.unsentChecktime)){
            this.state.connections.unsentChecktime = checktime;
            if(this.state.connections.unsentReq != newVal) this.state.connections.unsentReq = newVal;
        }
    },
    setServerDown(newVal, checktime){
        // don't set if already set by more recent post
        if(!this.state.connections.serverChecktime || checktime.isAfter(this.state.connections.serverChecktime)){
            this.state.connections.serverChecktime = checktime;
            if(this.state.connections.serverDown != newVal) this.state.connections.serverDown = newVal;
        }
    },
    setConnectionsOnCheckReturn(checktime){
        this.setUnsentReq(false, checktime);
        if(this.state.connections.checkServer){
            this.setServerDown(false, checktime);
            this.state.connections.checkServer = false;
        }
    },
    setConnectionsOnCheckFail(postData, checktime){
        // readyState 0: unsent (no internet, netmotion connected)
        if(postData.readyState == 0) this.setUnsentReq(true, checktime);
        else{
            this.setUnsentReq(false, checktime);
            if(this.state.connections.checkServer){
                this.setServerDown(true, checktime);
                this.state.connections.checkServer = false;
            }
        }
    },
    /*setConnectionsOnWSReturn(checktime){
        //if(this.sharedState.connections.unsentReq) this.setUnsentReq(false, checktime);   // only checkConnection sets unsentReq = false
        if(this.sharedState.connections.serverDown) this.setServerDown(false, checktime);
    },*/
    setConnectionsOnWSFail(postData, checktime){
        // readyState 0: unsent (no internet, netmotion connected)
        if(postData.readyState == 0 && !this.state.connections.unsentReq) this.setUnsentReq(true, checktime);
        // flag so next check connection will query server to confirm server is not down
        else if(postData.readyState != 0) this.state.connections.checkServer = true;
    },

    switchNightView(){
        this.state.nightView = !this.nightView;
    },

/* ADD TO LIVE */
    logout(payload){
        this.state.user._isLoading.local_storage = true;
        this.state.user._isLoading.adAccount = true;
        this.clearUserLS(payload);
        this.clearUserAD(payload);
    },
    setUserLS(payload){
        var loadDate = null;
        var token = null, email = null;
        if (payload.hasOwnProperty('token') && payload.token) token = payload.token;
        if(payload.hasOwnProperty('email') && payload.email) email = payload.email;

        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else loadDate = moment();

        if(token && email){
            // compare, don't set is loading again if uneeded
            if(!(this.state.user.token) || this.state.user.token != token || !(this.state.user.email) || this.state.user.email != email){
                this.state.user._isLoading.local_storage = true;
                this.state.user._isLoading.adAccount = true;
                this.state.user.adChecked = false;
                this.state.user._lastLoad.local_storage = loadDate;
                this.state.user.token = token;
                this.state.user.email = email;

                if (this.debug) console.log('USER TOKEN & EMAIL SET: email: ' + email + '; token: ' + token);
                this.state.user._isLoading.local_storage = false;
            }
            // if store already has token & email, update load date
            else this.state.user._lastLoad.local_storage = loadDate;
        }
        else if(this.errDebug) console.error('ERROR: setUser:\t\tpayload - ' + JSON.stringify(payload));
    },
    clearUserLS(payload){
        var loadDate = null;
        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else loadDate = moment();
        this.state.user._lastLoad.local_storage = loadDate;
        this.state.user.token = null;
        this.state.user.email = null;
        this.state.user._isLoading.local_storage = false;
    },
    setUserAD(payload){
        var adData = null, loadDate = null, fName = null, lName = null, accountName = null, inITS = false;
        if(payload.hasOwnProperty('adData') && payload.adData) adData = payload.adData;
        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else loadDate = moment();

        if(adData && Array.isArray(adData) && adData.length == 1){
            if(adData[0].hasOwnProperty('givenName') && adData[0].givenName && adData[0].hasOwnProperty('sn') && adData[0].sn && adData[0].hasOwnProperty('sAMAccountName') && adData[0].sAMAccountName && adData[0].hasOwnProperty('description') && adData[0].description){
                this.state.user._lastLoad.adAccount = loadDate;

                fName = adData[0].givenName;
                lName = adData[0].sn;
                accountName = adData[0].sAMAccountName;

                if(!(this.state.user.username) || this.state.user.username != accountName){
                    this.state.user.username = accountName;
                    if(this.debug) console.log('ACCOUNT NAME SET: ' + accountName);
                }
                if(!(this.state.user.firstName) || this.state.user.firstName != fName){
                    this.state.user.firstName = fName;
                    if(this.debug) console.log('USER FIRST NAME SET: ' + fName);
                }
                if(!(this.state.user.lastName) || this.state.user.lastName != lName){
                    this.state.user.lastName = lName;
                    if(this.debug) console.log('USER LAST NAME SET: ' + lName);
                }
                if(adData[0].description == 'ITS'){
                    if(this.debug) console.log('USER IS DEV');
                    this.setUserIsDev();
                    this.state.user.inITS = true;
                }
                else{
                    this.clearUserIsDev();
                    this.state.user.inITS = false;
                }
                this.state.user.adChecked = true;
                this.state.user._isLoading.adAccount = false;
            }
            else{
                if(this.warnDebug) console.warn('WARNING: setUserADAccount:\t\tAll properties not returned');
                this.clearUserAD({ loadDate: loadDate });
            }
        }
        else{
            if(this.errDebug && adData && Array.isArray(adData) && adData.length > 1) console.error('ERROR: setUserADAccount:\t\tMore than one account returned');
            else if(this.errDebug && adData && Array.isArray(adData)) console.error('ERROR: setUserADAccount:\t\tNO DATA');
            else if(this.errDebug && !adData) console.error('setUserADAccount:\t\tERROR: setUserADAccount - getUserByEmail error');
            this.clearUserAD({ loadDate: loadDate })
        }
    },
    clearUserAD(payload){
        var loadDate = null;
        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else loadDate = moment();
        this.state.user._lastLoad.adAccount = loadDate;
        this.state.user.username = null;
        this.state.user.firstName = null;
        this.state.user.lastName = null;
        this.clearUserIsDev();
        this.state.user.inITS = false;
        if(payload.hasOwnProperty('adChecked')) this.state.user.adChecked = payload.adChecked;
        else this.state.user.adChecked = true;
        this.state.user._isLoading.adAccount = false;
    },
    setUserIsDev(){
        this.state.datatables.settings.formsList.wsProps.keepInactive = true;
        this.state.datatables.settings.recordsList.wsProps.keepInactive = true;
        this.state.datatables.settings.valSetsList.wsProps.keepInactive = true;
    },
    clearUserIsDev(){
        this.state.datatables.settings.formsList.wsProps.keepInactive = false;
        this.state.datatables.settings.recordsList.wsProps.keepInactive = false;
        this.state.datatables.settings.valSetsList.wsProps.keepInactive = false;
    },
    getUserIsLoading(){
        return this.state.user._isLoading.local_storage || this.state.user._isLoading.adAccount;
    },
    getUserIsDev(){
        if(!this.state.user._isLoading.adAccount) return this.state.user.inITS;
    },
    getUsername(){
        if(!this.state.user._isLoading.adAccount) return this.state.user.username;
    },
    getUserEmail(){
        if(!this.state.user._isLoading.local_storage) return this.state.user.email;
    },
    getUserEmailShort(){
        var email;
        if(!this.state.user._isLoading.local_storage && this.state.user.email){
            email = this.state.user.email;
            return email.substring(0, email.indexOf('@'));
        }
    },
    getUserFirstName(){
        if(!this.state.user._isLoading.adAccount) return this.state.user.firstName;
    },
    getUserLastName(){
        if(!this.state.user._isLoading.adAccount) return this.state.user.lastName;
    },


/* ISLOADING + LOAD DATE */

    setLastChange(changetime){
        if(!this.state.lastChange || changetime.isAfter(this.state.lastChange)) this.state.lastChange = changetime;
    },
    setStoreIsLoading(payload){
        var stateName = null, storeName = null
        var isLoading = true, loadDate = null;

        if(payload.hasOwnProperty('isLoading') && !(payload.isLoading)){
            isLoading = false;
            if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        }
        /*else{
            if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
            else {
                loadDate = moment();
                if(this.warnDebug) console.warn("WARNING: setStoreIsLoading:\t\tload date not sent");
            }
            newPayload = Object.assign({}, payload, {loadDate: loadDate});
        }*/

        if(payload.hasOwnProperty('stateName')) stateName = payload.stateName;
        if(payload.hasOwnProperty('storeName')) storeName = payload.storeName;

        // set store itself as loading if neither stateName nor storeName is sent, do before to ensure mistakes don't set store loading
        if(!stateName && !storeName){
            this.state.isLoading = isLoading;
        }
        else if(!storeName){
            if(this.state.hasOwnProperty(stateName)) this.state[stateName].isLoading = isLoading;
            else if(this.errDebug) console.error("ERROR: setStoreIsLoading:\t\tstateName DNE - " + stateName);
        }
        else{
            if(this.state[stateName]._isLoading.hasOwnProperty(storeName)) this.state[stateName]._isLoading[storeName] = isLoading;
            else if(this.errDebug) console.error("ERROR: setStoreIsLoading:\t\t_isLoading not setup for storeName - " + this.payloadToStr(payload));
        }

        if(!isLoading && loadDate) this.setStoreLoadDate(payload)
    },
// WRITTEN POORLY, SHOULD BE CORRECTED/SHORTENED
    setStoreLoadDate(payload){
        var stateName = null, storeName = null, loadDate = null;
        var dataObj;

        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else {
            loadDate = moment();
            if(this.warnDebug) console.warn("WARNING: setStoreLoadDate:\t\tload date not sent");
        }

        if(payload.hasOwnProperty('stateName')) stateName = payload.stateName;
        if(payload.hasOwnProperty('storeName')) storeName = payload.storeName;

        // set store itself as loading if neither stateName nor storeName is sent, do before to ensure mistakes don't set store loading
        if(!stateName || !storeName){
            if(!this.state.loadDate) this.state.lastLoad = loadDate;
            else{
                if(loadDate.isAfter(this.state.lastLoad)) this.state.lastLoad = loadDate;
                //moDiff = this.state.lastLoad.diff(loadDate); if(moDiff < 0) this.state.lastLoad = loadDate;
            }
        }
        else if(!storeName){
            if(this.state.hasOwnProperty(stateName)){
                if(!this.state[stateName].lastLoad) this.state[stateName].lastLoad = loadDate;
                else{
                    if(loadDate.isAfter(this.state.lastLoad)) this.state.lastLoad = loadDate;
                    //moDiff = this.state[stateName].lastLoad.diff(loadDate); if(moDiff < 0) this.state[stateName].lastLoad = loadDate;
                }
            }
            else if(this.errDebug) console.error("ERROR: setStoreLoadDate:\t\tstateName DNE - " + stateName);
        }
        else{
            if(this.state[stateName]._lastLoad.hasOwnProperty(storeName)){
                if(!this.state[stateName]._lastLoad[storeName]) this.state[stateName]._lastLoad[storeName] = loadDate;
                else{
                    if(loadDate.isAfter(this.state[stateName]._lastLoad[storeName])) this.state[stateName]._lastLoad[storeName] = loadDate;
                    //moDiff = this.state[stateName]._lastLoad[storeName].diff(loadDate); if(moDiff < 0) this.state[stateName]._lastLoad[storeName] = loadDate;
                }
            }
            else if(this.errDebug) console.error("ERROR: setStoreLoadDate:\t\t_loadDate not setup for storeName - " + this.payloadToStr(payload));
        }
    },

/* SETTINGS: TABLE SETTINGS, WS PROPS */
    getStoreSettings: function(payload){
        if(payload.hasOwnProperty('storeName')){
            if(this.state.datatables.settings.hasOwnProperty(payload.storeName)){
                return this.state.datatables.settings[payload.storeName];
            } else if (this.errDebug) console.error("ERROR: getSettings:\t\tpayload - no settings for storename - " + payload.storeName);
        } else if (this.errDebug) console.error("ERROR: getSettings:\t\tpayload - no storename");
    },
    getTableSettings: function(payload){
        var tableSettings = null;
        var storeSettings = this.getStoreSettings(payload);
        if(storeSettings) tableSettings = storeSettings.tableSettings;
        return tableSettings;
    },
    setTableSettings: function(payload){
        var returnVal = false;
        var tableSettings = this.getTableSettings(payload);
        if(tableSettings){
            returnVal = true;

            if(payload.hasOwnProperty('showInactive')) tableSettings.showInactive = payload.showInactive;
            if(payload.hasOwnProperty('showDetails')) tableSettings.showDetails = payload.showDetails;
            if(payload.hasOwnProperty('showIDCol')) tableSettings.showIDCol = payload.showIDCol;
            if(payload.hasOwnProperty('showColFilters')) tableSettings.showColFilters = payload.showColFilters;
            if(payload.hasOwnProperty('perPage')) tableSettings.perPage = payload.perPage;

            // param specific
            if(payload.hasOwnProperty('searchStr') || payload.hasOwnProperty('sortBy') || payload.hasOwnProperty('sortDesc')){
                if(payload.hasOwnProperty('formID')){
                    if(tableSettings.hasOwnProperty('formID')){
                        tableSettings.formID = payload.formID;
                        if(payload.hasOwnProperty('searchStr')) tableSettings.searchStr = payload.searchStr;
                        if(payload.hasOwnProperty('sortBy')) tableSettings.sortBy = payload.sortBy;
                        if(payload.hasOwnProperty('sortDesc')) tableSettings.sortDesc = payload.sortDesc;
                    }
                    else if(this.errDebug) console.error("ERROR: setTableSettings:\t\tpayload has formID by no formID on store settings:" + this.payloadToStr(payload));
                }
            }

            if(payload.hasOwnProperty('deptID')){
                if(tableSettings.hasOwnProperty('deptID')) tableSettings.deptID = payload.deptID;
                else if(this.errDebug) console.error("ERROR: setTableSettings:\t\tpayload has deptID by no deptID on store settings:" + this.payloadToStr(payload));
            }
            
            if(payload.hasOwnProperty('wsProps') && payload.wsProps) this.setWSProps(payload);
        };
        return returnVal;
    },
    getWSProps: function(payload){
        var wsProps = null;
        var storeSettings = this.getStoreSettings(payload);
        if(storeSettings) wsProps = storeSettings.wsProps;
        return wsProps;
    },
    getCurrentWSProps: function(payload){
        var currentWSProps = null;
        var storeSettings = this.getStoreSettings(payload);
        if(storeSettings) currentWSProps = storeSettings.currentWSProps;
        return currentWSProps;
    },
    setWSProps: function(payload){
        var returnVal = false;
        var wsProps = this.getWSProps(payload);
        if(this.debug) console.log('setWSProps - ' + JSON.stringify(payload))
        if(wsProps){
            returnVal = true;
            if (payload.hasOwnProperty('count')) wsProps.count = payload.count;
            if (payload.hasOwnProperty('date')) wsProps.historicalSearch = payload.date;
            if (payload.hasOwnProperty('start')) wsProps.historicalSearchStart = payload.start;
            if (payload.hasOwnProperty('end')) wsProps.historicalSearchEnd = payload.end;
            if (payload.hasOwnProperty('column')) wsProps.historicalSearchColumn = payload.column;
            if (payload.hasOwnProperty('keepInactive')) wsProps.keepInactive = payload.keepInactive;
            if (payload.hasOwnProperty('onlyInactive')) wsProps.onlyInactive = payload.onlyInactive;
            if(payload.hasOwnProperty('formID')){
                if(wsProps.hasOwnProperty('formID')) wsProps.formID = payload.formID;
                else if(this.errDebug) console.error("ERROR: setWSProps:\t\tpayload has formID by no formID on store wsProps:" + this.payloadToStr(payload));
            }
            if(this.debug) console.log(wsProps);
        }
        return returnVal;
    },
    copyWSPropsToCurrent: function(payload){
        var returnVal = false;
        var wsProps = this.getWSProps(payload);
        var currentWSProps = this.getCurrentWSProps(payload);
        if(wsProps && currentWSProps){
            returnVal = true;
            currentWSProps = Object.assign(currentWSProps, wsProps);
        }
        if(this.debug) console.log(currentWSProps);
        return returnVal;
    },
    getWSPropsEqual(payload){
        var returnVal = true;
        var wsProps = this.getWSProps(payload);
        var currentWSProps = this.getCurrentWSProps(payload);
        var keys1, keys2;
        if(wsProps && currentWSProps){
            keys1 = Object.keys(wsProps);
            keys2 = Object.keys(currentWSProps);
            if(keys1.length !== keys2.length) returnVal = false;
            keys1.forEach(function(key, index){
                if(wsProps[key] !== currentWSProps[key]) returnVal = false;
            })
            return true;
        } else if(this.state.errDebug) console.error("ERROR: wsPropsHasChange:\t\tpayload - " + JSON.stringify(payload));
    },
/* WEBSERVICE RETURN */
    newWebserviceRequest(payload){
        var areEqual = this.getWSPropsEqual(payload);
        if(this.state.debug) console.log("wsProps = currentWSProps ? " + areEqual)
        return !(areEqual);
    },
    canShowData(payload){
        var returnVal = true;
        var wsProps = this.getWSProps(payload);
        var currentWSProps = this.getCurrentWSProps(payload);
        if(wsProps && currentWSProps){
            if(payload.storeName == 'formsList'){
                if(wsProps.deptID != currentWSProps.deptID) returnVal = false
            }
            else if(payload.storeName == 'recordsList'){
                if(wsProps.formID != currentWSProps.formID) returnVal = false
            }
        }
        return returnVal;
    },

/* STORE/DATA OBJ(S) - GETS */

    /* DATA OBJECT : db table (for that form), or specifically one row of table
         Names: storeName/dataObj/objName, resultset, storeName */

    // returns either storeObj or dataObj (specific object in storeObj - provide id)
    //      includes both when dataObj = storeObj (formData, formRecord), or when id not specified, so returns the storeObj array
    // HANDLES valobjs
    getDataObj(payload){ // payload = {storeName (req), id, stateName}
        var dataObj = null;
        var stateName = 'form';
        var tableID;

        if (payload.hasOwnProperty('stateName') && payload.stateName) stateName = payload.stateName;
// comment out eventually
        else if (payload.hasOwnProperty('isOrig') && payload.isOrig) stateName = 'database';

        if (payload.hasOwnProperty('storeName')){

            // confirm storeName exists
            if(this.state[stateName].hasOwnProperty(payload.storeName)){
                // if id was included sent
                if( payload.hasOwnProperty('id') && payload.id ){
                    tableID = this.getStoreTableID(payload);
                    if(tableID){
                        dataObj = this.state[stateName][payload.storeName].find(function(o){
                            // if item is object, compare to val property [updated version, for more detail per field (properites)]
                            if(typeof(o[tableID]) === 'object') return o[tableID].val == payload.id;
                            else return o[tableID] == payload.id;
                        });
                    }
                }
                else{   //formData, record, formFields (in Builder Fields Table)
                    dataObj = this.state[stateName][payload.storeName];
                }
            }
            else if (this.errDebug) console.error("ERROR: getDataObj:\t\tobject does not exist - " + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error("ERROR: getDataObj:\t\tpayload - storename - " + this.payloadToStr(payload));

        return dataObj;
    },
    /* returns objects in resultset  according to filters - ex. getArrDataObjs('formsList') */
    // HANDLES valobjs;
    getArrDataObjs(payload){    // payload =  {storeName (req), stateName, props: {propname: val, ...}, orderBy: [], keepInactive}
    //getStoreObjs(payload){    // payload =  {storeName (req), stateName, props: {propname: val, ...}, orderBy: [], keepInactive}
        var storeObjs, filteredStoreObjs = [], filterProps;

        if(payload.hasOwnProperty('props') && payload.props) filterProps = Object.keys(payload.props);
        if(payload.hasOwnProperty('id') && payload.id && this.warnDebug) console.warn('WARNING: getArrDataObjs:\t\tid sent in payload - ' + this.payloadToStr(paylod))

        storeObjs = this.getDataObj(payload);
        if(storeObjs && Array.isArray(storeObjs)){
            if(storeObjs.length > 0){
                // get array & filter
                filteredStoreObjs = storeObjs.filter(function(obj){
                    var keepObj = true;

                    // exclude if inctive by default, unless keepInactive is in payload
                    if(!(payload.hasOwnProperty('keepInactive') && payload.keepInactive)){
                        if(obj.hasOwnProperty('Active')){
                            if(typeof(obj.Active) === "object" && !(obj.Active.val)) keepObj = false;
                            else if(typeof(obj.Active) !== "object" && !(obj.Active)) keepObj = false;
                        }
                        else if(obj.hasOwnProperty('isActive')){
                            if(typeof(obj.isActive) === "object" && !(obj.isActive.val)) keepObj = false;
                            else if(typeof(obj.isActive) !== "object" && !(obj.isActive)) keepObj = false;
                        }
                    }
                    if(keepObj && filterProps){
                        // go through props until a property in object does not match
                        var excl = filterProps.some(function(prop){
                            if(obj.hasOwnProperty(prop)){
                                if(typeof(obj[prop]) === "object" && obj[prop].val != payload.props[prop]) return true;
                                else if(typeof(obj[prop]) !== "object" && obj[prop] != payload.props[prop]) return true;
                            }
                            else if (this.errDebug) console.error('ERROR: getArrDataObjs:\t\tarray obj missing prop - ' + prop);
                            return false;
                        });
                        if(excl) keepObj = false;
                    }
                    return keepObj;
                });
            }
            else if (this.warnDebug) console.warn('WARNING: getArrDataObjs:\t\tobject array has no values - ' + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error('ERROR: getArrDataObjs:\t\tobject is not an arrary - ' + this.payloadToStr(payload));

        return filteredStoreObjs;
    },
    /* returns editing/original resultset property or object property in resultset specified - ex. getObjProp('formSections', FormSectionID, 1, SectionTitle, false) */
    // ; used in updateObjProp()
    getObjProp(payload){   // payload =  {storeName (req), id, propname (req), isOrig}
        var objProp;
        var dataObj;

        if(payload.hasOwnProperty('storeName') && (payload.hasOwnProperty('propname')) ){
            dataObj = this.getDataObj(payload);

            if (dataObj && dataObj.hasOwnProperty(payload.propname)){
                objProp =  dataObj[payload.propname];    
            }
            else if (dataObj && !(dataObj.hasOwnProperty(payload.propname)) && this.errDebug) {
                if (this.errDebug) console.error('ERROR: getObjProp:\t\tproperty does not exist - ' + this.payloadToStr(payload));
                if (this.errDebug) console.log(dataObj);
            }
        }
        else if (this.errDebug) console.error('ERROR: getObjProp:\t\tpayload - ' + this.payloadToStr(payload));

        return objProp;
    },


        // returns propname for the id of the table specified by storeName
    // works for any storeName in state.tableIDs
    getStoreTableID(payload){ // payload = {storeName (req)};
        var tableID;

        if (payload.hasOwnProperty('storeName') && payload.storeName){
            if(this.state.tableIDs.hasOwnProperty(payload.storeName) && this.state.tableIDs[payload.storeName]){
                tableID = this.state.tableIDs[payload.storeName]
                // DON'T USE RECORDNUMBER
                if(payload.storeName == 'recordsList') tableID = 'ID';
            }
            else if (this.errDebug) console.error("ERROR: getStoreTableID:\t\ttableID not found for store - " + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error("ERROR: getStoreTableID:\t\tpayload - storename - " + this.payloadToStr(payload));

        return tableID;
    },
    getMinTableID(payload){ // payload = {storeName (req)};
        var storeObj;
        var tableID, minID;

        tableID = this.getStoreTableID(payload);
        storeObj = this.getDataObj(payload)
        if(tableID){
            if(!storeObj || (Array.isArray(storeObj) && storeObj.length == 0)){
                minID = 0;
            }
            else if (Array.isArray(storeObj)){ 
                minID = storeObj.reduce(function(min, dataObj){
                    return dataObj[tableID] < min ? dataObj[tableID] : min;
                }, 0);
            }
            else if (this.errDebug) console.error("ERROR: getMinTableID:\t\t???");
        }
        return minID;
    },
    // returns propname for the order field of the table specified by storeName
    // storeName should be arrayworks for any storeName in state.orderIDs
    getStoreOrderID(payload){ // payload = {storeName (req)};
        var orderID;

        if (payload.hasOwnProperty('storeName') && payload.storeName){
            if(this.state.orderIDs.hasOwnProperty(payload.storeName) && this.state.orderIDs[payload.storeName]){
                orderID = this.state.orderIDs[payload.storeName]
            }
            else if (this.warnDebug) console.warn("WARNING: getStoreOrderID:\t\torderID not found for store - " + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error("ERROR: getStoreOrderID:\t\tpayload - storename - " + this.payloadToStr(payload));

        return orderID;
    },
    // storeObjs must be array, will be filtered if props are in payload
    getMaxOrder(payload){ // payload = {storeName (req)};
        var orderID, maxOrder = 0, storeObjs;

        orderID = this.getStoreOrderID(payload);
        storeObjs = this.getArrDataObjs(payload);
        if(orderID && storeObjs){
            if(storeObjs.length > 0){
                maxOrder = storeObjs.reduce(function(max, dataObj){
                    return dataObj[orderID].dbVal > max ? dataObj[orderID].dbVal : max;
                }, 0);
            }
        }
        return maxOrder;
    },
    // storeObjs will be filtered if props are in payload
    getMinOrder(payload){ // payload = {storeName (req)};
        var orderID, minOrder = 0, storeObjs;

        orderID = this.getStoreOrderID(payload);
        storeObjs = this.getArrDataObjs(payload);
        if(orderID && storeObjs){
            if(storeObjs.length > 0){
                minOrder = storeObjs.reduce(function(min, dataObj){
                    return dataObj[orderID].dbVal < min ? dataObj[orderID].dbVal : min;
                }, 0);
            }
        }
        return minOrder;
    },



/* STORE/DATA OBJ(S) - SET/UPDATE */

    /* sets object property/properties, returns display value (should be editing only) - ex. ? */
    // REQUIRES valobjs; used in updateFormDataProp, ?
    // CANNOT update TableID or OrderID fields
    updateObjProp(payload){ // payload = {storeName (req), id, propname (req), valObj (req), isOrig} [valObj MUST include displayVal update]
        var returnVal;
        var compStateName = 'database'
        var compPayload;
        var updateObj, compObj;
        var compareResult;

        // copies payload, but requests original object (database)
        if(payload.hasOwnProperty('stateName') && payload.stateName == 'dialog') compStateName = 'form';

        if(payload.hasOwnProperty('storeName') && payload.hasOwnProperty('propname') && payload.hasOwnProperty('valObj') && payload.valObj.hasOwnProperty('displayVal')){
            updateObj = this.getObjProp(payload);

            if(updateObj){
                compPayload = Object.assign({}, payload, {stateName: compStateName});
                compObj = this.getObjProp(compPayload);

                if(compObj){
                    // updates the object properties sent through payload (1-all)
                    Object.assign(updateObj, payload.valObj);

                    compareResult = this.compareColValObjs(updateObj, compObj, false);
                    //if (this.debug) console.log(compareResult);
                    if (compareResult != 0){
                        updateObj.updateDB = true;
                    }
                    else if(compareResult == 0){
                        updateObj.updateDB = false;
                    }

                    returnVal = updateObj.displayVal;

                }
                else{
                    Object.assign(updateObj, payload.valObj);
                    updateObj.updateDB = true;
                    returnVal = updateObj.displayVal;
                }
            } else if (this.errDebug) console.error('ERROR: updateObjProp: No Form Object - ' + this.payloadToStr(payload));
        } else if (this.errDebug) console.error('ERROR: updateObjProp: PAYLOAD - ' + this.payloadToStr(payload));

        /*if(err){
            if (this.errDebug) console.log('ERROR: updateObjProp: PAYLOAD - ' + this.payloadToStr(payload));
            NEED TO DO SOMETHING HERE 
        }*/

        return returnVal;
    },
    /* sets field that has already been converted to a valObj (object property), returns display value (should be editing only) - ex. ? */
    updateFieldInternal(payload){ // payload = {field (req), newValue (req)}
        var self = this;
        var editField, newVal;
        var val = null, displayVal = '', valObj = null;

        if(payload.hasOwnProperty('field') && payload.field && payload.hasOwnProperty('newValue')){
            newVal = payload.newValue;
            if(newVal == "") newVal = null;
            
            editField = payload.field;
            //else if(payload.hasOwnProperty('storeName') && payload.hasOwnProperty('propname')) editField = clone(self.state.form[payload.storeName][payload.propname]);

            editField.dbVal = newVal;

            if(newVal != null){
                if(editField.valType == 'number'){
                    val = newVal;
                    displayVal = newVal.toString();
                }
                else if(editField.valType == 'text' || editField.valType == 'textarea'){
                    displayVal = newVal;
                    val = newVal.toString().toUpperCase();
                }
                else if(editField.valType == 'boolean'){
                    if (currVal == true || currVal == 1){
                        val = true;
                    }
                    else{
                        val = false;
                    }
                    displayVal = val ? 'true' : 'false';
                }
                else if (editField.valType == 'combobox'){
                    var subset, valObj;
                    var joinSet = editField.JoinSet;
                    if(joinSet){
                        if(this.state.form[joinSet].length > 0 || this.state.database[joinSet].length > 0){
                            if(self.state.form[joinSet].length > 0) subset = 'form';
                            else subset = 'database';

                            if(this.state[subset][joinSet].length > 0 && this.state[subset][joinSet][0].hasOwnProperty(editField.ValProp)){
                                valObj = self.state[subset][joinSet].find(function(s){
                                    if(typeof(s[editField.ValProp]) === "object") return s[editField.ValProp].val == newVal;
                                    else return s[editField.ValProp] == newVal;
                                });
                                if(valObj){
                                    if(typeof(valObj[editField.ValProp]) === "object") val = valObj[editField.ValProp].val;
                                    else val = valObj[editField.ValProp];

                                    if(typeof(valObj[editField.TextProp]) === "object") displayVal = valObj[editField.TextPron].displayVal;
                                    else displayVal = valObj[editField.TextProp];
                                }
                                else{
                                    if(this.errDebug) console.error('ERROR: getValObj - NOT FOUND IN STATE.' + subset + '.' + joinSet + ' - ' + newVal);
                                }
                            }
                        }
                        else if(newVal !== null){
                            if(this.errDebug) console.error('ERROR: getValObj - ' + joinSet + ' NOT LOADED')
                            val = newVal;
                            displayVal = newVal.toString();
                        }
                    }
                    else {
                        if(self.errDebug) console.error('ERROR: getValObj - NO JOINSET SPECIFIED')
                        val = currVal;
                        displayVal = currVal.toString();
                    }
                }
                else{
                    if (this.errDebug) console.error('ERROR: updateFieldInternal: TYPE NOT HANDLED - ' + this.payloadToStr(payload));
                    /* NEED TO DO SOMETHING HERE */
                }
            }
            editField.val = val;
            editField.displayVal = displayVal

            //this.updateObjectProp({storeName: payload.storeName, propname: payload.propname, valObj: newValObj});
        }
        else{
            if (this.errDebug) console.error('ERROR: updateFieldInternal: PAYLOAD - ' + this.payloadToStr(payload));
        }
    },
    updateOrderID: function(payload){
        var self = this;
        var stateName = 'form';
        var arrPayload;
        var dataObj = null, arrDataObjs = [];
        var orderID;

        if(payload.hasOwnProperty('stateName') && payload.stateName) stateName = payload.stateName;

        if (payload.hasOwnProperty('storeName') && payload.hasOwnProperty('order')){
            dataObj = this.getDataObj(payload);

            arrPayload = Object.assign({}, payload, {id: null});
            arrDataObjs = this.getArrDataObjs(arrPayload);
            if(arrDataObjs){

                this.state[stateName]._isLoading[payload.storeName] = true;

                orderID = this.getStoreOrderID(payload);

                var foundOrderGreater = false;
                // check if already exists with that order
                var i = dataObj.forEach(function(s){
                    if (s[orderID].dbVal >= payload.order){
                        s[orderID].dbVal++;
                    }
                });

                newObj[orderID].dbVal = payload.order;
            }
        }
    },



/* STORE/DATA OBJ(S) - ADD */

    /* adds object  - ex. ? */
    addDataObj(payload){ // payload = {storeName (req), order, props:{propname: val}};        subsection props: {FormSectionID: }, field props: {FormSectionID: , FormSubSectionID: }
        var self = this;
        var stateName = 'form';
        var loadPayload, orderPayload_All;
        var storeObj = null, newObj = null;
        var tableID, minID, orderID, maxOrder, maxOrder_All;
        var newOrder, checkOrder = false;

        if(payload.hasOwnProperty('loadDate') && payload.loadDate) loadDate = payload.loadDate;
        else loadDate = moment();

        if(payload.hasOwnProperty('stateName') && payload.stateName) stateName = payload.stateName;

        if(payload.hasOwnProperty('order') && payload.order){
            newOrder = payload.order;
        }

        // check required props
        if (payload.hasOwnProperty('storeName')){
            storeObj = this.getDataObj(payload);
            if(storeObj || payload.storeName == 'formData' || payload.storeName == 'formRecord'){
                loadPayload = Object.assign({}, payload, {isLoading: true, loadDate: loadDate});
                this.setStoreIsLoading(loadPayload);

                tableID = this.getStoreTableID(payload);
                minID = this.getMinTableID(payload);

                if(storeObj && Array.isArray(storeObj)){
                    orderID = this.getStoreOrderID(payload);
                    if(minID > 0){
                        maxOrder = this.getMaxOrder(payload);
                        orderPayload_All = Object.assign({}, payload, {props: null});
                        //minOrder_All = this.getMinOrder(orderPayload_All);
                        maxOrder_All = this.getMaxOrder(orderPayload_All);
                    }
                    else{
                        maxOrder = 0;
                        max_Order_All = 0;
                    }
                }

                if(payload.hasOwnProperty('newObj') && payload.newObj){
                    newObj = clone(payload.newObj);
                }
                // clone firstSection if new form (no IDs, so minID will return as 0)
                else if(payload.storeName == 'formSections' && minID == 0){
                    if(this.state.default.hasOwnProperty('firstSection') && this.state.default.firstSection){
                        newObj = clone(this.state.default.firstSection);
                    }
                }
                else if(payload.storeName == 'formSections' && (!newOrder || newOrder > maxOrderAll)){
                    if(this.state.default.hasOwnProperty('lastSection') && this.state.default.lastSection){
                        newObj = clone(this.state.default.lastSection);
                    }
                }
                // confirm storeName has default
                else if(this.state.default.hasOwnProperty(payload.storeName) && this.state.default[payload.storeName]){
                    newObj = clone(this.state.default[payload.storeName]);
                }

                if(newObj){
                    newObj[tableID] = minID - 1;

                    if(payload.hasOwnProperty('props') && payload.props){
                        var propnames = Object.keys(payload.props);

                        propnames.forEach(function(p){
                            if(newObj.hasOwnProperty(p)){
                                console.log(p);
                                self.updateFieldInternal({field: newObj[p], newValue: payload.props[p]})
                            }
                            else if (this.warnDebug) console.warn('WARNING: addDataObj:\t\tproperty DNE - ' + p);
                        })
                    }
                    else console.log('no props')

                    if(payload.storeName == 'formData'){
                        if(!(this.state.form.formData)){
                            this.state.form.formData = newObj;
                            if (this.debug) console.log('addDataObj:\t\tAdded default formData');
                        }
                        else if (this.warnDebug) console.warn('WARNING: addDataObj:\t\tForm Data already exists');

                    }
                    else if (payload.storeName == 'formRecord'){
                        if(!(this.state.form.formRecord) || this.state.form.formRecord.length == 0){
                                this.state.form.formRecord = newObj;
                                if (this.debug) console.log('addDataObj:\t\tAdded default Form Record');
                        }
                        else if (this.warnDebug) console.warn('WARNING: addDataObj:\t\tForm Record already exists');
                    }
                    // adding to array
                    else{
                        // if order was included in props
                        if(newOrder) newObj[orderID].dbVal = payload.order;
                        else if(!(newObj[orderID].dbVal)) newObj[orderID].dbVal = maxOrder + 1;

                        if(newObj[orderID].dbVal <= maxOrder_All) checkOrder = true;

                        if(payload.storeName != 'dialog' && checkOrder){
                            // check if already exists with that order
                            storeObj.forEach(function(dataObj){
                                if (dataObj[orderID].dbVal >= payload.order){
                                    dataObj[orderID].dbVal++;
                                }
                            });
                        }

                        // default adds to form store, dialog adds to dialog store
                        storeObj.push(newObj);
                    }
                    loadPayload = Object.assign({}, loadPayload, {isLoading: false});
                    this.setStoreIsLoading(loadPayload);
                }
                else{
                    if (this.errDebug) console.error("ERROR: addDataObj:\t\tdefault object does not exist - " + this.payloadToStr(payload));
                }
            }
            else if (this.errDebug) console.error("ERROR: addDataObj:\t\tobject does not exist - " + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error("ERROR: addDataObj:\t\tpayload - storename - " + this.payloadToStr(payload));

        return newObj;
    },

    orderArrDataObjs: function(payload){
        var self = this;
        var storeIdPropname, orderIdPropname;

        if(payload.hasOwnProperty('arrDataObjs') && payload.arrDataObjs){
            storeIdPropname = this.getStoreTableID(payload);
            orderIdPropname = this.getStoreOrderID(payload);

            if(orderIdPropname){
                return payload.arrDataObjs.sort(function(a, b){
                    if(a[orderIdPropname].dbVal === null && b[orderIdPropname].dbVal === null){
                        return a[storeIdPropname] - b[storeIdPropname];
                    }
                    else if(a[orderIdPropname].dbVal === null){
                        return 1;
                    }
                    else if(b[orderIdPropname].dbVal === null){
                        return -1;
                    }
                    else return a[orderIdPropname].dbVal - b[orderIdPropname].dbVal;
                });
            }
            else{
                if(this.warnDebug) console.log('no order id set');
                return payload.arrDataObjs;
            }
        }
    },

    setupNewForm: function(){
        var loadDate = moment();
        if(this.debug) console.log("adding default form data");
        this.addDataObj({stateName: 'form', storeName: 'formData', loadDate: loadDate});
                        // If no formSections, automatically push the default Main (first) formSection
        if(this.state.form.formSections.length === 0){
            if(this.debug) console.log("adding default first section");
            this.addDataObj({stateName: 'form', storeName: 'formSections', loadDate: loadDate});
        }
    },

    checkFieldsInactive: function(payload){ // payload =  {storeName (req), stateName, props: {propname: val, ...}, orderBy: [], keepInactive}
        var newPayload;
        var arrDataObj;
        var inactiveIndex = -1;

        newPayload = Object.assign({}, payload, {keepInactive: true});

        arrDataObj = this.getArrDataObjs(payload);
        if(arrDataObj && Array.isArray(arrDataObj)){
            if(arrDataObj.length > 0){
                // get array & filter
                inactiveIndex = arrDataObj.findIndex(function(obj){
                    var returnVal = false;
                    if(obj.hasOwnProperty('Active')){
                        if(typeof(obj.Active) === "object" && !(obj.Active.val)) returnVal =  true;
                        else if(typeof(obj.Active) !== "object" && !(obj.Active)) returnVal = true;
                    }
                    else if(obj.hasOwnProperty('isActive')){
                        if(typeof(obj.isActive) === "object" && !(obj.isActive.val)) returnVal = true;
                        else if(typeof(obj.isActive) !== "object" && !(obj.isActive)) returnVal = true;
                    }
                    return returnVal;
                });
            }
            else if (this.warnDebug) console.warn('WARNING: checkFieldsInactive:\t\tobject array has no values - ' + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error('ERROR: checkFieldsInactive:\t\tobject is not an arrary - ' + this.payloadToStr(payload));

        return (inactiveIndex == -1 ? false : true);
    },

    setDialog(payload){
        if(payload.hasOwnProperty('isOpen')){
            if(payload.isOpen){
                if(payload.hasOwnProperty('storeName') && payload.hasOwnProperty('id')){
                    if(payload.hasOwnProperty('isNew')){
                        if(payload.isNew) this.state.dialogSettings.isNew = true;
                    }
                    else{
                        var formDataObj = this.getDataObj(payload);
                        if (this.state.dialog[payload.storeName].length > 0) console.error('dialog array has value')
                        this.state.dialog[payload.storeName].push(clone(formDataObj));
                    }

                    this.state.dialogSettings.storeName = payload.storeName;
                    this.state.dialogSettings.id = payload.id;
                    this.state.dialogSettings.isOpen = true;
                }
                else if(this.errDebug) console.error('ERROR: setDialog - open - payload');
            }
            else{
                this.state.dialogSettings.isOpen = false;
                this.state.dialogSettings.isNew = false;
                this.state.dialogSettings.id = null;
                this.state.dialogSettings.storeName = null;
                this.state.dialog[payload.storeName] = [];
            }
        }
    },


    /*deleteDataObj(payload){ // payload = {storeName (req), id, propname, valobj?}
        var newObj = null;
        var tableID;

        // check required props
        if (payload.hasOwnProperty('storeName') && payload.storeName){
            // confirm storeName exists
            if(this.state.form.hasOwnProperty(payload.storeName)){
                this.state.form._isLoading[payload.storeName] = true;
                tableID = this.state.tableIDs[payload.storeName]

                // confirm storeName has default
                if(this.state.default.hasOwnProperty(payload.storeName) && this.state.default[payload.storeName]){
                    var buildObj = clone(this.state.default[payload.storeName]);

                    if(payload.storeName == 'formData' || payload.storeName == 'record'){
                        // won't be adding to array
                        console.log('INCOMPLETE - ADD/REPLACE OBJECT - FORMDATA, RECORD')
                    }

                    // adding to array
                    else{
                        // if order was included in props
                        if( payload.hasOwnProperty('order') && payload.order ){
                            // check if already exists with that order, increase all order by 1
                            var i = this.state.form[payload.storeName].findIndex(function(o){
                                // if item is object, compare to val property [updated version, for more detail per field (properites)]
                                if(typeof(o[tableID]) === 'object') return o[tableID].val == payload.id;
                                else return o[tableID] == payload.id;
                            });      
                        }
                        else{
                            // add to end

                        }
                    }
                }
                else{
                    if (this.errDebug) console.error("ERROR: addDataObj:\t\tdefault object does not exist - " + this.payloadToStr(payload));
                }
            }
            else if (this.errDebug) console.error("ERROR: addDataObj:\t\tobject does not exist - " + this.payloadToStr(payload));
        }
        else if (this.errDebug) console.error("ERROR: addDataObj:\t\tpayload - storename - " + this.payloadToStr(payload));


        // if id was included sent
                if( payload.hasOwnProperty('id') && payload.id ){
                    tableID = this.state.tableIDs[payload.storeName]
                    if(tableID){
                        obj = this.state[subState][payload.storeName].find(function(o){
                            // if item is object, compare to val property [updated version, for more detail per field (properites)]
                            if(typeof(o[tableID]) === 'object') return o[tableID].val == payload.id;
                            else return o[tableID] == payload.id;
                        });
                    }
                    else{
                        if (this.errDebug) console.error("ERROR: getDataObj:\t\ttableID not found for store - " + this.payloadToStr(payload));
                    }
                }
    }*/

    /* returns all columns (objects) in a resultset [[state.columns._]] */
    // ; used in getColumns_Headers()
    getColumns(storeName){
        var cols;

        if(this.state.columns.hasOwnProperty(storeName)){
            cols = this.state.columns[storeName];
        }
        else if (this.errDebug) console.error('ERROR: getColumns: STORE DOES NOT EXIST - ' + storeName);

        return cols;
    },
    /* returns all columns that should be shown (ex. on all forms page) in a resultset */
    // HANDLES valobjs; used in Entry & Builder - Home
    getColumns_Headers(storeName, smallScreen){
        var headers;
        var cols = this.getColumns(storeName);

        if(cols){
            headers = cols.filter(function(c){
                var returnVal = false;
                if(c.hasOwnProperty('ShowInHeader')){
                    if(typeof(c.ShowInHeader) === "object") returnVal = c.ShowInHeader.val;
                    else returnVal = c.ShowInHeader;
                }
                else if(c.hasOwnProperty('IsTableHeader')){
                    if(typeof(c.IsTableHeader) === "object") returnVal = c.IsTableHeader.val;
                    else returnVal = c.IsTableHeader;
                }

                /*if(returnVal){
                    if(c.hasOwnProperty('IsTableID')){
                        if(typeof(c.IsTableID) === "object") returnVal = returnVal && !(c.IsTableID.val);
                        else returnVal = returnVal && !(c.IsTableID);
                    }
                }*/

                /*if(returnVal && smallScreen){
                    if(c.hasOwnProperty('IsTableID')){
                        if(typeof(c.IsTableID) === "object") returnVal = returnVal &&  c.IsTableID.val;
                        else returnVal = returnVal &&  c.IsTableID;
                    }
                }*/

                return returnVal;
            });
        }

        return headers;
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




/* MUTATIONS */

    /* SET: Generic - All tables/stores use this */
    setState(newValue, stateName, tableName){
        //if(tableName == 'firstSection' || tableName == 'LastSection') console.log('setState(): ' + stateName + '.' + tableName)
        //if(tableName == 'formData' || tableName == 'formsList') console.log(newValue)
        //var self = this;
        //if(tableName == 'formData' || tableName == 'formsList') console.log(self.state[stateName][tableName])
        //if(tableName == 'formData') console.log('Val FormID: ' + newValue.FormID)
        //if(tableName == 'formData' && this.state.database.formData && this.state.database.formData.hasOwnProperty('FormID')) console.log('Start DB FormID: ' + this.state.database.formData.FormID)
        //if(tableName == 'formData' && this.state.form.formData && this.state.form.formData.hasOwnProperty('FormID')) console.log('Start Form FormID: ' + this.state.form.formData.FormID)
        
        //var cloned = clone(newValue);
        //console.log(cloned);
        //if( self.state[stateName][tableName] && typeof(self.state[stateName][tableName]) === 'object' && !(Array.isArray(self.state[stateName][tableName])) ){
        //    if(tableName == 'formData') console.log('1st');
        //    self.state[stateName][tableName] = Object.assign({}, (self.state[stateName][tableName]), cloned);
        //}
        //else{
        //    if(tableName == 'formData') console.log('2nd');
        //    this.state[stateName][tableName] = cloned;
        //}
        this.state[stateName][tableName] = clone(newValue);

        //if(tableName == 'formData' && this.state.database.formData && this.state.database.formData.hasOwnProperty('FormID')) console.log('End DB FormID: ' + this.state.database.formData.FormID)
        //if(tableName == 'formData' && this.state.form.formData && this.state.form.formData.hasOwnProperty('FormID')) console.log('End Form FormID: ' + this.state.form.formData.FormID)
    },

    /* LOAD: Generic - EXCLUDING columns and datables, all tables/stores use this*/
    loadStore(newValue, storeName, loadDate){
        var self = this;
        var editable = false;
        var newVal, def, db;
        //var inDialog = (storeName == 'formFields' || storeName == 'allDepartments' || storeName == 'allFieldTypes' || storeName == 'allValSets') ? true : false;

        if(newValue && newValue.length > 0){
            this.setStoreIsLoading({stateName: 'database', storeName: storeName, isLoading: true, loadDate: loadDate});
            editable = newValue[0].hasOwnProperty('updateDB');

            if(storeName === 'formData' || storeName == 'formRecord'){
                newVal = clone(newValue[0]);
                this.setColumnValObjs(newVal, 'formData');
            }
            else{
                newVal = clone(newValue);
                newVal.forEach(function(item){
                    self.setColumnValObjs(item, storeName);
                });
            }

            if(editable){
                this.setStoreIsLoading({stateName: 'default', storeName: storeName, isLoading: true, loadDate: loadDate});
                this.setStoreIsLoading({stateName: 'form', storeName: storeName, isLoading: true, loadDate: loadDate});
                
                /*if(inDialog){
                    this.state.dialog._isLoading[storeName] = true;
                    this.state.dialog._lastLoad[storeName] = loadDate;
                }*/

                if(storeName === 'formData' || storeName == 'formRecord'){
                    if(newVal.updateDB === false){
                        this.setState(newVal, 'database', storeName);
                        this.setState(newVal, 'form', storeName);
                        //if(inDialog) this.setState(newVal, 'dialog', storeName);
                    }
                    else if(newVal.updateDB === true){
                        //if(storeName == 'formData') console.log(newVal);
                        this.setState(newVal, 'default', storeName);
                        if (this.debug) console.log(storeName + ' nulled')
                        this.setState(null, 'database', storeName);
                        this.setState(null, 'form', storeName);
                        //if(inDialog) this.setState(null, 'dialog', storeName);
                    }
                }
                else{
                    if(storeName !== 'formSections'){
                        def = newVal.find(function(item){
                            return item.updateDB === true;
                        });
                        if(def){
                            this.setState(def, 'default', storeName);
                        }
                    }
                    else{
                        def = newVal.find(function(item){
                            return item.updateDB === true && item.SectionID.dbVal === null;
                        });
                        if(def){
                            this.setState(def, 'default', storeName);
                        }
                        var sd1 = newVal.find(function(item){
                            return item.updateDB === true && item.SectionID.dbVal == 1;
                        });
                        if(sd1){
                            this.setState(sd1, 'default', 'firstSection');
                        }
                        var sd2 = newVal.find(function(item){
                            return item.updateDB === true && item.SectionID.dbVal == 2;
                        });
                        if(sd2){
                            this.setState(sd2, 'default', 'lastSection');
                        }
                    }

                    var db = newVal.filter(function(item){
                        return item.updateDB === false;
                    });

                    if(db && db.length > 0){
                        this.setState(db, 'database', storeName);
                        this.setState(db, 'form', storeName);
                        //if(inDialog) this.setState(db, 'dialog', storeName);
                    }
                    else{
                        if( (this.state.database[storeName] && this.state.database[storeName].length > 0) || (this.state.form[storeName] && this.state.form[storeName].length > 0) ){
                            if (this.debug) console.log(storeName + ' nulled')
                        }
                        this.setState([], 'database', storeName);
                        this.setState([], 'form', storeName);
                        //if(inDialog) this.setState([], 'dialog', storeName);
                    }
                }
            }
            else{
                this.setState(newVal, 'database', storeName);
            }

            if (this.debug) console.log(editable ? 'loadStore: ' + storeName + ' - states set: database, form, default(s)' : 'loadStore: ' + storeName + ' - states set: database');

            this.setStoreIsLoading({stateName: 'database', storeName: storeName, isLoading: false});
            if (editable){
                this.setStoreIsLoading({stateName: 'default', storeName: storeName, isLoading: false});
                this.setStoreIsLoading({stateName: 'form', storeName: storeName, isLoading: false});
                /*if(inDialog){
                    this.state.dialog._isLoading[storeName] = false;
                    this.state.dialog.lastLoad = loadDate;
                }*/
            }
            //if(storeName == 'formData' && this.state.database.formData && this.state.database.formData.hasOwnProperty('FormID')) console.log('End DB FormID: ' + this.state.database.formData.FormID)
            //if(storeName == 'formData' && this.state.form.formData && this.state.form.formData.hasOwnProperty('FormID')) console.log('End Form FormID: ' + this.state.form.formData.FormID)
        }
        else{
            if (this.warnDebug) console.warn('WARNING: loadStore: ' + storeName + ' - no results');   
        }
    },
    loadColumns(newValue, storeNames, loadDate){
        var self = this;
        var fCols;

        if(newValue){
            this.setStoreIsLoading({stateName: 'columns', isLoading: true, loadDate: loadDate});
            storeNames.forEach(function(storeName){
                self.setStoreIsLoading({stateName: 'columns', storeName: storeName, isLoading: true, loadDate: loadDate});
                fCols = newValue.filter(function(col){
                    return col.StoreName === storeName;
                });
                if(fCols && fCols.length > 0){
                    self.setState(fCols, 'columns', storeName);
                }
                self.setStoreIsLoading({stateName: 'columns', storeName: storeName, isLoading: false});
            });

            this.setStoreIsLoading({stateName: 'columns', isLoading: false});
            if (this.debug) console.log('loadColumns: columns set');
        }
        else if (this.errDebug) console.error('ERROR: loadColumns: NO RESULTS');
    },
    // Only used in Entry & Build - Home (View All Forms or View All Records)
    loadDataTable (newValue, storeName, loadDate) {
        var self = this;
        this.setStoreIsLoading({stateName: 'datatables', storeName: storeName, isLoading: true, loadDate: loadDate});

        if(newValue && newValue.length > 0){
            //this.setStoreIsLoading({stateName: 'datatables', storeName: storeName, isLoading: true, loadDate: loadDate});

            var newVal = clone(newValue);
            newVal.forEach(function(v){
                self.setColumnValObjs(v, storeName);
            });

            this.setState(newVal, 'datatables', storeName);

            if (this.debug) console.log('loadDataTable triggered - ' + storeName + ' - states set: datatables');

            //this.setStoreIsLoading({stateName: 'datatables', storeName: storeName, isLoading: false});
        }
        else{
            if (this.warnDebug) console.warn('WARNING: loadDataTable - ' + storeName + ' - NO RESULTS');
            this.setState([], 'datatables', storeName);
        }
        this.setStoreIsLoading({stateName: 'datatables', storeName: storeName, isLoading: false});
    },


    // colA is updated, colB is database;
    compareColVals(colA, colB, sortBy){
        var returnVal = 0;

        // typeof null == object, check for nulls before
        if(colA === null && colB === null){
            returnVal = 0;
        }
        else if(colA === null){
            returnVal = -1;
        }
        else if(colB === null){
            returnVal = 1;
        }
        else if(typeof(colA) == 'object' && typeof(colB) == 'object'){
            returnVal = this.compareColValObjs(colA, colB, {byCategory: false, alphabetically: false});
        }
        else if(typeof(colA) == 'object'){
            if (this.errDebug) console.error("ERROR: comparing different types: (" + colA.valType + ") " + colA.val + " ? " + colB);
            returnVal = 0;
        }
        else if(typeof(colB) == 'object'){
            if (this.errDebug) console.error("ERROR: comparing different types: " + colA + " ? " + " (" + colB.valType + ") " + colB.val);
            returnVal = 0;
        }
        else{
            if(colA > colB){
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
        //if(this.debug) console.log(returnVal);
        return returnVal;
    },

    /* Used by updateObjProp, compareColVals */
    compareColValObjs(colObjA, colObjB, sortPayload){
        var returnVal = 0;

        //if(this.debug) console.log(colObjA.val + " : " + colObjB.val);

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
        else if (colObjA.valType == 'select' && colObjB.valType == 'select'){
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
        /*else if ( (colObjA.valType == 'select2' && colObjB.valType == 'select2') || colObjA.valType == 'autocomplete' && colObjB.valType == 'autocomplete' ){
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
        }*/
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



    setColumnValObjs(newVal, storeName){   //setAllValObjs
        var self = this;
        var cols = this.getColumns(storeName);
        var payload = {storeName: storeName};
        var newValObj;

        // set 1/0 to true/false
        if(newVal.hasOwnProperty('updateDB')){
            if(newVal.updateDB && (newVal.updateDB == 1) || newVal.updateDB == true) newVal.updateDB = true;
            else newVal.updateDB = false;
        }

        if(cols){
            cols.forEach(function(c){
                if(!(c.IsTableID) && !(c.IsOrderID)){
                    payload = Object.assign({}, payload, {colVal: newVal[c.ColumnName], FieldType: c.ColumnType, Column: c});

                    if (c.hasOwnProperty('ColumnTypeID')) payload = Object.assign({}, payload, {FieldTypeID: c.ColumnTypeID});
                    //if(newVal.hasOwnProperty('updateDB')) payload = Object.assign({}, payload, {UpdateDB: newVal.updateDB});

                    /*if (c.hasOwnProperty('ValidationSetID')) payload = Object.assign(payload, {ValidationSetID: c.ValidationSetID});
                    if (c.hasOwnProperty('JoinSet')) payload = Object.assign(payload, {JoinSet: c.JoinSet, ForeignKey: c.ForeignKey, ValProp: c.ValColumn, TextProp: c.TextColumn});
                    if (c.hasOwnProperty('Label')) payload = Object.assign(payload, {Label: c.Label});
                    if (c.hasOwnProperty('UserInput')) payload = Object.assign(payload, {isInput: c.UserInput, required: c.Required});
                    if (c.hasOwnProperty('Calculated')) payload = Object.assign(payload, {calculated: c.Calculated});
                    if (c.hasOwnProperty('ShowInHeader')) payload = Object.assign(payload, {isHeader: c.ShowInHeader, hasTooltip: c.HasTooltip, tooltipCol: c.TooltipForCol});*/

                    newValObj = self.getColValObj(payload);

                    //newVal = Object.assign({}, newVal, {[c.ColumnName]: newValObj});
                    
                    if(newVal.hasOwnProperty(c.ColumnName)) newVal[c.ColumnName] = newValObj;
                    else Vue.set( newVal, c.ColumnName, newValObj );
                }
                else if (c.IsTableID){
                    self.state.tableIDs[storeName] = c.ColumnName;
                }
                // orderID needs updateDB, so has to be object, but only {dbVal: _, updateDB: t/f}
                else if(c.IsOrderID){
                    self.state.orderIDs[storeName] = c.ColumnName;

                    newValObj = {dbVal: payload.colVal, updateDB: false}
                    if(newVal.hasOwnProperty(c.ColumnName)) newVal[c.ColumnName] = newValObj;
                    else Vue.set( newVal, c.ColumnName, newValObj );
                }
                else{

                }
            });
        }

        return newVal;
    },



    getColValObj(payload){    // colVal (req), FieldType, FieldTypeID, UpdateDB, showTimestamp, showDay, setDefault
        var self = this;

        var colValObj = {dbVal: payload.colVal, updateDB: false};
        var currVal = payload.colVal;
        var setDef = payload.hasOwnProperty('setDefault') && payload.setDefault;

        var fieldTID, fieldT, joinSet;
        if(payload.hasOwnProperty('FieldTypeID')){
            fieldTID = payload.FieldTypeID;
            if(fieldTID){
                colValObj = Object.assign({}, colValObj, {FieldTypeID: fieldTID});
            }
        }
        if(payload.hasOwnProperty('FieldType')){
            fieldT = payload.FieldType;
            if(fieldT){
                fieldT = fieldT.toUpperCase();
                colValObj = Object.assign({}, colValObj, {FieldType: fieldT});
            }
        }
        /*if(payload.hasOwnProperty('UpdateDB')){
            colValObj = Object.assign({}, colValObj, {updateDB: payload.UpdateDB});
        }*/ 
        if(payload.Column.hasOwnProperty('JoinSet')){
            joinSet = payload.Column.JoinSet;
            colValObj = Object.assign({}, colValObj, {JoinSet: joinSet});
        }
        if(payload.Column.hasOwnProperty('ForeignKey')){
            colValObj = Object.assign({}, colValObj, {ForeignKey: payload.Column.ForeignKey, ValProp: payload.Column.ValColumn, TextProp: payload.Column.TextColumn});
        }

        if(payload.Column.hasOwnProperty('Label')){
            colValObj = Object.assign({}, colValObj, {Label: payload.Column.Label});
        }
        if(payload.Column.hasOwnProperty('UserInput')){
            colValObj = Object.assign({}, colValObj, {isInput: payload.Column.UserInput, required: payload.Column.Required});
        }
        if(payload.Column.hasOwnProperty('Hidden')){
            colValObj = Object.assign({}, colValObj, {isHidden: payload.Column.Hidden});
        }
        if(payload.Column.hasOwnProperty('Calculated')){
            colValObj = Object.assign({}, colValObj, {isCalculated: payload.Column.Calculated});
        }
        if(payload.Column.hasOwnProperty('ShowInHeader')){
            colValObj = Object.assign({}, colValObj, {isHeader: payload.Column.ShowInHeader, hasTooltip: payload.Column.HasTooltip, tooltipCol: payload.Column.TooltipForCol});
        }
        if(payload.Column.hasOwnProperty('ValidationSetID')){
            colValObj = Object.assign({}, colValObj, {ValidationSetID: payload.Column.ValidationSetID});
        }

        var valType, val = null, displayVal = '', valObj = null;
        var subset;

        if(fieldTID && fieldTID > 0 && fieldTID <= 7){

            switch(parseInt(fieldTID)){
                case 1: // date
                    valType = 'moment';
                    if(currVal !== null){
                        /*val = moment(); CHANGED 1/31*/
                        val = moment.utc(currVal);
                    }
                    else if(setDef){
                        val = moment();
                    }
/* ADD: SET TO TODAY IF PRIMARY DATE FIELD */
                    /*else{
                        val = null;
                        displayVal = '';
                    }*/
                break;
                case 2: // time ??
                    valType = 'moment';
                    if(currVal !== null){
                        val = moment.utc(currVal);
                    }
                    // set null dates to current date?
                    else if(setDef){
                        val = moment();
                    }
                break;
                case 3: // number
                    valType = 'number';
                    if(currVal !== null){
                        //valObj = Number(currVal);
                        val = parseFloat(currVal);
                        displayVal = currVal.toString();
                    }
                break;
                case 4: // text,
                    valType = 'text';
                    if(currVal !== null){
                        displayVal = currVal.toString();
                        val = currVal.toString().toUpperCase();
                    }
                break;
                case 5: // text area
                    valType = 'textarea';
                    if(currVal !== null){
                        displayVal = currVal.toString();
                        val = currVal.toString().toUpperCase();
                    }
                break;
                case 6: // checkbox
                    valType = 'boolean';
                    // allow for bits to be null
                    if(currVal === null){
                        val = false;
                    }
                    else if (currVal == true || currVal == 1){
                        val = true;
                    }
                    else{
                        val = false;
                    }
                    displayVal = val ? 'true' : 'false';
                break;
                case 7: // valset
                    valType = 'select';
                    if(currVal !== null && (self.state.form.formVsOptions.length > 0 || self.state.database.formVsOptions.length > 0)){
                        if(self.state.form.formVsOptions.length > 0){
                            subset = 'form';
                        }
                        else{
                            subset = 'database';
                        }

                        if(self.state[subset].formVsOptions.length > 0 && self.state[subset].formVsOptions[0].hasOwnProperty('EntryValue')){
                            valObj = self.state[subset].formVsOptions.find(function(v){
                                if(typeof(v.ValidationSetID) === "object" && typeof(v.EntryValue) === "object"){
                                    return v.ValidationSetID.val == joinSet && v.EntryValue.val == currVal;
                                }
                                else if(typeof(v.ValidationSetID) === "object"){
                                    return v.ValidationSetID.val == joinSet && v.EntryValue == currVal
                                }
                                else if(typeof(v.EntryValue) === "object"){
                                    return v.ValidationSetID == joinSet && v.EntryValue.val == currVal
                                }
                                else{
                                    return v.ValidationSetID == joinSet && v.EntryValue == currVal;
                                }
                            });
                            if(valObj){
                                if(typeof(valObj.EntryValue) === "object") val = valObj.EntryValue.val;
                                else val = valObj.EntryValue;

                                if(typeof(valObj.EntryName) === "object") displayVal = valObj.EntryName.displayVal;
                                else displayVal = valObj.EntryName.toString();
                                displayVal = valObj.EntryName.toString();
                            }
                            else{
                                if(self.errDebug) console.error('ERROR: getValObj - NO VSOPTION FOUND IN STATE.' + subset + ' - ' + joinSet + ': ' + currVal);
                            }
                        }
                        /*else if(self.state.database.vsOptions.length > 0 && self.state.database.vsOptions[0].hasOwnProperty('EntryValue')){
                            valObj = self.state.database.vsOptions.find(function(v){
                                return v.ValidationSetID == payload.Column.ValidationSetID && v.EntryValue == currVal;
                            });

                            if(valObj){
                                val = valObj.EntryValue;
                                displayVal = valObj.EntryName.toString();
                            }
                            else{
                                if(self.errDebug) console.log('ERROR: getValObj - NO VSOPTION FOUND IN STATE.DATABASE - ' + payload.Column.ValidationSetID + ': ' + currVal);
                            }
                        }*/
                    }
                    else if (currVal !== null){
                        if(self.errDebug) console.error('ERROR: getValObj - NO VSOPTIONS LOADED')
                    }
                break;
            }
        }
        else if(fieldT){
            // dates / times
            if(fieldT.indexOf('DATETIME') > -1){
                valType = 'moment';
                if(currVal !== null){
                    val = moment.utc(currVal);
                }
                // set null dates to current date?
                else if(setDef){
                    val = moment();
                }
            }
            else if(fieldT.indexOf('DATE') > -1){
                valType = 'moment';
                if(currVal !== null){
                    val = moment();
                }
                else if(setDef){
                    val = moment();
                }
            }
            else if(fieldT.indexOf('TIME') > -1){
                valType = 'moment';
                if(currVal !== null){
                    val = moment.utc(currVal);
                }
                // set null dates to current date?
                else if(setDef){
                    val = moment();
                }
            }
            // Numbers / GUIDs
            else if(fieldT.indexOf('GUID') > -1){
                valType = 'text';
                val = currVal.toString().toUpperCase();
                displayVal = '';
            }
            else if(fieldT.indexOf('INT') > -1 || fieldT.indexOf('YEAR') > -1){
                valType = 'number';
                if(currVal !== null){
                    //valObj = Number(currVal);
                    val = parseInt(currVal);
                    displayVal = currVal.toString();;
                }
            }
            else if(fieldT.indexOf('DOUBLE') > -1 || fieldT.indexOf('NUMBER') > -1){
                valType = 'number';
                if(currVal !== null){
                    //valObj = Number(currVal);
                    val = parseFloat(currVal);
                    displayVal = currVal.toString();
                }
            }
            else if (fieldT.indexOf('TEXTAREA') > -1){
                valType = 'textarea';
                if(currVal !== null){
                    displayVal = currVal.toString();
                    val = currVal.toString().toUpperCase();
                }
            }
            else if (fieldT.indexOf('TEXT') > -1 || fieldT.indexOf('URL') > -1 || fieldT.indexOf('USER') > -1 || fieldT.indexOf('HTMLID') > -1){
                valType = 'text';
                if(currVal !== null){
                    displayVal = currVal.toString();
                    val = currVal.toString().toUpperCase();
                }
            }
            else if (fieldT.indexOf('BOOL') > -1 || fieldT.indexOf('BOOLEAN') > -1){
                valType = 'boolean';
                // allow for bits to be null
                if(currVal === null){
                    val = false;
                }
                else if (currVal == true || currVal == 1){
                    val = true;
                }
                else{
                    val = false;
                }
                displayVal = val ? 'true' : 'false';
            }
            else if (fieldT.indexOf('VALSET') > -1){
                valType = 'text';
                if(currVal !== null){
                    displayVal = currVal.toString();
                    val = currVal.toString().toUpperCase();
                }
            }
            else if(fieldT.indexOf('JOIN') > -1 || fieldT.indexOf('SELECT') > -1 ){
                valType = fieldT.indexOf('JOIN') > -1 ? 'combobox' : 'select2';
                if(joinSet){
                    if(currVal !== null && (self.state.form[joinSet].length > 0 || self.state.database[joinSet].length > 0)){
                        if(self.state.form[joinSet].length > 0) subset = 'form';
                        else subset = 'database';

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
                                if(typeof(valObj[payload.Column.ValColumn]) === "object"){
                                    val = valObj[payload.Column.ValColumn].val;
                                }
                                else{
                                    val = valObj[payload.Column.ValColumn];
                                }
                                if(typeof(valObj[payload.Column.TextColumn]) === "object"){
                                    //val = valObj[payload.Column.TextColumn].val;
                                    displayVal = valObj[payload.Column.TextColumn].displayVal;
                                }
                                else{
                                    //val = valObj[payload.Column.TextColumn];
                                    displayVal = valObj[payload.Column.TextColumn];
                                }
                            }
                            else{
                                if(this.errDebug) console.error('ERROR: getValObj - NOT FOUND IN STATE.' + subset + '.' + joinSet + ' - ' + currVal);
                            }
                        }
                    }
                    else if(currVal !== null){
                        if(this.errDebug) console.error('ERROR: getValObj - ' + joinSet + ' NOT LOADED')
                        val = currVal;
                        displayVal = currVal.toString();
                    }
                }
                else {
                    if(self.errDebug) console.error('ERROR: getValObj - NO JOINSET SPECIFIED')
                    val = currVal;
                    displayVal = currVal.toString();
                }
            }
            else{
                valType = 'unknown';
                if(currVal !== null){
                    val = currVal;
                    displayVal = val.toString();
                }
            }
        }

        // set display for moments
        if(valType == 'moment' && val){
            if(fieldT.indexOf('DATETIME') > -1){
                    if(payload.storeName == 'formsList'){
                        if(payload.Column.ColumnName === 'CreateDate' || payload.Column.ColumnName === 'LastEditDate'){
                            displayVal = getDateTimeStr(val,'M/D/YY', 'h:mmA', false); //getDateTimeStr(sqlDate, dateFormat, timeFormat, excludeMidnight)
                        }
                    }
                    else if(payload.storeName == 'recordsList'){
                        if(payload.Column.ColumnName === 'OriginalSubmitDate' || payload.Column.ColumnName === 'LastEditDate'){
                            displayVal = getDateTimeStr(val,'M/D/YY', 'h:mmA', false); //getDateTimeStr(sqlDate, dateFormat, timeFormat, excludeMidnight)
                        }
                    }
                    // payload.Column._ ?
                    else if(payload.hasOwnProperty('showDay') && payload.showDay && payload.hasOwnProperty('showTimestamp') && payload.showTimestamp){
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
            else if(fieldT.indexOf('DATE') > -1){
                displayVal = val.format('M/D/YY');
            }
            else if(fieldT.indexOf('TIME') > -1){
                displayVal = val.format('h:mmA');
            }
        }

        colValObj = Object.assign({}, colValObj, {valType: valType, val: val, displayVal: displayVal, valObj: valObj});
        return colValObj;
    },


    payloadToStr(payload){
        var msg = '';
        var tableID;

        if(payload.hasOwnProperty('stateName') && payload.stateName){
            msg += 'state: '+ payload.stateName;
        }
        if(payload.hasOwnProperty('storeName') && payload.storeName){
            msg += ', store: '+ payload.storeName;
            tableID = this.state.tableIDs[payload.storeName];
        }

        if(payload.hasOwnProperty('id') && payload.id){
            if(tableID ) msg += ', id (' + tableID + '): ' + payload.id;
            else msg += ', id (?): ' + payload.id;
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

        if(payload.hasOwnProperty('valObj') && payload.valObj){
            msg += '; valObj - ';

            if (payload.valObj.hasOwnProperty('fieldTypeID') && payload.valObj.fieldTypeID){
                msg += 'fieldTypeID: ' + payload.valObj.fieldTypeID;
            }
            else if(payload.valObj.hasOwnProperty('FieldTypeID') && payload.valObj.FieldTypeID){
                msg += 'FieldTypeID: ' + payload.valObj.FieldTypeID;
            }
            else if (payload.valObj.hasOwnProperty('fieldType') && payload.valObj.fieldType){
                msg += 'fieldType: ' + payload.valObj.fieldType;
            }
            else if(payload.valObj.hasOwnProperty('FieldType') && payload.valObj.FieldType){
                msg += 'FieldType: ' + payload.valObj.FieldType;
            }
            else{
               msg += '? (should be logged above)';
               console.log(payload.valObj);
            }
        }

        if(payload.hasOwnProperty('isOrig') && payload.isOrig) msg += '; (DB)';
        if(payload.hasOwnProperty('storeName') && payload.storeName && payload.storeName.endsWith('List')) msg += '; (DT)';

        return msg;
    },

}


                    /*setStateIsLoading(stateName, loadDate){

                                var storeNames = Object.keys(this.state[stateName]._isLoading)
                                storeNames.forEach(function(store){
                                    stateIsLoading = stateIsLoading || self.state[stateName]._isLoading[store];
                                });
                                this.state[stateName].isLoading = stateIsLoading;
                    },
                    setStateLastLoad(stateName, loadDate){
                        /*if(!(this.state[stateName].lastLoad)){
                            this.state[stateName].lastLoad = loadDate;
                        }
                        else{
                            moDiff = this.state[stateName].lastLoad.diff(loadDate);
                            if(moDiff < 0){
                                this.state[stateName].lastLoad = loadDate;
                            }
                        }*/
                        /*var self = this;
                                var storeNames = Object.keys(this.state[stateName]._lastLoad)
                                storeNames.forEach(function(store){
                                    if(!stateLastLoad) stateLastLoad = self.state[stateName]._lastLoad[store];
                                    else{
                                        moDiff = stateLastLoad.diff(self.state[stateName]._lastLoad[store]);
                                        if(moDiff < 0){
                                            stateLastLoad = self.state[stateName]._lastLoad[store];
                                        }
                                    }
                                });
                                this.state[stateName].isLoading = stateIsLoading;
                                this.state[stateName].lastLoad = stateLastLoad;
                    },*/
