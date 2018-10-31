Vue.component('builder-date-picker-v', {
    // declare the props
    props: {
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
        inputDisabled:{
            type: Boolean,
            required: false,
            default: false
        },
        inputClearable:{
            type: Boolean,
            required: false,
            default: true
        },
        dataPortion:{
            type: String,
            required: false
        },
        allowRange:{
            type: Boolean,
            required: false,
            default: false
        }
    },
    template: `
        <div>
        <v-text-field
            :id="inputID"
            :ref="inputID"
            \
            v-model="inputValFormatted"
            @blur="updateFormatted"
            @change="changeValue"
            @update:error="updateErr"
            \
            :label="inputLabel"
            :background-color="inputColor"
            :disabled="inputDisabled"
            :clearable="inputClearable"
            @click:clear="clearInput"
            @click:prepend="menuVal = true"
            @focus="selectAll"
            @click.right="logValue"
            \
            hint="MM/DD/YYYY format"
            persistent-hint
            :messages="msg"\
            :rules="[]"\
            \
            prepend-icon="event"
        ></v-text-field>
        \
        <v-menu
            :id="menuID"
            :ref="menuID"
            v-model="menuVal"
            \
            :activator="inputSelectorStr"
            :close-on-content-click="false"
            :return-value.sync="pickerVal"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
        >
            <v-date-picker
                v-model="pickerVal"
                v-on:input="savePicker"
                no-title
                scrollable
            >
                <v-spacer></v-spacer>
            </v-date-picker>
        </v-menu>
        </div>
    `,
    //                <!--title-date-format="pickerTitle"
//                :multiple="allowRange"-->
//                <v-btn flat color="primary" @click="menuVal = false">Cancel</v-btn>
    //            <v-btn flat color="primary" @click="savePicker">OK</v-btn>
    data: function(){
        return{
            //_field: this.field,
            //_origField: this.origField,
            menuVal: false,
            inputValFormatted: null,
            momentDate: null,
            valNotes: '',
            hasError: false,
            errMsg: ''
        }
    },
    created: function(){
    },
    mounted: function(){
    },
    watch:{
        inputVal: {
            handler(newVal, oldVal){
                var self = this;
                if(newVal){
                    this.momentDate = moment(newVal);
                    this.inputValFormatted = this.momentDate.format('MM/DD/YY');
                }
                else{
                    this.momentDate = null;
                    this.inputValFormatted = null;
                }
            }, deep: true
        }
    },
    computed:{
        inputID: function(){
            var self = this;

            var id = '';
            if(this.concatID){
                if(this.idText != null && this.idNum == null && this.idPropname == null){
                    id += this.idText;
                }
                if(this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
                    id += this.field[self.idPropname].toString();
                }
                if(this.idNum != null){
                    id += '_' + this.idNum.toString();
                }
            }
            else{
                if(this.idText != null){
                    id = this.idText;
                }
                else if(this.idPropname != null && this.field.hasOwnProperty(self.idPropname)){
                    id = this.field[self.idPropname].toString();
                }
            }

            if(id.length > 0){
                return id;
            }
            else{
                return null;
            }
        },
        inputSelectorStr: function(){
            if(this.inputID){
                return '#' + this.inputID.toString();
            }
            else{
                return undefined;
            }
        },
        menuID: function(){
            if(this.inputID){
                return 'dateM' + this.inputID.toString();
            }
            else{
                return 'dateMenu';
            }
        },
        inputLabel: function(){
            var self = this;
            if(this.labelText != null){
                return this.labelText;
            }
            else if(this.labelPropname != null && this.field.hasOwnProperty(self.labelPropname)){
                return this.field[self.labelPropname];
            }
            else{
                return null;
            }
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
        wasChanged: function(){
            // both null or is equal for false
            if( (!(this.origVal) && !(this.inputVal)) || (this.origVal == this.inputVal)){
                return false;
            }
            else{
                return true;
            }
        },
        inputColor: function(){
            if(this.wasChanged){
                return 'green';
            }
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
            " - original: " + this.valToText(this.origVal) + "\n" + 
            " - current: " + this.valToText(this.inputVal) + "\n" +
            " - field: " + this.valToText(this.fieldVal);
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
        savePicker: function(){
            var self = this;
            console.log(this.$refs[self.menuID]);
            console.log(self.inputVal);
            console.log(self.pickerVal);
            this.$refs[self.menuID].save(self.pickerVal);
            //this.updateValue(self.inuptVal);
        },
        //@blur (string)
        updateFormatted: function(){
            var self = this;
            console.log(this.inputValFormatted);
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

            switch(this.dataPortion){
                case 'form-data':
                    eventHub.$emit('update-form-data', {valPropname: self.valPropname, val: formattedValue});
                break;
                case 'section':
                    eventHub.$emit('update-section-data', {formSectionID: self.field.FormSectionID, valPropname: self.valPropname, val: formattedValue});
                break;
                case 'search':
                    eventHub.$emit('update-search-data', {valPropname: self.valPropname, val: formattedValue})
                default:
                    eventHub.$emit('update-field', {fieldID: self.field.FieldId, valPropname: self.valPropname, val: formattedValue});
            }
        },
        valToText: function(oVal){
            var val = oVal;
            if(val){
                return val.toString();
            }
            else if(val == ''){
                return 'blank';
            }
            else{
                return 'null';
            }
        },
        logValue: function(){
            console.log(this.logMsg);
        },
        // @change (string)
        changeValue: function(newValue){
            console.log("text " + this.inputID + " @change " + newValue);
        },
        // @update:error (boolean)
        updateErr: function(newValue){
            console.log("text " + this.inputID + " @update:error " + newValue);
        },
        selectAll: function (event) {
            // Workaround for Safari bug
            // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
            /*setTimeout(function () {
                event.target.select()
            }, 0)*/
        },
        clearInput: function(){
            console.log('clear input callback');
            //this.inputVal = null;
            return;
        },
        setError: function(errMsg){
        },
        reload: function(val){
        }
    }
})