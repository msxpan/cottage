#! /usr/bin/env node

var fs = require('fs');
var async = require('async');
var path = require('path');
var program = require('commander');

var createDirsSync = function (dir, split, mode, callback) {
    console.log("创建目录：" + dir);
    if (!fs.existsSync(dir)) {
        var dirArr = dir.split(split);
        var pathtmp;

        async.forEach(dirArr, function (item, cb) {
            // console.log( item);
            if (pathtmp) {
                pathtmp = path.join(pathtmp, item);
            }
            else {
                pathtmp = item;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    cb(null, item);
                }
                else {
                }
            }
        }, function (err) {
            // callback(err);
        })
    }
    else {
        // callback(null);
    }
}

var creatHtml=function(env,folder,type){
  var filePath; 
  if (type=="html") {
    filePath=env + '/src/' + folder + '/index.html';
  }else if(type=="css"){
    filePath=env + '/src/resource/css/' + env + '.css';
  }else if(type=="js"){
    filePath=env + '/src/resource/js/' + env + '.js';
  }

  fs.open(filePath, 'a', function(err, fd) {
      if (err) {
          throw err;
      }

      var buf = new Buffer(8);
      var data;

      if (type=="html") {
        data = '<!DOCTYPE html>\n' +
          '<html>\n\n' +
          '<head>\n' +
          '\t<meta charset="UTF-8">\n' +
          '\t<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">\n' +
          '\t<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n' +
          '\t<title></title>\n' +
          '\t<link rel="stylesheet" type="text/css" href="../resource/css/'+env+'.css">\n' +
          '</head>\n\n' +
          '<body>\n' +
          '</body>\n\n' +
          '<script type="text/javascript" src="../resource/js/'+env+'.js"></script>\n' +
          '</html>\n';
      }else{
        data = ''
      }

      fs.write(fd, data, 0, 8, 0, function(err, bytesWritten, buffer) {
          if (err) {
              throw err;
          }
          console.log(bytesWritten);
          console.log(buffer);
          fs.close(fd, function(err) {
              if (err) {
                  throw err;
              }
              console.log('file closed');
          })

      })
  });



}


program
.version('0.0.1')
.command('*')
.action(function(env){
  // console.log(env)
  createDirsSync(env+'/src/static','/')
  createDirsSync(env+'/src/resource','/')
  createDirsSync(env+'/src/wcm','/')
  
  createDirsSync(env+'/src/resource/js','/')
  createDirsSync(env+'/src/resource/css','/')
  createDirsSync(env+'/src/resource/images','/')

  creatHtml(env,'static','html')
  creatHtml(env,'wcm','html')
  creatHtml(env,'','js')
  creatHtml(env,'','css')
});

program.parse(process.argv);


