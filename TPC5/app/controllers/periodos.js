var axios = require('axios')

module.exports.getPeriodos = () => {
    return axios.get("http://localhost:3000/periodos")
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.getPeriodo = id => {
    return axios.get("http://localhost:3000/periodos/" + id)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.addPeriodo = periodo => {
    return axios.post("http://localhost:3000/periodos", periodo)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.updatePeriodo = periodo => {
    return axios.put("http://localhost:3000/periodos/" + periodo.id, periodo)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}

module.exports.getPeriodo = id => {
    return axios.delete("http://localhost:3000/periodos/" + id)
            .then(resp => {
                return resp.data
            })
            .catch(erro =>{
                return erro;
            })
}