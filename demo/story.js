import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Tether from '../src';
import {Menu} from './Menu';


storiesOf('Tether', module)
    .add('floating menu', () => (
        <div style={{height: 5000}}>
            <Tether
                className="menuContainer"
                target={document.body}
                targetAnchor="center top"
                elementAnchor="center top"
                targetOffset="0% 0%"
                elementOffset="0% 100"
                constraints={[
                               {
                                   to: 'window',
                                   pin: true,
                               }
                         ]}
            >
                <Menu/>
            </Tether>
        </div>
    ))
    .add('with no text', () => (
        <button></button>
    ));