export default class AnimationComponent{
    constructor(_animationComponent) {
        if(_animationComponent){
            this.animation = _animationComponent.animation;
            this.component = _animationComponent.component;
            this.bundles = _animationComponent.bundles;
        }
    }

    static getInstance = (animationComponent) =>{
        animationComponent = animationComponent || null;
        if(!animationComponent){
            return undefined;
        }
        return new AnimationComponent(animationComponent);;
    }
}