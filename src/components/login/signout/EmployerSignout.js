import React, {Component} from 'react';
import * as authFunctions from "../../../functions/Auth";
import * as constants from "../../../utils/Constants";

class EmployerSignout extends Component {
    constructor(args) {
        super(args);
        this.state = {

        }
    }
    componentDidMount = () =>{
        authFunctions.logoutEmployerUser(()=>{
            this.props.history.push(constants.SIGNIN_EMPLOYER);
        });
    }

    render() {
        return (
            <h1></h1>
        )
    }
}

export default EmployerSignout;