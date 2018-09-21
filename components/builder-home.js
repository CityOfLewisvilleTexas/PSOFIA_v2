var BuilderHome = {
    template: '<div>home</div>',
    data: function(){
        return{
            //list vars
            /* copied from Vuetify for data-table w/ CRUD */
            isLoading: false,
            formHeaders: [
                {text: 'Field Name', sortable: false},
                {text: 'HTML ID', sortable: false},
                {text: 'Field Type', sortable: false},
                {text: 'Properties', sortable: false}
            ]
        }
    },
    ready: function(){
        this.initialize(); // idk why not done in ready?
    },
    methods: {
        getAllForms: function(){
            var self = this;
            this.isLoading = true;
            $.post('https://query.cityoflewisville.com/v2/',{
                webservice : 'PSOFIAv2/Get All Forms'
            },
            function(data){
                self.forms = data.Forms
            })
            .fail(function(data){
                console.log('Webservice Fail: Get All Forms');
                self.isLoading = false;
            });
        }
    }
}