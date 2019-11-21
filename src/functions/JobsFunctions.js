import { FirebaseRef, FirebaseFunctionsRef } from '../utils/FirebaseConfigurator';
import * as tables from "../utils/FirebaseTables";
import HocJob from "../utils/hoc/jobs/HocJob";
import EmployeeUser from "../utils/hoc/employeeUser/EmployeeUser";
import HocApply from "../utils/hoc/jobs/HocApply";
import HocJobRole from "../utils/hoc/jobs/HocJobRole";
import HocCheckIn from "../utils/hoc/jobs/HocCheckin";
import * as constants from "../utils/Constants";
import HocEmployeeSkill from "../utils/hoc/employeeUser/HocEmployeeSkill";
import * as utils from "../utils/Utils";

/**
 * @param employerID -> the id of the logged employer
 * @param status -> active, draft or archived
 * @param successCallback
 * @param errorCallback
 */
export function getJobsByStatusWithPending(employerID, status, successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).where("employerID", "==", employerID).where("status", "==", status).onSnapshot((querySnapshot) => {
        const jobs = [];
        querySnapshot.forEach((doc)=> {
            const hocJob = HocJob.getInstance(doc.data());
            jobs.push(hocJob);
        });
        successCallback(jobs);
    });
}


export function getJobsById(id, listening, successCallback, errorCallback){
    const ref = FirebaseRef.collection(tables.TABLE_JOBS).doc(id);
    var paymentReqCount = 0;

    
    if(listening){
        ref.onSnapshot((doc) => {
            if (doc.exists) {
                FirebaseRef.collection(tables.TABLE_JOBS).doc(id).collection(tables.SUB_TABLE_PAYMENT).get().then(snap => {
                    paymentReqCount = snap.size;
                    successCallback(HocJob.getInstance(doc.data()), paymentReqCount);
                 });
                
            } else {
                errorCallback();
            }
        }, error => () =>{
            if(errorCallback)errorCallback(error)
            utils.logError(error)
        });
    }else{
        ref.get().then((doc) => {
            if (doc.exists) {
                successCallback(HocJob.getInstance(doc.data()));
            } else {
                errorCallback();
            }
        }).catch((error) => {
            if(errorCallback)errorCallback(error);
            utils.logError(error)
        });
    }
}

