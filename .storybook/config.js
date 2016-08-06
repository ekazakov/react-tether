import { configure } from '@kadira/storybook';
// import './story.css';
require( '../demo/story.css');

function loadStories() {
    require('../demo/story');
    // require as many stories as you need.
}

configure(loadStories, module);