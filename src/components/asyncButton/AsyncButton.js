import React from 'react';
import ProgressButton from 'react-progress-button'
import css from './AsyncButton.css'
import LaddaButton, { XL, EXPAND_LEFT, XS } from 'react-ladda';

const AsyncButton = (props) =>(
    <LaddaButton
        loading={props.loading}
        onClick={props.onClick}
        enabled={props.enabled}
        disabled={props.disabled}

        style={this.style}
        className={props.className}
        data-style={EXPAND_LEFT}
        data-spinner-size={30}
        data-spinner-color={props.spinnerColor?props.spinnerColor:"#ddd"}
        data-spinner-lines={12}>
        {props.textButton}
    </LaddaButton>
);

export default AsyncButton;