const ELEMENT_NODE = 1;

function tryDo(callback) {
    try {
        return callback();
    } catch (e) {}
}

export function getScrollParents(el) {
    // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    const computedStyle = getComputedStyle(el) || {};
    const position = computedStyle.position;
    let parents = [];

    let parent = el;
    while ((parent = parent.parentNode) && parent && parent.nodeType === ELEMENT_NODE) {
        let style;
        style = tryDo(() => getComputedStyle(parent));

        if (typeof style === 'undefined' || style === null) {
            parents.push(parent);
            return parents;
        }

        const {overflow, overflowX, overflowY} = style;
        if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
            if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
                parents.push(parent)
            }
        }
    }

    parents.push(el.ownerDocument.body);

    // If the node is within a frame, account for the parent window scroll
    if (el.ownerDocument !== document) {
        parents.push(el.ownerDocument.defaultView);
    }

    return parents;
}

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const CENTER = 'center';

export function isFitInBoundingBox(elementBox, containerBox) {
    let fitVertical = true;
    let fitHorizontal = true;
    const {left, right, top, bottom} = elementBox;
    const {
        left: containerLeft,
        right: containerRihgt,
        top: containerTop,
        bottom: containerBottom
    } = containerBox;

    if (left < containerLeft || right > containerRihgt) {
        fitHorizontal = false;
    }

    if (top < containerTop || bottom > containerBottom) {
        fitVertical = false;
    }

    return {fitHorizontal, fitVertical};
}

export function isOutOfBoundingBox(...args) {
    const {fitHorizontal, fitVertical} = isFitInBoundingBox(...args);
    return !fitHorizontal || !fitVertical;
}

export function mirrorAnchorHorizontal({tAnchorHoriz, eAnchorHoriz}) {
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

export function mirrorAnchorVeritcal({tAnchorVert, eAnchorVert}) {
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

export function calcPosition(
    {tAnchorHoriz, tAnchorVert, eAnchorHoriz, eAnchorVert},
    {targetTop, targetLeft, targetWidth, targetHeight, targetRight, targetBottom},
    {elementWidth, elementHeight},
    targetOffset,
    elementOffset
) {
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
    } else if (tAnchorVert === TOP) {
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

export function horizReposition(stateCopy, targetBB, clientBB, containerBox, targetOffset, elementOffset) {
    const {elemTop, elemLeft} = calcPosition(
        {...stateCopy, ...mirrorAnchorHorizontal(stateCopy)}, targetBB, clientBB, targetOffset, elementOffset);
    const top = elemTop;
    const left = elemLeft;
    const bottom = top + clientBB.elementHeight;
    const right = left + clientBB.elementWidth;

    let fitH = isFitInBoundingBox({top, left, bottom, right}, containerBox).fitHorizontal;

    if (fitH) {
        return Object.assign({}, stateCopy, mirrorAnchorHorizontal(stateCopy));
    }

    return stateCopy;
}

export function vertReposition(stateCopy, targetBB, clientBB, containerBox, targetOffset, elementOffset) {
    const {elemTop, elemLeft} = calcPosition(
        {...stateCopy, ...mirrorAnchorVeritcal(stateCopy)}, targetBB, clientBB, targetOffset, elementOffset);
    const top = elemTop;
    const left = elemLeft;
    const bottom = top + clientBB.elementHeight;
    const right = left + clientBB.elementWidth;

    const fitV = isFitInBoundingBox({top, left, bottom, right}, containerBox).fitVertical;

    if (fitV) {
        return Object.assign({}, stateCopy, mirrorAnchorVeritcal(stateCopy));
    }

    return stateCopy;
}

export function getTargetBox(box) {
    let {width, height, top, left, bottom, right} = box;

    return {
        targetWidth: width, targetHeight: height, targetTop: top, targetLeft: left, targetBottom: bottom, targetRight: right
    };
}

export function getElementBox(box) {
    let {width, height, top, left, bottom, right} = box;
    return {
        elementWidth: width, elementHeight: height, elementTop: top, elementLeft: left, elementBottom: bottom, elementRight: right
    };
}

function applyConstraints(constraints = [], stateCopy) {
    if (constraints.length === 0) {
        return stateCopy;
    }

    if (!fitHorizontal) {
        return horizReposition(stateCopy, targetBox, elementBox, containerBox);
    } else if (stateCopy.tAnchorHoriz !== tAnchorHoriz || stateCopy.eAnchorHoriz !== eAnchorHoriz){
        return horizReposition(stateCopy, targetBox, elementBox, containerBox);
    }

    if (!fitVertical) {
        return vertReposition(stateCopy, targetBox, elementBox, containerBox);
    } else if (stateCopy.tAnchorVert !== tAnchorVert || stateCopy.eAnchorVert !== eAnchorVert) {
        return vertReposition(stateCopy, targetBox, elementBox, containerBox);
    }

    return stateCopy;
}

export function position({
    stateCopy,
    elementBox,
    targetBox,
    tAnchorHoriz,
    tAnchorVert,
    eAnchorHoriz,
    eAnchorVert,
    containerBox,
    constraints,
    targetOffset, elementOffset
}) {
    const fitting = isFitInBoundingBox(elementBox, containerBox);
    const {fitHorizontal, fitVertical} = fitting;
    elementBox = getElementBox(elementBox);
    targetBox = getTargetBox(targetBox);

    // stateCopy = applyConstraints(constraints, stateCopy);

    return Object.assign({}, stateCopy, calcPosition(stateCopy, targetBox, elementBox, targetOffset, elementOffset))
}
