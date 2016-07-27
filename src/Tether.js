import React from 'react'
import {findDOMNode} from 'react-dom';
import {getScrollParents, position, isElement} from './utils';

export class Tether extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        const targetBB = this.props.targetElement.getBoundingClientRect();
        this.state = {
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            ...targetBB
        };
    }

    prepareConstraints(constraints) {
        return constraints.map(constraint => {
            if (isElement(constraint.to)) {
                return constraint.to.getBoundingClientRect();
            }

            if (constraint.to === 'scroll-parent') {
                const scrollParents = getScrollParents(this.props.targetElement);

                if (scrollParents.length > 0) {
                    constraint.to = scrollParents[0].getBoundingClientRect();
                } else {
                    constraint.to = 'window';
                }
            }

            if (constraint.to === 'window') {
                constraint.to = {
                    top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight
                };
            }

            return constraint;
        });
    }

    reposition = () => {
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        const elementBox = findDOMNode(this).getBoundingClientRect();
        const targetBox = this.props.targetElement.getBoundingClientRect();
        const viewportBox = {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight};
        const {targetOffset, elementOffset, } = this.props;
        const constraints = this.prepareConstraints(this.props.constraints);
        const newState = position({
            stateCopy: {...this.state},
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            elementBox,
            targetBox,
            viewportBox,
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
