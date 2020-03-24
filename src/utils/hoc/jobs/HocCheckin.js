export default class HocCheckin{
    constructor(_checkin) {
        if(_checkin){
            this.id = _checkin.id;
            this.approved = _checkin.approved;
            this.date = _checkin.date? _checkin.date:null;
            this.timestamp = _checkin.timestamp? _checkin.timestamp:null;
        }
    }

    static getInstance = (checkin) =>{
        checkin = checkin || null;
        if(!checkin){
            return undefined;
        }
        return new HocCheckin(checkin);;
    }
}