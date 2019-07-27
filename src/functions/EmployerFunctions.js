import {FirebaseRef, FirebaseFunctionsRef, FirebaseAuth} from '../utils/FirebaseConfigurator';
import * as tables from "../utils/FirebaseTables";
import * as constants from "../utils/Constants";
import * as authFunctions from "./Auth";
import * as errorsFirebase from "../utils/FirebaseErrors";
import * as strings from "../utils/Strings";
import * as utils from "../utils/Utils";

export function insertEmployer(employer, successCallback, errorCallback){
    FirebaseRef.collection(tables.TABLE_USERS).doc(employer.uid).set( employer ).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function getEmployer(id, successCallback, errorCallback){
    FirebaseRef.collection(tables.TABLE_USERS).doc(id).get().then((doc) => {
        if (doc.exists) {
            successCallback(doc.data());
        } else {
            errorCallback();
        }
    }).catch((error) => {
        errorCallback(error);
        utils.logError(error)
    });
}

export function hireEmployee(jobId, employeeUID, successCallback, errorCallback){
    const data = {jobId: jobId, employeeUID: employeeUID};
    const hireEmployee = FirebaseFunctionsRef.httpsCallable(constants.FUNCTION_HIRE_EMPLOYEE);
    hireEmployee(data).then(() => {
        successCallback();
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        }
        utils.logError(error)
    });
}

export function dismissEmployee(jobId, employeeUID, successCallback, errorCallback){
    const data = {jobId: jobId, employeeUID: employeeUID};
    const hireEmployee = FirebaseFunctionsRef.httpsCallable(constants.FUNCTION_DISMISS_EMPLOYEE);
    hireEmployee(data).then(() => {
       successCallback();
    }).catch((error) => {
       if (errorCallback) {
           errorCallback(error);
       }
        utils.logError(error)
    });
}

export function updateEmployer(employer,successCallback, errorCallback){
    FirebaseRef.collection(tables.TABLE_USERS).doc(employer.uid).update( employer ).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function changePassword(oldPassowrd, newPassword, successCallback, errorCallback){
    const user = FirebaseAuth().currentUser;

    //before change I will try a fake login for verify the old psw:
    authFunctions.loginEmployerUser(user.email, oldPassowrd, ()=>{
        user.updatePassword(newPassword).then(()=> {
            successCallback();
        }).catch((error)=> {
            if(errorCallback)errorCallback(error)
            utils.logError(error)
        });
    }, (error)=>{
        if(errorCallback){
            if(error.code === errorsFirebase.LOGIN_INVALID_PASSWORD){
                error.message = strings.stringsProfileEmployer.LBL_ERROR_WRONG_PASSWORD;
            }
            errorCallback(error)
        }
        utils.logError(error)
    });
}