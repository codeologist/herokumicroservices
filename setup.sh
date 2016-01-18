#!/bin/bash

mkdir my-awesome-app
cd my-awesome-app
npm init --yes
npm config set save=true
npm config set save-exact=true
cat ~/.npmrc

echo 'node_modules' >> .gitignore
git rm -r --cached node_modules
git commit -am 'ignore node_modules'

#clustering
npm install --save --save-exact throng


echo 'npm-debug.log' >> .gitignore
git commit -am 'ignore npm-debug'