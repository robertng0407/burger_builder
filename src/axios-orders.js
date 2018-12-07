import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-e24e4.firebaseio.com/'
});

export default instance;