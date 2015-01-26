var express = require('express');
var router 	= express.Router();

//var pdfinfo = require('pdfinfojs');
var fs		= require('fs');
var imager  = require('image2pdf');


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

			imager.genPDF('./tempFiles' + Name, './tempFiles/' + randomString + '.pdf', function(a,b){
				if(a)
					console.log(a);
				if(b)
					console.log(b);
			});
			res.send('OK');

		});

	});

});

module.exports = router;
