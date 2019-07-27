import userIconPlaceholder from '../../../assets/img/userIconPlaceholder.png';

export default class EmployeeUser{
    constructor(_user) {
        if(_user){
            this.uid = _user.uid;
            this.firstName = _user.firstName?_user.firstName:null;
            this.lastName = _user.lastName?_user.lastName:null;
            this.email = _user.email?_user.email:null;
            this.type = _user.type?_user.type:null;
            this.profileImg = _user.profileImg?_user.profileImg:userIconPlaceholder;
            this.rating = _user.overallAverage?Number(_user.overallAverage):0;
            //java can't save these fields as array so I have to convert them:
            if(_user.references){
                this.references = [];
                for(let ref in _user.references) {
                    this.references.push(_user.references[ref]);
                }
            }else{
                this.references = null;
            }

            if(_user.skills){
                this.skills = [];
                for(let ref in _user.skills) {
                    this.skills.push(_user.skills[ref]);
                }
            }else{
                this.skills = null;
            }

            //the jobs where he was hired
            if(_user.jobs){
                this.jobs = [];
                for(let ref in _user.jobs) {
                    this.jobs.push(_user.jobs[ref]);
                }
            }else{
                this.jobs = null;
            }
        }
    }

    static getInstance = (user) =>{
        user = user || null;
        if(!user){
            return undefined;
        }
        return new EmployeeUser(user);;
    }
}