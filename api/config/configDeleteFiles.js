const fs = require("fs");

const path_del_file = 'public/filesRegister/';
const path_del_file_tour = 'public/filesTour/';

//main function delete file image
const deleteFile = (name_img) => {
    fs.unlink(`${path_del_file}${name_img}`, (err) => {
        if (err) {
          console.error(err)
          return
        }
    })
}

const deleteFileTour = (name_img) => {
  fs.unlink(`${path_del_file_tour}${name_img}`, (err) => {
      if (err) {
        console.error(err)
        return
      }
  })
}

module.exports =  {
                    deleteFile,
                    deleteFileTour
                  };