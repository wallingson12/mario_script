import os

# pasta de origem
pasta_origem = "assets"  # ajuste para a pasta raiz do seu projeto

for root, dirs, files in os.walk(pasta_origem):
    for file in files:
        caminho_completo = os.path.join(root, file)
        print(caminho_completo)
