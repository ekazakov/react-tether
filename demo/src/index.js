import React from 'react'
import {render} from 'react-dom'

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
        return <div className="container" ref="rooot">
            <h1>react-tooltip Demo</h1>

            <Form >
                <FormGroup id="exampleInputEmail1" title="Email address" type="email" placeholder="Email"/>
                <FormGroup id="exampleInputPassword1" title="Password" type="password" placeholder="Password"/>
                <div ref="block" className="form-group">
                    <label htmlFor="exampleInputFile">File input</label>
                    <input type="file" id="exampleInputFile"/>
                    <p className="help-block">Example block-level help text here.</p>
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox"/> Check me out
                    </label>
                </div>
                <div style={{position: 'relative', margin: 20, marginLeft: 350, marginTop: 100}}>
                    <Tooltip targetAnchor="right top" elementAnchor="left top">
                        <button ref="foo" data-tooltip-target type="button" className="btn btn-default">Do Stuff</button>
                        <div data-tooltip-content style={{width: 400, height: 300}}>
                            <div style={{padding: 20}}>
                                Hello Dick! LOL! {this.state.counter}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </Form>

        </div>
    }
};

render(<Demo/>, document.querySelector('#demo'));
