const app = require('./src/app');
const config = require('./src/config/config');

app.listen(config.PORT, () => {
    console.log(`===========================================`);
    console.log(`Movie Service (Person 3) is running!`);
    console.log(`Port: ${config.PORT}`);
    console.log(`Health Check: http://localhost:${config.PORT}/`);
    console.log(`API Resource: http://localhost:${config.PORT}/movies`);
    console.log(`===========================================`);
});
