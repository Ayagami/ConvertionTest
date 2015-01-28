var express = require('express');
var router 	= express.Router();

//var pdfinfo = require('pdfinfojs');
var fs		= require('fs');
var http = require('http');
//var Canvas 	= require('canvas');
//var pdfUtils = require('pdfutils').pdfutils;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploadTestFile', function(req,res){
	res.render('upload', {title: 'Uploading a Test File'});
});

router.get('/apiTest', function(req,res){

	//var apiURL = 'http://online.verypdf.com/api/?apikey=XXXXXXXXXXXXX&app=pdftools&infile=https://dl.dropboxusercontent.com/u/5570462/verypdf-cloud-api/verypdf.pdf&outfile=out.jpg&-width=100&-height=100';
	var apiURL = 'http://online.verypdf.com/api/?apikey=XXXXXXXXXXXXX&app=pdftools&infile=https://dl.dropboxusercontent.com/u/5570462/verypdf-cloud-api/verypdf.pdf&outfile=out.jpg';
	http.get(apiURL, function(response){

		var body = '';

		response.on('data', function(c){
			body += c;
		});

		response.on('end', function(){
			console.log(body);
			var arr = body.split(" ");

			var s = arr[1].substring(0, arr[1].length - 4);
			res.render('api', {title: 'api', imgurl: s});
		})

	});

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
					convertToSvg({Name: Name, randomString: randomString}, function(x,y){
						if(x)
							res.send(x);
						else
							res.send('/' + randomString + '.svg');
					});
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


var convertToSvg = function(data,cb){
	pdfUtils('./public/' + data.randomString + '.pdf', function(err,doc){

		if(err){
			cb(null,false);
			return;
		}
		else{
			for(var x=0; x < doc.length; x++){
				doc[x].asSVG().toFile('./public/'+data.randomString + '_' + (x+1) + '.svg');
			}
			cb(null,true);
			return;
		}

	});
}

var convertToPdf = function(data,cb){

	fs.readFile('./tempFiles/' + data.Name, function(a,b){

	if(a) {
		cb(null,false);
		return;
	}
	var img = new Canvas.Image;
	img.src = b;

	var canvas = new Canvas(img.width, img.height, 'pdf');
	var ctx    = canvas.getContext('2d');
	ctx.drawImage(img,0,0,img.width, img.height);
	fs.writeFile('./public/'+data.randomString+'.pdf', canvas.toBuffer());
	// 
	
	convertToSvg(data, function(p,q){
		if(p) return cb(null,false);
		else return cb(null,q);
	})

	});

}


module.exports = router;
