import createPersistedState from 'vuex-persistedstate'
import {createStore} from "vuex";
import http from "@/utils/http-common";
// import axios from "@/utils/bearer";
import * as pService from '@/utils/pService.js'
import vueConfig from '../../vue.config'
import axios from 'axios'
var BASE_URL = vueConfig.devServer.proxy['/blocket'].target + "/api"
var USER_URL = BASE_URL + "/recruit/users"


export default createStore({
    state: {
        user: {
            check: null,
            userId: 0,
            userEmail: null,
            username: null,
            userbelong: null,
            userbrn: null,
            userphone : null,
            type:0,
            walletAddress: null,
            accessToken: null,
            show: true,
            personalInfoId: 0,
        },
        file:{},
        verifications:{},
    },
    mutations: {
        setUserId(state, id) {
            state.user.userId = id
        },
        setUserEmail(state, userEmail) {
            state.user.userEmail = userEmail
        },
        setUserType(state, type) {
            state.user.type = type
        },
        setWalletAddress(state, address) {
            state.user.walletAddress = address
        },
        logout(state) {
            state.user.userId = 0
            state.user.personalInfoId = 0
            state.user.walletAddress = null
            state.user.show = true
        },
        login(state, payload) {
            state.user.accessToken = payload.accessToken;
            state.user.show = false;
            state.user.type=payload.type;
        },
        userinfo(state, payload) {
            console.log(payload.name);
            state.user.username = payload.name;
            state.user.userbelong = payload.belong;
            state.user.userbrn = payload.brn;
            state.user.userphone = payload.phoneNumber;
        },
        setPersonalInfoId(state, payload) {
            state.user.personalInfoId = payload
        },

        check(state, payload) {
            state.user.check = payload;
        },
        
        setFile(state,payload){
            state.file = payload;
        },
        setVerifications(state,payload){
            state.verifications = payload;
        },
        setFileVerified(state,payload){
            state.file.currentStatus = payload.currentStatus;
            state.file.reasonsRejection = payload.reasonsRejection;
        },
    },
    actions: {
        setUserEmail({ commit }, payload){
            console.log("actions.js?????? setUserEmail ??????")
            commit("setUserEmail", payload)
        },

        saveWalletInDB({
            state
        }, payload) {
            console.log(state)
            console.log(payload)
        },
        login(context, { email, password }) {
            console.log("?????????");
            http
                .post("/api/recruit/users/login", {
                    email: email,
                    password: password
                })
                .then(({data}) => {
                    console.log(data);
                    localStorage.setItem("accessToken", data.accessToken);

                    if (data.statusCode == 404) {
                        alert("????????? ?????? ??????????????? ???????????? ????????????.");
                    } else {
                        // vuex ????????? user ????????? ??????
                        context.commit("setUserEmail", email)
                        // vuex??? ??? ???????????????..?
                        context.commit("login", data);
                        pService.checkLogin();
                    }
                })
                .catch((error) => {
                    alert("????????? ??????");
                    console.dir(error);
                });
        },
        logout(context) {
            console.log("????????????");
            context.commit("logout");
        },
        checkEmail(context, {email}) {
            console.log("???????????? : " + email);
            console.log(context);
            http
                .get("/api/recruit/users/" + email, {email: email})
                .then(({data}) => {
                    console.log("?????????" + data.message)
                    if (data.statusCode == 200) {
                        return data.statusCode;
                    } else if(data.statusCode == 409) {
                        return data.statusCode;
                    }
                }).then( data  => {
                    console.log(data);
                    context.commit("check",data)
                })
        },
        userCheck(context) {
            axios.get(USER_URL + "/me", {
                headers: {
                    Authorization: "Bearer " + this.state.user.accessToken
                }
            }).then(({data}) => {
                context.commit("userinfo", data);
                

            })
        },
        modify(context, data) {
            console.log("?????? ?????????" + context);
            console.log("?????? :  " + this.state.user.accessToken);
            axios.patch(USER_URL + "/me", {
                headers: {
                    Authorization: "Bearer " + this.state.user.accessToken
                }
            },data)
                // const url = USER_URL + "/me";
                // const headers = {
                //     Authorization: "Bearer " + localStorage.getItem("accessToken"),
                // }
                // return axios.patch(url, { headers }, data,)
                //     .then((res) => {
                //     if(res.data.statusCode==200){
                //         console.log(res.data);
                //         // alert(res.data.message);
                //     }   
                // }).catch((err)=>{
                //     //  alert(err.data.message);
                //     // alert(err);
                //     console.log(err);
                // });
            
        },
    getFileInfo(context,payload){
                console.log(payload);
            if(localStorage.getItem("accessToken")){
                const url = "/api/recruit/Gallery/galleryDetail/";
                return http.get(url+payload.fileId).then((res)=>{
                    console.log(res.data);
                    context.commit("setFile",res.data)
                })
            }
        },
        patchVerification(context,payload){
            console.log(payload);
            if(localStorage.getItem("accessToken")){
                const url = "/api/recruit/verification";
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                };
                return http.patch(url,payload,{headers}).then((res)=>{
                    if(res.data.statusCode==200){
                        console.log(res.data);
                        context.commit("setFileVerified",res.data);

                        
                    }
                }).catch((err)=>{
                    
                    
                    
                    console.log(err);
                });
            }
        },
        async getVerifications(context,payload){
            let result="";
            if(localStorage.getItem("accessToken")){
                const url = "/api/recruit/verification/list";
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                };
                await http.post(url,payload,{headers}).then((res)=>{
            
                        console.log(res.data.verificationList);
                        context.commit("setVerifications",res.data.verificationList);
                        result = res.data;
                }).catch((err)=>{
                     console.log(err);
                });
            }
            return result;
        }
    },
    getters: {
        user(state){
            return state.user;
        },
        file(state){
            return state.file;
        },
        verifications(state){
            return state.verifications;
        },
    },
    modules: {},
    plugins: [ createPersistedState() ],
});
