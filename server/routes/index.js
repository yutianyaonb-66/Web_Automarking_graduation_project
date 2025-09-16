const { verify } = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");
const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");

module.exports = (app) => {
  const User = require("../models/User");
  const Course = require("../models/Course");
  const EnrollRequest = require("../models/EnrollRequest");
  const Assignment = require("../models/Assignment");
  const Submission = require("../models/Submission");
  const Tastcase = require("../models/Tastcase");
  const SECRET = "sdkfjaksdhfakjsdhfaksd";
  const jwt = require("jsonwebtoken");
  const nodemailer = require("nodemailer");
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.get("/files/content/:name", controller.getFilesData);
  app.use(router);

  const isEmail = async (req, res, next) => {
    User.findOne({ email: req.body.email }, function (err, data) {
      if (err) {
      } else {
        if (data) {
          res.send({
            flag: false,
            message: "The current user has been registered",
          });
        } else {
          next();
        }
      }
    });
  };

  app.post("/reg", isEmail, async (req, res) => {
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      verify: req.body.verify,
      identity: req.body.identity,
    });
    if (req.body.verify) {
      res.send({
        flag: true,
        message: "Registered successfully",
      });
    } else {
      res.send({
        flag: true,
        message: "Please check the registered email for verification.",
      });
    }
  });

  app.post("/login", async (req, res) => {
    var email = { email: req.body.email };
    const user = await User.findOne(email);
    if (!user) {
      const data = {
        message:
          "Sorry! The email number you entered does not exist, please re-enter it!",
        flag: false,
      };
      res.send(data);
    } else {
      if (user.password != req.body.password) {
        const data = {
          message:
            "Sorry! The password you entered is incorrect, please re-enter it!",
          flag: false,
        };
        res.send(data);
      } else if (user.verify === false) {
        const data = {
          message: "Account is not activated, please check your email.",
          flag: false,
        };
        res.send(data);
      } else {
        const rule = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          identity: user.identity,
        };

        jwt.sign(rule, "secret", { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          console.log(token);
          res.json({
            flag: true,
            token: "Bearer " + token,
          });
        });
      }
    }
  });

  app.post("/email", async (req) => {
    var email = req.body.email;
    var firstname = req.body.firstname;
    let currentDate = new Date().toLocaleString(); 
    console.log(email);

    let transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      secureConnection: true,
      port: 465,
      secure: true,
      auth: {
        user: "yutianyaonb88@163.com",
        pass: "WENELXQBGASTJHAC",
      },
    });

    let info = await transporter.sendMail({
      from: "Double verify your email --  <yutianyaonb88@163.com>",
      to: email,
      subject: "Verification your email",
      html: `
      <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 5px; width: 600px; margin: 0 auto;">
          <h2>AutoMarking invites you to activate your account</h2>
          <p>Hi,Dear ${firstname}</p>
          <p>Please click the button below to activate your account </p>
          <a href="http://localhost:8080/active/?id=${email}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Verify Account</a>
          <p>Activation Time: ${currentDate}</p>
        </div>
      </div>
    `,
    });
  });

  app.post("/inviteEmail", isEmail, async (req, res) => {
    var email = req.body.email;
    var identity = req.body.identity;
    let currentDate = new Date().toLocaleString(); 
    console.log(email);
    console.log(identity);

    let transporter = nodemailer.createTransport({
      host: "smtp.163.com",
      secureConnection: true,
      port: 465,
      secure: true,
      auth: {
        user: "yutianyaonb88@163.com",
        pass: "WENELXQBGASTJHAC",
      },
    });

    let info = await transporter.sendMail({
      from: "AutoMark invite you to register -- <yutianyaonb88@163.com>",
      to: email,
      subject: "Invite you to register",
      html: `
      <div style="text-align: center; background-color: #f2f2f2; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 5px; width: 800px; margin: 0 auto;">
          <h2>AutoMarking invites you to create your  ${identity} account</h2>
          <p>Hi,</p>
          <p>Please click the button below to create your account </p>
          <a href="http://localhost:8080/inviteReg/?email=${email}&identity=${identity}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Create Account</a>
          <p>Registration Time: ${currentDate}</p>
        </div>
      </div>
    `,
    });
    if (info) {
      const data = {
        message: "Invitation email has been sent",
        flag: true,
      };
      res.send(data);
    }
  });

  app.post("/active", async (req, res) => {
    var email = { email: req.body.email };
    var updatTrue = { $set: { verify: "true" } };
    const user = await User.findOne(email);
    // console.log(email);
    if (!user) {
      const data = {
        message:
          "Activation failed, please check the link in your email and try again.",
        flag: false,
      };
      res.send(data);
    } else {
      await User.findOneAndUpdate(email, updatTrue, function (err) {
        if (err) {
          console.log(err);
          return;
        }
      });
      const data = {
        message: "Account activation succeeded",
        flag: true,
      };
      res.send(data);
    }
  });

  app.post("/resetpw", async (req, res) => {
    var email = { email: req.body.email };
    const user = await User.findOne(email);
    if (!user) {
      const data = {
        message:
          "Email is not registered, please check if the email is correct.",
        flag: false,
      };
      res.send(data);
    } else {
      var email = req.body.email;
      console.log(email);

      let transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        secureConnection: true,
        port: 465,
        secure: true,
        auth: {
          user: "yutianyaonb88@163.com",
          pass: "WENELXQBGASTJHAC",
        },
      });

      let info = await transporter.sendMail({
        from: "Reset your account password -- <yutianyaonb88@163.com>",
        to: email,
        subject: "Reset password",
        text:
          `Hi, Dear ` +
          user.firstname +
          ` Please click the link below to reset your password http://localhost:8080/#/changepw/?id=` +
          email,
      });

      const data = {
        message:
          "The verification email has been sent, please check your email.",
        flag: true,
      };
      res.send(data);
    }
  });

  app.post("/getchangpw", async (req, res) => {
    var email = { email: req.body.email };
    const user = await User.findOne(email);
    if (!user) {
      const data = {
        message:
          "The link is invalid, please check your email again and try again.",
        flag: false,
      };
      res.send(data);
    } else {
      const data = {
        flag: true,
        user: user,
      };
      res.send(data);
    }
  });

  app.post("/changepw", async (req, res) => {
    var email = { email: req.body.email };
    var newPaw = { password: req.body.password };
    const user = await User.findOne(email);
    if (!user) {
      const data = {
        message:
          "Failed to change password, please check your email again and try again.",
        flag: false,
      };
      res.send(data);
    } else {
      await User.findOneAndUpdate(email, newPaw, function (err) {
        if (err) {
          console.log(err);
          return;
        }
      });
      const data = {
        message: "Changed password successfully.",
        flag: true,
      };
      res.send(data);
    }
  });

  app.post("/userlist", async (req, res) => {
    const user = await User.find();
    const newUser =[];
    for(let i=0; i<user.length; i++){
      if(user[i].identity!='admin'){
        newUser.push(user[i])
      }     
    }
    if (newUser) {
      const data = {
        message: "Get phonelist successfully",
        flag: true,
        user: newUser,
      };
      res.send(data);
    } else {
      const data = {
        message: "Error",
        flag: false,
      };
      res.send(data);
    }
  });

  app.post("/changidentitybyid", async (req, res) => {
    var userid = { _id: req.body.id };
    var identity = req.body.identity;
    await User.findOneAndUpdate(userid, { identity: identity }, function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });

  app.post("/createcourse", async (req, res) => {
    console.log(req.body.tutor);
    const newCourse = await Course.create({
      course_code: req.body.course_code,
      course_name: req.body.course_name,
      description: req.body.description,
      course_credit: req.body.course_credit,
      tutor: req.body.tutor,
    });
    res.send({ flag: true, message: "Successfully created course" });
  });

  app.post("/unapprovedcourse", async (req, res) => {
    const course = await Course.find();
    const newCourse = [];
    for (let item of course) {
      if (item.approved == false) {
        newCourse.push(item);
      }
    }
    if (newCourse) {
      const data = {
        message: "Get course successfully",
        flag: true,
        course: newCourse,
      };
      res.send(data);
    } else {
      const data = {
        message: "Error",
        flag: false,
      };
      res.send(data);
    }
  });

  app.post("/courseaudit", async (req, res) => {
    var courseid = { _id: req.body.id };
    var state = req.body.state;
    if (state) {
      await Course.findOneAndUpdate(
        courseid,
        { approved: true },
        function (err) {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
    } else {
      await Course.findOneAndDelete(courseid);
    }
  });

  app.post("/approvedcourse", async (req, res) => {
    const course = await Course.find();
    const newCourse = [];
    for (let item of course) {
      if (item.approved == true) {
        newCourse.push(item);
      }
    }
    if (newCourse) {
      const data = {
        message: "Get course successfully",
        flag: true,
        course: newCourse,
      };
      res.send(data);
    } else {
      const data = {
        message: "Error",
        flag: false,
      };
      res.send(data);
    }
  });

  app.post("/enrollcourse", async (req, res) => {
    var courseid = { courseid: req.body.courseid };
    const newRequire = await EnrollRequest.create({
      courseid: req.body.courseid,
      studentid: req.body.studentid,
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      course_code: req.body.course_code,
      course_name: req.body.course_name,
    });
    res.send({
      flag: true,
      message:
        "Successfully submit the enroll information, please wait for Admins approval",
    });
  });

  app.post("/unapprovestudent", async (req, res) => {
    const request = await EnrollRequest.find();
    if (request) {
      const data = {
        message: "Get course successfully",
        flag: true,
        course: request,
      };
      res.send(data);
    } else {
      const data = {
        message: "Error",
        flag: false,
      };
      res.send(data);
    }
  });

  app.post("/studentaudit", async (req, res) => {
    var requestid = { _id: req.body.id };
    var state = req.body.state;
    if (state) {
      const request = await EnrollRequest.find(requestid);
      const courseid = await Course.updateOne(
        { _id: request[0].courseid },
        { $addToSet: { user: request[0].studentid } }
      );
      if (courseid) {
        await EnrollRequest.findOneAndDelete(requestid);
        const data = {
          message: "Approved",
          flag: true,
        };
        res.send(data);
      } else {
        const data = {
          message: "Error",
          flag: false,
        };
        res.send(data);
      }
    } else {
      await EnrollRequest.findOneAndDelete(requestid);
    }
  });

  app.post("/getcourse", async (req, res) => {
    var userid = { user: req.body.userid };
    var tutorid = { tutor: req.body.userid };

    async function getData(userid, tutorid) {
      var value;
      try {
        value = await Course.find(userid);
        if (value.length === 0) {
          value = await Course.find(tutorid);
          if (value.length === 0) {
            throw new Error("No data found");
          }
        }
      } catch (error) {
        throw new Error(error);
      }
      return value;
    }
    getData(userid, tutorid)
      .then((data) => {
        const value = {
          message: "Get course successfully",
          flag: true,
          course: data,
        };
        res.send(value);
      })
      .catch((error) => {
        const value = {
          message: "Error",
          flag: false,
        };
        res.send(value);
      });
  });

  app.post("/createassignment", async (req, res) => {
    const newAssignemnt = await Assignment.create({
      name: req.body.name,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      score: req.body.score,
      answer: req.body.answer,
      totleScore: req.body.totleScore,
    });
    const courseid = await Course.updateOne(
      { _id: req.body.courseID },
      { $addToSet: { assignment: newAssignemnt._id } }
    );
    res.send({
      flag: true,
      message: "Create assignment successful.",
    });
  });

  app.post("/getassignment", async (req, res) => {
    var courseID = { _id: req.body.courseID };
    const course = await Course.find(courseID);
    if (course) {
      const assignment = [];
      // console.log(course[0].assignment.length);
      for (let i = 0; i < course[0].assignment.length; i++) {
        assignment.push(await Assignment.find(course[0].assignment[i]));
      }
      if (assignment.length) {
        const notStartedTasks = []; // 未开始的任务
        const ongoingTasks = []; // 正在进行的任务
        const completedTasks = []; // 已经结束的任务
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 10); // 将 UTC 时间增加 10 小时
        const date = new Date(now);
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        for (let q = 0; q < assignment.length; q++) {
          if (date < assignment[q][0].start_date) {
            // 任务未开始
            notStartedTasks.push(assignment[q][0]);
          } else if (
            date >= assignment[q][0].start_date &&
            date <= assignment[q][0].end_date
          ) {
            // 任务正在进行
            ongoingTasks.push(assignment[q][0]);
          } else {
            // 任务已结束
            completedTasks.push(assignment[q][0]);
          }
        }
        const data = {
          message: "Get Assignment Success",
          flag: true,
          notStartedTasks: notStartedTasks,
          ongoingTasks: ongoingTasks,
          completedTasks: completedTasks,
        };
        res.send(data);
        // console.log("未开始的任务：", notStartedTasks);
        // console.log("正在进行的任务：", ongoingTasks);
        // console.log("已结束的任务：", completedTasks);
        // console.log(date);
      } else {
        const data = {
          message: "Assignment is empty",
          flag: false,
        };
        res.send(data);
      }
    }
  });

  app.post("/updateassignment", async (req, res) => {
    const assignmentID = { _id: req.body.assignmentID };
    const updatedFields = {
      name: req.body.name,
      end_date: req.body.end_date,
      score: req.body.score,
      description: req.body.description,
    };
    console.log(assignmentID);
    try {
      await Assignment.updateOne(assignmentID, updatedFields);
      // console.log(result);
      const data = {
        message: "Update Success",
        flag: true,
      };
      res.send(data); // respond with the result of the update operation
    } catch (error) {
      const data = {
        message: "Error",
        flag: false,
      };
      res.send(data); // respond with an error if the update operation fails
    }
  });

  app.post("/deleteassignment", async (req, res) => {
    const result = await Assignment.deleteOne({ _id: req.body.assignmentID });
    if (result) {
      const results = await Course.updateOne(
        { _id: req.body.courseID },
        { $pull: { assignment: req.body.assignmentID } }
      );
      if (results) {
        const data = {
          flag: true,
        };
        res.send(data);
      } else {
        const data = {
          flag: false,
        };
        res.send(data);
      }
    } else {
      const data = {
        flag: false,
      };
      res.send(data);
    }
  });

  app.post("/getassignmentdetail", async (req, res) => {
    const assignment = await Assignment.findOne({ _id: req.body.assignmentID });
    if (assignment) {
      const data = {
        flag: true,
        assignment: assignment,
      };
      res.send(data);
    }
  });

  app.post("/checkassignment", async (req, res) => {
    let result = 1;
    let submissionsID = null;
    let submissionsFile = null;
    const submissions = await Submission.find();
    if (req.body.role === "tutor") {
      for (let q = 0; q < submissions.length; q++) {
        if (submissions[q].assignment == req.body.assignmentID) {
          result = 2;
          const assignment = await Assignment.findOne({
            _id: req.body.assignmentID,
          });
          if (assignment) {
            if (assignment.marksReleased == true) {
              result = 3;
            }
          }
        }
      }
    } else {
      for (let i = 0; i < submissions.length; i++) {
        if (submissions[i].user == req.body.user) {
          if (submissions[i].assignment == req.body.assignmentID) {
            result = 2;
            submissionsID = submissions[i]._id;
            submissionsFile = submissions[i].file;
            if (submissions[i].grade != null) {
              result = 3;
              submissionsID = submissions[i]._id;
              submissionsFile = submissions[i].file;
            }
          }
        }
      }
    }

    if (submissions) {
      const data = {
        flag: true,
        submissionInfo: {
          result,
          submissionsID,
          submissionsFile,
        },
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "Error",
      };
      res.send(data);
    }
  });

  app.post("/submitassignment", async (req, res) => {
    let newSubmission;
    console.log(req.body.activeStep);
    if (req.body.activeStep == 1) {
      newSubmission = await Submission.create({
        user: req.body.user,
        assignment: req.body.assignment,
        file: req.body.file,
      });
    } else {
      newSubmission = await Submission.updateOne(
        { _id: req.body.ifsubmitsubmissionsID },
        { $set: { file: req.body.file } }
      );
    }
    if (newSubmission) {
      const data = {
        flag: true,
        message: "Successful Submssion",
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "Submit failed",
      };
      res.send(data);
    }
  });

  app.post("/getAllStudentNameSubmited", async (req, res) => {
    const Submissions = await Submission.find({
      assignment: req.body.assignmentID,
    });
    const StudentIDList = [];
    const StudentLists = [];
    if (Submissions) {
      for (let i = 0; i < Submissions.length; i++) {
        StudentIDList.push(Submissions[i].user);
      }
      // console.log(StudentIDList);
      if (StudentIDList) {
        for (let q = 0; q < StudentIDList.length; q++) {
          const StudentList = await User.find({ _id: StudentIDList[q] });
          // console.log(StudentList);
          StudentLists.push(StudentList);
        }
      }
    }
    if (StudentLists) {
      const data = {
        flag: true,
        StudentLists: StudentLists,
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "No students have submitted assignments yet",
      };
      res.send(data);
    }
  });

  app.post("/getStudentSubmitContent", async (req, res) => {
    let filename = null;
    let submitID = null;
    const studentDetail = await User.find({ _id: req.body.studentID });
    const submissions = await Submission.find();
    if (submissions) {
      for (let i = 0; i < submissions.length; i++) {
        if (submissions[i].assignment == req.body.assignmentID) {
          if (submissions[i].user == req.body.studentID) {
            filename = submissions[i].file;
            submitID = submissions[i]._id;
          }
        }
      }
    }
    console.log(filename);
    if (filename) {
      const data = {
        flag: true,
        filename: filename,
        studentDetail: studentDetail,
        submitID: submitID,
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "Error",
      };
      res.send(data);
    }
  });

  app.post("/submitGrade", async (req, res) => {
    await Submission.updateOne(
      { _id: req.body.submitID },
      {
        $set: {
          grade: req.body.grade,
          markDate: req.body.markDate,
          comments: req.body.comments,
          commenter: req.body.commenter,
        },
      }
    );
    await Assignment.updateOne(
      { _id: req.body.assignment },
      { $set: { marksReleased: true } }
    );
    res.send({
      flag: true,
      message: "Score submitted successfully",
    });
  });

  app.post("/getMarksInfo", async (req, res) => {
    let results = [];
    let assignmentIDList = [];
    const { ObjectId } = require("mongodb");
    const courses = await Course.findOne({ _id: req.body.courseID });
    for (let i = 0; i < courses.assignment.length; i++) {
      const assignmentID = courses.assignment[i];
      assignmentIDList.push(assignmentID);
    }
    const convertedAssignmentIDs = assignmentIDList.filter((id) =>
      mongoose.isValidObjectId(id)
    );
    const pipeline = [
      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "assignment",
          as: "submissions",
        },
      },
      {
        $unwind: "$submissions",
      },
      {
        $match: {
          _id: { $in: convertedAssignmentIDs },
          "submissions.user": ObjectId(req.body.userID),
        },
      },
    ];
    const result = await Assignment.aggregate(pipeline);
    console.log(result);
    res.send({
      flag: true,
      result: result,
      message: "Get Marks Successful",
    });
  });

  app.post("/uploadskeleton", async (req, res) => {
    console.log(req.body.skeleton);
    console.log(req.body.courseID);
    const y = await Assignment.updateOne(
      { _id: req.body.courseID },
      {
        $set: {
          skeleton: req.body.skeleton,
        },
      }
    );
    console.log(y);
    res.send({
      flag: true,
      message: "Submit successful",
    });
  });

  app.post("/getResultTable", async (req, res) => {
    // console.log(req.body.assignmentID);
    let score = [];
    const SubmissionList = await Submission.find();
    if (SubmissionList) {
      for (let i = 0; i < SubmissionList.length; i++) {
        console.log(SubmissionList[i].assignment);
        if (SubmissionList[i].assignment == req.body.assignmentID) {
          score.push(SubmissionList[i].grade);
        }
      }
    }
    console.log(score);
    if (score) {
      const data = {
        flag: true,
        score: score,
      };
      res.send(data);
    }
  });

  app.post("/updateFile", async (req, res) => {
    let newSubmission;
    let createSubmission;

    const SubmissionList = await Submission.find();
    if (SubmissionList) {
      for (let i = 0; i < SubmissionList.length; i++) {
        if (SubmissionList[i].user == req.body.user) {
          // console.log(req.body.assignment);
          if (SubmissionList[i].assignment == req.body.assignment) {
            newSubmission = await Submission.updateOne(
              { _id: SubmissionList[i]._id },
              {
                $set: { file: req.body.file },
              }
            );
          }
        }
      }
    }
    if(!newSubmission){
      createSubmission = await Submission.create({
        user: req.body.user,
        assignment: req.body.assignment,
        file: req.body.file,
      });
    }
    if (newSubmission || createSubmission) {
      const data = {
        flag: true,
        message: "Successful Submssion!",
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "Error!",
      };
      res.send(data);
    }
  });

  app.post("/createTaskcase", async (req, res) => {
    const newTaskcase = await Tastcase.create({
      name: req.body.name,
      assignment: req.body.assignment,
      testType: req.body.testType,
      returnValue: req.body.returnValue,
      score: req.body.score,
      hidden: req.body.hidden,
    });
    if (newTaskcase) {
      const data = {
        flag: true,
        message: "Add task case Successful!",
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "error!",
      };
      res.send(data);
    }
  });

  app.post("/gateTaskcase", async (req, res) => {
    const tastcases = await Tastcase.find({ assignment: req.body.assignment });
    let hiddencases = [];
    let publiccases = [];
    if (tastcases) {
      for (let i = 0; i < tastcases.length; i++) {
        if (tastcases[i].hidden == "Public") {
          publiccases.push(tastcases[i]);
        } else {
          hiddencases.push(tastcases[i]);
        }
      }
    }

    if (tastcases) {
      const data = {
        flag: true,
        tastcases: tastcases,
        hiddencases: hiddencases,
        publiccases: publiccases,
        message: "Get Task case successful",
      };
      res.send(data);
    } else {
      const data = {
        flag: false,
        message: "Task case is empty",
      };
      res.send(data);
    }
  });

  app.post("/deleteTaskcase", async (req, res) => {
    const result = await Tastcase.deleteOne({ _id: req.body.taskcaseID });
    if (result) {
      const data = {
        flag: true,
        message: "Delete Successful",
      };
      res.send(data);
    }
  });
};
