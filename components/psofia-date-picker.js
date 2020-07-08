Vue.component('psofia-date-picker', {
    // declare the props
    props: {
        
        stateName:{ 
            type: String,
            required: false,
            default: 'form'
        },
        storeName:{ // formData, sections, subSections, fields, etc
            type: String,
            required: true
        },
        storeId:{   // formFieldID, formSectionID, formSubSectionID, etc
            type: Number,
            required: false
        },
        valPropname:{
            type: String,
            required: true
        },
        inputDisabled:{
            type: Boolean,
            required: false,
            default: false
        },
        allowRange:{
            type: Boolean,
            required: false,
            default: false
        },
        inputClearable:{
            type: Boolean,
            required: false,
            default: true
        },
        parentShowInactive:{
            type: Boolean,
            required: false,
            default: false
        },
        isDarkMode:{
            type: Boolean,
            required: false,
            default: false
        }
    },
    template: `
        <span>
            <v-menu v-if="!allowRange"
                :id="menuID" :ref="menuID"
                
                v-model="showMenu"
                
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :id="inputID" :ref="inputID"
                        
                        v-model="inputValFormatted"
                        v-bind="attrs"
                        @blur="updateFormatted"
                        @change="changeValue"
                        @update:error="updateErr"
                        
                        :label="inputLabel"
                        :hint="inputDesc"
                        :persistent-hint="hasHint"
                        :disabled="inputDisabled"
                        :clearable="inputClearable"

                        @click:clear="clearInput"
                        @focus="selectAll"
                        @click.right="logValue"
                            v-on="on"

                        :messages="msg"
                        :success="wasChanged"

                        :rules="[]"
                        :error="hasError"

                        prepend-icon="event"
                        :background-color="inputColor"
                    ></v-text-field>
                </template>

                <v-date-picker
                    :id="pickerID" :ref="pickerID"

                    v-model="pickerVal"
                    @input="setPicker"

                    :multiple="false"
                    :range="allowRange"
                    :disabled="inputDisabled"

                    no-title
                    scrollable
                    picker-date="2020/05"
                    color="secondary"
                    header-color="primary"
                    :dark="isDarkMode"
                    :day-format="null" :header-date-format="null" :month-format="null" :title-date-format="null" :weekday-format="null"
                >
                    <v-spacer></v-spacer>
                </v-date-picker>
            </v-menu>

            <v-dialog v-if="allowRange"
                :id="menuID" :ref="menuID"
                v-model="showMenu"
                :return-value.sync="pickerVal"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="inputValFormatted"
                        label="Historical Search"
                        v-bind="attrs"
                        v-on="on"
                        readonly
                    ></v-text-field>
                </template>
                <v-card>
                    <v-card-text>
                        <v-btn text color="primary" @click.stop.prevent="switchPickerType">Range</v-btn>
                    </v-card-text>
                    <v-date-picker
                        v-model="pickerVal"
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="historicalSearch.show = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.historicalSearch_dialog.save(historicalSearch[historicalSearch.type])">OK</v-btn>
                    </v-date-picker>
                    <v-date-picker
                        v-model="pickerRange"
                        range
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="historicalSearch.show = false">Cancel</v-btn>
                        <v-btn text color="primary" @click="$refs.historicalSearch_dialog.save(historicalSearch[historicalSearch.type])">OK</v-btn>
                    </v-date-picker>
                </v-card>
            </v-dialog>
        </span>
    `,

//MENU
//:return-value.sync="pickerVal"
//lazy
//TEXT INPUT
//@click:prepend="showMenu = true"
//            <!--title-date-format="pickerTitle"
//              :multiple="allowRange"-->
//            <v-btn flat color="primary" @click="showMenu = false">Cancel</v-btn>
//            <v-btn flat color="primary" @click="savePicker">OK</v-btn>
    data: function(){
        return{
            isLoading: true,
            sharedState: store.state,
            inputValObj: '',    //
            inputVal: '',       //includes properties that are val objects: 1 from allSections (sectionID, sectionTitle, sectionDesc)
            showMenu: false,
            inputValFormatted: null,
            pickerVal: null,
            pickerRange: [],

            hasError: false,
            errMsg: '',
            debug: true,
        }
    },
    created: function(){
    },
    mounted: function(){
        var self = this;
        Vue.nextTick(function(){
            self.initialize();
        });
    },
    watch:{
        valObj: {
            handler: function(val, prev){
                if(val){
                    if(this.debug) console.log('watch field obj - reload input');
                    this.loadInput();
                }
            },
            deep: true
        },
    },
    computed:{
        stateLoading: function(){ return this.sharedState.isLoading; },
        colsLoading: function(){ return this.sharedState.columns.isLoading; },
        formLoading: function(){ return this.sharedState.form.isLoading; },
        dbLoading: function(){ return this.sharedState.database.isLoading; },
        storeLoading: function(){
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

        compError: function(){
            if((this.storeName !== 'formData' || this.storeName !== 'formRecord') && !(this.storeId)) return true;
            else return false;
        },

        storeIdPropname: function(){
            return store.getStoreTableID(this.payload);
        },
        descPropname: function(){
            var propname;
            if(this.storeName == 'formSections') propname = 'SectionDesc';
            else if(this.storeName == 'formSubSections') propname = 'SubsectionDesc';
            else if(this.storeName == 'formFields') propname = 'FieldDesc';
            return propname;
        },

        payload: function(){
            return {stateName: this.stateName, storeName: this.storeName, id: this.storeId, propname: this.valPropname};
        },
        origPayload: function(){
            return Object.assign({}, this.payload, {stateName: 'database'});
        },
        descPayload: function(){
            return Object.assign({}, this.payload, {propname: this.descPropname});
        },

        valObj: function(){
            return store.getObjProp(this.payload);
        },
        origValObj: function(){
            return store.getObjProp(this.origPayload);
        },

        /*pickerVal: {
            get: function(){
                return this.valObj;
            },
            set: function(newValue){
                if(this.debug) console.log("setter");
                this.updateValue(newValue);
            }
        },*/

        // only for dialog
        isDialog: function(){
            return (this.stateName && this.stateName == 'dialog');
        },
        formPayload: function(){
            if(this.isDialog) return Object.assign({}, this.payload, {stateName: 'form'});
            else return null;
        },
        formValObj: function(){
            if(this.isDialog) return store.getObjProp(this.payload);
            else return null
        },

        inputID: function(){
            var id = '';
            if(this.storeId) id += 'input_' + this.storeName + '_' + this.storeIdPropname + this.storeId + '_' + this.valPropname;
            else id += 'input_' + this.storeName + '_' + this.valPropname;

            if(id.length > 0) return id;
            else return null;
        },
        menuID: function(){
            if(this.inputID) return this.inputID + '_menu';
        },
        pickerID: function(){
            if(this.inputID) return this.inputID + '_picker';
        },

        inputLabel: function(){
            if(this.valObj) return this.valObj.Label;
            else return null;
        },
        inputDesc: function(){
            var self = this;
            if(this.storeName === 'formFields') return store.getObjProp(self.descPayload);
            //else if(this.descPropname != null && this.valObj.hasOwnProperty(self.descPropname)) return this.valObj[self.descPropname];
            else return null;
        },

        hasHint: function(){
            if (this.inputDesc) return true;
            else return false;
        },
        wasChanged: function(){
            if(this.valObj.updateDB) return true;
            else return false;
        },
        inputColor: function(){
            if(this.wasChanged) return 'green';
        },
        isSelected: function(){
        },
        msg: function(){
            if(this.wasChanged){
                return 'original: ' + this.valToText(this.origVal);
            }
        },
        logMsg: function(){
            return this.valPropname + "\n" +
                " - original: " + this.valToText(this.origValObj) + "\n" + 
                " - current: " + this.valToText(this.valObj) + "\n" +
                " - input: " + this.valToText(this.inputValObj);
        }
    },
    methods:{
        getInputRef: function(){
            var self = this;
            console.log(this.$refs[self.inputID]);
            /*if(this.inputID){
                return this.$refs[self.inputID];
            }
            else*/
                return undefined;
        },
        
        setPicker: function(){
            var self = this;
            // close menu
            this.showMenu = false;
        },
        //type input to text field @blur (string)
        updateFormatted: function(){
            var self = this;
            console.log(this.inputValFormatted);

            this.pickerVal = moment(this.inputValFormatted).format("YYYY-MM-DD");
        },
        // @input (string)
        updateValue:function(newValue){
            var self = this;
            console.log("text " + this.inputID + " @input " + newValue);
            var formattedValue;

            if(newValue){
                formattedValue = newValue.trim();
                if(newValue == ""){
                    formattedValue = null;
                }
                // If the value was not already normalized,
                // manually override it to conform
                if (formattedValue !== newValue) {
                    //this.$refs[this.inputID].value = formattedValue;
                }
            }

            var newPayload = Object.assign({}, self.payload, {valObj: self.inputValObj});
            store.updateObjProp(newPayload);
        },

        valToText: function(oVal){
            if(oVal){
                if(oVal.dbVal){
                    return oVal.dbVal.toString();
                }
                else if(oVal.dbVal == ''){
                    return 'blank';
                }
                else{
                    return 'null';
                }
            }
            else{
                return 'null obj'
            }
        },
        logValue: function(){
            console.log(this.logMsg);
        },
        // @change (string)
        changeValue: function(newValue){
            if(this.debug) console.log("text " + this.inputID + " @change " + newValue);
        },
        // @update:error (boolean)
        updateErr: function(newValue){
            if(this.debug) console.log("text " + this.inputID + " @update:error " + newValue);
        },
        selectAll: function (event) {
            // Workaround for Safari bug
            // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
            /*setTimeout(function () {
                event.target.select()
            }, 0)*/
        },
        clearInput: function(){
            if(this.debug) console.log('clear input callback');
            //this.inputVal = null;
            return;
        },
        setError: function(errMsg){
        },
        reload: function(val){
        }
    }
})


/*
            if(this.inputValFormatted){
                var arr;
                var yearI;
                var parseStr;
                var parseErr = false;

                // parse string
                if(this.inputValFormatted.indexOf('/') > -1){
                    parseStr = this.inputValFormatted;
                    arr = this.inputValFormatted.split('/');
                }
                else if(this.inputValFormatted.indexOf('-') > -1){
                    parseStr = this.inputValFormatted.replace('-', '/');
                    arr = this.inputValFormatted.split('-');
                }
                else{
                    parseErr = true;
                }
                // if month, date, and year are included
                if(arr.length == 3){
                    yearI = 2;
                }
                // if only month and year are included, automatically change to 1st of month
                else if(arr.length == 2){
                    yearI = 1;
                    parseStr = arr[0].toString + '/01/' + arr[1].toString;
                }
                else{
                    parseErr = true;
                }

                // 4 digit year
                if(arr[yearI].length == 4){
                    this.momentDate = moment(parseStr, 'MM/DD/YYYY');
                }
                // 2 digit year
                else if(arr[yearI].length == 2){
                    this.momentDate = moment(parseStr, 'MM/DD/YY');
                }
                // 1 digit year -> 2000s
                else if(arr[yearI].length == 1){
                    parseStr = parseStr.slice(0,parseStr.lastIndexOf('/')) + '0' + arr[yearI];
                    this.momentDate = moment(parseStr, 'MM/DD/YY');
                }
                else{
                    parseErr = true;
                }

                if (parseErr){
                    this.errMsg = "formatting error";
                    console.log(this.errMsg);
                    this.momentDate = null;
                    this.updateValue(null);
                    return;
                }
                else{
                    // set input value
                    this.updateValue(this.momentDate.format("YYYY-MM-DD"));
                }
            }
            else{
                this.momentDate = null;
                this.updateValue(null);
                return;
            }
*/

/*
        field:{
            type: Object,
            required: true
        },
        origField:{
            type: Object,
            required: false
        },
        valPropname:{
            type: String,
            default: 'value',
            required: false
        },
        idText:{
            type: String,
            required: false
        },
        idNum:{
            type: Number,
            required: false,
        },
        idPropname:{
            type: String,
            required: false
        },
        concatID:{
            type: Boolean,
            required: false,
            default: false
        },
        labelText:{
            type: String,
            required: false
        },
        labelPropname:{
            type: String,
            required: false
        },
        dataPortion:{
            type: String,
            required: false
        },




        origVal: function(){
            var self = this;
            if(this.origField && this.origField[self.valPropname]){
                return this.origField[self.valPropname];
            }
            else{
                return null;
            }
        },
        fieldVal: function(){
            var self = this;
            if(this.field && this.field[self.valPropname]){
                return this.field[self.valPropname];
            }
            else{
                return null;
            }
        },

        inputVal: function(){
            return this.fieldVal;
        },

        pickerVal: {
            get: function(){
                return this.fieldVal;
            },
            set: function(newValue){
                console.log("setter");
                this.updateValue(newValue);
            }
        },
*/