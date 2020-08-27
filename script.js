function Date(day, month, year){
    this.day= day;
    this.month= month;
    this.year= year;
}

Date.prototype.setDay= function(day){
    this.day= day;
}
Date.prototype.setMonth= function(month){
    this.month= month;
}
Date.prototype.setYear= function(year){
    this.year= year;
}
let modafuke= Date.prototype;
modafuke.getDay= function(){return this.day;}
modafuke.getMonth= function(){return this.month;}
modafuke.getYear= function(){return this.year;}
