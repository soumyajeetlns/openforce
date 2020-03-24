export default class HocJob{
    constructor(_job) {
        if(_job){
            this.id = _job.id;
            this.employerID = _job.employerID;
            this.employerName = _job.employerName;
            this.status = _job.status;
            this.description = _job.description?_job.description:null;
            this.startDate = _job.startDate;
            this.endDate = _job.endDate;
            this.jobRole = _job.jobRole;
            this.address = _job.address;
            this.latitude = _job.latitude;
            this.longitude = _job.longitude;
            this.coordinates = _job.coordinates;
            this.requiredEmployees = _job.requiredEmployees;
            this.applied = _job.applied?_job.applied:0;
            this.hired = _job.hired?_job.hired:0;
            this.dismissed = _job.dismissed?_job.dismissed:0;
            this.creationDate = _job.creationDate; // when the job is created
            this.postedDate = _job.postedDate; // when the job is published
        }
    }

    static getInstance = (job) =>{
        job = job || null;
        if(!job){
            return undefined;
        }
        return new HocJob(job);;
    }
}