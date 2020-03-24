import {FirebaseAuth, FirebaseRef} from '../utils/FirebaseConfigurator'
import * as errorsFirebase from '../utils/FirebaseErrors'
import * as authFunctions from "./EmployerFunctions";
import * as constants from "../utils/Constants";
import * as utils from "../utils/Utils";

export function logout(callback) {
    return FirebaseAuth().signOut().then(callback);
}

export function loginEmployerUser (email, pw, successCallback, errorCallback) {
    if(!pw) {
        //Firebase it seems break if you don't put a psw (at least at the first time)
        const fakeObjError = [];
        fakeObjError.code = errorsFirebase.LOGIN_INVALID_PASSWORD;
        errorCallback(fakeObjError);
        return;
    }
    return FirebaseAuth().signInWithEmailAndPassword(email, pw).then(function(user){
        if(!user.user.emailVerified){
            errorCallback({code:errorsFirebase.LOGIN_USER_UNCONFIRMED})
        }else{
            successCallback(user)
        }
    }).catch((error)=> {
        if(errorCallback)errorCallback(error)
        utils.logError(error)
    });
}

export function createEmployerUser (email, pw, employer, successCallback, errorCallback) {
    if(!pw || !email) {
        //Firebase it seems break if you don't put a psw (at least at the first time)
        const fakeObjError = [];
        fakeObjError.code = errorsFirebase.LOGIN_INVALID_PASSWORD;
        errorCallback(fakeObjError);
        return;
    }

    FirebaseAuth().createUserWithEmailAndPassword(email, pw).then((createdUser)=>{
        if(createdUser && createdUser.user){
            createdUser.user.sendEmailVerification();
        }
        employer.uid = createdUser.user.uid;
        authFunctions.insertEmployer(employer,successCallback,errorCallback);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error)
        utils.logError(error)
    });
};

export function forgotPassword (email, successCallback, errorCallback){
    FirebaseAuth().sendPasswordResetEmail(email).then(()=>{
        successCallback()
    }).catch((error)=> {
        if(errorCallback)errorCallback(error)
        utils.logError(error)
    });
}

export function logoutEmployerUser (callback) {
    return FirebaseAuth().signOut().then(callback);
}