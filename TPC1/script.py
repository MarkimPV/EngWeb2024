import xml.etree.ElementTree as ET
import os

os.chdir("./MapaRuas-materialBase")

file = open("./texto/MRB-01-RuaDoCampo.xml",'r')

tree = ET.parse("./texto/MRB-01-RuaDoCampo.xml")
root = tree.getroot()



def extractName(element):
    return element.find('./meta/nome').text

def extractImages(element):
    imageInfo = []
    for image in element.findall('./corpo/figura'):
        imageInfo.append((image.find('imagem').get('path'),image.find('legenda').text))
    return {extractName(element):imageInfo}

def extractDescrition(element):
    rua_paragrafos = []
    for paragrafo in element.findall('./corpo/para'):
        para_text = paragrafo.text.strip() if paragrafo.text else ''

        for child_elem in paragrafo:
            if child_elem.tag == 'lugar':
                lugar_text = child_elem.text.strip() if child_elem.text else ''
                para_text += f' <a href="{lugar_text}.html">{lugar_text}</a>'

            elif child_elem.tag == 'data':
                data_text = child_elem.text.strip() if child_elem.text else ''
                para_text += f' {data_text}'

            elif child_elem.tag == 'entidade' and child_elem.get('tipo') == 'instituição':
                entidade_text = child_elem.text.strip() if child_elem.text else ''
                para_text += f' {entidade_text}'

        # Append the processed paragraph to the list
        rua_paragrafos.append(para_text)

    return rua_paragrafos
    
    
print(extractDescrition(root))