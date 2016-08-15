import React from 'react'
import Tether from '../src/Tether';

const Icon = (props) => (
    <div className={`question ${props.className}`}
         style={props.style}
         onMouseEnter={props.onMouseEnter}
         onMouseLeave={props.onMouseLeave}></div>
);

const Tooltip = (props) => (
    <div className="tooltip"
         >
        {props.children}
    </div>
);

export class TooltipStory extends React.Component {
    state = {
        showTooltip: false
    };

    onMouseEnter = (e) => {
        this.setState({showTooltip: true});};
    onMouseLeave = () => {this.setState({showTooltip: false});};

    renderTooltip() {
        if (this.state.showTooltip) {
            return <Tether
                target=".question"
                targetAnchor="right center"
                elementAnchor="left center"
            >
                <Tooltip>
                    At vero eos et accusamus et iusto odio
                    dignissimos ducimus qui blanditiis
                    praesentium voluptatum deleniti.
                    Temporibus autem quibusdam et aut officiis
                    debitis aut rerum necessitatibus
                </Tooltip>
            </Tether>;
        }

        return null;
    }

    render() {
        return <div style={{padding: 50}}>
            <Icon onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}/>
            {this.renderTooltip()}
        </div>;
    }
}
