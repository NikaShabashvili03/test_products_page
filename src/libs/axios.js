import axios from 'axios'
import md5 from 'md5'

const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const md5Hash = md5(`Valantis_${timestamp}`);

const instance = axios.create({
    baseURL: `https://api.valantis.store:41000/`,
    headers: {
        'X-Auth': md5Hash,
    }
});

export default instance;