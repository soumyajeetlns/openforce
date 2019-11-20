import LocalizedStrings from 'react-localization';

//Signup:
export const stringsSignup = new LocalizedStrings({
    en:{
        TITLE_STEP_1:"Enter business detail",
        LBL_COMPANY_NAME:"Full name",
        LBL_SOLETRADER_NAME:"Sole Trader name",
        COMPANY_HOUSE_SIGNUP_1: "Get details using companies house",
        LBL_EMAIL:"Enter email address",
        PLACEHOLDER_STEP_1:"Enter your full first and surname",
        PLACEHOLDER_STEP_3: "Your trading name",
        PLACEHOLDER_STEP_COMPANY: "Enter business name",
        UTR_LABEL :"UTR number",
        WEBSITE_LABEL : "Website or online presence",
        WEBSITE_PLACEHOLDER :"e.g www.acneconstruction.com",
        UTR_PLACEHOLDER: "9012345678",
        BTN_STEP_1:"SUBMIT",

        TITLE_STEP_2:"Sign Up",
        TITLE_STEP_3:"Trading Details",
        TITLE_STEP_6:"Payment details",
        PAYMENT_SUBTITLE: "Please add your payment details to finalise your account",
        BTN_SUBMIT:"SUBMIT",
        TITLE_STEP_4:"Business Details",
        SUBTITLE_STEP_3:"Trading address",
        SUBTITLE_STEP_4:"Get details using companies house",
        EMP_TYP_1 :"Limited Company",
        EMP_TYP_2 : "Sole Trader",
        SUBTITLE_STEP_1:"Full Name",
        PLACEHOLDER_EMAIL_STEP_2:"address@example.com",
        ADDRESS_PLACEHOLDER:"Address line1",
        CITY_PLACEHOLDER:"City",
        UTRNO_PLACEHOLDER:"90123456768",
        POSTCODE_PLACEHOLDER:"Post Code",
        PLACEHOLDER_CONTACT_MOBILE:"Contact mobile no",

        LBL_PASSWORD_1:"Set a password",
        LBL_PASSWORD_2:"Confirm password",
        LBL_PASSWORD:"Enter your password",
        LBL_CHECKBOX_STEP_2:"I hearby check this box to say that I am the official hiring manager for my company",

        BTN_CONTINUE_WITH_LINKEDIN:"CONTINUE WITH LINKEDIN",
        BTN_SIGN_IN:"Sign in",
        LBL_OR:"or",
        BTN_CONTINUE:"CONTINUE",
        MESSAGE_SUCCESS_SIGNUP:"An email was sent to the address. Please confirm before you signin.",
        errors:{
            ERROR_EMAIL:"Invalid email",
            ERROR_PASSWORD:"Invalid password. The password must be at least 6 chars",
            ERROR_PASSWORD_MATCH:"The two password doesn't match",
            ERROR_SOLETRADER : "Please provide a sole trader name",
            ERROR_BUSINESS : "Please enter the Business Name",            
            ERROR_RADIO : "Please select one company type",
            ERROR_CHECKBOX:"You have to confirm that you are an hiring manager",           
        },
        LBL_TERMS_OF_CONDITIONS_1:"Openforce is a registered company in England, Wales and Northern Ireland 09860607",
        LBL_TERMS_OF_CONDITIONS_2:"CONTACT US",
        LBL_TERMS_OF_CONDITIONS_3:"Openforce limited complies with GDPR.",
        LBL_TERMS_OF_CONDITIONS_4:"Read about our privacy policy"
    }
});

//forgot:
export const stringsForgot = new LocalizedStrings({
    en: {
        LBL_TITLE:"Forgot Password",
        PLACEHOLDER_EMAIL:"Enter your account email",
        MESSAGE_SUCCESS_FORGOT:"An email was sent to the address. Please check it and reset your password.",
        errors:{
            ERROR_EMAIL:"Invalid email"
        }
    }
})

//Signin:
export const stringsSignin = new LocalizedStrings({
    en: {
        LBL_TITLE:"Welcome back",
        LBL_SIGNUP:"Wanting to join?",
        LBL_SIGNUP_2:"Sign up",
        LBL_EMAIL:"Email address",
        PLACEHOLDER_EMAIL:"address@example.com",
        LBL_PASSWORD:"Password",
        PLACEHOLDER_PASSWORD:"Enter your password",
        BTN_FORGOT:"FORGOT PASSWORD",
        BTN_SUBMIT:"SUBMIT",
        errors:{
            ERROR_EMAIL:"Invalid email",
            //ERROR_PASSWORD:"Invalid password",
            ERROR_PASSWORD:"Invalid Credentials",
            USER_NOT_FOUND:"User not found",
            USER_NOT_VERIFIED:"Please, confirm the registration"
        }
    }
})

