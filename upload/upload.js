var formidable = require('formidable'),
    http = require('http'),
    // 单元文件管理工具，上载表单解析数据
    util = require('util'),
    fs =  require('fs'),
    path = require('path'),
    //添加时间戳模块
    timestamp = require('time-stamp');
 
http.createServer(function(req, res) {
  //判断当前的执行环境是否为上传文件post请求 
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    // 调用formidable的IncomingForm表单构建方法
    var form = new formidable.IncomingForm();
    // 设置上载文件目录
    form.uploadDir = "./uploads";

    // 表单的数据对象解析
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/html;charset=UTF-8;'});
      res.write('received upload:\n\n');
    //   fields表示的是文本域
    // files代表当前文件信息
    // inspect解析
      console.log(util.inspect({fields: fields, files: files}))
      res.end('上传成功');
    // 保证即使文件名相同，在不同的时间也能提交上去我们的文件信息
    //  添加重命名
    //   0.个性签名-jsx
    //   1.时间戳 - 可以实现同一秒上传多个文件也不会被覆盖
    //   2.随机数 - 4位随机数紧随其后，保证文件名绝对唯一
        var sign = 'jsx_'
        var timing = timestamp('YYYYMMDDHHmmss')
        //Math.ceil & Math.floor
        // Math.random()==>[0,1)==>1000,9999四位整数
        // Math.random()+1000==>[1000,1001)
        // Math.random()*8999==>[0,8999)+1000==>[1000,9999)
        // Math.floor向下取整
        // Math.floor(Math.random()*8999+1000)==>[1000,9999)==>[1000,9998]所有的整数
        //  Math.ceil(Math.random()*8999+1000)==>[1000,9999)==>[1000,9999]所有的整数
        
        var random = Math.ceil(Math.random()*8999+1000)
        //截取到原始文件的后缀名
        var extname = path.extname(files.uploads.name)
        //重命名后的结果
        var reName = sign+timing+random+extname
        var oldname = __dirname+'/'+files.uploads.path;
        var newname = __dirname+'/uploads/'+reName

    //   fs实现重命名
        fs.rename(oldname,newname,(err)=>{
          if(err){console.log(err)}
          console.log('重命名成功')
        })
    });
 
    return;
  }
}).listen(3000);

console.log('当前服务器运行端口为3000')