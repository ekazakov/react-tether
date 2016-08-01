import React from 'react'
import {render} from 'react-dom'
import './index.css';
import Tether from '../../src';

let Demo = class extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            counter: 0,
            elementAnchor: "left top"
        };
    }

    render() {
        return <div className="" >
            <div className="scroll-box">
                <div className="content">
                    <Tether
                        target={document.body}
                        targetAnchor="center top"
                        elementAnchor="center top"
                        targetOffset="0% 0%"
                        elementOffset="0% 0"
                        constraints={[
                               {
                                    to: 'scroll-parent',
                                    attachment: 'together',
                                    pin: true,
                                    outOfBounds: 'hide'
                               },
                               {
                                   to: 'window',
                                   pin: true,
                               },
                         ]}
                    >
                        <div style={{width: 200, height: 200}}>
                            <div style={{padding: 20}}>
                                Hello Dick! LOL! {this.state.counter}
                            </div>
                        </div>
                    </Tether>
                    <div type="button" className="target" ref={(ref) => this.foo = ref}></div>
                </div>
            </div>



        </div>
    }

    flip() {
        this.setState({elementAnchor: "left bottom"});
    }
};

window.demo = render(<Demo/>, document.querySelector('#demo'));
