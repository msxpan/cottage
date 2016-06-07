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
    filePath=env + '/src/' + folder + env +'.html';
  }else if(type=="css"){
    filePath=env + '/src/resource/css/' + env + '.css';
  }else if(type=="js"){
    filePath=env + '/src/resource/js/' + env + '.js';
  }else if(type=="png"){
    filePath=env + '/src/images/' + env + '.png';
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


var stat = fs.stat;

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;       
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst );   
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};



program
.version('0.0.1')
.command('*')
.action(function(env){

  var gulpConfigPath = process.mainModule.paths[0].substr(0,process.mainModule.paths[0].length-12)+'/gulpConfig/resource'
  createDirsSync(env+'/src/static','/')
  createDirsSync(env+'/src/resource','/')
  createDirsSync(env+'/src/wcm','/')
  
  createDirsSync(env+'/src/resource/js','/')
  createDirsSync(env+'/src/resource/css','/')
  createDirsSync(env+'/src/resource/images','/')

  exists(gulpConfigPath, env+'/', copy );

  creatHtml(env,'static','html')
  creatHtml(env,'wcm','html')
  creatHtml(env,'','js')
  creatHtml(env,'','css')
  creatHtml(env,'','png')
  
});

program.parse(process.argv);


