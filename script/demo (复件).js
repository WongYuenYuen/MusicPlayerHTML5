window.onload = initPage;
var currentSongLi;
var songTotal = 1;

function initPage(){
    //player div:
    document.getElementById("audio").onended = goOnPlay;
    document.getElementById("lastSong").onclick = playLastSong;
    document.getElementById("nextSong").onclick = playNextSong;
    document.getElementById("controlSong").onclick = controlSong;
    
    //function div:
    document.getElementById("defaultSongSheet").onclick = openDefaultSongSheet;
    document.getElementById("mySongSheet").onclick = showMySongSheet;
    document.getElementById("playMost").onclick = openPlayMostSheet;


    //list div:
    addEventHandler(document.getElementById('addSongs'),'change', handleFileSelect);
    openDefaultSongSheet();
}

function goOnPlay(){
    var audio = document.getElementById("audio");
    if(audio.ended == true) playNextSong();
}
function playLastSong(){
    var audio = document.getElementById("audio");
    if(currentSongLi.previousSibling.nodeType == 1){
        currentSongLi = currentSongLi.previousSibling;
    }else{
        var list = document.getElementById("list").getElementsByTagName("li");
        currentSongLi = list[list.length - 1];
    }
    var lastSong = currentSongLi.getElementsByTagName("source");
    console.log(lastSong);
    lastSong = lastSong[0].cloneNode(true);
    audio.replaceChild(lastSong, audio.childNodes[1]);
    play();
}

function controlSong(){
    var audio = document.getElementById("audio");
    var playButton = document.getElementById("controlSong");
    if(audio.paused  == true){
        play();
    }else{
        playButton.innerHTML = "begin";
        audio.pause();
    }
}

function play(){
    var audio = document.getElementById("audio");
    var playButton = document.getElementById("controlSong");
    playButton.innerHTML = "stop";
    audio.play();
}
function playNextSong(){
    var audio = document.getElementById("audio");
    if(currentSongLi.nextSibling != undefined){
        currentSongLi = currentSongLi.nextSibling;
    }else{
        var list = document.getElementById("list").getElementsByTagName("li");
        currentSongLi = list[0];
    }
    var nextSong = currentSongLi.getElementsByTagName("source");
    console.log(nextSong);
    nextSong = nextSong[0].cloneNode(true);
    audio.replaceChild(nextSong, audio.childNodes[1]);
    play();
}

function sendAddSongRequest(song_id, src, name){
    var addSongRequest = createRequest();
    console.log("first step");
    if(addSongRequest == null){
        console.log("add song request send failed");
    }else{
        var url = "php/addSong.php?song_id=" + song_id + "&src=" + src + "&name=" + name;
        addSongRequest.onreadystatechange = function (){
            if(addSongRequest.readyState == 4 && addSongRequest.status == 200){
                console.log("responseText: " + addSongRequest.responseText);
            }
        };
        addSongRequest.open("POST", url, true);
        addSongRequest.send(null);
    }
  console.log("out the sendadd");
}

function addSongOperation(song_id,src,fileName){
    var audio = document.getElementById("audio");
    var songList = document.getElementById("songlist");
    var source = document.createElement("source");
    source.src = src;
    source.id = song_id;

    var a = document.createElement("a");
    a.innerHTML = fileName;
    a.href = "#";
    a.appendChild(source);
    a.onclick = function (event){
        console.log(event.srcElement.parentNode);
        currentSongLi = event.srcElement.parentNode; 
        var newSong = event.srcElement.childNodes[1].cloneNode(true);
        if(audio.childElementCount == 0){
            audio.appendChild(newSong);
        }else{
            console.log("currentSong: " + audio.childNodes[0]);
            var currentSong = audio.childNodes[1];
            audio.replaceChild(newSong,currentSong);
        }
        play();
    };

    var addSongTag = document.createElement("span");
    addSongTag.innerHTML = "&nbsp;&nbsp;&nbsp;";
    addSongTag.className = "add-song-into-list";
    addSongTag.onclick = function (){
    }

    var deleteTag = document.createElement("span");
    deleteTag.innerHTML = "&nbsp;&nbsp;&nbsp;";
    deleteTag.id = "list_" + song_id.substr(5);
    deleteTag.className = "delete-song";
    deleteTag.onclick = function (event){
        console.log(event.srcElement.parentNode);
        deleteSongRequest = createRequest();
        if(deleteSongRequest == null){
            console.log("发送请求失败！");
        }else{
            var url = "php/deletejson.php?song_id=" + event.srcElement.id.substr(5);
            deleteSongRequest.onreadystatechange = function (){
                if(deleteSongRequest.readyState == 4 && deleteSongRequest.status == 200){
                    if(deleteSongRequest.responseText == "okay"){
                        songlist.removeChild(event.srcElement.parentNode); 
                        console.log("delete song !");
                    }else{
                        console.log("delete failed!");
                    }
                }
            };
            deleteSongRequest.open("GET", url, true);
            deleteSongRequest.send(null);
        }
    }

    var li = document.createElement("li");
    li.className = "";
    li.appendChild(a);
    li.appendChild(addSongTag);
    li.appendChild(deleteTag);
    songlist.appendChild(li);
}

function handleFileSelect(obj){
    var audio = document.getElementById("audio");
    var files = obj.target.files;

    for(var i =0,f; f= files[i]; i++){
        var songURL = obj.target.files[i].path;
        var song_id = "song_" + (songTotal + 1);
        songTotal ++;
        addSongOperation(song_id, songURL, obj.target.files[i].name);
        sendAddSongRequest(song_id, songURL, obj.target.files[i].name);
    }
}

function openDefaultSongSheet(){
    var openDefaultRequest = createRequest();
    if(openDefaultRequest == null){
        console.log ("Unable to openDefaultSongSheetRequest object");
    }else {
        console.log ("Got the openDefaultSongSheetRequest object.");
        var url = "php/testjson.php";

        openDefaultRequest.onreadystatechange = function (){
            var audio = document.getElementById("audio");
            if(openDefaultRequest.readyState == 4 && openDefaultRequest.status == 200){
                var json = openDefaultRequest.responseText;
                json = JSON.parse(json);
                console.log(json);
                for(var i = 0; i<json.length; i++){
                    addSongOperation(json[i].song_id, json[i].src, json[i].name);
                }
                songTotal = json.length;
            };
        }
        openDefaultRequest.open("POST", url, true);
        openDefaultRequest.send(null);
        console.log("openDefaultRequest");
    }
}

function showMySongSheet(){
}

function openPlayMostSheet(){

}

function createNewSheet(){

}
