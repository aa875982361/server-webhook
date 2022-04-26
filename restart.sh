tsc
NAME=$1;
npx pm2 describe $NAME > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
    echo "start app '$NAME'..."
    npx pm2 start ./dist/index.js --name $NAME
else
    echo "restart app '$NAME'..."
    npx pm2 restart $NAME
fi;