export default class HocEmployeeSkill{
    constructor(_skill) {
        if(_skill){
            this.id = _skill.id;
            this.level = _skill.level;
            this.name = _skill.name;
            this.payRate = _skill.payRate;
        }
    }

    static getInstance = (skill) =>{
        skill = skill || null;
        if(!skill){
            return undefined;
        }
        return new HocEmployeeSkill(skill);;
    }
}