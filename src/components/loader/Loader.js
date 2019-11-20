import React from 'react';
import * as css from './Loader.css';
import loaderGif from '../../assets/img/loader.svg';
import Wrapper from "../wrapper/Wrapper";

const Loader = (props) =>(
    <Wrapper>
        {props.loading?
            <div className={props.className?props.className:"myLoader"} style={{position:props.position?props.position:"absolute"}}>
                <div style={{position:"relative"}}>
                    <center><img src={loaderGif} /></center>
                </div>
            </div>
            :null}
    </Wrapper>
);

export default Loader;