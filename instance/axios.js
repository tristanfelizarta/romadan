import axios from 'axios'

const http = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_URL}/api`
})

export default http
