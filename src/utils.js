const ELEMENT_NODE = 1;

function tryDo(callback) {
    try {
        return callback();
    } catch (e) {}
}

export function isElement(node) {
    return node && node.nodeType === ELEMENT_NODE;
}

export function getScrollParents(el) {
    // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
    // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    const computedStyle = getComputedStyle(el) || {};
    const position = computedStyle.position;
    let parents = [];

    let parent = el;
    while ((parent = parent.parentNode) && isElement(parent)) {
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

    if (left < containerBox.left || right > containerBox.right) {
        fitHorizontal = false;
    }

    if (top < containerBox.top || bottom > containerBox.bottom) {
        fitVertical = false;
    }

    return {fitHorizontal, fitVertical};
}

export function isOutOfBoundingBox(...args) {
    const {fitHorizontal, fitVertical} = isFitInBoundingBox(...args);
    return !fitHorizontal || !fitVertical;
}

function boxIntersections(elementBox, containerBox) {
    let overTop = false;
    let overLeft = false;
    let overBottom = false;
    let overRight = false;

    const {
        left: elementLeft,
        right: elementRight,
        top: elementTop,
        bottom: elementBottom
    } = elementBox;

    const {
        left: containerLeft,
        right: containerRight,
        top: containerTop,
        bottom: containerBottom
    } = containerBox;

    if (elementTop <= containerTop) {
        overTop = true;
    }

    if (elementLeft <= containerLeft) {
        overLeft = true;
    }

    if (elementBottom >= containerBottom) {
        overBottom = true;
    }

    if (elementRight >= containerRight) {
        overRight = true;
    }

    return {overTop, overLeft, overBottom, overRight};
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

function isPercent(str) {
    return str[str.length - 1] === '%';
}

export function parseOffset(offset, {width, height}) {
    var [horiz, vert] = offset.split(' ');

    if (isPercent(vert)) {
        vert = height / 100 * parseFloat(vert.slice(0, -1), 10);
    } else {
        vert = parseFloat(vert, 10);
    }

    if (isPercent(horiz)) {
        horiz = width / 100 * parseFloat(horiz.slice(0, -1), 10);
    } else {
        horiz = parseFloat(horiz, 10);
    }

    return [horiz, vert];
}

export function calcPosition(
    {tAnchorHoriz, tAnchorVert, eAnchorHoriz, eAnchorVert},
    targetBox,
    elementBox,
    targetOffset,
    elementOffset
) {
    const midX = targetBox.left + targetBox.width / 2;
    const midY = targetBox.top + targetBox.height / 2;
    const [targetHorizOffset, targetVertOffset] = parseOffset(targetOffset, {width: targetBox.width, height: targetBox.height});
    const [elementHorizOffset, elementVertOffset] = parseOffset(elementOffset, {width: elementBox.width, height: elementBox.height});

    let elemTop = 0;
    let elemLeft = 0;
    let transformTop = 0;
    let transformLeft = 0;

    if (tAnchorHoriz === LEFT) {
        if (eAnchorHoriz === LEFT) {
            elemLeft = targetBox.left + targetHorizOffset;
        } else if (eAnchorHoriz === CENTER) {
            elemLeft = targetBox.left + targetHorizOffset;
            transformLeft = -50;
        } else if (eAnchorHoriz === RIGHT) {
            elemLeft = targetBox.left + targetHorizOffset;
            transformLeft = -100;
        }
    } else if (tAnchorHoriz === CENTER) {
        if (eAnchorHoriz === LEFT) {
            elemLeft = midX + targetHorizOffset;
        } else if (eAnchorHoriz === CENTER) {
            elemLeft = midX + targetHorizOffset;
            transformLeft = -50;
        } else if (eAnchorHoriz === RIGHT) {
            elemLeft = midX + targetHorizOffset;
            transformLeft = -100;
        }
    } else if (tAnchorHoriz === RIGHT) {
        if (eAnchorHoriz === LEFT) {
            elemLeft = targetBox.right + targetHorizOffset;
        } else if (eAnchorHoriz === CENTER) {
            elemLeft = targetBox.right + targetHorizOffset;
            transformLeft = -50;
        } else if (eAnchorHoriz === RIGHT) {
            elemLeft = targetBox.right + targetHorizOffset;
            transformLeft = -100;
        }
    }

    if (tAnchorVert === TOP) {
        if (eAnchorVert === TOP) {
            elemTop = targetBox.top + targetVertOffset;
        } else if (eAnchorVert === CENTER) {
            elemTop = targetBox.top + targetVertOffset;
            transformTop = -50;
        } else if (eAnchorVert === BOTTOM) {
            elemTop = targetBox.top + targetVertOffset;
            transformTop = -100;
        }
    } else if (tAnchorVert === CENTER) {
        if (eAnchorVert === TOP) {
            elemTop = midY + targetVertOffset;
        } else if (eAnchorVert === CENTER) {
            elemTop = midY + targetVertOffset;
            transformTop = -50;
        } else if (eAnchorVert === BOTTOM) {
            elemTop = midY + targetVertOffset;
            transformTop = -100;
        }
    } else if (tAnchorVert === BOTTOM) {
        if (eAnchorVert === TOP) {
            elemTop = targetBox.bottom + targetVertOffset;
        } else if (eAnchorVert === CENTER) {
            elemTop = targetBox.bottom + targetVertOffset;
            transformTop = -50;
        } else if (eAnchorVert === BOTTOM) {
            elemTop = targetBox.bottom + targetVertOffset;
            transformTop = -100;
        }
    }

    elemTop = Math.round(elemTop + transformTop / 100 * elementBox.height + elementVertOffset);
    elemLeft = Math.round(elemLeft + transformLeft / 100 * elementBox.width + elementHorizOffset);
    return {elemTop, elemLeft};
}

export function horizReposition(stateCopy, targetBB, clientBB, containerBox, targetOffset, elementOffset) {
    const {elemTop, elemLeft} = calcPosition(
        {...stateCopy, ...mirrorAnchorHorizontal(stateCopy)}, targetBB, clientBB, targetOffset, elementOffset);
    const top = elemTop;
    const left = elemLeft;
    const bottom = top + clientBB.height;
    const right = left + clientBB.width;

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
    const bottom = top + clientBB.height;
    const right = left + clientBB.width;

    const fitV = isFitInBoundingBox({top, left, bottom, right}, containerBox).fitVertical;

    if (fitV) {
        return Object.assign({}, stateCopy, mirrorAnchorVeritcal(stateCopy));
    }

    return stateCopy;
}

function applyConstraints({
    stateCopy,
    elementBox,
    targetBox,
    tAnchorHoriz,
    tAnchorVert,
    eAnchorHoriz,
    eAnchorVert,
    viewportBox,
    constraints,
    targetOffset,
    elementOffset
}) {
    if (constraints.length === 0) {
        return stateCopy;
    }

    constraints.forEach(constraint => {
        const {fitHorizontal, fitVertical} = isFitInBoundingBox(elementBox, constraint.to);

        if (!fitHorizontal) {
            stateCopy = horizReposition(stateCopy, targetBox, elementBox, constraint.to, targetOffset, elementOffset);
        } else if (stateCopy.tAnchorHoriz !== tAnchorHoriz || stateCopy.eAnchorHoriz !== eAnchorHoriz){
            stateCopy = horizReposition(stateCopy, targetBox, elementBox, constraint.to, targetOffset, elementOffset);
        }

        if (!fitVertical) {
            stateCopy = vertReposition(stateCopy, targetBox, elementBox, constraint.to, targetOffset, elementOffset);
        } else if (stateCopy.tAnchorVert !== tAnchorVert || stateCopy.eAnchorVert !== eAnchorVert) {
            stateCopy = vertReposition(stateCopy, targetBox, elementBox, constraint.to, targetOffset, elementOffset);
        }
    });

    return Object.assign({}, stateCopy, calcPosition(stateCopy, targetBox, elementBox, targetOffset, elementOffset));
}

export function position({
    stateCopy,
    elementBox,
    targetBox,
    tAnchorHoriz,
    tAnchorVert,
    eAnchorHoriz,
    eAnchorVert,
    viewportBox,
    constraints,
    targetOffset,
    elementOffset
}) {
    stateCopy = applyConstraints(
        {stateCopy, elementBox, targetBox, tAnchorHoriz, tAnchorVert, eAnchorHoriz, eAnchorVert, viewportBox, constraints, targetOffset, elementOffset});

    return stateCopy;
}
