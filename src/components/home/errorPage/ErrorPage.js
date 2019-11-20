import * as css from './ErrorPage.css';
import React from 'react';
import {Col, Row} from "react-flexbox-grid";
import HomeContainer from "../HomeContainer";
import * as strings from "../../../utils/Strings";
import * as constants from "../../../utils/Constants";
import Wrapper from "../../wrapper/Wrapper";
import Popup from "../../popup/Popup";
import {Link} from "react-router-dom";

const ErrorPage = (props) => (
    <HomeContainer selectedTab={"fakeSection"}>
        <Wrapper className={"pageErrorPageWrapper"}>
            <Popup
                width={"550px"}
                height={"400px"}
                buttonsStyle={{bottom:"70px"}}
                wrapperStyle={{minHeight:"100vh"}}
                bodyText={
                    <div>
                        <p className={"title"}>
                            Error 500
                        </p>

                        <p>
                            {strings.stringsHomeContainer.LBL_ERROR_PAGE}
                        </p>
                        <ul>
                            <li>{strings.stringsHomeContainer.LBL_ERROR_PAGE_1}</li>
                            <li>{strings.stringsHomeContainer.LBL_ERROR_PAGE_2}</li>
                            <li>{strings.stringsHomeContainer.LBL_ERROR_PAGE_3}</li>
                        </ul>
                    </div>
                }>
                <Wrapper>
                    <a href={"mailto:" + constants.EMAIL_ISSUE}>
                        <button>{strings.stringsHomeContainer.BTN_CONTACT_US}</button>
                    </a>
                    <Link to={constants.HOME}>
                        <button>{strings.stringsHomeContainer.BTN_GO_TO_HOME}</button>
                    </Link>
                </Wrapper>

            </Popup>
        </Wrapper>
    </HomeContainer>
)

export default ErrorPage;
