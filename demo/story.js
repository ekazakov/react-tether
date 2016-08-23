import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import {StickyMenu} from './Menu';
import {StickyHeaders} from './StickyHeaders';
import {TooltipStory} from './Tooltip';
import {SimpleStory} from './Simple';


storiesOf('Tether', module)
    .add('floating menu', () => (
        <StickyMenu/>
    ))
    .add('sticky headers', () => (
        <StickyHeaders/>
    ))
    .add('tooltip', () => <TooltipStory/>)
    .add('simple', () => <SimpleStory/>)
;