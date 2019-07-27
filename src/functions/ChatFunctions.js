import {FirebaseRef} from "../utils/FirebaseConfigurator";
import * as tables from "../utils/FirebaseTables";
import HocJob from "../utils/hoc/jobs/HocJob";
import HocChat from "../utils/hoc/chat/hocChat";
import * as constants from "../utils/Constants";
import * as utils from "../utils/Utils";

/**
 *
 * @param employerUID
 * @param employeeUID
 * @param jobID
 * @param lastSnapShot the last snapshot
 * @param successCallback
 * @param errorCallback
 */
export function getChatByJob(employerUID, employeeUID, jobID, lastSnapShot, successCallback, errorCallback){
    FirebaseRef.collection(tables.TABLE_CHAT).where("employerId", "==", employerUID).where("employeeId", "==", employeeUID).where("jobId", "==", jobID).get().then((querySnapshot) => {
        const chatID = querySnapshot.docs[0].id;
        const hocChat = HocChat.getInstance(querySnapshot.docs[0].data());

        FirebaseRef.collection(tables.TABLE_CHAT).doc(chatID).collection(tables.SUB_TABLE_CHAT).orderBy("timestamp").limit(constants.DEF_SIZE).get().then((queryMessages) =>{
            const messages = [];
            queryMessages.forEach((message)=> {
                messages.push(message.data());
            })
            hocChat.messages = messages;
            successCallback(hocChat);
        }).catch((error)=>{
            if(errorCallback)errorCallback()
            utils.logError(error)
        });
    });
}