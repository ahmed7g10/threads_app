const multer = require('multer');
const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const Upload = multer({ storage });
module.exports = { Upload };


// const multer=require('multer');
// const path=require('path');
// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'uploads')

//     },
//     filename:(req,file,cb)=>{
//         cb(null,Date.now()+path.extname(file.originalname));
//     }
// })
// const uplo=multer({storage})
// export it