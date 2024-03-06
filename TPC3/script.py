import re
import json

with open('filmes.json',"r",encoding='utf-8') as file:
    list_geral=[]
    set_act = set()
    set_gen = set()
    dic = {}
    for line in file:
        line_json = json.loads(line.strip())
        if 'genres' in line_json.keys():
            for genre in line_json['genres']: 
                set_gen.add(genre)
        if 'cast' in line_json.keys():
            for actor in line_json['cast']:
                set_act.add(actor)   
        list_geral.append(line_json)

    list_gen = []
    list_act = []
    for ind,gen in enumerate(list(set_gen)):
        dic_gen = {f'id' : f'G{ind+1}',f'Des' : gen}
        list_gen.append(dic_gen)
    
    for ind,act in enumerate(list(set_act)):
        dic_act = {f'id' : f'A{ind+1}',f'Des' : act}
        list_act.append(dic_act)

    dic['movies'] = list_geral
    dic['cast'] = list_act
    dic['genres'] = list_gen
    
    with open('filmes_database.json','w',encoding='utf-8') as file_database:
        json.dump(dic,file_database,indent=2)

    
    

