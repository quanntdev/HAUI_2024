# Exit when any command fails
set -e

if [ -z "$1" ]; then
  echo "Error: Fill github branch at first parmeter, ex. sh deploy.sh dev"
  exit 0
fi

# Pull new source code
echo "Pulling new source code..."
git fetch origin $1
git checkout -f
git checkout $1
git pull origin $1

echo "Deploy starting..."
# Config environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

export NODE_OPTIONS=--max_old_space_size=4096

npm install || exit

# Do not build on server, we already built on CI server and copy to runtime server
# See file .github/workflows/cd.yml
# BUILD_DIR=temp ./node_modules/next/dist/bin/next build || exit
echo "Checking build folder..."
if [ ! -d "temp" ]; then
  echo '\033[31m temp Directory not exists!\033[0m'  
  exit 1;
fi

rm -rf .next

mv temp .next

pm2 reload ecosystem.config.js

# Load env for secret variable
if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

curl -X POST --data-urlencode "payload={\"channel\": \"#hapo-crm-notice\", \"username\": \"HapoBot\", \"text\": \"@channel Server $NEXT_PUBLIC_DOMAIN has been successfully deployed!\", \"icon_emoji\": \":ghost:\"}" $SLACK_PUSH_CHANNEL
echo "\nDeploy done."
exit 0
