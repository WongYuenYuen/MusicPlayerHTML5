Date.prototype.format = function(format)
{
    var o =
    {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
var myDate = new Date();
var datetime = myDate.format("yyyy-MM-dd hh:mm:ss");
print(datetime);  

var cursor = db.my_soft_info.find({"percent":0,"starttime":{$lt: datetime},"endtime":{$gt: datetime}});
while(cursor.hasNext())
{
      var temp = cursor.next();
      print(tojson(temp.bookid));  
      var arr = db.soft_basic_info.findOne({"id":temp.uid},{softcount:1}); 
      db.soft_basic_info.update({"id":temp.uid},{$set:{"freedate":arr.softcount+1,"getgrade":3}});
}
