PROJET BOWLING NODE JS

----------------------------------

Commande pour installer Node JS:

# Mettre à jour l'index des paquets
sudo apt update

# Installer les paquets nécessaires pour ajouter un dépôt HTTPS
sudo apt install -y curl software-properties-common

# Télécharger et ajouter le dépôt NodeSource pour Node.js (par exemple pour Node.js 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Installer Node.js
sudo apt install -y nodejs

----------------------------------

Intaller le package.json:

Dans le dossier qui contient le fichier JS

Ecrire dans le terminal:

npm init -y

----------------------------------

Lancer le projet:

node bowling.js
