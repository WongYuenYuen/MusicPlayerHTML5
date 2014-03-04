window.onload = initPage;
var currentSongLi;
var songTotal = 20;

function initPage(){
    initDb();
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
}


function Song(id, name, src){
    this.song_id = id;
    this.name = name;
    this.src = src;
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

function addSongOperation(songData){
    var audio = document.getElementById("audio");
    var songList = document.getElementById("songlist");
    var source = document.createElement("source");
    source.src = songData.src;
    source.id = songData.id;

    var a = document.createElement("a");
    a.innerHTML = songData.name;
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
    console.log(songData);
    console.log(songData.song_id);
    console.log(songData.name);
    deleteTag.id = "list_" + songData.song_id.substr(5);
    deleteTag.className = "delete-song";
    deleteTag.onclick = function (event){
        console.log(event.srcElement.parentNode);
        console.log(event.srcElement.id);
        songlist.removeChild(event.srcElement.parentNode); 
        var delete_id = "song_" + event.srcElement.id.substr(5);
        deleteSong(delete_id);
    } 
    var li = document.createElement("li");
    li.className = "";
    li.appendChild(a);
    li.appendChild(addSongTag);
    li.appendChild(deleteTag);
    songlist.appendChild(li);
}

function handleFileSelect(obj){ //获取文件的路径和文件名
    var audio = document.getElementById("audio");
    var songData = new Song();
    var files = obj.target.files;
    for(var i =0,f; f= files[i]; i++){
        songData.song_id = "song_" + (songTotal + 1);
        songData.name = obj.target.files[i].name;
        songData.src = obj.target.files[i].path;
        addSong2Sheet(songData);
        console.log(songData);
        songTotal ++;
        console.log("writ into the file");

        addSongOperation(songData);
    }
}

function openDefaultSongSheet(){
    loadDefaultSheet();
}

function showMySongSheet(){
}

function openPlayMostSheet(){

}

function createNewSheet(){

}
