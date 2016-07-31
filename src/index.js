import React, {Children, cloneElement} from 'react'
import ReactDOM, {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer} from 'react-dom';
import './Tether.css';

import {TetherPanel} from './TetherPanel';
window.ReactDOM = ReactDOM;
const {toArray} = Children;


export default class Tether extends React.Component {
    renderTether() {
        const target = ReactDOM.findDOMNode(this);
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
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'containerElement';
        // this.containerElement.style.visibility = 'hidden';
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
    
    // show = () => {
    //     this.containerElement.style.visibility = 'visible';
    // };
    // hide = () => {
    //     // this.containerElement.style.visibility = 'hidden';
    // };

    render() {
        const children = toArray(this.props.children);
        const target = children.find(child => {
            return child.props['data-tooltip-target'];
        });

        this.content = children.find(child => {
            return child.props['data-tooltip-content'];
        });

        return cloneElement(target, {});
    }
}
