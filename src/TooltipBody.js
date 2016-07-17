import React from 'react'
import {findDOMNode} from 'react-dom';

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const CENTER = 'center';


export class TooltipBody extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        const {
            top: targetTop,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            right: targetRight,
            bottom: targetBottom
        } = this.calcGeometry(this.props.targetElement);
        this.state = {
            tAnchorHoriz,
            tAnchorVert,
            eAnchorHoriz,
            eAnchorVert,
            targetTop,
            targetLeft,
            targetWidth,
            targetHeight,
            targetRight,
            targetBottom,
        };
    }


    calcGeometry(element) {
        let {width, height, top, left, bottom, right} = element.getBoundingClientRect();
        top += window.scrollY;
        left += window.scrollX;

        return {
            width, height, top, left, bottom, right
        };
    }


    calcPosition({
        tAnchorHoriz, tAnchorVert, eAnchorHoriz, eAnchorVert
        // targetTop, targetLeft, targetWidth, targetHeight, targetRight, targetBottom
    }) {
        let {
            top: targetTop,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
            right: targetRight,
            bottom: targetBottom
        } = this.calcGeometry(this.props.targetElement);

        const {width: elementWidth, height: elementHeight} = findDOMNode(this).getBoundingClientRect();
        // console.log('target:', {targetLeft, targetTop});
        const midX = targetLeft + targetWidth / 2;
        const midY = targetTop + targetHeight / 2;

        let elemTop = 0;
        let elemLeft = 0;
        let transformTop = 0;
        let transformLeft = 0;

        if (tAnchorHoriz === LEFT) {
            if (eAnchorHoriz === LEFT) {
                elemLeft = targetLeft;
            } else if (eAnchorHoriz === CENTER) {
                elemLeft = targetLeft;
                transformLeft = -50;
            } else if (eAnchorHoriz === RIGHT) {
                elemLeft = targetLeft;
                transformLeft = -100;
            }
        } else if (tAnchorHoriz === CENTER) {
            if (eAnchorHoriz === LEFT) {
                elemLeft = midX;
            } else if (eAnchorHoriz === CENTER) {
                elemLeft = midX;
                transformLeft = -50;
            } else if (eAnchorHoriz === RIGHT) {
                elemLeft = midX;
                transformLeft = -100;
            }
        } else if (tAnchorHoriz === RIGHT) {
            if (eAnchorHoriz === LEFT) {
                elemLeft = targetRight;
            } else if (eAnchorHoriz === CENTER) {
                elemLeft = targetRight;
                transformLeft = -50;
            } else if (eAnchorHoriz === RIGHT) {
                elemLeft = targetRight;
                transformLeft = -100;
            }
        }

        if (tAnchorVert === TOP) {
            if (eAnchorVert === TOP) {
                elemTop = targetTop;
            } else if (eAnchorVert === CENTER) {
                elemTop = targetTop;
                transformTop = -50;
            } else if (eAnchorVert === BOTTOM) {
                elemTop = targetTop;
                transformTop = -100;
            }
        } else if (tAnchorVert === CENTER) {
            if (eAnchorVert === TOP) {
                elemTop = midY;
            } else if (eAnchorVert === CENTER) {
                elemTop = midY;
                transformTop = -50;
            } else if (eAnchorVert === BOTTOM) {
                elemTop = midY;
                transformTop = -100;
            }
        } else if (tAnchorVert === BOTTOM) {
            if (eAnchorVert === TOP) {
                elemTop = targetBottom;
            } else if (eAnchorVert === CENTER) {
                elemTop = targetBottom;
                transformTop = -50;
            } else if (eAnchorVert === BOTTOM) {
                elemTop = targetBottom;
                transformTop = -100;
            }
        }

        elemTop = Math.round(elemTop + transformTop / 100 * elementHeight);
        elemLeft = Math.round(elemLeft + transformLeft / 100 * elementWidth);
        return {elemTop, elemLeft};
    }

    isFitInBoundingBox({top, left, right, bottom}) {
        console.log({top, left, right, bottom});
        let fitVertical = true;
        let fitHorizontal = true;

        if (left < 0 || right > window.innerWidth) {
            fitHorizontal = false;
        }

        if (top < 0 || bottom > window.innerHeight) {
            fitVertical = false;
        }

        return {fitHorizontal, fitVertical};
    }

    mirrorAnchorHorizontal({tAnchorHoriz, eAnchorHoriz}) {
        if (tAnchorHoriz === LEFT) {
           tAnchorHoriz = RIGHT;
        } else if (tAnchorHoriz === RIGHT) {
            tAnchorHoriz = LEFT;
        }

        if (eAnchorHoriz === RIGHT) {
            eAnchorHoriz = LEFT;
        } else if (eAnchorHoriz === LEFT) {
            eAnchorHoriz = RIGHT;
        }

        return {tAnchorHoriz, eAnchorHoriz};
    }

    mirrorAnchorVeritcal() {
        let {tAnchorVert, eAnchorVert} = this.state;

        if (tAnchorVert === TOP) {
            tAnchorVert = BOTTOM;
        } else if (tAnchorVert === BOTTOM) {
            tAnchorVert = TOP;
        }

        if (eAnchorVert === BOTTOM) {
            eAnchorVert = TOP;
        } else if (eAnchorVert === TOP) {
            eAnchorVert = BOTTOM;
        }

        return {tAnchorVert, eAnchorVert};
    }

    onResize = () => {
        console.log('on resize');
        const elem = findDOMNode(this);
        const boundingRect = elem.getBoundingClientRect();
        const fitting = this.isFitInBoundingBox(boundingRect);
        const {fitHorizontal, fitVertical} = fitting;
        const [tAnchorHoriz, tAnchorVert] = this.props.targetAnchor.split(' ');
        const [eAnchorHoriz, eAnchorVert] = this.props.elementAnchor.split(' ');
        // debugger;
        const stateCopy = {...this.state};
        // debugger;


        const horizReposition = () => {
            // debugger;
            const {elemTop, elemLeft} = this.calcPosition({...stateCopy, ...this.mirrorAnchorHorizontal(stateCopy)});
            const top = elemTop;
            const left = elemLeft;
            const bottom = top + boundingRect.height;
            const right = left + boundingRect.width;

            let fitH = this.isFitInBoundingBox({top, left, bottom, right}).fitHorizontal;

            if (fitH) {
                Object.assign(stateCopy, this.mirrorAnchorHorizontal(stateCopy));
            }
        };

        const vertReposition = () => {
            // debugger;
            const {elemTop, elemLeft} = this.calcPosition({...stateCopy, ...this.mirrorAnchorVeritcal(stateCopy)});
            const top = elemTop;
            const left = elemLeft;
            const bottom = top + boundingRect.height;
            const right = left + boundingRect.width;

            const fitV = this.isFitInBoundingBox({top, left, bottom, right}).fitVertical;

            if (fitV) {
                Object.assign(stateCopy, this.mirrorAnchorVeritcal(stateCopy));
            }
        };

        if (!fitHorizontal) {
            horizReposition();
        } else if (stateCopy.tAnchorHoriz !== tAnchorHoriz || stateCopy.eAnchorHoriz !== eAnchorHoriz){
            horizReposition();
        }

        if (!fitVertical) {
            vertReposition();
        } else if (stateCopy.tAnchorVert !== tAnchorVert || stateCopy.eAnchorVert !== eAnchorVert) {
            vertReposition();
        }

        // debugger;
        Object.assign(stateCopy, this.calcPosition(stateCopy));
        this.setState(stateCopy);
    };

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.onResize();
    }

    render() {
        console.log('render');
        // debugger;
        const {elemTop, elemLeft} = this.state;
        const style = {
            top: 0,
            left: 0,
            transform: `translate3D(${elemLeft}px, ${elemTop}px, 0)`,
            visibility: this.state.visibility
        };

        return <div className="TooltipBody" style={style}>
            {this.props.content}
        </div>;
    }
}
