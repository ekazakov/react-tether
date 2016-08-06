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
        return constraints.reduce((newConstraints, constraint) => {
            let box;

            if (utils.isElement(constraint.to)) {
                box = constraint.to.getBoundingClientRect();
            }

            if (constraint.to === 'scroll-parent') {
                const scrollParents = utils.getScrollParents(this.props.targetElement);

                if (scrollParents.length > 0) {
                    box = scrollParents[0].getBoundingClientRect();
                } else {
                    box = 'window';
                }
            }

            if (constraint.to === 'window' || box === 'window') {
                box = {
                    top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight
                };
            }

            return newConstraints.concat({...constraint, to: box})
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
        // console.log('reposition', this.props.elementAnchor);
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
        console.log('componentWillReceiveProps');
        this._reposition(nextProps);
    }

    isPined({top = false, left = false, bottom = false, right = false} = {}) {
        return top || left || bottom || right;
    }

    render() {
        const {
            elemTop,
            elemLeft,
            visibility,
            pinedTo
        } = this.state;

        let xOffset = window.pageXOffset;
        let yOffset = window.pageYOffset;
        let position = 'absolute';

        if (this.isPined(pinedTo)) {
            xOffset = yOffset = 0;
            position = 'fixed';
        }

        const style = {
            top: 0,
            left: 0,
            transform: `translate3D(${elemLeft + xOffset}px, ${elemTop + yOffset}px, 0)`,
            visibility,
            position
        };

        return <div className={this.props.className} style={style}>
            {cloneElement(this.props.content, {pinedTo: pinedTo || {}})}
        </div>;
    }
}