//Home container:
export const stringsHomeContainer = new LocalizedStrings({
    en: {
        LBL_ACTIVE:"ACTIVE",
        LBL_DRAFT:"DRAFT",
        LBL_ARCHIVE:"ARCHIVE",
        LBL_EMPLOYEES:"CLOSED",
        LBL_OPEN: "OPEN",
        LBL_CLOSED: "CLOSED",
        LBL_LOGO:"penforce",
        LBL_ERROR_PAGE:"We're terribly sorry, the page you are looking for is not here, please contact us informing us:",
        LBL_ERROR_PAGE_1:"Your browser",
        LBL_ERROR_PAGE_2:"The issue you're experiencing",
        LBL_ERROR_PAGE_3:"The steps you went through to cause the issue",
        LBL_404_PAGE:"We're terribly sorry, the page you are looking for is not here, please contact us informing us of your issue.",
        BTN_GO_TO_HOME:"Go to home",
        BTN_CONTACT_US:"Contact us"
    }
});

//JobsList:
export const stringsJobs = new LocalizedStrings({
    en: {
        LBL_NO_JOBS:"You currently don't have any recruitment drives",
        LBL_NO_ARCHIVED_JOBS:"You don't have any archived jobs",
        BTN_ADD_JOB:"POST NEW",
        LBL_ROLE:"Hiring",
        LBL_POSITIONS:"Positions",
        LBL_LENGTH:"Length",
        LBL_JOB_LOCATION:"Job location",

        LBL_JOB_OPEN:"RECRUITING",
        LBL_JOB_DRAFT:"DRAFT",
        LBL_JOB_CLOSED:"CLOSED"
    }
});

//Job popup:
export const stringsJobPopup = new LocalizedStrings({
    en: {
        LBL_EDIT_TITLE:"Edit Job",
        LBL_TITLE:"New drive",
        box_1:{
            LBL_BOX_TITLE_1:"What type of worker do you need?",
            PLACEHOLDER_INPUT_BOX_1:"Search roles",
            LBL_BOX_TITLE_2:"Enter Description",
            LBL_BOX_SUBTITLE_2:"Add a long description of the project to entice workers to get involved and be more willing to apply for the job",
            LBL_BOX_TITLE_3:"Job location",
            PLACEHOLDER_INPUT_BOX_2:"Enter postcode",
        },
        box_2:{
            LBL_BOX_TITLE_2:"How many workers do you need?",
        },
        box_3:{
            LBL_BOX_TITLE_3:"How long do you need them?",
        },
        LBL_WORKER:"worker",
        LBL_START_WORK:"Start work",
        LBL_END_WORK:"End work",
        LBL_CHOOSE_DATE:"CHOOSE DATE",
        LBL_PAY_PER_DAY:"PER DAY",
        LBL_TOTAL:"Total:",
        BTN_SAVE_DRAFT:"SAVE DRAFT",
        BTN_ARCHIVE:"ARCHIVE",
        BTN_SAVE:"DONE",
        BTN_REHIRE:"RE-HIRE",
        BTN_CANCEL:"CANCEL",
        errors:{
            NO_ROLE_SELECTED:"You must select at least one role",
            NO_LOCATION:"You must insert a proper location for the job",
            NO_EMPLOYEE:"Employee slot must be more than 0",
            NO_DATES:"You must specify the date range of the job",
            WRONG_DATES:"You must specify a correct date range of the job. Start date can't be bigger than end date"

        }
    }
});

export const stringsEmployeePopup = new LocalizedStrings({
    en:{
        LBL_SKILLS:"Skills",
        LBL_REFERENCES:"References",
        LBL_RATE:"Rate",
        LBL_DAY_RATE:"Day rate",
        LBL_OF_RATE:"OF rate",
        LBL_PROJECT_RATE:"Project rate",
        LBL_TOTAL_COST:"Total cost"
    }
})

