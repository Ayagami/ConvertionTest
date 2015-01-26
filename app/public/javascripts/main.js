$(document).ready(function(){
	$("#UploadFileToNewKanvasSession").uploadFile({
		url: "uploadTestFile",
		multiple: false,
		fileName: "filePkg",
		//allowedTypes: "png,jpg,jpeg,pdf,svg",
		allowedTypes: "pdf,png,jpg,jpeg,bmp",
		onSuccess: function(files,data,xhr){
			console.log(data);
		}
	});
})