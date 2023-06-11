import http from './axios'

const all = async (path) => {
    return await http.get(path).then((res) => res.data)
}

const get = async (path, id) => {
    return await http.get(`${path}/${id}`).then((res) => res.data)
}

const create = async (path, data) => {
    await http.post(path, { data: data })
}

const update = async (path, id, data) => {
    await http.patch(path, { id, data: data })
}

const remove = async (path, id) => {
    await http.delete(path, { data: { id } })
}

const api = {
    all,
    get,
    create,
    update,
    remove
}

export default api
