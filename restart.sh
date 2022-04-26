NAME=$1;
npx pm2 describe $NAME > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
    echo "start app '$NAME'..."
else
    echo "restart app '$NAME'..."
    npm run _stop
fi;
npm run start