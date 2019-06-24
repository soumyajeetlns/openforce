export default class HocJobRole{
    constructor(_job) {
        if(_job){
            this.id = _job.id;
            this.name = _job.name;
            this.dailyPay = _job.dailyPay?_job.dailyPay:0;
        }
    }

    static getInstance = (job) =>{
        job = job || null;
        if(!job){
            return undefined;
        }
        return new HocJobRole(job);;
    }
}