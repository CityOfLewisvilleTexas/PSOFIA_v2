function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;


    // Handle Moment
    if (obj instanceof moment) {
        copy = obj.clone();
        return copy;
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


function getPropVal (dataObj, propname, propType){ //getFieldVal(dataArr, valPropname, field)
    var self = this;
    var valObj;
    var val;
    var displayVal = '';
    var dbVal;
    var valErr = false;
    var valType;
    var vsOptions;
    if(store.state.form){
        vsOptions = store.state.form.vsOptions;
    }

    if(dataObj.hasOwnProperty(propname) && dataObj[propname]){
        if(propType && propType.FieldTypeID && propType.FieldTypeID > 0 && propType.FieldTypeID <= 7){
            switch(parseInt(propType.FieldTypeID)){
                case 1: // date
                    valObj = formatDate(dataObj[propname], 'default');
                    val = valObj.momentDate;
                    displayVal = valObj.str;
                    dbVal = valObj.str;
                    valType = 'date';
                    break;
                case 2: // time ??
                    valObj = formatTime(dataObj[propname], 'default');
                    val = valObj.momentDate;
                    displayVal = valObj.str;
                    dbVal = valObj.str;
                    valType = 'date';
                    break;
                case 3: // number
                    valObj = Number(dataObj[propname]);
                    val = parseFloat(dataObj[propname]);
                    displayVal = val.toString();
                    dbVal = val;
                    valType = 'number';
                    break;
                case 4: // text,
                case 5: // text area
                    displayVal = dataObj[propname];
                    val = displayVal.toString().toUpperCase();
                    dbVal = displayVal;
                    valType = 'string';
                    break;
                case 6: // checkbox
                    val = dataObj[propname];
                    displayVal = dataObj[propname] ? 'true' : 'false';
                    dbVal = val;
                    valType = 'boolean';
                    break;
                case 7: // valset
                    if(vsOptions.length > 0){
                        valObj = vsOptions.find(function(v){
                            return v.ValidationSetID == propType.ValidationSetID && v.EntryValue == dataObj[propname];
                        });
                        val = valObj.EntryValue;
                        displayVal = valObj.EntryName;
                        dbVal = val;
                        valType = 'set';
                    }
                    else{
                        console.log('error, no vsOptions in store');
                    }
                    break;
            }
        }
        else if(propType){
            if(propType.FieldType.toUpperCase().indexOf('INT') > -1){
                valObj = Number(dataObj[propname]);
                val = parseInt(dataObj[propname]);
                displayVal = val.toString();
                dbVal = val;
                valType = 'number';
            }
            else if(propType.FieldType.toUpperCase().indexOf('DOUBLE') > -1 || propType.FieldType.toUpperCase().indexOf('NUMBER') > -1){
                valObj = Number(dataObj[propname]);
                val = parseFloat(dataObj[propname]);
                displayVal = val.toString();
                dbVal = val;
                valType = 'number';
            }
            else if(propType.FieldType.toUpperCase().indexOf('DATE') > -1 || propType.FieldType.toUpperCase().indexOf('TIME') > -1){
                valObj = formatDateTime(dataObj[propname], 'default', 'default', true);
                val = valObj.momentDate;
                displayVal = valObj.str;
                dbVal = displayVal;
                valType = 'date';
            }
            else if (propType.FieldType.toUpperCase().indexOf('TEXT') > -1){
                displayVal = dataObj[propname];
                val = displayVal.toString().toUpperCase();
                dbVal = displayVal;
                valType = 'string';
            }
            else if (propType.FieldType.toUpperCase().indexOf('BOOL') > -1){
                val = dataObj[propname];
                displayVal = dataObj[propname] ? 'true' : 'false';
                dbVal = val;
                valType = 'boolean';
            }
            else if(propType.FieldType.toUpperCase().indexOf('GUID') > -1){
                dbVal = dataObj[propname];
                val = displayVal.toString().toUpperCase();
                displayVal = '';
                valType = 'string';
            }
            else{
                val = dataObj[propname];
                displayVal = val.toString();
                dbVal = val;
                valType = 'unknown';
            }
        }
        else{
            val = dataObj[propname];
            displayVal = val.toString();
            dbVal = val;
            valType = 'unknown';
        }
    }
    else if( dataObj.hasOwnProperty(propname) && propType &&
        ((propType.FieldTypeID && propType.FieldTypeID == 6) || (propType.FieldType.toUpperCase().indexOf('BOOL') > -1))
    ){
        // checkbox
        val = dataObj[propname];
        displayVal = dataObj[propname] ? 'true' : 'false';
        dbVal = val;
        valType = 'boolean';

    }

    return {valObj:valObj, val:val, displayVal:displayVal, dbVal: dbVal, valType:valType};
}

function getNullPropVal(){
    var valObj;
    var val;
    var displayVal = '';
    var dbVal = null;
    var valType = 'unknown';
    return {valObj:valObj, val:val, displayVal:displayVal, dbVal: dbVal, valType:valType};
}

function getNullPropVal_Field(fieldObj){
    var valObj;
    var val;
    var displayVal = '';
    var dbVal = null;
    var valType = 'unknown';

    switch(fieldObj.FieldTypeID){
        case 1: // date
            valObj = formatDate(moment(), 'default');
            val = valObj.momentDate;
            displayVal = valObj.str;
            dbVal = valObj.str;
            valType = 'date';
            break;
        case 2: // time ??
            valObj = formatTime(moment(), 'default');
            val = valObj.momentDate;
            displayVal = valObj.str;
            dbVal = valObj.str;
            valType = 'date';
            break;
        case 6: // checkbox
            val = 0;
            displayVal = 'false';
            dbVal = 0;
            valType = 'boolean';
            break;
    }

    return {valObj:valObj, val:val, displayVal:displayVal, dbVal: dbVal, valType:valType};
}

function getBuiltInPropVal (dataObj, propname){
    var propType = getPropType(propname, dataObj);
    return getPropVal(dataObj, propname, propType);
}

function comparePropVals (propValA, propValB){   //compareFieldVals(fieldValA, fieldValB)
    var returnVal = 0;

    //console.log(propValA.valType + ' '  + propValB.valType + '  ' + returnVal);

    if(propValA.valType == 'date' && propValB.valType == 'date'){
        moDiff = propValA.val.diff(propValB.val);
        //console.log(moDiff);
        if(moDiff < 0){
            returnVal = -1;
        }
        else if(moDiff > 0){
            returnVal = 1;
        }
    }
    else if (propValA.valType == 'set' && propValB.valType == 'set'){
        if(propValA.valObj.OptionOrder < propValB.valObj.OptionOrder){
            returnVal = -1;
        }
        if(propValA.valObj.OptionOrder > propValB.valObj.OptionOrder){
            returnVal = 1;
        }
    }
    else if (propValA.valType == propValB.valType){
        if(propValA.val == null || propValB.val == null){
            if((propValA.val == null) && propValB.val){
                returnVal = 1;
            }
            else if(propValA.val && (propValB.val == null)){
                returnVal = -1;
            }
        }
        else {
            if(propValA.val < propValB.val){
                returnVal = -1;
            }
            if(propValA.val > propValB.val){
                returnVal = 1;
            }
        }
    }
    // prop types don't match
    else{
        console.log("COMPARING TWO DIFFERENT TYPES - " + propValA.valType + ' ? ' + propValB.valType);
        if(propValA.valType == 'boolean' && propValB.valType != 'boolean'){
            returnVal = 1;
        }
        else if(propValA.valType != 'boolean' && propValB.valType == 'boolean'){
            returnVal = -1;
        }
        else{
            if(propValA.val == null || propValB.val == null){
                if((propValA.val == null) && propValB.val){
                    returnVal = 1;
                }
                else if(propValA.val && (propValB.val == null)){
                    returnVal = -1;
                }
            }
            else {
                if(propValA.val < propValB.val){
                    returnVal = -1;
                }
                if(propValA.val > propValB.val){
                    returnVal = 1;
                }
            }
        }
    }
    return returnVal;
}

function getDisplayVal(dataObj, propname, propType){    // getDisplayVal(dataArr, valPropname, field, valSets)
    var propVal = getPropVal(dataObj, propname, propType);
    return propVal.displayVal;
}


function compareByProp (dataObjA, dataObjB, propname, propType){    //compareByField?
    var propValA = getPropVal(dataObjA, propname, propType);
    var propValB = getPropVal(dataObjB, propname, propType);

    return comparePropVals(propValA, propValB);
}

function compareByPropForSort (sortBy, dataObjA, dataObjB, propname, propType){   //compareByFieldForSort
    var propValA = getPropVal(dataObjA, propname, propType);
    var propValB = getPropVal(dataObjB, propname, propType);

    var returnVal = comparePropVals(propValA, propValB);
    // don't change sign if comparison included a null
    if(propValA.val && propValB.val && (sortBy == 'descending' || sortBy == 'desc')){
        returnVal = returnVal * -1;
    }

    return returnVal;
}

function compareFieldsByProp (fieldA, fieldB, propname){
    var propTypeA = getPropType(propname, fieldA);
    var propTyepB = getPropType(propname, fieldB);
    var propValA = getPropVal(fieldA, propname, propTypeA);
    var propValB = getPropVal(fieldB, propname, propTyepB);

    return comparePropVals(propValA, propValB);
}

function compareFieldsByPropForSort (sortBy, fieldA, fieldB, propname){
    var propTypeA = getPropType(propname, fieldA);
    var propTyepB = getPropType(propname, fieldB);
    var propValA = getPropVal(fieldA, propname, propTypeA);
    var propValB = getPropVal(fieldB, propname, propTyepB);

    var returnVal = comparePropVals(propValA, propValB);

    // don't change sign if comparison included a null
    if(propValA.val && propValB.val && (sortBy == 'descending' || sortBy == 'desc')){
        returnVal = returnVal * -1;
    }

    return returnVal;
}

function getPropType(propname, dataObj){
    var fieldType;
    // RecordNumber may be int or 
    if(dataObj.hasOwnProperty('FieldTypeID') || dataObj.hasOwnProperty('FieldType')){
        return datObj;
    }
    else if(propname.toUpperCase() == 'RECORDNUMBER'){
        if(dataObj.hasOwnProperty(propname) && dataObj[propname]){
            if(parseInt(dataObj[propname]) == NaN){
                fieldType = 'GUID';
            }
            else fieldType = 'INT';
        }
        else fieldType = 'INT';
    }
    else if (propname.toUpperCase() == 'ACTIVE' || propname.toUpperCase() == 'REFRESHONSUBMIT'|| propname.toUpperCase() == 'REQUIRED' || propname.toUpperCase() == 'VISIBLEONEDIT'){
        fieldType = 'BOOL';
    }
    else if(propname.toUpperCase().slice(-2) == 'ID' || propname.toUpperCase().slice(-5) == 'ORDER'){
        fieldType = 'INT';
    }
    else if (propname.toUpperCase() == 'FIELDMIN' || propname.toUpperCase() == 'FIELDMAX'){
        fieldType = 'NUMBER';
    }
    else if(propname.toUpperCase().indexOf('DATE') > -1){
        fieldType = 'DATETIME';
    }
    else{
        fieldType = 'TEXT';
    }

    return {FieldTypeID: null, FieldType: fieldType}
}


function getDBLayout(tableName){
    var tableObj;
    switch(tableName){
        case 'FieldTypes':
        tableObj = {
            FieldTypeID: {FieldType: 'INT', propType: 'val'},
            FieldType: {FieldType: 'TEXT', propType: 'displayVal'},
            FieldTypeOrder: {FieldType: 'INT', propType: 'orderBy'}
        }
        break;
        case 'Departments':
        tableObj = {
            DepartmentID: {FieldType: 'INT', propType: 'val'},
            Department: {FieldType: 'TEXT', propType: 'displayVal'}
        }
        break;
        case 'Forms':
        tableObj = {
            FormID: {FieldType: 'INT', propType: 'val'},
            FormName: {FieldType: 'TEXT', propType: 'displayVal'},
            TableName: {FieldType: 'TEXT', propType: 'val'},
            ViewFormAddress: {FieldType: 'TEXT', propType: 'URL'},
            Active: {FieldType: 'BOOLEAN', propType: 'val'},
            DepartmentID: {FieldType: 'INT', propType: 'LINK', linkTo: 'Departments'},
            RefreshOnSubmit: {FieldType: 'BOOLEAN', propType: 'val'},
            FieldHTMLID_Date: {FieldType: 'TEXT', propType: 'LINK', linkTo: 'FormFields', linktoCol:'FieldHTMLID'},
            CreateDate: {FieldType: 'DATETIME', propType: 'val'},
            CreateUser: {FieldType: 'TEXT', propType: 'val'},
            LastEditDate: {FieldType: 'DATETIME', propType: 'val'},
            LastEditUser: {FieldType: 'TEXT', propType: 'val'},
            defOrderBy: {cols:['CreateDate', 'FormID'], directions:['desc','desc']},
            disabled: {cold:['TableName']}
        }
        break;
        case 'FormFields':
        tableObj = {
            FormFieldID: {FieldType: 'INT', propType: 'val'},
            FormID: {FieldType: 'INT', propType: 'LINK', linkTo: 'Forms'},
            FormSectionID: {FieldType: 'INT', propType: 'LINK', linkTo: 'FormSections'},
            FormSubSectionID: {FieldType: 'INT', propType: 'LINK', linkTo: 'FormSubSections'},
            FieldTypeID: {FieldType: 'INT', propType: 'LINK', linkTo: 'FieldTypes'},
            ValidationSetID: {FieldType: 'INT', propType: 'LINK', linkTo: 'ValidationSets'},
            FieldName: {FieldType: 'TEXT', propType: 'displayVal'},
            FieldHTMLID: {FieldType: 'TEXT', propType: 'val'},
            FieldOrder: {FieldType: 'INT', propType: 'orderBy'},
            Active: {FieldType: 'BOOLEAN', propType: 'val'},
            Required: {FieldType: 'BOOLEAN', propType: 'val'},
            VisibleOnEdit: {FieldType: 'BOOLEAN', propType: 'val'},
            FieldMin: {FieldType: 'NUMBER', propType: 'val'},
            FieldMax: {FieldType: 'NUMBER', propType: 'val'}
        }
        break;
    }
    return tableObj;
}