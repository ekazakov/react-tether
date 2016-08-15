import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import {StickyMenu} from './Menu';
import {StickyHeaders} from './StickyHeaders';


storiesOf('Tether', module)
    .add('floating menu', () => (
        <StickyMenu/>
    ))
    .add('sticky headers', () => (
        <StickyHeaders/>
    ));