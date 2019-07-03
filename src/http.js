import axios from 'axios';

const http = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL : 'http://localhost:7000/api',
    // timeout: 60000,
});

export default http;