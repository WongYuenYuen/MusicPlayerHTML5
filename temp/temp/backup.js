       //考虑兼容问题时获取文件的url
       /*
       if(obj){ 
		//ie 
		if (window.navigator.userAgent.indexOf("MSIE")>=1){ 
			obj.select(); 
			songURL = document.selection.createRange().text; 
		} 
		//firefox 
		else if(window.navigator.userAgent.indexOf("Firefox")>=1){
			if(obj.files){ 
			songURL = obj.files.item(0).getAsDataURL(); 
			} 
		songURL = obj.value; 
		} 
	songURL = obj.value; 
	} 
*/
function handleFileSelect(evt){
       //考虑兼容问题时候获取文件的加密过的url
 try{
     var file = null;
     if(evt.target.files && evt.target.files[i]){
         file = evt.target.files[i];
     }else if(evt.target.files && evt.target.files.item(i)){
         file = evt.target.files.item(i);
     }
     //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
     try{
         //Firefox7.0
         songURL = file.getAsDataURL();
         console.log("Firefox7" + songURL);
     }catch(e){
         //Firefox8.0 later
         songURL = window.URL.createObjectURL(file);
         console.log("Firefox8" + songURL);
     }
 }catch(e){
     //支持html5的浏览器,比如高版本的firefox、chrome、ie10
     if(evt.target.files && evt.target.files[i]){
         var reader = new FileReader();
         reader.onload = function (e){
             songURL = e.target.result;
             console.log("chrome: " + songURL);
         };
         reader.readAsDataURL(evt.target.files[i]);
     }
 }
}
