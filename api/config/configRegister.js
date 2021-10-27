const multer = require('multer');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../../public/filesRegister'));
    },
    filename: function(req, file, cb) { 
        let filename_img = file.originalname + Date.now() + Math.floor(Math.random() * 9999) + path.extname(file.originalname);
        let filename = filename_img.replace("'", "");
        cb(null, filename);
    }
});

const fileFilter = (req,file,cd) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype === "application/vnd.ms-excel" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        cd(null,true)
    }
    else{
        cd(null,false)
    }
}

const uploads = multer({
    storage: storage, fileFilter : fileFilter
}).fields([
    {name: 'filesConsider', maxCount: 5}
]);


module.exports = uploads;
