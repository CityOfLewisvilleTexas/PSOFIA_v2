Vue.component('psofia-autocomplete-dialog', {
	// declare the props
	props: {
		searchText:{
			type: String,
			required: false
		},
		vsOptions:{
			type: [Object, Array],
			required: false
		},
		showDialog:{
			// probably will  modify this for ease, really should just be in dialog comp but input comp needs to call it on click
			type: Boolean,
			required: false,
			default: false
		}
	},
	template: `
		<v-dialog
			v-bind:value="showDialog"
			v-on:input="changeDialog"
			>
			<v-card>
		        <v-card-title>
					<span class="headline">Departments</span>
		        </v-card-title>

				<v-card-text>
					<v-layout wrap>
						<v-flex xs12>
							<v-text-field
								v-model="filterStr">
								append-outer-icon="send"
								@click:append-outer="addDept"
							></v-text-field>
						</v-flex>

						<v-list subheader>
							<v-subheader>Matches</v-subheader>
							<v-list-tile
								v-for="item in sortMatches"
								:key="item.DepartmentID"
								@click="chooseDept(item)"
							>
					        	<v-list-tile-content>
					              <v-list-tile-title v-text="item.Department"></v-list-tile-title>
					            </v-list-tile-content>
					        </v-list-tile>
					        <v-subheader>Other</v-subheader>
					        <v-list-tile
								v-for="item in sortOther"
								:key="item.DepartmentID"
								@click="chooseDept(item)"
							>
					        	<v-list-tile-content>
					              <v-list-tile-title v-text="item.Department"></v-list-tile-title>
					            </v-list-tile-content>
					        </v-list-tile>
				    	</v-list>
					</v-layout>
				</v-card-text>
			</v-card>
		</v-dialog>
	`,
	data: function(){
		return{
			sharedState: store.state,
			isLoading: true,
			inputValObj: {},
			inputItem: {},
			searchText: null,
			showDialog: false,
			valNotes: '',
			hasError: false,
			errMsg: '',
			debug: true,
		}
	},
	created: function(){
		//nada
	},
	mounted: function(){
		//this.origVal = this.inputVal;
	},
	watch:{
		departments: function(newVal, oldVal){
			if(newVal && this.allDepartments.length == 0){
				this.allDepartments = clone(newVal);
			}
		},
		searchText: function(newVal, oldVal){
			if(newVal && this.filterStr == ''){
				this.filterStr = newVal;
			}
		}
	},
	computed:{
		filterArr: function(){
			if(this.filterStr.indexOf(" ") > -1){
				return this.filterStr.split(" ");
			}
			else{
				return [];
			}
		},
		filterDepartments: function(){
			var self = this;
			return this.allDepartments.map(function(dept){
				var d = {
					DepartmentID : dept.DepartmentID,
					Department : dept.Department,
					matchStr: false,
					matchSplit: false,
					matchOrder: -1,
					matches: []
				}
				// match whole
				var i = dept.Department.toLowerCase().indexOf(self.filterStr.toLowerCase());
				if (i > -1){
					d.matchStr = true;
					d.matchOrder = i;
					d.matches.push({
						index: i,
						str: self.filterStr
					});
				}
				else if(self.filterArr.length > 0){
					self.filterArr.forEach(function(fstr){
						var i2 = dept.Department.toLowerCase().indexOf(fstr);
						if(i2 > -1){
							d.matchSplit = true;
							if(d.matchOrder == -1 || i2 < d.matchOrder){
								d.matchOrder = i2;
							}
							d.matches.push({
								index: i2,
								str: fstr
							})
						}
					});
				}
				return d;
				
			});
		},
		sortMatches: function(){
			return this.filterDepartments.filter(function(dept){
				return dept.matchStr || dept.matchSplit;
			}).sort(function(a, b){
				if(a.matchStr && !(b.matchStr)){
					return -1;
				}
				if(b.matchStr && !(a.matchStr)){
					return 1;
				}
				if(a.matchSplit && !(b.matchSplit)){
					return -1;
				}
				if(b.matchSplit && !(a.matchSplit)){
					return 1;
				}
				if(a.matches.length > b.matches.length){
					return -1;
				}
				if(a.matches.length < b.matches.length){
					return 1;
				}
				if(a.matchOrder > b.matchOrder){
					return -1;
				}
				if(a.matchOrder < b.matchOrder){
					return 1;
				}
				if(a.Department < b.Department){
					return -1
				}
				if(a.Department > b.Department){
					return 1
				}
			});
		},
		sortOther: function(){
			return this.filterDepartments.filter(function(dept){
				return !(dept.matchStr) && !(dept.matchSplit);
			}).sort(function(a,b){
				if(a.Department < b.Department){
					return -1
				}
				if(a.Department > b.Department){
					return 1
				}
			});
		}
	},
	methods:{
		addDept: function(){
			var self = this;
			console.log('addDept');
			if(self.filterStr.length > 0){
				$.post('https://query.cityoflewisville.com/v2/',{
					webservice : 'PSOFIAv2/Add New Department',
					dept: self.filterStr
				},
				function(data){
					if(data.length == 1){
						if(data[0].SuccessMessage){
							self.msg = data[0].SuccessMessage;
							self.selectDept(data[0]);
							eventHub.$emit('send-toast', {msg: self.msg, type:'info'});
						}
						else if(data[0].WarningMessage){
							self.msg = data[0].WarningMessage;
							self.selectDept(data[0]);
							eventHub.$emit('send-toast', {msg: self.msg, type:'warning'});
						}
						else if(data[0].ErrorMessage){
							self.errMsg = data[0].ErrorMessage;
							eventHub.$emit('send-toast', {msg: self.errMsg, type:'error'});
						}
					}
					else{
						self.errMsg = 'PROBLEM: Webservice: Add Dept: extra data received';
						console.log(self.errMsg);
						eventHub.$emit('send-toast', {msg: self.errMsg, type:'error'});
					}
				})
				.fail(function(data){
					self.errMsg = 'Webservice fail: Add Dept';
					console.log('self.errMsg');
					eventHub.$emit('send-toast', {msg: self.errMsg, type:'error'});
				});
	        }
		},
		chooseDept: function(item){
			console.log(item);
			this.selectDept(item);
		},
		selectDept: function(item){
			console.log('selectDept');
			eventHub.$emit('update-form-data', {valPropname: 'DepartmentID', val: item['DepartmentID'], textPropname: 'Department', text: item['Department']});
			this.closeDialog();
		},
		changeDialog: function(newValue){
			if(!(newValue) && this.showDialog){
				this.closeDialog();
			}
		},
		closeDialog: function(){
			eventHub.$emit('close-dialog',{valPropname:'DepartmentID'});
		}
	}
})