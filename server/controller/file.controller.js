const { log } = require("console");
const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8081/files/";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res
        .status(400)
        .send({ message: "Please select a file to upload" });
    }
    res.status(200).send({
      message: "File uploaded successfully：" + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "文件大小不能超过 2MB",
      });
    }
    res.status(500).send({
      message: `Can't upload file: ${req.file.originalname}. ${err}`,
    });
  }
};
const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "File not found.",
      });
    }
    let fileInfos = [];
    console.log(directoryPath);
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
      console.log(file);
    });
    res.status(200).send(fileInfos);
  });
};
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Unable to fetch file." + err,
      });
    }
  });
};
const getFilesData = (req, res) => {
  const fileName = req.params.name;
  const filePath =__basedir + "/resources/static/assets/uploads/" + fileName;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error reading file' });
    } else {
      res.send(data);
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
  getFilesData,
};