export function getRoles(successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_ROLES).get().then((querySnapshot) => {
        const array = [];
        querySnapshot.forEach((doc)=> {
            const el = new HocJobRole(doc.data()) ;
            el.id = doc.id;
            array.push(el);
        });
        successCallback(array);
    }).catch((error) => {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function saveJob(job, successCallback,errorCallback){
    if(!job.id){
        job.id = FirebaseRef.collection(tables.TABLE_JOBS).doc().id;;
    }
    FirebaseRef.collection(tables.TABLE_JOBS).doc(job.id).set( job ).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function getApplyForJobByStatus(jobId,status,successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobId).collection(tables.SUB_TABLE_EMPLOYEE).where("status", "==", status).onSnapshot((querySnapshot) => {
        const promises = [];
        const usersArray = [];

        querySnapshot.forEach((doc)=> {
            const promise = FirebaseRef.collection(tables.TABLE_USERS).doc(doc.id).get();
            const apply = HocApply.getInstance(doc.data());
            apply.jobId = jobId;
            apply.uid = doc.id;
            apply.employeeId = doc.id;
            usersArray.push(apply);
            promises.push(promise);
        });

        Promise.all(promises).then((users)=>{
            const promisesSkills = []

            users.forEach((userSnap)=> {
                const promiseSkill = new Promise((resolve, reject) => {
                    //get his skills:
                    FirebaseRef.collection(tables.TABLE_USERS).doc(userSnap.data().uid).collection(tables.SUB_TABLE_EMPLOYEE_SKILLS).get().then((querySnapshot)=>{
                        const user = EmployeeUser.getInstance(userSnap.data());
                        const skills = [];
                        querySnapshot.forEach((docSkill)=> {
                            const skill = HocEmployeeSkill.getInstance(docSkill.data()) ;
                            skills.push(skill);
                        })
                        user.skills = skills;
                        if(usersArray.find(x => x.uid === user.uid)){
                            usersArray.find(x => x.uid === user.uid).user = user;
                        }
                        resolve();
                    }).catch((error)=>{
                        utils.logError(error)
                        reject(error)
                    })
                });
                promisesSkills.push(promiseSkill)
            });

            Promise.all(promisesSkills).then(()=>{
                successCallback(usersArray);
            })
        }).catch((e)=>{
            if(errorCallback)errorCallback(e);
            utils.logError(e)
        });
    });
}

export function getPaymentRequest(jobId,status,successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobId).collection(tables.SUB_TABLE_PAYMENT).onSnapshot((querySnapshot) => {
        const promises = [];
        const usersArray = [];

        querySnapshot.forEach((doc)=> {
            const promise = FirebaseRef.collection(tables.TABLE_USERS).doc(doc.id).get();
            const apply = HocApply.getInstance(doc.data());
            apply.jobId = jobId;
            apply.uid = doc.id;
            apply.employeeId = doc.id;
            usersArray.push(apply);
            promises.push(promise);
        });

        Promise.all(promises).then((users)=>{
            const promisesSkills = []

            users.forEach((userSnap)=> {
                const promiseSkill = new Promise((resolve, reject) => {
                    //get his skills:
                    FirebaseRef.collection(tables.TABLE_USERS).doc(userSnap.data().uid).collection(tables.SUB_TABLE_EMPLOYEE_SKILLS).get().then((querySnapshot)=>{
                        const user = EmployeeUser.getInstance(userSnap.data());
                        const skills = [];
                        querySnapshot.forEach((docSkill)=> {
                            const skill = HocEmployeeSkill.getInstance(docSkill.data()) ;
                            skills.push(skill);
                        })
                        user.skills = skills;
                        if(usersArray.find(x => x.uid === user.uid)){
                            usersArray.find(x => x.uid === user.uid).user = user;
                        }
                        resolve();
                    }).catch((error)=>{
                        utils.logError(error)
                        reject(error)
                    })
                });
                promisesSkills.push(promiseSkill)
            });

            Promise.all(promisesSkills).then(()=>{
                successCallback(usersArray);
            })
        }).catch((e)=>{
            if(errorCallback)errorCallback(e);
            utils.logError(e)
        });
    });
}

export function setAutoApprove(jobId, employeeID,autoApprove,successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobId).collection(tables.SUB_TABLE_EMPLOYEE).doc(employeeID).update({autoApprove:autoApprove}).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function approveAllCheckins(hocApply,successCallback,errorCallback){
    if(hocApply && hocApply.checkins.length>0){
        const promises = [];
        hocApply.checkins.forEach((checkIn)=>{
            if(!checkIn.approved){
                const p = new Promise((resolve, reject) => {
                    FirebaseRef.collection(tables.TABLE_JOBS).doc(hocApply.jobId).collection(tables.SUB_TABLE_EMPLOYEE).doc(hocApply.employeeId).collection(tables.SUB_TABLE_CHECKIN).doc(checkIn.id).update({approved:true}).then((docRef) =>{
                        checkIn.approved = true;
                        resolve(HocCheckIn.getInstance( checkIn));
                    }).catch((error)=> {
                        reject(error);
                    });
                });
                promises.push(p);
            }
        })
        Promise.all(promises).then(values => {
            successCallback(values);
        });
    }else{
        successCallback();
    }
}

export function getApplyByJob(employerUID, employeeUID, jobID, from, successCallback, errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobID).collection(tables.SUB_TABLE_EMPLOYEE).doc(employeeUID).get().then((doc) => {
        if (doc.exists) {
            const hocApply = HocApply.getInstance(doc.data());
            hocApply.id = doc.id;

            hocApply.jobId = jobID;
            hocApply.employeeId = employeeUID;
            FirebaseRef.collection(tables.TABLE_JOBS).doc(jobID).collection(tables.SUB_TABLE_EMPLOYEE).doc(employeeUID).collection(tables.SUB_TABLE_CHECKIN).get().then((querySnapshot)=> {
                const checkins = [];
                querySnapshot.forEach((docCheckin)=> {
                    const hocCheckin = HocCheckIn.getInstance(docCheckin.data());
                    hocCheckin.id = docCheckin.id;
                    checkins.push(hocCheckin);
                });
                hocApply.checkins = checkins;
                successCallback(hocApply);
            }).catch((error)=>{
                if(errorCallback)errorCallback(error);
                utils.logError(error)
            });
        } else {
            errorCallback("Unable to find apply");
        }
    }).catch((error) => {
        errorCallback(error);
        utils.logError(error)
    });
}

export function endJob(jobId, employeeId,  successCallback,errorCallback) {
    const data = {jobId: jobId, employeeId: employeeId};
    const hireEmployee = FirebaseFunctionsRef.httpsCallable(constants.FUNCTION_END_JOB);
    hireEmployee(data).then(() => {
        successCallback();
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        }
        utils.logError(error)
    });
}

export function archiveJob(jobId, successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobId).update({status:constants.JOBS_ARCHIVED}).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}

export function rateEmployeeByApply(jobId, employeeId, review1, review2, review3, review4, review5, successCallback,errorCallback) {
    //jobId, employeeId, review1, review2, review3, review4, review5
    const data = {jobId: jobId, employeeId: employeeId, review1, review2, review3, review4, review5};
    const ratingEmployee = FirebaseFunctionsRef.httpsCallable(constants.FUNCTION_RATING_EMPLOYEE);

    ratingEmployee(data).then(() => {
        successCallback();
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        }
        utils.logError(error)
    });
}

export function getLastEmployeeJobs(employeeId,jobId, successCallback, errorCallback){
    const data = {employeeId: employeeId, jobId: jobId};
    const ratingEmployee = FirebaseFunctionsRef.httpsCallable(constants.FUNCTION_GET_PAST_JOBS_EMPLOYEE);

    ratingEmployee(data).then((response) => {
        let jsonResp = null;
        try{
            jsonResp = JSON.parse(response.data)
        }catch (e) {}

        successCallback(jsonResp);
    }).catch((error) => {
        if (errorCallback) {
            errorCallback(error);
        }
        utils.logError(error)
    });
}

export function rejectPayment(jobId, empId, successCallback,errorCallback){
    FirebaseRef.collection(tables.TABLE_JOBS).doc(jobId).collection(tables.SUB_TABLE_PAYMENT).doc(empId).update({status:'rejected'}).then((docRef) =>{
        if(successCallback)successCallback(docRef);
    }).catch((error)=> {
        if(errorCallback)errorCallback(error);
        utils.logError(error)
    });
}