import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    state () { return { 
        fullName: "Гость", 
        adminRoot: false,
        balance: 0,
        stocks: {}, 
        id: -1
    }},
    getters: {
        getFullName(state){ return state.fullName;},
        getAdminRoot(state){ return state.adminRoot;},
        getBalance(state){ return state.balance;},
        getStocks(state){ return state.stocks;},
        getId(state){ return state.id;} 


    },
    mutations: {
        SET_NAME (state, payload) {
            state.fullName = payload; 
        },
        SET_ROOT (state, payload) {
            state.adminRoot = payload;
        }, 
        SET_BALANCE (state, payload) {
            state.balance = payload;
        },
        SET_STOCKS (state, payload) {
            state.stocks = payload;
        },
        SET_ID (state, payload) {
            state.id = payload;
        }
    },
    plugins: [createPersistedState()]
})

export default store;