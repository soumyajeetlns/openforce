import * as constants from "../Constants";

const initialState = {
    user: null,
    jobRoles:[]
};


const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.REDUX_PUT_USER_EMPLOYER_STATE:
            return {...state,user:action.payload};
        case constants.REDUX_GET_USER_EMPLOYER_STATE:
            return state;
        case constants.REDUX_PUT_JOB_ROLES_STATE:
            return {...state,jobRoles:action.payload};
        case constants.REDUX_GET_JOB_ROLES_STATE:
            return state;
        default:
            return state;
    }
} ;
export default Reducer;