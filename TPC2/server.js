var http = require('http')
var url = require('url')
var axios = require('axios')

http.createServer((req, res) => {

    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
    var q = url.parse(req.url,true)
    
    if(q.pathname == '/'){
        res.write('<ul>')
        res.write('<li><a href="http://localhost:17001/alunos"> Alunos </a></li>')
        res.write('<li><a href="http://localhost:17001/cursos"> Cursos </a></li>')
        res.write('<li><a href="http://localhost:17001/instrumentos"> Instrumentos </a></li>')
        res.end('</ul>')
    } else if (q.pathname.search(/(\/alunos|\/instrumentos|\/cursos)/) !=-1){
        axios.get("http://localhost:3000" + q.pathname)
            .then((resp) =>{
                let lista = resp.data
                
                
                if(q.pathname == '/alunos'){
                    lista.forEach((elem) => {
                        res.write("<ul>")
                        res.write(`<li><b>Id: </b> ${elem.id} </li>`)
                        res.write(`<li><b>Nome: </b> ${elem.nome} </li>`)
                        res.write(`<li><b>Data de Nascimento: </b> ${elem.dataNasc} </li>`)
                        res.write(`<li><b>Curso: </b> ${elem.curso} </li>`)
                        res.write(`<li><b>Ano do Curso: </b> ${elem.anoCurso} </li>`)
                        res.write(`<li><b>Instrumento: </b> ${elem.instrumento} </li>`)
                        res.write('</ul>')
                    })
                }else if(q.pathname == '/cursos'){
                    lista.forEach((elem) => {
                        res.write("<ul>")
                        res.write(`<li><b>Id: </b> ${elem.id} </li>`)
                        res.write(`<li><b>Designação: </b> ${elem.designacao} </li>`)
                        res.write(`<li><b>Duração: </b> ${elem.duracao} </li>`)
                        res.write(`<li><b>Instrumento: </b> ${elem.instrumento["#text"]} </li>`)
                        res.write('</ul>')
                    })
                }else if(q.pathname == '/instrumentos'){
                    lista.forEach((elem) => {
                        res.write("<ul>")
                        res.write(`<li><b>Id: </b> ${elem.id} </li>`)
                        res.write(`<li><b>Designação: </b> ${elem["#text"]} </li>`)
                        res.write('</ul>')
                    })
                }else{
                    res.write("<h3>Operação não suportada</h3>")
                }
                res.end()
            }).catch(erro => { console.log(erro)})
    }else{
        res.write("<h3>Operação não suportada</h3>")
        res.end()
    }
}).listen(17001)

console.log('Servidor à escuta na porta 17001')