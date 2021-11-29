const config = require('./common/config');
const app = require('./app');

app.listen(config.PORT, () => console.log(`App is running on http://localhost:${config.PORT}`));
