import React from 'react'
import Tether from '../src/Tether';

const Panel = (props) => (
    <div style={{width: 200, height: 200, border: '1px solid #f7d9a4', backgroundColor: '#f7d9a4', opacity: 0.7}}>
        <div></div>
    </div>
);

const targetStyle = {
    backgroundColor: 'orange',
    width: 50,
    height: 50,
    position: 'absolute',
    top: 1050,
    left: 1050
};

export class SimpleStory extends React.Component {
    render() {
        return <div style={{width: 3000, height: 3000}}>
            <Tether
                target=".target"
                targetAnchor="center center"
                elementAnchor="center center"
                targetOffset="0 0"
                elementOffset="0 0"
                style={{border: '5px solid red'}}
                constraints={[
                    {
                        to: 'window',
                        attachment: 'together',
                    },
                ]}
            >
                <Panel/>
            </Tether>
            <div className="target" style={targetStyle}></div>
        </div>;
    }
}