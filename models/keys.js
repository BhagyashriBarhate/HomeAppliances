// dbPassword = 'mongodb+srv://bhoomi:<password>@cluster0-jabjj.mongodb.net/test?retryWrites=true&w=majority';

// module.exports = {
//     mongoURI: dbPassword
// };


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/LoginReg', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./models/User');