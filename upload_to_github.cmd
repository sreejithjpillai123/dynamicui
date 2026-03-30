@echo off
cd /d "c:\Users\sreejith\OneDrive\Desktop\amayon"
git init
git add .
git commit -m "Upload dynamic UI codebase"
git branch -M main
git remote add origin https://github.com/sreejithjpillai123/dynamicui.git
git push -u origin main
pause
