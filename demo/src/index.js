import React from 'react'
import {render} from 'react-dom'
import './index.css';
import Tether from '../../src/Tether';

const Panel = (props) => (
    <div style={{width: 200, height: 200, border: '1px solid #f7d9a4', backgroundColor: '#f7d9a4'}}>
        <div style={{padding: 20}}>
            Hello! LOL!
        </div>
    </div>
);

let Demo = class extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            counter: 0,
            elementAnchor: "left top"
        };
    }

    render() {
        return <div>
            <div className="elementContainer"></div>
            <div className="scroll-box">
                <div className="content">
                    <Tether
                        target=".target"
                        targetAnchor="right top"
                        elementAnchor="left top"
                        targetOffset="0 0"
                        elementOffset="0 0"
                        container=".elementContainer"
                        style={{border: '5px solid red'}}
                        constraints={[
                               {
                                    to: 'scroll-parent',
                                    attachment: 'together',
                                    pin: true,
                                    // outOfBounds: 'hide'
                               },
                               {
                                   to: 'window',
                                   // attachment: 'together',
                                   // pin: true,
                               },
                         ]}
                    >
                        <Panel/>
                    </Tether>
                    <div type="button" className="target" ></div>
                </div>
            </div>
        </div>
    }

    flip() {
        this.setState({elementAnchor: "left bottom"});
    }
};

window.demo = render(<Demo/>, document.querySelector('#demo'));
