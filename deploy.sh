#!/bin/bash

set -e

echo "🛠 Building site..."
bundle exec jekyll build

echo "🚀 Deploying to gh-pages..."
git worktree add ../_site-deploy gh-pages
cp -r _site/* ../_site-deploy
cd ../_site-deploy
git add .
git commit -m "Deploy at $(date)"
git push origin gh-pages
cd ../my-forty-site
git worktree remove ../_site-deploy

echo "✅ Deployed!"

