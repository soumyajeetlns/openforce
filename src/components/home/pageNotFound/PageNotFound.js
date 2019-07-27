import * as css from './PageNotFound.css';
import React from 'react';
import {Col, Row} from "react-flexbox-grid";
import HomeContainer from "../HomeContainer";
import Popup from "../../popup/Popup";
import * as strings from "../../../utils/Strings";
import Wrapper from "../../wrapper/Wrapper";
import * as constants from "../../../utils/Constants";
import {Link} from "react-router-dom";

const PageNotFound = (props) => (
    <HomeContainer selectedTab={"fakeSection"}>
        <Wrapper className={"pageNotFoundWrapper"}>
            <Popup
                width={"550px"}
                height={"400px"}
                wrapperStyle={{minHeight:"100vh"}}
                bodyText={strings.stringsHomeContainer.LBL_404_PAGE}>

                <Wrapper>
                    <a href={"mailto:"+constants.EMAIL_ISSUE}>
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

export default PageNotFound
