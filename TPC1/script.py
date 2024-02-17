import xml.etree.ElementTree as ET
import os
import re

os.chdir("./MapaRuas-materialBase")

def extractName():
    return root.find('./meta/nome').text

def extractImages():
    imageInfo = []
    for figure in root.findall('./corpo/figura'):
        imageInfo.append({figure.find('legenda').text : figure.find('imagem').get('path')})
    return imageInfo

def extractDefenition():

    content = []

    paragrafos = root.findall('./corpo/para')

    for para in paragrafos:
        paragrafo = ''
        paragrafo += para.text.strip() if para.text else ''
        
        for elem in para:
            text = f' <b>{elem.text.strip()}</b> ' if elem.text else ''
            if elem.tag == 'lugar':
                paragrafo += text
            elif elem.tag == 'data':
                paragrafo += text
            elif elem.tag == 'entidade':
                paragrafo += text
            else:
                paragrafo += text
        
            if elem.tail:
                paragrafo += elem.tail.strip()
        
        content.append(f'<p>{paragrafo}</p>')
    

    return content

def extractHouses():
    houses = []

    for house in root.findall('./corpo/lista-casas/casa'):
        dic = {}
        for elem in house:
            if elem.tag == 'desc':
                content = []
                for para in elem.findall('para'):
                    paragrafo = ''
                    paragrafo += para.text.strip() if para.text else ''
        
                    for elemente in para:
                        text = f' <b>{elemente.text.strip()}</b> ' if elemente.text else ''
                        if elemente.tag == 'lugar':
                            paragrafo += text
                        elif elemente.tag == 'data':
                            paragrafo += text
                        elif elemente.tag == 'entidade':
                            paragrafo += text
                        else:
                            paragrafo += text

                        if elemente.tail:
                            paragrafo += elemente.tail.strip()
        
                    content.append(f'<p>{paragrafo}</p>')
                dic[elem.tag] = content
            else:
                dic[elem.tag] = elem.text
        houses.append(dic)
    return houses




def buildHTML():
    html='''
<!DOCTYPE html>
<html>
<head>
    <title>Engweb2024</title>
    <meta charset="UTF-8">
</head>
<body>
    '''

    name = extractName()
    template = html
    template += f'<h1>{name}</h1>\n'
    template += f'    <h2>Descrição:</h2>\n'
    
    description = extractDefenition()

    for para in description:
        template+=f'        {para}\n'
    
    houses = extractHouses()
    template += '<h2>Casas</h2>'
    for house in houses:
        template += f'<p><h3>Nº {house['número']}</h3></p>' if 'número' in house else '\n'
        template += f'<p><b>Enfiteuta:</b> {house['enfiteuta']}</p>' if 'enfiteuta' in house else '\n'
        template += f'<p><b>Foro:</b> {house['foro']}</p>' if 'foro' in house else '\n'
        template += f'<p><b>Descrição:</b>' 
        if 'desc' in house:
            for para in house['desc']:
                template += f'<p>{para}</p>'
        template += f'</p>'

    images = extractImages()

    for i in images:
        for i2 in i:
            template += (f'<img src="{i[i2]}" width="500" alt="Imagem da Rua">\n')
            template += (f'<p>{i2}</p>\n')
    
    template += '<h2>Fotos atuais</h2>'
    for file in os.listdir("./atual"):
            name_sem_espacos = re.sub(r"\s+", "", name)
            padrao = re.compile(re.escape(name_sem_espacos), re.IGNORECASE)
           # padrao = re.compile(name, re.IGNORECASE)
            if padrao.search(file):
                template += (f'<img src="../atual/{file}" width="500" alt="Imagem da Rua">\n')
    
    template += f'<h4><a href="../Ruas.html">Voltar</a></h4>'
    template += "</body>\n"
    template += "</html>"   

    file1 = open(f"./HTML/{name}.html","w",encoding="utf-8")
    file1.write(template)
    file1.close()    

def buildHTMLPrincipal(lista):
    html='''
<!DOCTYPE html>
<html>
<head>
    <title>Engweb2024</title>
    <meta charset="UTF-8">
</head>
<body>
    '''
    template = html
    for rua in sorted(lista):
        template += f'<li><a href="HTML/{rua}.html">{rua}</a></li>'

    html += "</body>\n"
    html += "</html>"  

    file1 = open(f"./Ruas.html","w",encoding="utf-8")
    file1.write(template)
    file1.close()   



ruas = []
for file in os.listdir("./texto/"):

    tree = ET.parse(f"./texto/{file}")
    root = tree.getroot()
    ruas.append(extractName())
    buildHTML()
buildHTMLPrincipal(ruas)





