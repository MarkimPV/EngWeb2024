import json

id = 1

with open("compositores.json","r", encoding="utf-8") as file:
    periodos = {}
    compositores = json.load(file)
    for entrada in compositores["compositores"]:
        if entrada["periodo"] not in periodos.keys():
            periodo = {"id":f'P{id}',"nome":entrada["periodo"],"compositores":[]}
            periodos[entrada["periodo"]] = periodo
            id +=1
        periodos[entrada["periodo"]]["compositores"].append({"id":entrada["id"],"nome":entrada["nome"]})
        entrada["periodo"] = {"id":periodos[entrada["periodo"]]["id"],"nome":entrada["periodo"]}

periodos_list = []

for dic in periodos.values():
    periodos_list.append(dic)

new_json_dic = {"compositores" : compositores["compositores"],"periodos":periodos_list}

with open("compositores_new.json","w") as file:
    json.dump(new_json_dic,file,indent=2)

