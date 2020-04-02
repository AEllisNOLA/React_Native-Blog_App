import axios from 'axios'

// Remember to update baseUrl upon every restart of server or after 8 hours of use.
export default axios.create({
    baseURL: 'http://7d109c4c.ngrok.io/'
})