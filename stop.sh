tsc
NAME=${1:-server-webhook};
npx pm2 describe $NAME > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
    echo "not app '$NAME'..."
else
    echo "stop app '$NAME'..."
    npx pm2 stop $NAME
fi;