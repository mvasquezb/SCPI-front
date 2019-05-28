import axios from 'axios';

const http = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:7000',
    timeout: 10000,
});

export default http;