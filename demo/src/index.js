import React from 'react'
import {render} from 'react-dom'
import './index.css';

import Tooltip from '../../src';

function Form(props) {
    return <form>{props.children}</form>;
}

class Block extends React.Component {
    render() {
        return <div className="form-group">{this.props.children}</div>;
    }
}

function FormGroup(props) {
    return <Block >
        <label htmlFor={props.id}>{props.title}</label>
        <input type={props.type} className="form-control" id={props.id} placeholder={props.placeholder}/>
    </Block>;
}

let Demo = class extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            counter: 0
        };

        // const handler = setInterval(() => {
        //     if (this.state.counter > 20) {
        //         clearInterval(handler);
        //         return;
        //     }
        //
        //     this.setState({counter: this.state.counter + 1});
        // }, 1000);
    }

    render() {
        return <div className="" >
            <div className="scroll-box">
                <div className="content">
                <Tooltip 
                         targetAnchor="right top"
                         elementAnchor="left top"
                         targetOffset="10 10"
                         elementOffset="20% 20%"
                         constraints={[
                               {
                                    to: 'window',
                                    attachment: 'together',
                                    pin: true,
                                    outOfBounds: 'hide'
                               }
                         ]}
                >
                    <div data-tooltip-target type="button" className="target" />
                    <div data-tooltip-content style={{width: 300, height: 300}}>
                        <div style={{padding: 20}}>
                            Hello Dick! LOL! {this.state.counter}
                        </div>
                    </div>
                </Tooltip>
                </div>
            </div>



        </div>
    }
};

render(<Demo/>, document.querySelector('#demo'));
