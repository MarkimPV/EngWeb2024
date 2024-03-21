// alunos_server.js
// RPCW2023: 2023-03-05
// by jcr

var http = require('http')
var axios = require('axios')
var templates = require('./templates')
var static = require('./static.js')
const { parse } = require('querystring');

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer(function (req, res) {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if((req.url == "/")){
                    axios.get("http://localhost:3000")
                        .then(response => {
                            // Render page with the student's list
                            res.write(templates.mainPage(d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores... Erro: " + erro)
                            res.end()
                        })
                } else if (req.url == "/compositores"){
                    axios.get("http://localhost:3000/compositores")
                    .then(response => {
                        var alunos = response.data
                        // Render page with the student's list
                        res.write(templates.compositoresListPage(alunos, d))
                        res.end()
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de compositores... Erro: " + erro)
                        res.end()
                    })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/(C)[0-9]+$/i.test(req.url)){
                    var idCompositor = req.url.split("/")[2]
                    axios.get("http://localhost:3000/compositores/" + idCompositor)
                        .then( response => {
                            let a = response.data
                            // Add code to render page with the compositor record
                            res.end(templates.compositorPage(a, d))
                        })
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == "/compositores/registo"){
                    // Add code to render page with the student form
                    res.write(templates.compositorFormPage(d))
                    res.end()
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    var idCompositor = req.url.split("/")[3]
                    // Get aluno record
                    axios.get("http://localhost:3000/compositores/" + idCompositor)
                        .then(function(resp){
                            var compositor = resp.data
                            res.end(templates.compositorFormEditPage(compositor, d))
                        })
                        .catch(erro => {
                            console.log("Erro: " + erro)
                            res.end(templates.errorPage("Unable to collect record: " + idCompositor, d))
                        })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)){
                    var idCompositor = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores/' + idCompositor)
                        .then(resp => {
                            console.log("Delete " + idCompositor + " :: " + resp.status);
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end('<p>Registo apagado:' + idCompositor  + '</p>')
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.errorPage("Unable to delete record: " + idCompositor, d))
                        })
                }else if(req.url == '/periodos'){
                    axios.get("http://localhost:3000/periodos")
                        .then(response => {
                            var periodos = response.data
                            // Render page with the student's list
                            res.write(templates.periodosListPage(periodos, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores... Erro: " + erro)
                            res.end()
                        })
                }
                // GET /periodo/:id --------------------------------------------------------------------
                else if(/\/periodos\/(P)[0-9]+$/i.test(req.url)){
                    var idPeriodo = req.url.split("/")[2]
                    axios.get("http://localhost:3000/periodos/" + idPeriodo)
                        .then( response => {
                            let a = response.data
                            // Add code to render page with the compositor record
                            res.end(templates.periodoPage(a, d))
                        })
                }
                else if(req.url == "/periodos/registo"){
                    // Add code to render page with the student form
                    res.write(templates.periodoFormPage(d))
                    res.end()
                }
                else if(/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    var idPeriodo = req.url.split("/")[3]
                    // Get aluno record
                    axios.get("http://localhost:3000/periodos/" + idPeriodo)
                        .then(function(resp){
                            var periodo = resp.data
                            res.end(templates.periodoFormEditPage(periodo, d))
                        })
                        .catch(erro => {
                            console.log("Erro: " + erro)
                            res.end(templates.errorPage("Unable to collect record: " + idCompositor, d))
                        })
                }
                else if(/\/periodos\/delete\/(P)[0-9]+$/i.test(req.url)){
                    var idPeriodo = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/periodos/' + idPeriodo)
                        .then(resp => {
                            console.log("Delete " + idPeriodo + " :: " + resp.status);
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(`<h5>Generated by EngWeb2024 in ${d} - [<a href="/periodos">Return</a>]</h5>`)
                            res.end('<p>Registo apagado:' + idPeriodo  + '</p>')
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                            res.end(templates.errorPage("Unable to delete record: " + idPeriodo, d))
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " unsupported on this server.</p>")
                    res.end()
                }
                
                break
            case "POST":
                if(req.url == '/compositores/registo'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            axios.post('http://localhost:3000/compositores', result)
                                .then(resp => {
                                    console.log(resp.data);
                                    res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.end('<p>Registo inserido:' + JSON.stringify(resp.data)  + '</p>')
                                })
                                .catch(error => {
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Unable to insert record...</p>")
                                    res.end()
                                });
                        }
                        else{
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Unable to collect data from body...</p>")
                            res.end()
                        }
                    })
                }
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            console.dir(result)
                            axios.put('http://localhost:3000/compositores/' + result.id, result)
                                .then(resp => {
                                    console.log(resp.data);
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    // res.write(studentFormPage(d))
                                    res.end('<p>Registo alterado:' + JSON.stringify(resp.data)  + '</p>')
                                })
                                .catch(error => {
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.end(templates.errorPage("Unable to insert record...", d))
                                });
                        }
                
                        else{
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Unable to collect data from body...</p>")
                            res.end()
                        }
                    });
                }
                else if(req.url == '/periodos/registo'){
                    collectRequestBodyData(req, result => {
                        if(result){
                            result.compositores = []
                            axios.post('http://localhost:3000/periodos', result)
                                .then(resp => {
                                    console.log(resp.data);
                                    res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                    // res.write(studentFormPage(d))
                                    res.end('<p>Registo inserido:' + JSON.stringify(resp.data)  + '</p>')
                                })
                                .catch(error => {
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Unable to insert record...</p>")
                                    res.end()
                                });
                        }
                        else{
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Unable to collect data from body...</p>")
                            res.end()
                        }
                    })
                }
                else if(/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    collectRequestBodyData(req, result => {
                        if(result){
                            console.dir(result)
                            axios.get('http://localhost:3000/periodos/' + result.id)
                                .then(resp => {
                                    let periodo = resp.data
                                    periodo.nome = result.nome
                                    axios.put('http://localhost:3000/periodos/' + result.id, periodo)
                                    .then(resp => {
                                        console.log(resp.data);
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        // res.write(studentFormPage(d))
                                        res.end('<p>Registo alterado:' + JSON.stringify(resp.data)  + '</p>')
                                    })
                                    .catch(error => {
                                        console.log('Erro: ' + error);
                                        res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.end(templates.errorPage("Unable to insert record...", d))
                                    });
                                })
                                .catch(error => {
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.end(templates.errorPage("Unable to insert record...", d))
                                });
                        }
                
                        else{
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Unable to collect data from body...</p>")
                            res.end()
                        }
                    });
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Unsupported POST request: ' + req.url + '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " unsupported in this server.</p>")
                res.end()
        }
    }
    
})

alunosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



