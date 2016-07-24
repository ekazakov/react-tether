import React, {Children, cloneElement} from 'react'
import ReactDOM, {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer} from 'react-dom';
import './Tether.css';

import {Tether} from './Tether';
window.ReactDOM = ReactDOM;
const {toArray} = Children;


export default class Tooltip extends React.Component {
    renderTether() {
        const target = ReactDOM.findDOMNode(this);
        // console.log('target:', target);
        // console.log(this.props);
        const {targetAnchor, elementAnchor, targetOffset, elementOffset} = this.props;
        renderSubtreeIntoContainer(this,
            <Tether
                targetOffset={targetOffset}
                elementOffset={elementOffset}
                targetElement={target}
                containerElement={this.containerElement}
                content={this.content}
                targetAnchor={targetAnchor}
                elementAnchor={elementAnchor}
            />,
        this.containerElement);
    }

    componentWillMount() {
        // console.log('will mount');
        this.containerElement = document.createElement('div');
        this.containerElement.id = 'containerElement';
        this.containerElement.style.visibility = 'hidden';
        document.body.appendChild(this.containerElement);
    }

    componentDidUpdate() {
        this.renderTether();
    }

    componentDidMount() {
        this.renderTether();
    }
    
    componentWillUnmount() {
        console.log('will unmount');
    }

    show = () => {
        this.containerElement.style.visibility = 'visible';
    };
    hide = () => {
        // this.containerElement.style.visibility = 'hidden';
    };

    render() {
        const children = toArray(this.props.children);
        const target = children.find(child => {
            return child.props['data-tooltip-target'];
        });

        this.content = children.find(child => {
            return child.props['data-tooltip-content'];
        });

        return cloneElement(target, {
            onMouseOver: this.show,
            onMouseOut: this.hide
        });
    }
}
