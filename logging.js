import serverConfig from './config/server.json'
import axios from 'axios'

const sendLog = async (data) => {
    const { host, port, endpoint } = serverConfig

    if (!host || !port || !endpoint) {
        return false;
    }

    try {
        const response = await axios.post(`http://${host}:${port}${endpoint}`, data)

        if (response.status >= 200 && response.status < 300) {
            return true;
        }
        
    } catch (err) {
        return false;
    }
    
}

export default { sendLog }