export const stringsHiredEmployeePopup = new LocalizedStrings({
    en:{
        LBL_RATE:"DAY RATE",
        LBL_AUTO_APPROVE:"AUTO-APPROVE",
        LBL_APPROVE:"APPROVE",
        LBL_END_JOB:"END-JOB",
        CHAT:{
            LBL_MESSAGE_APPLIED:"Candidate applied",
            LBL_MESSAGE_HIRED:"Candidate hired",
            LBL_MESSAGE_JOB_LOCATION:"Location Sent",
            LBL_MESSAGE_JOB_CHECK_IN:"Candidate checked-in",
            LBL_MESSAGE_ENDED:"Job ended",
        },
        TABLE:{
            LBL_DATE:"DATE",
            LBL_CHECKIN:"CHECK-IN",
            LBL_CHECKOUT:"CHECK-OUT",
            LBL_STATUS:"STATUS",
        },

        LBL_APPROVED:"APPROVED",
        LBL_NOT_APPROVED:"NOT APPROVED",
        LBL_END_JOB_2:"Rate your time with ",
        BTN_END_JOB:"DONE",
        RATING_QUESTION_1:"Completed the job in time?",
        RATING_QUESTION_2:"Quality of work?",
        RATING_QUESTION_3:"Communication skills?",
        RATING_QUESTION_4:"Organisation of tasks?",
        RATING_QUESTION_5:"Working with team (if applicable)?",
        BTN_SKIP_QUESTION:"SKIP QUESTION"
    }
})


//map:
export const stringsJobMap = new LocalizedStrings({
    en: {
        LBL_PAYMENT:"Payment",
        LBL_HIRED:"Hired",
        LBL_APPLIED:"Applied",
        POPUP_CONFIRM_END_JOB_TITLE:"End the job",
        POPUP_CONFIRM_END_JOB_BODY:"Ending the job informs the contractor that they are no longer needed and the will no longer turn up for work",
        POPUP_CONFIRM_BTN_ACCEPT:"YES",
        POPUP_CONFIRM_BTN_CANCEL:"NO",

        POPUP_CONFIRM_RE_HIRE_TITLE:"Extending the job",
        POPUP_CONFIRM_RE_HIRE_BODY:"You’re re-submitting a job post for an extention to the hiring process, are you sure you wish to-do this?",
        POPUP_CONFIRM_RE_HIRE_ACCEPT:"SUBMIT",
        POPUP_CONFIRM_RE_HIRE_CANCEL:"CANCEL"
    }
})

//map:
export const stringsProfileEmployer = new LocalizedStrings({
    en: {
        LBL_COLUMN_BUSINESS_DETAIL:"Business Details",        
        LBL_DETAIL:"Detail",
        LBL_ADDRESS:"Trading Address",
        LBL_SETTINGS:"Settings",
        BTN_UPDATE:"Update",        
        LBL_COMPANY_NUMBER:"Company number",
        LBL_CONTACT_NUMBER:"Contact Number",
        LBL_ADDRESS_1:"Address",
        LBL_ADDRESS_2:"City",
        LBL_ADDRESS_3:"Address line3",
        LBL_POST_CODE:"Post code",
        LBL_EMAIL_ADDRESS:"Email address",
        LBL_PASSWORD_1:"New Password",
        LBL_PASSWORD_2:"Confirm password",
        LBL_CURRENT_PASSWORD:"Current password",
        LBL_PASSWORD_MESSAGE:"Minimum 8 characters and 2 symbols",
        LBL_SUCCESS_UPDATE:"Update successfully",
        LBL_ERROR_UPDATE:"Error on update",
        BTN_CHANGE_PASSWORD:"Change password",
        LBL_SUCCESS_CHANGE_PASSWORD:"Password updated successfully",
        LBL_ERROR_WRONG_PASSWORD:"Your old password is wrong",
        LBL_ERROR_PASSWORDS_MISMATCH:"Passwords doesn't match",
        LBL_ERROR_PASSWORDS_NO_VALID:"Your password is too week",
        BTN_LOGOUT:"LOG OUT",

        LBL_COLUMN_TRADING_DETAILS:"Trading Details",
        BTN_DELETE_ACCOUNT:"DELETE MY ACCOUNT",
        LBL_REGISTER_TRADE_NAME:"Registered trading name",
        LBL_COMPANY_TRADE_TYPE:"Status",
        LBL_COMPANY_TRADE_UTR:"UTR Number",
        LBL_EMPLOYER_NAME:"Employer name",
        LBL_COMPANY_NUMBER:"Company number",
    }
})