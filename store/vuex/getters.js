 export default {
    /* GENERAL ROUTE */
        routeState: (state) => { return state[state.routeComponent]; },
        routeStore: (state, getters) => (storeName) => { return getters.routeState[storeName]; },
    /* APP SETTINGS */
        nightView: (state) => { return state.appSettings.nightView; },
        connection_checktime: (state) => (connName) => { return state.appSettings.connections[connName + 'Checktime']; },
        hasInternet: (state) => { return state.appSettings.connections.isOnLine && !state.appSettings.connections.unsentReq; },
        user_loadDate: (state) => (authType) => { return state.appSettings.user[authType].loadDate; },
        user_isLoading: (state) => (authType) => { return state.appSettings.user[authType].isLoading },
        userLoading: (state) => { return getters.user_isLoading('token') || getters.user_isLoading('email') || getters.user_isLoading('adAccount'); },
        user_token: (state, getters) => { return state.appSettings.user.token.val; },
        user_email: (state, getters) => { return state.appSettings.user.email.val; },
        emailShort: (state, getters) => {
            if(!getters.user_isLoading('adAccount')){
                if(getters.user_email) return getters.user_email.substring(0, getters.user_email.indexOf('@'));
            } else return '';
        },
        user_firstName: (state, getters) => { return state.appSettings.user.adAccount.firstName; },
        user_lastName: (state, getters) => { return state.appSettings.user.adAccount.lastName; },
        user_username: (state, getters) => { return state.appSettings.user.adAccount.username; },
        user_inITS: (state, getters) => { return state.appSettings.user.adAccount.inITS; },
        isDev: (state, getters) => { if(!getters.user_isLoading('adAccount')) return getters.user_inITS; }, 
        displayUser: (state, getters) => {
            if(!getters.userLoading){
                if(getters.user_firstName) return getters.user_firstName;
                else if(getters.user_username) return getters.user_username;
                else return getters.emailShort;
            } else return '';
        },

    /* WS PROPS */
        wsProps: (state, getters) => { return getters.routeState.props.wsProps; },
        currentWSProps: (state, getters) => { return getters.routeState.props.currentWSProps; },
        wsPropsHasChange: (state, getters) => (payload) => {
            var wsProps = getters.wsProps(payload);
            var currentWSProps = getters.currentWSProps(payload);
            var keys1, keys2; 
            if(wsProps && currentWSProps){
                keys1 = Object.keys(wsProps);
                keys2 = Object.keys(currentWSProps);
                if(keys1.length !== keys2.length) return true;
                keys1.forEach(function(key, index){
                    if(wsProps[key] !== currentWSProps[key]) return true;
                })
            } else if(state.errDebug) console.error("ERROR: wsPropsHasChange:\t\tpayload - " + JSON.stringify(payload));
            return false;
        },
    /* TABLE SETTINGS */
        tableSettings: (state, getters) => { return getters.routeState.props.tableSettings; },
}