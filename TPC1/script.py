import xml.etree.ElementTree as ET
import os

os.chdir("./MapaRuas-materialBase")

file = open("./texto/MRB-01-RuaDoCampo.xml",'r')

tree = ET.parse("./texto/MRB-01-RuaDoCampo.xml")
root = tree.getroot()

def extractName():
    return root.find('./meta/nome').text

def extractImages():
    imageInfo = []
    for image in root.findall('./corpo/figura'):
        imageInfo.append((image.find('imagem').get('path'),image.find('legenda').text))
    return {extractName():imageInfo}

def extractDefenition():

    content = []

    paragrafos = root.findall('./corpo/para')

    for para in paragrafos:
        paragrafo = ''
        paragrafo += para.text.strip() if para.text else ''
        
        for elem in para:
            text = f' <Strong>{elem.text.strip()}</Strong> ' if elem.text else ''
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

    template = html

    template += f'<h1>{extractName()}</h1>\n'
    template += f'    <h2>Descrição:</h2>\n'
    
    description = extractDefenition()

    for para in description:
        template+=f'        {para}\n'
    


    template += "</body>\n"
    template += "</html>"

    template += (f'<div class="image-with-caption">\n')
    template += (f'    <img src="{"img_path"}" alt="Imagem da Rua">\n')
    template += (f'    <p>{"legenda"}</p>\n')
    template += ('</div>\n')
    template += ('</div>\n')

    file1 = open("teste1.html","w",encoding="utf-8")
    file1.write(template)
    file1.close()    

buildHTML()
