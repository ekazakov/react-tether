import React, {cloneElement} from 'react'
import {findDOMNode} from 'react-dom';
let utils = require('./utils');

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./utils', () => {
        utils = require('./utils');
    });
}

export class TetherPanel extends React.Component {
    static defaultProps = {
        targetOffset: '0 0',
        elementOffset: '0 0',
        constraints: [],
        style: {}
    };
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
        const {targetElement} = this.props;
        
        function formatBoundaries(boundaries) {
            const windowBox = {
                top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight
            };

            if (boundaries === 'scroll-parent') {
                const scrollParents = utils.getScrollParents(targetElement);

                if (scrollParents.length > 0) {
                    return scrollParents[0].getBoundingClientRect();
                }

                return windowBox;
            }

            if (boundaries === 'window') {
                return windowBox;
            }

            if (utils.isElement(boundaries)) {
                return boundaries.getBoundingClientRect();
            }

            if (typeof boundaries === 'string') {
                return document.querySelector(boundaries).getBoundingClientRect();
            }

            throw Error('invalid boundaries')
        }

        function formatAttachment(attachment = 'none none') {
            const attachments = attachment.split(' ');
            let verticalAttachment, horizontalAttachment;

            if (attachments.length === 2) {
                ([verticalAttachment, horizontalAttachment] = attachments);
            } else {
                verticalAttachment = horizontalAttachment = attachment;
            }

            return {verticalAttachment, horizontalAttachment};
        }

        function formatPins(pin) {
            const newPin = {top: false, left: false, right: false, bottom: false};

            if (Array.isArray(pin)) {
                pin.forEach((item) => {
                    newPin[item] = item in newPin;
                });

                return newPin;
            }



            return pin ? {top: true, left: true, right: true, bottom: true} : false;
        }

        return constraints.reduce((newConstraints, constraint) => {
            const box = formatBoundaries(constraint.to);
            const attachment = formatAttachment(constraint.attachment);
            const pin = formatPins(constraint.pin);

            return newConstraints.concat({...constraint, to: box, attachment, pin});
        }, []);
    }

    _reposition(props) {
        const [tAnchorHoriz, tAnchorVert] = props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = props.elementAnchor.split(' ');
        const elementBox = findDOMNode(this).getBoundingClientRect();
        const targetBox = props.targetElement.getBoundingClientRect();
        // const viewportBox = {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight};
        const {targetOffset, elementOffset} = props;
        const constraints = this.prepareConstraints(props.constraints);
        // console.log(constraints);
        const newState = utils.position({
            stateCopy: {...this.state},
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            elementBox,
            targetBox,
            constraints,
            targetOffset,
            elementOffset
        });

        this.setState(newState);
    }

    reposition = () => {
        this._reposition(this.props);
    };

    componentDidMount() {
        window.addEventListener('resize', this.reposition);
        window.addEventListener('scroll', this.reposition);
        window.addEventListener('touchmove', this.reposition);
        this.scrollParents = utils.getScrollParents(this.props.targetElement);
        this.scrollParents.forEach(parent => parent.addEventListener('scroll', this.reposition));
        this.reposition();
    }

    componentWillUnmount() {
        (this.scrollParents || []).forEach(parent => parent.removeEventListener('scroll', this.reposition));
        window.removeEventListener('resize', this.reposition);
        window.removeEventListener('scroll', this.reposition);
        window.removeEventListener('touchmove', this.reposition);
    }

    componentWillReceiveProps(nextProps) {
        this._reposition(nextProps);
    }

    isPined({top = false, left = false, bottom = false, right = false} = {}) {
        return top || left || bottom || right;
    }

    render() {
        const { elemTop, elemLeft, visibility, pinedTo} = this.state;

        let xOffset = window.pageXOffset;
        let yOffset = window.pageYOffset;
        let position = 'absolute';

        if (this.isPined(pinedTo) && this.props.isGlobal) {
            xOffset = yOffset = 0;
            position = 'fixed';
        }

        const transforms = `translate(${elemLeft + xOffset}px, ${elemTop + yOffset}px) translateZ(0)`;

        const style = {
            top: 0,
            left: 0,
            WebkitTransform: transforms,
            MozTransform: transforms,
            msTransform: transforms,
            transform: transforms,
            visibility,
            position,
            zIndex: 1,
            ...this.props.style
        };

        return <div className={this.props.className} style={style}>
            {cloneElement(this.props.content, {pinedTo: pinedTo || {}})}
        </div>;
    }
}
