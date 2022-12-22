

const {  NODE_ENV } = process.env;
const local = 'http://localhost:4000/';
const server = 'http://api.allroundcare.ng/';

export const url = NODE_ENV == 'development' ? local : server;

console.log('url is working', url);