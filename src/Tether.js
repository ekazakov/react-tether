import React, {Children, cloneElement} from 'react'
import ReactDOM, {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer} from 'react-dom';
import {TetherPanel} from './TetherPanel';

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

        renderSubtreeIntoContainer(this,
            <TetherPanel
                targetElement={target}
                content={this.content}
                containerElement={this.containerElement}
                {...this.props}
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
        ReactDOM.unmountComponentAtNode(this.containerElement)
    }

    render() {
        return <noscript></noscript>;
    }
}
