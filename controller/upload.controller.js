const multer = require("multer");
const {upLoadProfile,upLoadDocuments} = require('../middleware/multer');

exports.uploadImage = (req, res) => {
   
    upLoadProfile(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return  res.status(500).send({
                message: err.message || 'Some error occurred uploading files.',
              });
        } else if (err) {
          return  res.status(500).send({
                message: err.message || 'Some error occurred uploading files.',
              });
          
        }
   return res.status(200).send(req.file)

 })



   
  };
  

  exports.uploadDocument = (req, res) => {
    
    upLoadDocuments(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return  res.status(500).send({
                message: err.message || 'Some error occurred uploading files.',
              });
        } else if (err) {
            return  res.status(500).send({
                message: err.message || 'Some error occurred uploading files.',
              });
        }
   return res.status(200).send(req.file)
  
   
      });
  };
  