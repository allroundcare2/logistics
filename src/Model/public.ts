

const {  NODE_ENV } = process.env;
const local = 'http://localhost:3000/';
const server = 'http://api.allroundcare.org/';

export const url = NODE_ENV == 'development' ? local : server;

console.log('url is working', url);