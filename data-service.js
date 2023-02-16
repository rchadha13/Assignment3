var fs = require("fs");

var student_data = require("./data/students.json");
var program_data = require("./data/programs.json");
const path = require('path');


let initialize = new Promise(function (resolve, reject) {
    fs.readFile("./data/students.json", "utf8", (err, data_student) => {
        if (err) {
            reject(new Error("Something is not right!"));
        } else {
            student_data = JSON.parse(data_student);
            fs.readFile("./data/students.json", "utf8", (err, data_program) => {
                if (err) {
                    reject(new Error("Something is not right!"));
                } else {
                    program_data = JSON.parse(data_program);
                    resolve("data has been initialized");
                }
            });
        }
    });
});

let getAllStudents = new Promise(function (resolve, reject) {
    if (student_data.length==0){
        reject( "no results returned")
    }
    resolve(student_data)
});

let getInternationalStudents = new Promise(function (resolve, reject) {
    var interstudents = new Array();
    for (let index = 0; index < student_data.length; index++) {
        const element = student_data[index];
        if (element['isInternationalStudent']) {
            interstudents.push(element);
        }
    }
    if (interstudents.length==0){
        reject( "no results returned")
    }
    resolve(interstudents)
});

let getPrograms = new Promise(function (resolve, reject) {
    
    if (program_data.length==0){
        reject( "no results returned")
    }
    resolve(program_data)
});

const images = [];
let addImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
    images.push(imageUrl);
    resolve();
    });
};
    
let getImages = () => {
    return new Promise((resolve, reject) => {
    if (images.length == 0) {
    reject("no results returned");
    }
    resolve(images);
    });
};

let students = [];

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
      if (studentData.isInternationalStudent === undefined) {
        studentData.isInternationalStudent = false;
      } else {
        studentData.isInternationalStudent = true;
      }
  
      // Read existing data from file
      fs.readFile(path.join(__dirname, "data", "students.json"), (err, data) => {
        if (err) {
          reject(err);
        } else {
          let students = JSON.parse(data);
          
          // Generate new student ID
          let maxId = Math.max(...students.map((student) => Number(student.studentId)));
          studentData.studentId = (maxId + 1).toString();
  
          // Add new student data to existing data
          students.push(studentData);
  
          // Write updated data back to file
          fs.writeFile(
            path.join(__dirname, "data", "students.json"),
            JSON.stringify(students),
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        }
      });
    });
}

function getStudentsByStatus(status) {
    return new Promise((resolve, reject) => {
      const matchingStudents = student_data.filter(student_data => student_data.status === status);
  
      if (matchingStudents.length === 0) {
        reject(new Error("no results returned"));
      } else {
        resolve(matchingStudents);
      }
    });
}

function getStudentsByProgramCode(programCode) {
    return new Promise((resolve, reject) => {
      const matchingStudents = student_data.filter(student_data => student_data.program === programCode);
        
      if (matchingStudents.length === 0) {
        reject(new Error("no results returned"));
      } else {
        resolve(matchingStudents);
      }
    });
}

function getStudentsByExpectedCredential(credential) {
    return new Promise((resolve, reject) => {
      const matchingStudents = student_data.filter(student_data => student_data.expectedCredential === credential);
  
      if (matchingStudents.length === 0) {
        reject(new Error("no results returned"));
      } else {
        resolve(matchingStudents);
      }
    });
}

function getStudentById(sid) {
    // return new Promise((resolve, reject) => {
    //     console.log(sid);
    //   const matchingStudents = student_data.filter((student_data) => student_data.studentId === sid);
        
    //   if (matchingStudents.length === 0) {
    //     reject(new Error("no result returned"));
    //   } else {
    //     resolve(matchingStudents[0]);
    //   }
    // });
   
        return new Promise((resolve, reject) => {
          const student = student_data.find(student_data => student_data.studentID === sid);
          if (student) {
            resolve(student.firstName + " " +student.lastName);
          } else {
            reject(new Error("no result returned"));
          }
        });
      
      
}
  

const message = () => {
    const name = "Jesse";
    const age = 40;
    return name + " is " + age + "years old.";
};

module.exports = { message, initialize, getAllStudents, getInternationalStudents, getPrograms, addImage, getImages, addStudent, getStudentsByStatus, getStudentsByProgramCode, getStudentsByExpectedCredential, getStudentById};