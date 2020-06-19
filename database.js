  const mongoose = require('mongoose');
const URI = 'mongodb://localhost/api2';
mongoose.set('useFindAndModify', false);//Para que no salga aviso en findOneAndUpdate en createVehicle
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('db is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;