const multer = require('multer');
const path = require('path');

//set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../../public/filesTour'));
    },
    filename: function(req, file, cb) { 
        let filename_img = file.originalname + '-' + Date.now() + Math.floor(Math.random() * 9999) + path.extname(file.originalname);
        let filename = filename_img.replace("'", "");
        cb(null, filename);
    }
});

const fileFilter = (req,file,cd) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cd(null,true)
    }
    else{
        cd(null,false)
    }
    // cd(null,true)
}

const uploads = multer({
    storage: storage, fileFilter : fileFilter
}).fields([
    {name: 'previewImage', maxCount: 1},
    {name: 'photos', maxCount: 20},
    {name: 'photosMP1', maxCount: 20},
    {name: 'photosMP2', maxCount: 20}
]);


module.exports = uploads;
