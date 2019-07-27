import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {unregister} from './registerServiceWorker';
import {Provider} from "react-redux";
import {createStore} from "redux";
import Reducer from "./utils/Reducers/Reducer";
import * as FirebaseConfigurator from "./utils/FirebaseConfigurator";
import * as Constants from "./utils/Constants";

const store = createStore(Reducer);

ReactDOM.render(
    <Provider store={store}><App /></Provider> , document.getElementById('root'));
unregister();