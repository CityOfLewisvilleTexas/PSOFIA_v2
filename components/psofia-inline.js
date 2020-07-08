Vue.component('psofia-inline', {
	props: {
		stateName:{
			type: String,
			required: false,
			default: 'form'
		},
		storeName:{	// formData, sections, subSections, fields, etc
			type: String,
			required: true
		},
		storeId:{	// formFieldID, formSectionID, formSubSectionID, etc
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
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<v-row>
			<v-col cols="12" xs="12" sm="6" md="4" lg="3"
				v-for="(field, index) in ckboxFields" :key="index">
				<psofia-checkbox
					:store-name="storeName" :val-propname="field" :store-id="storeId">
				</psofia-checkbox>
			</v-col>
		</v-row>
	`,
	//<v-col cols="12" xs="12 :sm="fieldSize.sm" :md="fieldSize.md" :lg="fieldSize.lg"
	data: function(){
		return{
			isLoading: true,
            sharedState: store.state,
            inputValObj: {},
			inputVal: '',
			hasError: false,
			errMsg: '',
            debug: true,
            fieldSize: {
            	xs: 12,
            	sm: 6,
            	md: 4,
            	lg: 3,
            },
		}
	},

	created: function(){
		 //this.initialize();
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
					if(this.debug) console.log('watch field obj - reload input: ' + this.valPropname);
					this.loadInput();
				}
			},
			deep: true
		}
	},
	computed:{
		stateLoading: function(){
            return this.sharedState.isLoading;
        },
        colsLoading: function(){
            return this.sharedState.columns.isLoading;
        },
        formLoading: function(){
            return this.sharedState.form.isLoading;
        },
        dbLoading: function(){
            return this.sharedState.database.isLoading;
        },
        storeLoading: function(){
            return this.stateLoading || this.colsLoading || this.formLoading || this.dbLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

        compError: function(){
			if((this.storeName !== 'formData' || this.storeName !== 'formRecord') && !(this.storeId)){
				return true;
			}
			else return false;
		},
        storeIdPropname: function(){
			return this.sharedState.tableIDs[this.storeName];
		},
        payload: function(){
        	//var self = this;
			if(!(this.storeId)) return {storeName: this.storeName, propname: this.valPropname};
			else return {storeName: this.storeName, id: this.storeId, idPropname: this.storeIdPropname, propname: this.valPropname};
		},
        valObj: function(){
        	var self = this;
			return store.getDataObj(self.payload);
        },
        ckboxFields: function(){
            var self = this;
            if(this.valObj){
                return Object.keys(self.valObj).filter(function(field){
                    return (self.valObj[field].isInput  && !(self.valObj[field].isHidden) && (self.valObj[field].valType === 'boolean'));
                });
            }
        },
	},
	methods:{
	},
})