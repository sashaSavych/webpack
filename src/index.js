import * as $ from 'jquery';
import Post from "@models/Post";

import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';

import json from './assets/json';
import xml from './assets/data.xml';
import csv from './assets/data.csv';

import WebpackLogo from './assets/webpack-logo';

const post = new Post('Webpack Post Title', WebpackLogo);

$('pre').addClass('code').html(post.toString());

console.log('Post to String:', post.toString());
console.log('JSON:', json);
console.log('Xml:', xml);
console.log('Csv:', csv);
