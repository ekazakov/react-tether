import React from 'react'
import {findDOMNode} from 'react-dom';
import {getScrollParents, position, getTargetBox} from './utils';

export class Tether extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        const targetBB = getTargetBox(this.props.targetElement.getBoundingClientRect());
        this.state = {
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            ...targetBB
        };
    }

    reposition = () => {
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        const elementBox = findDOMNode(this).getBoundingClientRect();
        const targetBox = this.props.targetElement.getBoundingClientRect();
        const containerBox = {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight};
        const {constraints, targetOffset, elementOffset} = this.props;
        
        const newState = position({
            stateCopy: {...this.state},
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            elementBox,
            targetBox,
            containerBox,
            constraints,
            targetOffset,
            elementOffset
        });

        this.setState(newState);
    };

    componentDidMount() {
        window.addEventListener('resize', this.reposition);
        window.addEventListener('scroll', this.reposition);
        window.addEventListener('touchmove', this.reposition);
        this.scrollParents = getScrollParents(this.props.targetElement);
        this.scrollParents.forEach(parent => parent.addEventListener('scroll', this.reposition));
        this.reposition();
    }

    componentWillUnmount() {
        (this.scrollParents || []).forEach(parent => parent.removeEventListener('scroll', this.reposition));
        window.removeEventListener('resize', this.reposition);
        window.removeEventListener('scroll', this.reposition);
        window.removeEventListener('touchmove', this.reposition);
    }

    render() {
        const {elemTop, elemLeft, visibility} = this.state;
        const style = {
            top: 0,
            left: 0,
            transform: `translate3D(${elemLeft}px, ${elemTop}px, 0)`,
            visibility
        };

        return <div className="TooltipBody" style={style}>
            {this.props.content}
        </div>;
    }
}
