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
    static defaultProps = {
        container: 'body'
    };

    renderTether() {
        let target;
        const {target: ignore, children, container, ...restProps} = this.props;

        if (utils.isElement(this.props.target)) {
            target = this.props.target;
        } else {
            target = document.querySelector(this.props.target);
        }


        renderSubtreeIntoContainer(this,
            <TetherPanel
                targetElement={target}
                content={children}
                containerElement={this.containerElement}
                isGlobal={container === 'body'}
                {...restProps}
            />,
        this.containerElement);
    }

    componentDidUpdate() {
        this.renderTether();
    }

    componentDidMount() {
        this.containerElement = document.createElement('div');
        const container = document.querySelector(this.props.container);
        container.appendChild(this.containerElement);
        this.renderTether();
    }
    
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.containerElement)
    }

    render() {
        return <noscript></noscript>;
    }
}
