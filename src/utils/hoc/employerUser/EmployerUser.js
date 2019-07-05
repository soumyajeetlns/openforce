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
            this.contactNumber = _user.contactNumber?_user.contactNumber:null;
            this.companyType = _user.companyType?_user.companyType:null;
            this.businessname = _user.businessname?_user.businessname:null;
            this.utrno = _user.utrno?_user.utrno:null;
            
            this.address_1 = _user.address_1?_user.address_1:null;
            this.address_2 = _user.address_2?_user.address_2:null;
            this.address_3 = _user.address_3?_user.address_3:null;
            this.postCode = _user.postCode?_user.postCode:null;//company
            this.postcode = _user.postcode?_user.postcode:null;//sole trader
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