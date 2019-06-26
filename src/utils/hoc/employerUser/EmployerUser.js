export default class EmployerUser{
    constructor(_user) {
        if(_user){
            this.uid = _user.uid;
            this.companies = _user.companies?_user.companies:null;
            this.email = _user.email;
            this.type = _user.type;
            this.profileImage = _user.profileImage?_user.profileImage:null;
            this.profileImageThumb = _user.profileImageThumb?_user.profileImageThumb:null;
            this.publicID = _user.publicID?_user.publicID:null
            this.companyNumber = _user.companyNumber?_user.companyNumber:null;
            this.contactNumber = _user.contactNumber?_user.contactNumber:null;
            this.companyType = _user.companytype?_user.companytype:null;
            
            this.address_1 = _user.address_1?_user.address_1:null;
            this.address_2 = _user.address_2?_user.address_2:null;
            this.address_3 = _user.address_3?_user.address_3:null;
            this.postCode = _user.postCode?_user.postCode:null;
        }
    }

    static getInstance = (user) =>{
        user = user || null;
        if(!user){
            return undefined;
        }
        return new EmployerUser(user);;
    }
}