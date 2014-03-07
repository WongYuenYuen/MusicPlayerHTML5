window.onload = initPage;
var currentSongLi;
var songTotal = 20;
var modeNum = 0;

function initPage(){
    initDb();
    //player div:
    document.getElementById("audio").onended = goOnPlay;
    document.getElementById("lastSong").onclick = playLastSong;
    document.getElementById("nextSong").onclick = playNextSong;
    document.getElementById("controlSong").onclick = controlSong;
    document.getElementById("playMode").onclick = changePlayMode;
    document.getElementById("seekBar").onclick = changeProgress;
    document.getElementById("volumeBar").onclick = changeVolume;

    //function div:
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

function Time(minute, second){
    this.minute = minute;
    this.second = second;
}

function goOnPlay(){
    var audio = document.getElementById("audio");
    if(audio.ended == true) playNextSong();
}
function playLastSong(){
    var audio = document.getElementById("audio");
    console.log(currentSongLi.previousSibling);
    if(currentSongLi.previousSibling != null){
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

function changePlayMode(){
    var audio = document.getElementById("audio");
    var playMode = document.getElementById("playMode");
    var mode = [{"pattern": "列表循环"}, {"pattern": "随机"}, {"pattern": "单曲循环"}];
    console.log(mode);
    if(modeNum == 2) modeNum = 0; 
    else modeNum ++;
    playMode.innerHTML = mode[modeNum].pattern; 
    switch(modeNum){//还要改变按钮的样式
        case 0: break;
        case 1: break;
        case 2: break;
    }

}

function play(){
    var audio = document.getElementById("audio");
    var playButton = document.getElementById("controlSong");
    playButton.innerHTML = "stop";
    showTotalTime();
    showCurrentTime();
    audio.play();
}

function playNextSong(){
    var audio = document.getElementById("audio");

    switch(modeNum){
        case 0: 
            audio.loop = false;
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
            break;
        case 1: 
            audio.loop = false;
            var song_id = "song_" + parseInt(Math.random()*songTotal);
            var nextSong = document.getElementById(song_id);
            audio.replaceChild(nextSong, audio.childNodes[1]);
            play();
           console.log(nextSong);
            break;
        case 2: audio.loop = true;
                play();break;
    }
}

function addSongOperation(songData){
    var audio = document.getElementById("audio");
    var songList = document.getElementById("songlist");
    var source = document.createElement("source");
    source.src = songData.src;
    source.id = songData.song_id;

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
/*
function handleFileSelect(obj){ //获取文件的路径和文件名
    var audio = document.getElementById("audio");
    var songData = new Song();
    var files = obj.target.files;
    for(var i =0,f; f= files[i]; i++){
        songData.song_id = "song_" + (songTotal + 1);
        songData.name = obj.target.files[i].name;
        songData.src = obj.target.files[i].path;
        console.log(obj.target.files[i]);
        addSong2Sheet(songData);
        console.log(songData);
        songTotal ++;
        console.log("writ into the file");

        addSongOperation(songData);
    }
}
*/

function handleFileSelect(evt){
    var audio = document.getElementById("audio");
    var files = evt.target.files;
    var songData = new Song();
    for(var i =0,f; f= files[i]; i++){
        try {
            var file = null;
            if (evt.target.files && evt.target.files[i]) {
                file = evt.target.files[i];
            } else if (evt.target.files && evt.target.files.item(i)) {
                file = evt.target.files.item(i);
            }
            //Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
            try {
                //Firefox7.0
                //songURL = file.getAsDataURL();
                songURL = file.readAsBinaryString();
                console.log("Firefox7" + songURL);
            } catch (e) {
                //Firefox8.0 later
                //songURL = window.URL.createObjectURL(file);
                songURL = file.readAsBinaryString();
                console.log("Firefox8" );
                console.log(songURL);
            }
        } catch (e) {
            //支持html5的浏览器,比如高版本的firefox、chrome、ie10
            if (evt.target.files && evt.target.files[i]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    songURL = e.target.result;
                    console.log("chrome: " + songURL);
                };
                reader.readAsDataURL(evt.target.files[i]);
            }
        }
        songData.song_id = "song_" + (songTotal + 1);
        songData.name = evt.target.files[i].name;
        songData.src = songURL;
        console.log(evt.target.files[i]);
        addSong2Sheet(songData);
        console.log(songData);
        songTotal ++;
        console.log("writ into the file");

        addSongOperation(songData);
    }
}

function changeProgress(evt){
    evt = evt || window.event;
    var audio = document.getElementById("audio");
    var x = evt.offsetX;
    console.log(x);
    var time =  (x/(document.getElementById("seekBar").offsetWidth));
    document.getElementById("playBar").style.width = time + "%";
    console.log("time: " + time);
    console.log(audio.duration);
    audio.currentTime = audio.duration*time;
    console.log(audio.currentTime);
}

function changeVolume(evt){
    evt = evt || window.event;
    var audio = document.getElementById("audio");
    var x = evt.offsetX;
    console.log(x);
    var volume =  (x/(document.getElementById("volumeBar").offsetWidth));
    console.log(volume);
    document.getElementById("volumeBarValue").style.width = volume + "%";
    audio.volume = volume;
}

function showTotalTime(){
    var audio = document.getElementById("audio");
    var tempTime = new Time(0,0);
    //if(audio.readyState)
    var text = document.getElementById("totalTime");
    console.log(audio.duration);
    audio.ondurationchange = function (){
        tempTime.minute = parseInt((audio.duration / 60));
        tempTime.second = parseInt((audio.duration % 60).toFixed(2));
        text.innerHTML = tempTime.minute + ":" + tempTime.second;
    }

}

function showCurrentTime(){
    var audio = document.getElementById("audio");
    var text = document.getElementById("currentTime");
    var tempTime = new Time(0,1);
    var temp = setInterval(function(){
        if(audio.ended == true) clearInterval(temp);
        else{
            tempTime.minute = parseInt((audio.currentTime / 60));
            tempTime.second = parseInt((audio.currentTime % 60).toFixed(2));
        }
        text.innerHTML = parseFloat(tempTime.minute) + ":" + parseFloat(tempTime.second);
    },1000);
}

function showMySongSheet(){
}

function openPlayMostSheet(){

}

function createNewSheet(){

}
