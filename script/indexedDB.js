const DB_NAME = 'Music-Player';
const DB_VERSION = 1;
const DB_STORE_NAME = 'defalut-sheet';

var db;

function initDb(){
    console.log("initdb...");

    var request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = function(evt){
        db = this.result;
        console.log("initDb done");

        loadDefaultSheet();
    };
    
    request.onerror = function (evt){
        console.error("initDb:" + evt.target.errorCode);
    };

    request.onupgradeneeded = function (evt){
        console.log("initDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'song_id', autoIncrement: false });

//        store.createIndex('song_id', 'song_id', { unique: true});
        store.createIndex('name', 'name', { unique: false});
        store.createIndex('src', 'src', { unique: false});
    };
}

function addSong2Sheet(songData){
    console.debug("addPublication arguments:", arguments);
    if (!db) {
      console.error("addPublication: the db is not initialized");
      return;
    }
    var tx = db.transaction(DB_STORE_NAME, 'readwrite');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.add({ song_id: songData.song_id, name: songData.name, src: songData.src});
    req.onsuccess = function (evt) {
      console.debug("Insertion in DB successful");
//      loadDefaultSheet();
    };
    req.onerror = function() {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

}


  function loadDefaultSheet() {
    console.debug("loadDefaultSheet");

    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    var store = tx.objectStore(DB_STORE_NAME);
    var req;

    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      console.log('<p>There are <strong>' + evt.target.result +
                     '</strong> record(s) in the object store.</p>');
      songTotal = evt.target.result;
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;
      if (cursor) {
        console.debug("cursor.value:", cursor.value);
        addSongOperation(cursor.value);
        console.log('<li>' +
                        '[' + cursor.key + '] ' +
                        '(song_id: ' + cursor.value.song_id + ') ' +
                        cursor.value.name + ' - ' +
                        cursor.value.src + ' / ' +
                        '</li>');

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct img ids
        i++;
      } else {
        console.debug("No more entries!");
      }
    };
  };



  function displayActionSuccess(msg) {
    msg = typeof msg !== 'undefined' ? "Success: " + msg : "Success";
    console.log('<span class="action-success">' + msg + '</span>');
  }
  function displayActionFailure(msg) {
    msg = typeof msg !== 'undefined' ? "Failure: " + msg : "Failure";
    console.log('<span class="action-failure">' + msg + '</span>');
  }


function deleteSong(song){
    console.debug("delete ...");
    var k = song;
      console.debug("delete k:", k);
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);

//      k = Number(k);

      var req = store.get(k);
      req.onsuccess = function(evt) {
        var record = evt.target.result;
        console.debug("record:", record);
        if (typeof record !== 'undefined') {
          req = store.delete(k);
          req.onsuccess = function(evt) {
            console.debug("evt:", evt);
            console.debug("evt.target:", evt.target);
            console.debug("evt.target.result:", evt.target.result);
            console.debug("delete successful");
            displayActionSuccess("Deletion successful");
//            loadDefaultSheet();
          };
          req.onerror = function (evt) {
            console.error("delete:", evt.target.errorCode);
          };
        } else {
          displayActionFailure("No matching record found");
        }
      };
      req.onerror = function (evt) {
        console.error("delete:", evt.target.errorCode);
      };
}
