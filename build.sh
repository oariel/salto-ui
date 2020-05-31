echo 'Did you update the version number?'
cp ../lib/approvals.js lib/.
cp ../lib/logger.js lib/.
cp ../lib/env-.js lib/.
cp -r ../lib/jslt lib/.
npm run dist
