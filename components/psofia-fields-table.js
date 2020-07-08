Vue.component('psofia-fields-table', {
	// declare the props
	props: {
		stateName:{	
			type: String,
			required: false,
			default: 'form'
		},
		storeName: {
			type: String,
			required: false,
			default: 'formFields'
		},
		props:{	// formSectionID, formSubSectionID
			type: Object,
			required: true
		},
		parentShowInactive:{
			type: Boolean,
			required: false,
			default: false
		},
	},
	template: `
		<v-card class="mx-md-2 my-4">

			<v-toolbar flat dense>
				<v-toolbar-title class="body-2 grey--text">Fields</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon v-if="hasInactiveFields">
					<v-icon>mdi-dots-vertical</v-icon>
				</v-btn>
			</v-toolbar>

			<v-data-table
				:headers="tableHeaders"
				:items="orderedFields"
				:items-per-page="-1"
				item-key="FormFieldID"
				:loading="appLoading"
				disable-filtering
				disable-pagination
				disable-sort
				hide-default-header
				hide-default-footer
				class="elevation-1"
			>
				<template v-slot:header="{ props: { headers } }">
					<thead>
						<tr>
							<th v-for="header in tableHeaders">
								{{header.text}}
							</th>
							<th colspan="2" width="110px" class="moveHead">
								Move
							</th>
							<th width="20px">
								order
							</th>
						</tr>
					</thead>
				</template>

				<template v-slot:body="{items}">
					<tbody>
						<tr v-for="item in items" :key="item.FormFieldID">
							<td v-for="col in fieldsHeaders" @click.stop="openDialog(item)"
								class="openDialog" :key="col.ID">
								{{ item[col.ColumnName].displayVal }}
	                        </td>
							<td @click.stop="openDialog(item)"
								class="openDialog v-data-table__divider">
								<v-chip v-for="prop in getFieldProps(item)" :key="prop.ID"
									small>
									{{getPropText(item, prop)}}
								</v-chip>
								<v-chip v-if="showInactiveCalc && !(item.Active.val)"
									small>Inactive</v-chip>
							</td>
							<td v-if="item.isActive" @click.stop="moveFieldUp(item)"
								class="moveCol v-data-table__divider" width="50px">
								<v-icon>mdi-transfer-up</v-icon>
							</td>
							<td v-if="item.isActive" @click.stop="moveFieldDown(item)"
								class="moveCol v-data-table__divider" width="50px">
								<v-icon>mdi-transfer-down</v-icon>
							</td>
							<td>
								{{item[orderIdPropname].dbVal}}
							</td>
						</tr>
					</tbody>
				</template>

				<!--<template v-slot:expanded-item="{ headers, item }">
					<td><psofia-checkbox store-name="formData" val-propname="Required"></psofia-checkbox></td>
					<td><psofia-checkbox store-name="formData" val-propname="VisibleOnEdit"></psofia-checkbox></td>
					<td><psofia-checkbox store-name="formData" val-propname="Active"></psofia-checkbox></td>
				</template>-->

			</v-data-table>

			<psofia-field-dialog v-if="dialogId"
				:store-name="storeName" :store-id="dialogId" :props="props"
			></psofia-field-dialog>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="addNewField" text small color="primary">
					<v-icon left small>mdi-tray-plus</v-icon>Add Field
				</v-btn>
			</v-card-actions>
		</v-card>
	`,
	data: function(){
		return{
			isLoading: false,
			sharedState: store.state,
			showInactive: false,
			debug: true,
		}
	},
	created: function(){
		if(this.debug) console.log("\t\t\tBUILDER FORM FIELDS TABLE - Created");
	},
	mounted:function(){
		if(this.debug) console.log("\t\t\tBUILDER FORM FIELDS TABLE - Mounted");
	},
	watch: {
    },
	computed: {
		showInactiveCalc: function(){
			return this.parentShowInactive || this.showInactive;
		},
		
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
            return this.stateLoading || this.formLoading || this.dbLoading || this.colsLoading;
        },
        appLoading: function(){
            return this.storeLoading || this.isLoading;
        },

        payload: function(){
        	if (this.storeName && this.props) return {stateName: this.stateName, storeName: this.storeName, props: this.props, keepInactive: this.showInactiveCalc};
        },

        storeIdPropname: function(){
        	return store.getStoreTableID(this.payload);
        },
        orderIdPropname: function(){
			return store.getStoreOrderID(this.payload);
		},

        // fields in specified section
		filteredFields: function(){
			if (this.payload) return store.getArrDataObjs(this.payload);
		},

        hasInactiveFields: function(){
			if(this.payload) return store.checkFieldsInactive(this.payload);
		},
		// max order in section/subsection
		maxOrder: function(){
			if (this.payload) return store.getMaxOrder(this.payload);
		},
		// min order in section/subsection
		minOrder: function(){
			if (this.payload) return store.getMinOrder(this.payload);
		},


		orderedFields:function(){
			if(this.filteredFields){
				var orderPayload = Object.assign({}, this.payload, {arrDataObjs: this.filteredFields});
				return store.orderArrDataObjs(orderPayload);
			}
			/*var self = this;
			if(this.filteredFields){
				return this.filteredFields.sort(function(a, b){
					if(a[self.orderIdPropname].dbVal === null && b[self.orderIdPropname].dbVal === null){
						return a[self.storeIdPropname].dbVal - b[self.storeIdPropname].dbVal;
					}
					else if(a[self.orderIdPropname].dbVal === null){
						return 1;
					}
					else if(b[self.orderIdPropname].dbVal === null){
						return -1;
					}
					else return a[self.orderIdPropname].dbVal - b[self.orderIdPropname].dbVal;
				});
			}*/
		},

		fieldsColumns: function(){
			if(this.filteredFields) return store.getColumns(this.storeName);  
		},
		fieldsHeaders: function(){
            if(this.fieldsColumns){
            	return this.fieldsColumns.filter(function(c){
            		if (c.hasOwnProperty('IsTableHeader')){
	                    return c.IsTableHeader
	                }
	                else return true;
            	})
            }
		},
		tableHeaders: function(){
            if (this.fieldsHeaders) {
                var self = this;
                var cols = this.fieldsHeaders.map(function(column){
                    return {
                        text: column.ShortLabel,
                        value: column.ColumnName,
                        sortable: false
                    }
                }); 
                cols.push({
                    text: 'Properties',
                    value: 'Properties',
                    sortable: false,
                    divider: true
                })
                /*cols.push({
                    text: 'Move',
                    value: 'Move',
                    align: 'center',
                    width: '150px',
                    sortable: false
                })*/
                return cols;
            }
        },

        fieldsProps: function(){
        	if(this.fieldsColumns){
            	return this.fieldsColumns.filter(function(c){
	                return c.IsProp;
            	})
            }
        },

        dialogId: function(){
        	return this.sharedState.dialogSettings.id;
        }
	},
	methods: {
		initialize: function(){
			/* copied from Vuetify data-table w/ CRUD - needed to do here b/c defaults sent from server */
		},
		getFieldProps: function(field){
			return this.fieldsProps.filter(function(col){
				if (!col.Hidden){
					if (field[col.ColumnName].val) return true;
					else return false;
					// should be val but in the process of fixing/changing it
				}
				else {
					if (field[col.ColumnName].val) return true;
					else return false;
				}
			});
		},
		getPropText: function(field, prop){
			var str = prop.ShortLabel;
			var val = '';
			if(str.indexOf('{{val}}') != -1){
				val = field[prop.ColumnName].displayVal
				str = str.replace('{{val}}', val)
			}
			return str;
		},
		openDialog: function(field, isNew){
			var fieldID = field[this.storeIdPropname];
			var _isNew = isNew;
			if(!(_isNew)) _isNew = false;
			store.setDialog({isOpen: true, isNew: _isNew, storeName: this.storeName, id: fieldID})
			//this.editFieldID = field[this.storeIdPropname];
			//this.showEditDialog = true;
		},
		moveFieldUp: function(field){
			console.log("move up " + field.HTMLID + ': ' + field[orderIdPropname].dbVal)
			//if(field.)
		},
		moveFieldDown: function(field){
			console.log("move down " + field.HTMLID + ': ' + field[orderIdPropname].dbVal)
			//newOrder = field.order
		},
		addNewField: function(){
			var self = this;
			var newPayload = Object.assign({}, self.payload, {stateName: 'dialog', order: (self.maxOrder + 1)});
			console.log(newPayload);
			var newObj = store.addDataObj(newPayload);
			console.log(newObj);
			this.openDialog(newObj, true);
		},
	}
})



        /*sec_storeIdPropname: function(){
        	return store.getStoreTableID({storeName: "formSections"});
        },
        subSec_storeIdPropname: function(){
        	return store.getStoreTableID({storeName: "formSubSections"});
        },*/

        /*propsKeys: function(){
        	return Object.keys(this.props);
        },*/

        /* filteredFields_All
        	var self = this;
			var fields = [];
			var compareProps = Object.keys(this.props);

            if(this.allFields.length > 0 && this.propsKeys){
                fields = this.allFields.filter(function(field){
                    return (field[self.sec_storeIdPropname].val == self.sectionFilter) //&& field[self.subSec_storeIdPropname].val == self.subSectionFilter)
                });
            }
            return fields;*/
        /* filteredFields
        	var self = this;
			var fields = [];

            if(this.filteredFields_All.length > 0){
            	if(!this.showInactive){
	                fields = this.filteredFields_All.filter(function(field){
	                    if(field.hasOwnProperty('Active')){
	                        return field.Active.val                
	                    }
	                    return true;
	                })
	            }
	            else{
	            	fields = this.filteredFields;
	            }
            }
            return fields;*/


        /*allSections:function(){
			return this.sharedState.sections;
		},
		allSubSections:function(){
			return this.sharedState.subSections;
		},
		allFieldTypes:function(){
			return this.sharedState.fieldTypes;
		},
		allValidationSets:function(){
			return this.sharedState.validationSets;
		},*/

		/*defaultField:function(){
			return this.sharedState.default.field;
		},*/

		/*sectionFields:function(){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID
				return (f.FormSubSectionID == null);
			});
		},*/
		/*orderedSubSections:function(){
			return this.subSections.sort(function(a, b){
				return a.SubSectionOrder - b.SubSectionOrder;
			});
		},*/

		/*sectionID:function(){
			return this.section.SectionID;
		},
		sectionTitle: function(){
			var vm = this;
			var s = this.allSections.find(function(sF){
				// DON'T COMPARE TO FormSectionID
				return vm.section.SectionID == sF.SectionID;
			});
			if(s){
				return s.SectionTitle;
			}
// AUTOCOMPLETE - where is update/set? 
			else{
				return "ERROR?";
			}
		},*/


				/*getSubSectionFields: function(sub){
			return this.fields.filter(function(f){
				// IS NOT SubSectionID?
				return f.FormSubSectionID == sub.FormSubSectionID;
			});
		},*/

		/*getFieldType:function(field){
			var ft = this.allFieldTypes.find(function(f){
				return f.FieldTypeID == field.FieldTypeID;
			})
			if(ft){
				return ft.FieldType;
			}
			else{
				return '';
			}
		},*/

		/*editField: function(field){
			var self = this;
			console.log(field);
			eventHub.$emit('open-edit-dialog-full', {sectionID: self.section.SectionID, fieldID: field.FormFieldID});
		},
		moveFieldUp: function(field){
			eventHub.$emit('move-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID, type: 'up'});
		},
		moveFieldDown: function(field){
			eventHub.$emit('move-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID, type: 'down'});
		},
		deleteField: function(field){
			eventHub.$emit('delete-field', {formSectionID: this.section.FormSectionID, fieldID: field.FormFieldID});
		}*/