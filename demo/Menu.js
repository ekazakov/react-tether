import React from 'react'

export const Menu = (props) => (
    <div className={`menu ${props.pinedTo.top ? 'pinned' : ''}`}>
        <div className="menuItem">Cool Stuff</div>
        <div className="menuItem">Very Cool Stuff</div>
        <div className="menuItem">Super Awesome Stuff</div>
        <div className="menuItem">Just boring shit</div>
    </div>
);