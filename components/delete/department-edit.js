Vue.component('department-edit', {
	// declare the props
	props: {
		searchText:{
			type: String,
			required: false
		},
		departments:{
			type: [Object, Array],
			required: false
		},
	},
	template: `
		<v-card>
	        <v-card-title>
				<span class="headline">Departments</span>
	        </v-card-title>

			<v-card-text>
				<v-layout wrap>
					<v-flex xs12>
						<v-text-field v-model="filterStr">
						</v-text-field>
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
	`,
	data: function(){
		return{
			//inputVal: '',
			filterStr: '',
			allDepartments: [],
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
				this.allDepartments = newVal;
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
		filterDepartments:function(){
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
				var i = dept.Department.toLowerCase().indexOf(self.filterStr);
				if (i > 0){
					d.matchStr = true;
					d.matchOrder = i;
					matches.push({
						index: i,
						str: self.filterStr
					})
				}
				else if(self.filterArr.length > 0){
					self.filterArr.forEach(function(fstr){
						var i2 = dept.Department.toLowerCase().indexOf(fstr);
						if(i2 > 0){
							d.matchSplit = true;
							if(d.matchOrder == -1 || i2 < d.matchOrder){
								d.matchOrder = i2;
							}
							matches.push({
								index: i2,
								str: fstr
							})
						}
					});
				}
				
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
	}
}