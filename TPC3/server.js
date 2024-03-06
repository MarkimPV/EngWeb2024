var http = require('http')
var url = require('url')
var axios = require('axios')

http.createServer((req,res) =>{

    res.writeHead(200,{'Content-Type' : 'text/html; charset=utf8'})
    var q = url.parse(req.url,true)

    if(q.pathname == '/'){
        res.write('<ul>')
        res.write('<li><a href="http://localhost:17001/genres">Generos</a></li>')
        res.write('<li><a href="http://localhost:17001/cast">Atores</a></li>')
        res.write('<li><a href="http://localhost:17001/movies">Filmes</a></li>')
        res.end('</ul>')
    }else if (q.pathname.search(/\/genres|\/cast|\/movies/) !=-1){
        axios.get("http://localhost:3000" + q.pathname)
            .then((resp) =>{
                let lista = resp.data

                if(q.pathname == '/genres'){
                    lista.forEach((elem) => {
                        res.write("<ul>")
                        res.write(`<li>${elem.Des}</li>`)
                        res.write('</ul>')
                    })
                }else if (q.pathname == '/cast'){
                    lista.forEach((elem) => {
                    res.write("<ul>")
                    res.write(`<li>${elem.Des}</li>`)
                    res.write('</ul>')
                    })
                }else if (q.pathname == '/movies'){
                    lista.forEach((elem) => {
                    res.write("<ul>")
                    res.write(`<li><b>Título: </b>${elem.title}</li>`)
                    res.write(`<li><b>Ano: </b>${elem.year}</li>`)
                    res.write(`<li><b>Elenco:</b></li>`)
                    res.write("<ul>")
                    if(elem.hasOwnProperty('cast')){ 
                        elem.cast.forEach((ele) =>{
                            res.write(`<li>${ele}</li>`)
                    })}
                    res.write("</ul>")
                    res.write(`<li><b>Género: </b></li>`)
                    res.write("<ul>")
                    if(elem.hasOwnProperty('genres')){
                        elem.genres.forEach((ele) =>{
                            res.write(`<li>${ele}</li>`)
                    })}
                    res.write("</ul>")
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