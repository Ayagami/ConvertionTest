var express = require('express');
var router 	= express.Router();

//var pdfinfo = require('pdfinfojs');
var fs		= require('fs');
var Canvas 	= require('canvas');
var pdfUtils = require('pdfutils');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploadTestFile', function(req,res){
	res.render('upload', {title: 'Uploading a Test File'});
});

router.post('/uploadTestFile', function(req,res){
	var fstream;
	req.pipe(req.busboy);

	req.busboy.on('file', function (fieldname, file, filename){

		var randomString 	= Math.random().toString(36).slice(-8);
		var oldName 		= filename.split('.');
		var extension	 	= oldName[oldName.length - 1];
		var Name 			= randomString + '_' + filename;
		fstream = fs.createWriteStream('./tempFiles/' + Name);
		file.pipe(fstream);

		fstream.on('close', function(){

			switch(extension){
				case 'pdf':

					break;
				default:
					convertToPdf({Name: Name, randomString: randomString}, function(a,b){
						if(a)
							res.send(a);
						else{
							res.send('/' + randomString + '.pdf');
						}
					})
					break;
			}


			

		});

	});

});

var convertToPdf = function(data,cb){

	fs.readFile('./tempFiles/' + data.Name, function(a,b){

	if(a) throw a;
	var img = new Canvas.Image;
	img.src = b;

	var canvas = new Canvas(img.width, img.height, 'pdf');
	var ctx    = canvas.getContext('2d');
	ctx.drawImage(img,0,0,img.width, img.height);
	fs.writeFile('./public/'+data.randomString+'.pdf', canvas.toBuffer());
	// 
	cb(null,true);

	});

}


module.exports = router;
