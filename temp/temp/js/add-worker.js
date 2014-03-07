importScripts("id3/id3all.js");
onmessage = function(a) {

	console.log("onmessage");
	addFile(a.data.file, a.data);
};

function addFile(d, b) {
	console.log(d);
	console.log(b);
	var c = d.name;
	console.log(c);
	var a = b;
	ID3.loadTags(c, function(e) {
		var f = ID3.getAllTags(c);
		console.log(f);
		var g = rstr2hex(rstr_md5(e));
		console.log(g);
		var i = {
			id: g,
			mediaId: a.mediaId,
			path: a.path,
			playCount: 0,
			favorite: false
		};
		console.log(i);
		if (f.title) {
			i.title = f.title.concat("");
		} else {
			i.title = c.substr(0, c.lastIndexOf("."));
		} if (f.artist) {
			i.artist = f.artist.concat("");
			console.log(i.artist);
		} else {
			i.artist = "unknown";
		} if (f.album) {
			i.album = f.album.concat("");
		} else {
			i.album = "unknown";
		} if ("picture" in f && a.cover) {
			var h = Base64.encodeBytes(f.picture.data);
			i.picture = h;
			console.log(h);
		}
		postMessage(i);
		console.log("postMessage");
	}, {
		tags: ["artist", "title", "album", "picture"],
		dataReader: FileAPIReader(d)
	});
}