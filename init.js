var mongo = require('./www/database/intalize/db_connect');
var user = require('./www/database/tbUser');

var newuser = new user({
   email: 'phamtrungdung@gmail.com',
   username: 'phamtrungdung',
   password: new user().generateHash('123456'),
   status: true,
   isActive: true,
   createAt: Date.now()
})
newuser.save((err,success) =>{
    if(err) console.log(err);
    console.log('Đã thêm');
})



