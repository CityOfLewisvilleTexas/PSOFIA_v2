function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

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
    var valType;
    var vsOptions;
    if(store.state.form){
        vsOptions = store.state.form.vsOptions;
    }

    if(dataObj[propname]){
        if(propType && propType.FieldTypeID && propType.FieldTypeID > 0 && propType.FieldTypeID <= 7){
            switch(parseInt(propType.FieldTypeID)){
                case 1: // date
                    valObj = formatDate(dataObj[propname], 'default');
                    val = valObj.momentDate;
                    displayVal = valObj.str;
                    valType = 'date';
                    break;
                case 2: // time ??
                    valObj = formatTime(dataObj[propname], 'default');
                    val = valObj.momentDate;
                    displayVal = valObj.str;
                    valType = 'date';
                    break;
                case 3: // number
                    valObj = Number(dataObj[propname]);
                    val = parseFloat(dataObj[propname]);
                    displayVal = val.toString();
                    valType = 'number';
                    break;
                case 4: // text,
                case 5: // text area
                    val = dataObj[propname].toString().toUpperCase();
                    displayVal = dataObj[propname];
                    valType = 'string';
                    break;
                case 6: // checkbox
                    val = dataObj[propname];
                    displayVal = dataObj[propname] ? 'true' : 'false';
                    valType = 'boolean';
                    break;
                case 7: // valset
                    if(vsOptions.length > 0){
                        valObj = vsOptions.find(function(v){
                            return v.ValidationSetID == propType.ValidationSetID && v.EntryValue == dataObj[propname];
                        });
                        val = valObj.EntryValue;
                        displayVal = valObj.EntryName;
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
                val = parseInt(dataObj[propname]);
                displayVal = val.toString();
                valType = 'number';
            }
            else if(propType.FieldType.toUpperCase().indexOf('DOUBLE') > -1 || propType.FieldType.toUpperCase().indexOf('NUMBER') > -1){
                val = parseFloat(dataObj[propname]);
                displayVal = val.toString();
                valType = 'number';
            }
            else if(propType.FieldType.toUpperCase().indexOf('DATE') > -1 || propType.FieldType.toUpperCase().indexOf('TIME') > -1){
                valObj = formatDateTime(dataObj[propname], 'default', 'default', true);
                val = valObj.momentDate;
                displayVal = valObj.str;
                valType = 'date';
            }
            else if (propType.FieldType.toUpperCase().indexOf('TEXT') > -1){
                val = dataObj[propname].toString().toUpperCase();
                displayVal = dataObj[propname];
                valType = 'string';
            }
            else if (propType.FieldType.toUpperCase().indexOf('BOOL') > -1){
                val = dataObj[propname];
                displayVal = dataObj[propname] ? 'true' : 'false';
                valType = 'boolean';
            }
            else{
                val = dataObj[propname];
                displayVal = val.toString();
                valType = 'unknown';
            }
        }
        else{
            val = dataObj[propname];
            displayVal = val.toString();
            valType = 'unknown';
        }
    }
    return {valObj:valObj, val:val, displayVal:displayVal, valType:valType};
}

function comparePropVals (propValA, propValB){   //compareFieldVals(fieldValA, fieldValB)
    var returnVal = 0;

    if(propValA.valType == 'date' && propValB.valType == 'date'){
        moDiff = (propValA.val).diff(propValB.val);
        if(moDiff < 0){
            returnVal = -1;
        }
        if(moDiff > 0){
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

function getPropType(propname){
    var fieldType;
    if (propname == 'Active' || propname == 'RefreshOnSubmit'|| propname == 'Required' || propname == 'VisibleOnEdit'){
        fieldType = 'BOOL';
    }
    else if(propname.slice(-2) == 'ID' || propname.slice(-5) == 'Order'){
        fieldType = 'INT';
    }
    else if (propname == 'FieldMin' || propname == 'FieldMax'){
        fieldType = 'NUMBER';
    }
    else{
        fieldType = 'TEXT';
    }

    return {FieldTypeID: null, FieldType: fieldType}
}

function compareFieldsByProp (fieldA, fieldB, propname){
    var propType;
    if(fieldA.FieldTypeID && fieldB.FieldTypeID){
        if(fieldA.FieldTypeID == fieldB.FieldTypeID){
            propType = {FieldTypeID: fieldA.FieldTypeID, FieldType: fieldA.FieldType, ValidationSetID: fieldA.ValidationSetID};
            return this.compareByProp(fieldA, fieldB, propname, propType);
        }
        else{
            console.log("incompatible field types for comparison - FieldTypeID " + fieldA.FieldTypeID + " : " + fieldB.FieldTypeID);
            return 0;
        }
    }
    else if(fieldA.FieldType && fieldB.FieldType){
        if(fieldA.FieldType == fieldB.FieldType){
            return propType = {FieldTypeID: fieldA.FieldTypeID, FieldType: fieldA.FieldType, ValidationSetID: fieldA.ValidationSetID};
        }
        else{
            console.log("incompatible field types for comparison");
            return 0;
        }  
    }
    else{
        console.log("incompatible field types for comparison");
        return 0;
    }
}

function compareFieldsByPropForSort (sortBy, fieldA, fieldB, propname){
    var propType;
    if(fieldA.FieldTypeID && fieldB.FieldTypeID && fieldA.FieldTypeID == fieldB.FieldTypeID){
        propType = {FieldTypeID: fieldA.FieldTypeID, FieldType: fieldA.FieldType, ValidationSetID: fieldA.ValidationSetID};
        return this.compareByPropForSort(sortBy, fieldA, fieldB, propname, propType);
    }
    else if(fieldA.FieldType && fieldB.FieldType && fieldA.FieldType == fieldB.FieldType){
        propType = {FieldTypeID: fieldA.FieldTypeID, FieldType: fieldA.FieldType, ValidationSetID: fieldA.ValidationSetID};
        return this.compareByPropForSort(sortBy, fieldA, fieldB, propname, propType); 
    }
    else{
        console.log("incompatible field types for comparison");
        return 0;
    }
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