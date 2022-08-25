const { app } = require('./app')
//util
const { sequelize } = require('./util/database')
const { initModels } = require('./util/initModels');

sequelize
    .authenticate()
    .then(() => console.log('Database Postgress authenticate'))
    .catch(error => console.log(error))

// Models relations
initModels();

sequelize
    .sync()
    .then(() => console.log("Database syncronized"))
    .catch(error => console.log(error))

app.listen(4000, () =>{
    console.log('app running')
})
