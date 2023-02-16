/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _____Rajveer Singh Chadha_____ Student ID: __158923219___ Date: ___Feb 3rd, 2023__
*
* Online (Cyclic) Link: https://victorious-jay-dungarees.cyclic.app/
*
********************************************************************************/


var express = require("express");
var data_service = require("./data-service");

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

var app = express();



// import { message } from './data_service.js';

var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

// creating 'upload' variable
const upload = multer({ dest: '/uploads' });

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static('public'));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/intlstudents", function(req, res){
    data_service.getInternationalStudents.then(
        (result) => { 
            res.status(200).json(result)
            
        },
        (error) => { 
           console.log(error);
           res.status(404).json({'message': error})
        }
      );
});

app.get("/students", function(req, res){


    const status = req.query.status;
    const program = req.query.program;
    const credential = req.query.credential;

    if (status) {
        // const filteredStudents = data_service.getStudentsByStatus(status);
        // res.json(filteredStudents);
        data_service.getStudentsByStatus(status).then(
            (result) => { 
                res.status(200).json(result);
                
            },
            (error) => { 
               console.log(error);
               res.status(404).json({'message': error})
            }
          );
    } else if (program) {
        data_service.getStudentsByProgramCode(program).then(
            (result) => { 
                res.status(200).json(result);
                
            },
            (error) => { 
               console.log(error);
               res.status(404).json({'message': error})
            }
          );
    } else if (credential) {
        data_service.getStudentsByExpectedCredential(credential).then(
            (result) => { 
                res.status(200).json(result);
                
            },
            (error) => { 
               console.log(error);
               res.status(404).json({'message': error})
            }
          );
    } else {
        data_service.getAllStudents.then(
            (result) => { 
                res.status(200).json(result);
                
            },
            (error) => { 
               console.log(error);
               res.status(404).json({'message': error})
            }
          );
    }
    
    // data_service.getAllStudents.then(
    //     (result) => { 
    //         res.status(200).json(result);
            
    //     },
    //     (error) => { 
    //        console.log(error);
    //        res.status(404).json({'message': error})
    //     }
    //   );

    

});

app.get("/student/:id", (req, res) => {
    const sid = req.params.id;
    // console.log(sid)
    // data_service.getStudentById(sid)
    //   .then(student => {
    //     res.json(student);
    //   })
    //   .catch(err => {
    //     res.status(404).json({ error: "no result returned" });
    //   });

    data_service.getStudentById(sid).then(
        (result) => { 
            res.status(200).json(result);
            
        },
        (error) => { 
           console.log(error);
           res.status(404).json({'message': error})
        }
      );
});

app.get("/students/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addStudent.html"));
});


app.get("/images/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addImage.html")); 
});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }   
          );
  
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
      }
  
      upload(req)
        .then((uploaded) => {
          processForm(uploaded.url);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      processForm("");
    }
  
    function processForm(imageUrl) {
      try {
        // Call the addImage function from the data-service.js module to add the image URL to the images array
        data_service.addImage(imageUrl);
        // data_service.getImages()
        res.redirect('/images');
      } catch (error) {
        console.error(error);
      }
    }
});
  


app.get("/programs", function(req, res){
    data_service.getPrograms.then(
        (result) => { 
            res.status(200).json(result)
            
        },
        (error) => { 
           console.log(error);
           res.status(404).json({'message': error})
        }
      );
});

app.get('*', function(req, res){
    // res.status(404).json()
    res.sendFile(path.join(__dirname,"/views/error.html"));
});


// console.log(data_service);

// setup http server to listen on HTTP_PORT

data_service.initialize.then(
    (result) => { 
       console.log(result);   
       app.listen(HTTP_PORT, onHttpStart);
    },
    (error) => { 
       console.log(error);
    }
);

//Setting up the cloudinary config
cloudinary.config({
    cloud_name: 'dd4tqrcwv',
    api_key: '659647782241726',
    api_secret: 'faJv4tlD6-EshZf3YIyH8EmWRPY',
    secure: true
});

//return the images in a JSON format

app.post("/images", function(req,res){

    data_service.getImages()
        .then((images) => {
            res.json({images: images});
        })
        .catch((error) => {
            res.status(500).send({error: error});
        });
    // res.json({ images });
});


// Adding the built-in "express.urlencoded" middleware
app.use(express.urlencoded({ extended: true }));

app.post("/students/add", function(req, res){
    // data_service.addStudent(req.body)
    //   .then(() => {
    //     res.redirect("/students");
    //   })
    //   .catch((error) => {
    //     res.json({ error:error});
    // });
    try {
        data_service.addStudent(req.body)
            .then(() => {
                res.redirect("/students");
            })
    } catch (error) {
        res.json({ error:error});
    }
});
  