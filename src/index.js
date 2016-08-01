import React, {Children, cloneElement} from 'react'
import ReactDOM, {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer} from 'react-dom';
import './Tether.css';

import {TetherPanel} from './TetherPanel';
window.ReactDOM = ReactDOM;

let utils = require('./utils');

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./utils', () => {
        utils = require('./utils');
    });
}


export default class Tether extends React.Component {
    renderTether() {
        let target;

        if (utils.isElement(this.props.target)) {
            target = this.props.target;
        } else {
            target = document.querySelector(this.props.target);
        }

        const {targetAnchor, elementAnchor, targetOffset, elementOffset, constraints} = this.props;
        renderSubtreeIntoContainer(this,
            <TetherPanel
                targetOffset={targetOffset}
                elementOffset={elementOffset}
                targetElement={target}
                containerElement={this.containerElement}
                content={this.content}
                targetAnchor={targetAnchor}
                elementAnchor={elementAnchor}
                constraints={constraints}
            />,
        this.containerElement);
    }

    componentWillMount() {
        this.content = this.props.children;
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'containerElement';
        document.body.appendChild(this.containerElement);

    }

    componentDidUpdate() {
        this.renderTether();
    }

    componentDidMount() {
        this.renderTether();
    }
    
    componentWillUnmount() {
    }

    render() {
        return null;
    }
}
