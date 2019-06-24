import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import * as constants from "../../../utils/Constants";

const PrivateRoute = ({component: Component, authUser,type, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) => (isValid(authUser,type))
                ? <Component {...props} />
                : <Redirect to={{pathname: getPathName(), state: {from: props.location}}} />}
        />

    )
}

function isValid(authUser,type){
    return (isUserLoggedIn(authUser) && authUser.type === type);
}

function getPathName() {
    return constants.SIGNIN_EMPLOYER;
}

function isUserLoggedIn(authUser) {
    return authUser && authUser!=null
}

export default PrivateRoute;