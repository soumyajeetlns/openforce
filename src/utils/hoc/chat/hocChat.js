export default class HocChat{
    constructor(_chat) {
        if(_chat){
            this.employeeId = _chat.employeeId;
            this.employerId = _chat.employerId;
            this.jobId = _chat.jobId;
            this.jobRole = _chat.jobRole;
            this.messages = _chat.message;
            this.lastMessage = _chat.lastMessage;
            this.lastUpdateTime=_chat.lastUpdateTime;
        }
    }

    static getInstance = (chat) =>{
        chat = chat || null;
        if(!chat){
            return undefined;
        }
        return new HocChat(chat);;
    }
}