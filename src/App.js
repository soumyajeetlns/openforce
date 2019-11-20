import React, { Component } from 'react';
import './App.css';
import './Global.css'
import * as constants from "./utils/Constants";
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Wrapper from "./components/wrapper/Wrapper";
import EmployerForgot from "./components/login/forgot/EmployerForgot";
import EmployerSignout from "./components/login/signout/EmployerSignout";
import PrivateRoute from "./components/route/PrivateRoute/PrivateRoute";
import {connect} from 'react-redux'
import firebase from 'firebase'
import EmployerSignup from "./components/login/signup/EmployerSignup";
import EmployerUser from './utils/hoc/employerUser/EmployerUser';
import * as tables from "./utils/FirebaseTables";
import {FirebaseRef, ProjectId} from "./utils/FirebaseConfigurator";
import EmployerSignin from "./components/login/signin/EmployerSignin";
import JobsList from "./components/home/jobs/JobsList";
import * as jobsFunctions from "./functions/JobsFunctions";
import 'react-toastify/dist/ReactToastify.css';
import Map from "./components/home/map/Map";
import ProfileEmployer from "./components/home/profile/ProfileEmployer";
import 'react-toastify/dist/ReactToastify.css';

import bugsnag from '@bugsnag/js'
import bugsnagReact from '@bugsnag/plugin-react'
import PageNotFound from "./components/home/pageNotFound/PageNotFound";
import ErrorPage from "./components/home/errorPage/ErrorPage";
import Payment from './components/home/payment/payment';

function noop() {}
const logger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: function () {
        console.log.apply(console, arguments);
    }
};

const releaseStage = process.env.NODE_ENV !== 'production' ? "develop" : 'openforce-production' === ProjectId ? "production" : 'openforce-staging' === ProjectId ? "staging" : "develop";
const bugsnagClient = bugsnag({ apiKey: constants.BUGSNAG_KEY, appVersion: `${process.env.REACT_APP_VERSION}`, notifyReleaseStages: [ 'production', 'staging' ], releaseStage: releaseStage, logger: logger });
bugsnagClient.use(bugsnagReact,React);


const ErrorBoundary = bugsnagClient.getPlugin('react');
class App extends Component {

    componentDidMount(){

        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                //get the custom user:
                const userId = user.uid;
                //check the cluster of the user, if admin or a user:
                return FirebaseRef.collection(tables.TABLE_USERS).doc(user.uid).get().then((doc) =>{
                    if (doc.exists) {
                        const employeeUser =  EmployerUser.getInstance(doc.data());
                        this.props.onUserEmployeeLoggedIn(employeeUser);
                    }
                });
            }else{
                const employeeUser =  EmployerUser.getInstance(user);
                this.props.onUserEmployeeLoggedIn(employeeUser);
            }
        })
    }

    render() {
        if(this.props.ctr.user === null) return null;
        return (
            <ErrorBoundary FallbackComponent={ErrorPage}>
                <ToastContainer />
                <BrowserRouter>
                    <Switch>
                        <PrivateRoute path={constants.HOME} exact component={JobsList} authUser={this.props.ctr.user} type={constants.CLUSTER_EMPLOYER}/>
                        <PrivateRoute path={constants.JOBS + "/:section"} exact component={JobsList} authUser={this.props.ctr.user} type={constants.CLUSTER_EMPLOYER}/>
                        <PrivateRoute path={constants.JOB_MAP + "/:id"} exact component={Map} authUser={this.props.ctr.user} type={constants.CLUSTER_EMPLOYER}/>
                        <PrivateRoute path={constants.PROFILE_EMPLOYER} component={ProfileEmployer} authUser={this.props.ctr.user} type={constants.CLUSTER_EMPLOYER}/>
                        <PrivateRoute path={constants.PAYMENT_EMPLOYER} component={Payment} authUser={this.props.ctr.user} type={constants.CLUSTER_EMPLOYER}/>

                        <Route path={constants.SIGNIN_EMPLOYER} component={EmployerSignin}/>
                        <Route path={constants.SIGNUP_EMPLOYER} component={EmployerSignup}/>
                        <Route path={constants.SIGNOUT_EMPLOYER} exact component={EmployerSignout}/>
                        <Route path={constants.FORGOT_EMPLOYER} exact component={EmployerForgot}/>
                        <Route path={constants.ERROR} exact component={ErrorPage}/>

                        <Route exact component={PageNotFound}/>
                    </Switch>
                </BrowserRouter>
            </ErrorBoundary>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ctr: state
    }
}
const mapDispatchToProps = dispatch =>{
    return {
        onUserEmployeeLoggedIn : (user) => {
            dispatch({type: constants.REDUX_PUT_USER_EMPLOYER_STATE,payload:user})
            //on login Ill cache all jobs role to the redux:
            jobsFunctions.getRoles((roles)=>{
                dispatch({type: constants.REDUX_PUT_JOB_ROLES_STATE,payload:roles})
            });
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(App);
