Vue.component('psofia-webservice-settings', {
    // declare the props
    props: {
        storeName:{ // formsList, recordsList
            type: String,
            required: true
        },
        formId: {
            type: Number,
            required: false
        }
    },
    template: `
        <v-dialog v-model="showDialog" max-width="600px" :persistent="hasChange">
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </template>
            <v-card>
                <v-tabs v-model="tab"
                    class="elevation-2" grow
                    background-color="primary" dark
                >
                    <v-tab href="#historical-search">Historical Search</v-tab>
                    <v-tab href="#other-options">Other Options</v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                    <v-tab-item value="historical-search">
                        <v-card flat>
                            <v-card-text>
                                <v-row dense v-if="isDev && debug">
                                    <v-col cols="12" sm="12">
                                        Date: {{printHS(historicalSearch.date)}}
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        Range: {{printHS(historicalSearch.range)}}
                                    </v-col>
                                    <v-col cols="12" sm="12">
                                        SELECTED: {{hsType}}: {{printHS(historicalSearch[hsType])}}
                                    </v-col>
                                    <v-col cols="12" sm="12" class="text-center">
                                        Primary Date Field: 
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on">{{hsDateText}}</span>
                                            </template>
                                            <span>{{hsDateTooltip}}</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12">
                                        <v-radio-group v-model="historicalSearch.columnName" row dense>
                                            <v-radio small v-if="primaryDate_HTMLID" label="Primary Date Field" :value="primaryDate_HTMLID"></v-radio>
                                            <v-radio small label="Date Submitted" value="OriginalSubmitDate"></v-radio>
                                            <v-radio small label="Date Edited" value="LastEditDate"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12">
                                        Get all records
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on">{{hsDateText}}</span>
                                            </template>
                                            <span>{{hsDateTooltip}}</span>
                                        </v-tooltip>{{ historicalSearch.isRange ? ' between:' : ':'}}
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" xs="12" sm="6" class="text-center">
                                        <v-menu v-model="historicalSearch.show"
                                            id="historicalSearch_dialog" ref="historicalSearch_dialog"
                                            :close-on-content-click="false"
                                            transition="scale-transition" min-width="290px" offset-y bottom offset-x right
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="hsText"
                                                    id="historicalSearch" ref="historicalSearch"
                                                    prepend-icon="mdi-calendar"
                                                    v-on="on" v-bind="attrs"
                                                    readonly
                                                    append-outer-icon="mdi-close" @click:append-outer="clearHS"
                                                ></v-text-field>
                                            </template>
                                            <v-card>
                                                <v-date-picker v-model="historicalSearch[hsType]"
                                                    id="historicalSearch_picker" ref="historicalSearch_picker"
                                                    :range="historicalSearch.isRange"
                                                    no-title scrollable color="primary"
                                                ></v-date-picker>
                                                <v-divider></v-divider>
                                                <v-card-actions>
                                                    <v-switch v-model="historicalSearch.isRange" label="Range" color="primary"></v-switch>
                                                    <v-spacer></v-spacer>
                                                    <v-btn text color="primary" @click="cancelHS">Cancel</v-btn>
                                                    <v-btn text color="primary" @click="saveHS">Save</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-menu> 
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item value="other-options">
                        <v-card flat>
                            <v-card-text>
                                <v-row dense>
                                    <v-col cols="12" sm="12">Number of records to return: </v-col>
                                    <v-col cols="12" xs="12" sm="6">
                                        <v-text-field type="number" v-model.number.lazy="returnCount" @blur="validateCount"
                                            :disabled="isHistoricalSearch"
                                            hint="500 max" step="10" max="500" min="10"
                                            :append-outer-icon="returnCount<500 ? 'mdi-arrow-up-bold-box' : 'mdi-arrow-down-bold-box'" @click:append-outer="returnCount<500 ? returnCount=500 : returnCount=50"
                                        ></v-text-field> <!--append-outer-icon="mdi-plus" @click:append-outer="incRetCount" prepend-icon="mdi-minus" @click:prepend="decRetCount"-->
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-checkbox v-model="keepInactive" :disabled="onlyInactive"
                                            label="Include deleted records"
                                        ></v-checkbox>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-checkbox v-model="onlyInactive" label="Get all deleted records"
                                    ></v-checkbox>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                
                </v-tabs-items>

                <v-divider></v-divider>
                <v-card-actions>
                    <span v-if="hasChange && hasInternet" class="caption">{{getRecordsStr}}</span>
                    <span v-if="!hasInternet" class="caption" color="red">No Internet Connection</span>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="showDialog = false">Cancel</v-btn>
                    <v-btn color="primary" text @click="saveWSProps" :disabled="!hasChange || !hasInternet">Get Records</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    `,
    data: function(){
        return{
            //isLoading: true,
            sharedState: store.state,
            
            showDialog: false,
            tab: 'historical-search',
            returnCount: 50,
            keepInactive: false,
            onlyInactive: false,
            historicalSearch:{
                show: false,
                columnName: 'OriginalSubmitDate',
                isRange: false,
                date: null,
                range: [],
                last:{
                    isRange: false,
                    date: null,
                    range: [],
                },
                isCancelled: false,
                isSaved: false,
            },

            debug: false,
        }
    },
    created: function(){
        if(this.debug) console.log("\t\tpsofia-webservice-settings - Created");
    },
    mounted: function(){
        var self = this;
        if(this.debug) console.log("\t\tpsofia-webservice-settings - Mounted");
        Vue.nextTick(function(){
            self.initialize();
        });
    },
    watch:{
        hsShow: function(newVal, oldVal){
            if(oldVal === false && newVal === true){
                if(this.debug) console.log('Show: HistoricalSearch: ' + this.hsType)
                this.historicalSearch.last.isRange = this.historicalSearch.isRange;
                this.historicalSearch.last.date = this.historicalSearch.date;
                this.historicalSearch.last.range = this.historicalSearch.range;

                this.historicalSearch.isCancelled = false;
                this.historicalSearch.isSaved = false;
            }
            if(oldVal === true && newVal === false){
                if(this.debug) console.log('Close: HistoricalSearch: ' + this.hsType);
                if(this.historicalSearch.isCancelled == false && this.historicalSearch.isSaved == false){
                    if(this.debug) console.log('HISTORICAL SEARCH CLOSED EXTERNALLY');
                    this.saveHS();
                }
            }
        },
        primaryDate_HTMLID: function(newVal, oldVal){
            // if historical search is currently using primary date field
            if(this.historicalSearch.columnName != 'OriginalSubmitDate' && this.historicalSearch.columnName != 'LastEditDate'){
                if(this.debug) console.log('Change Primary Date Field')
                if(newVal && newVal != oldVal){
                    if(this.historicalSearch.columnName != newVal) this.historicalSearch.columnName = newVal;
                }
                else if (!newVal && oldVal){
                    if(this.historicalSearch.columnName == oldVal) this.historicalSearch.columnName = 'OriginalSubmitDate';
                }
            }
        },
        hsType: function(newVal, oldVal){
            if(newVal != oldVal){
                if(this.debug) console.log('Switch: HistoricalSearch: ' + oldVal + ' -> ' + newVal);
                if(newVal == 'range'){
                    if(this.historicalSearch.range.length === 0 && this.historicalSearch.date !== null){
                        if(this.debug) console.log('carry over date -> range');
                        this.historicalSearch[newVal].push(this.historicalSearch[oldVal])
                    }
                }
                else{
                    if(this.historicalSearch.date === null && this.historicalSearch.range.length > 0){
                        if(this.debug) console.log('carry over range -> date');
                        this.historicalSearch[newVal] = this.historicalSearch[oldVal][0];
                    }
                }
            }
        },
        onlyInactive: function(newVal, oldVal){
            if(newVal){
                this.keepInactive = true;
                //this.returnCount = 500;
            }
            /*else if(oldVal === true && !newVal){
                if(this.wsProps.count) this.returnCount = this.wsProps.count;
                else this.returnCount = 50;
            }*/
        },
    },
    computed:{
        hasInternet: function(){ return this.sharedState.connections.isOnLine && !this.sharedState.connections.unsentReq; },
        userEmail: function(){ return this.sharedState.user.email; },
        isDev: function(){ return this.sharedState.user.isDev; },

        wsProps: function(){
            return store.getWSProps({storeName: this.storeName});
        },
        isHistoricalSearch: function(){
            if((!this.historicalSearch.isRange && this.historicalSearch.date) || (this.historicalSearch.isRange && this.historicalSearch.range && this.historicalSearch.range.length == 2)) return true;
            else return false;
        },
        isHS_incomplete: function(){
            if(this.historicalSearch.isRange && this.historicalSearch.range && this.historicalSearch.range.length < 2 ) return true;
            else return false;
        },
        hasChange: function(){
            var hasChange = false;

            if(this.isHistoricalSearch){
                if(!this.historicalSearch.isRange){
                    if(this.historicalSearch.date != this.wsProps.historicalSearch) hasChange = true;
                }
                else{
                    if(this.historicalSearch.range[0] != this.wsProps.historicalSearchStart) hasChange = true;
                    if(this.historicalSearch.range[1] != this.wsProps.historicalSearchEnd) hasChange = true;
                }
                if(this.historicalSearch.columnName != this.wsProps.historicalSearchColumn) hasChange = true;
            }
            else if(!this.isHS_incomplete && this.returnCount != this.wsProps.count) hasChange = true;
            
            if(this.keepInactive != this.wsProps.keepInactive) hasChange = true;
            if(this.onlyInactive != this.wsProps.onlyInactive) hasChange = true;

            return hasChange;
        },

        hsShow: function(){
            return this.historicalSearch.show;
        },
        hsType: function(){
            if(this.historicalSearch.isRange) return 'range';
            else return 'date';
        },
        hsLastType: function(){
            if(this.historicalSearch.last.isRange) return 'range';
            else return 'date';
        },
        hsText: function(){
            if(this.hsType == 'date'){
                if(this.historicalSearch.date) return getDateStr(this.historicalSearch.date, 'M/D/YY');
                else if(this.isDev && this.debug) return this.printHS(this.historicalSearch.date);
                else return this.historicalSearch.date;
            }
            else if(this.hsType == 'range'){
                if(this.historicalSearch.range && this.historicalSearch.range.length == 2) return getDateStr(this.historicalSearch.range[0], 'M/D/YY') + ' ~ ' + getDateStr(this.historicalSearch.range[1], 'M/D/YY');
                else if(this.historicalSearch.range && this.historicalSearch.range.length == 1) return getDateStr(this.historicalSearch.range[0], 'M/D/YY');
                else if(this.isDev && this.debug) return this.printHS(this.historicalSearch.range);
                else return this.historicalSearch.range.join(' ~ ');
            }
        },

        formFieldsPayload: function(){
            return {storeName: 'formFields', stateName: 'database'}
        },
        formFields: function(){
            return store.getDataObj(this.formFieldsPayload);
        },
        primaryDateField: function(){
            if(this.formFields){
                return this.formFields.find(function(field){
                    return field.PrimaryDateField.val == 1;
                });
            }
            else return null;
        },
        primaryDate_HTMLID: function(){
            if(this.primaryDateField){
                return this.primaryDateField.FieldHTMLID.displayVal;
            }
            else return null;
        },

        hsDateText: function(){
            if(this.historicalSearch.columnName != 'OriginalSubmitDate' && this.historicalSearch.columnName != 'LastEditDate') return 'with [' + this.primaryDateField.FieldName.displayVal + ']';
            else if(this.historicalSearch.columnName == 'OriginalSubmitDate') return 'submitted';
            else if(this.historicalSearch.columnName == 'LastEditDate') return 'edited';
        },
        hsDateTooltip: function(){
            if(this.historicalSearch.columnName != 'OriginalSubmitDate' && this.historicalSearch.columnName != 'LastEditDate') return 'FieldHTMLID: ' + this.primaryDate_HTMLID;
            else if(this.historicalSearch.columnName == 'OriginalSubmitDate') return 'OriginalSubmitDate';
            else if(this.historicalSearch.columnName == 'LastEditDate') return 'LastEditDate';
        },
        getRecordsStr: function(){
            var str = 'Get'
            if(this.isHistoricalSearch){
                if(this.historicalSearch.columnName != 'OriginalSubmitDate' && this.historicalSearch.columnName != 'LastEditDate') str += ' all records';
                else if(this.historicalSearch.columnName == 'OriginalSubmitDate') str += ' all records submitted';
                else if(this.historicalSearch.columnName == 'LastEditDate') str += ' all records edited';

                if(this.historicalSearch.isRange) str += ' between';
                else if(this.historicalSearch.columnName != 'OriginalSubmitDate' && this.historicalSearch.columnName != 'LastEditDate') str += ' for';
                str += ' ' + this.hsText;
            }
            else{
                if(this.returnCount === null) str += ' all records';
                else str += ' last ' + this.returnCount + ' records';
            }
            if(this.onlyInactive) str = str.replace('records','deleted records');
            else if(this.keepInactive) str += ' (include deleted)';
            return str;
        },
    },
    methods:{
        initialize: function(){
            if(this.debug) console.log("\t\tpsofia-webservice-settings - initialize");
            this.copyWSProps();
            if(this.primaryDate_HTMLID) this.historicalSearch.columnName = this.primaryDate_HTMLID;
        },
        copyWSProps: function(){
            if(this.wsProps.count) this.returnCount = this.wsProps.count;

            if(this.wsProps.historicalSearch){
                if(this.debug) console.log('initial set: date');
                this.historicalSearch.date = this.wsProps.historicalSearch;
            }
            else this.historicalSearch.date = null;

            if(this.wsProps.historicalSearchStart && this.wsProps.historicalSearchEnd){
                if(this.debug) console.log('initial set: range');
                this.historicalSearch.range.push(this.wsProps.historicalSearchStart);
                this.historicalSearch.range.push(this.wsProps.historicalSearchEnd);
            }
            else this.historicalSearch.range = [];
            
            this.keepInactive = this.wsProps.keepInactive;
            this.onlyInactive = this.wsProps.onlyInactive;
        },
        saveWSProps: function(){
            var self = this;
            var payload = {
                storeName: this.storeName,
                formID: null,
                count: null,
                date: null,
                start: null,
                end: null,
                column: null,
                keepInactive: false,
                onlyInactive: false,
            };
            if(this.debug) console.log('saveWSProps');

            if(this.isHistoricalSearch){
                if(!this.historicalSearch.isRange) payload.date = this.historicalSearch.date;
                else {
                    payload.start = this.historicalSearch.range[0];
                    payload.end = this.historicalSearch.range[1];
                }
                payload.column = this.historicalSearch.columnName;
            }
            else payload.count = this.returnCount;

            payload.formID = this.formId;
            payload.keepInactive = this.keepInactive;
            payload.onlyInactive = this.onlyInactive;

            if(this.debug) console.log(payload);
            store.setWSProps(payload);

            Vue.nextTick(function(){
                self.$emit('refresh-records');
                store.setLastChange(moment());
                if(self.showDialog) self.showDialog = false;
            });
        },

        saveHS: function(){
            var self = this;
            this.historicalSearch.isSaved = true;

            if(this.debug) console.log('Save HS: ' + this.printHS(this.historicalSearch[this.hsType]));
            if(this.debug && this.historicalSearch.isRange != this.historicalSearch.last.isRange) console.log('type changed')

            if(this.historicalSearch.isRange){
                if(this.historicalSearch.range && this.historicalSearch.range.length == 2){
                    if(this.historicalSearch.range[0] > this.historicalSearch.range[1]) this.historicalSearch.range.reverse();
                    else if(this.historicalSearch.range[0] == this.historicalSearch.range[1]){
                        this.historicalSearch.date = this.historicalSearch.range[0];
                        this.historicalSearch.isRange = false;
                    }
                    /*Vue.nextTick(function(){
                        store.setWSProps({start: self.historicalSearch.range[0], end: self.historicalSearch.range[1]});
                    });*/
                }
                else if(this.historicalSearch.range && this.historicalSearch.range.length == 1){
                    this.historicalSearch.date = this.historicalSearch.range[0];
                    this.historicalSearch.isRange = false;
                }
            }
            Vue.nextTick(function(){
                self.historicalSearch.show = false;
            });
        },
        cancelHS: function(){
            var self = this;
            this.historicalSearch.isCancelled = true;

            if(this.debug) console.log('Cancel HS: ' + this.printHS(this.historicalSearch[this.hsType]));
            
            if(this.historicalSearch.isRange != this.historicalSearch.last.isRange){
                if(this.debug) console.log('type changed');
                this.historicalSearch.isRange = this.historicalSearch.last.isRange
            }
            if(this.historicalSearch.date != this.historicalSearch.last.date){
                if(this.debug) console.log('set last date')
                this.historicalSearch.date = this.historicalSearch.last.date;
            }
            if(this.historicalSearch.range != this.historicalSearch.last.range){
                if(this.debug) console.log('set last range')
                this.historicalSearch.range = this.historicalSearch.last.range;
            }
            Vue.nextTick(function(){
                self.historicalSearch.show = false;
            });
        },
        clearHS: function(){
            var self = this;
            if(this.debug) console.log('Clear HS');
            this.historicalSearch.date = null;
            this.historicalSearch.range = [];
        },

        validateCount: function(){
            var defNum = 50;
            var inputVal = this.returnCount;
            if(this.wsProps.count) defNum = this.wsProps.count;

            if(this.returnCount){
                if(isNaN(this.returnCount)) this.returnCount = defNum;
                else{
                    if(this.returnCount % 1 != 0) this.returnCount = this.returnCount.toFixed(0);
                    if(this.returnCount <= 0) this.returnCount = 10;
                    else if(this.returnCount > 500) this.returnCount = 500;
                }
            }
            else this.returnCount = defNum;

        },

        printHS: function(value){
            if(value && value.constructor === Array && value.length === 0) return '[] empty array'
            else if(value === null) return 'null'
            else return value;
        },
        incRetCount: function(){
            this.returnCount = this.returnCount + 10;
        },
        decRetCount: function(){
            this.returnCount = this.returnCount - 10;
        },
    }
})