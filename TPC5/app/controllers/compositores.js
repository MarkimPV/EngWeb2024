var axios = require('axios')

module.exports.getCompositores = () => {
    return axios.get("http://localhost:3000/compositores?_sort=nome")
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.getCompositor = id => {
    return axios.get("http://localhost:3000/compositores/" + id)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.addCompositor = compositor => {
    return axios.post("http://localhost:3000/compositores", compositor)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.updateCompositor = compositor => {
    return axios.put("http://localhost:3000/compositores/" + compositor.id, compositor)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.deleteCompositor = id => {
    return axios.delete("http://localhost:3000/compositores/" + id)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}