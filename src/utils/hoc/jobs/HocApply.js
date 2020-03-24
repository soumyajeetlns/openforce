export default class HocApply{
    constructor(_apply) {
        if(_apply){
            this.uid = _apply.uid;
            this.jobId = null;
            this.employeeId = null;
            this.status = _apply.status;
            this.payRate = _apply.payRate;
            this.autoApprove = !!_apply.autoApprove;
            this.applicationDate = _apply.applicationDate;
            this.checkins = [];

            this.endTimeStamp = _apply.endTimeStamp;
            this.ended = _apply.ended;
            this.endedBySystem = _apply.endedBySystem ;

            this.employeeHasReviewed = !!_apply.employeeHasReviewed;
            this.employeeLeftReviewAt = _apply.employeeLeftReviewAt;
            this.employeeReview = _apply.employeeReview;
            this.employerHasReviewed = !!_apply.employerHasReviewed;
            this.employerLeftReviewAt = _apply.employerLeftReviewAt;

            this.rate = _apply.rate?_apply.rate:0;

            if(!_apply.employerReview) _apply.employerReview={}
            this.employerReview ={
                review1:_apply.employerReview.review1,
                review2:_apply.employerReview.review2,
                review3:_apply.employerReview.review3,
                review4:_apply.employerReview.review4,
                review5:_apply.employerReview.review5,
            }
        }
    }

    static getInstance = (apply) =>{
        apply = apply || null;
        if(!apply){
            return undefined;
        }
        return new HocApply(apply);;
    }
}