import {ProjectId} from "./FirebaseConfigurator";


export const ENVIRONMENT = process.env.NODE_ENV;
export const GOOGLE_MAPS_API_KEY = "AIzaSyDLhCfMHWXXr1RHQbPphYVbU-W0puATnRM";
export const HOME = "/"
export const SIGNIN_EMPLOYER = "/employer/signin"
export const SIGNUP_EMPLOYER = "/employer/signup"
export const SIGNOUT_EMPLOYER = "/employer/signout"
export const FORGOT_EMPLOYER = "/employer/forgot"
export const PROFILE_EMPLOYER = "/employer/profile"
export const PAYMENT_EMPLOYER = "/payment"
export const NOT_FOUND_PAGE = "/pageNotFound"
export const ERROR = "/error";
export const COMPANYHOUSEAPIURL    =   "http://lnsel.co.in/openforce-web-master/companyhouseapi.php?page=";

export const JOBS = "/jobs"
export const JOB_MAP = "/map"

export const JOBS_ACTIVE = "active";
export const JOBS_DRAFT = "draft";
export const JOBS_ARCHIVED = "archive";
export const JOBS_CLOSED = "closed";

export const REDUX_PUT_USER_EMPLOYER_STATE = "REDUX_PUT_USER_EMPLOYER_STATE";
export const REDUX_GET_USER_EMPLOYER_STATE = "REDUX_GET_USER_EMPLOYER_STATE";
export const REDUX_PUT_JOB_ROLES_STATE = "REDUX_PUT_JOB_ROLES_STATE";
export const REDUX_GET_JOB_ROLES_STATE = "REDUX_GET_JOB_ROLES_STATE";


export const CLUSTER_EMPLOYER = "employer";
export const STATUS_EMPLOYEE_HIRED = "hired";
export const STATUS_EMPLOYEE_APPLIED = "applied";
export const STATUS_EMPLOYEE_DISMISSED = "dismissed";

//functions
export const FUNCTION_HIRE_EMPLOYEE = "hireEmployee";
export const FUNCTION_DISMISS_EMPLOYEE = "dismissEmployee";
export const FUNCTION_END_JOB = "endJob";
export const FUNCTION_RATING_EMPLOYEE = "rateEmployee";
export const FUNCTION_GET_PAST_JOBS_EMPLOYEE = "getPastJobForUser";


export const DEFAULT_OF_RATE = 10;

//chat:
export const TYPES_MESSAGE = {TYPE_APPLIED:"APPLIED", TYPE_HIRED:"HIRED", TYPE_JOB_LOCATION:"LOCATION", TYPE_CHECK_IN:"CHECKIN", TYPE_ENDED:"JOBEND"};

export const DEF_SIZE = 100; //todo: make the pagination

export const EMAIL_ISSUE = "enquiries@joinopenforce.com"

export const BUGSNAG_KEY = process.env.NODE_ENV === 'production' ?
    ('openforce-production' === ProjectId ? "87b7e4ab7837b6b5de545ee501ec382e" : "c019fc3afc5b51083966e7bd2772015f")
    : "c019fc3afc5b51083966e7bd2772015f";