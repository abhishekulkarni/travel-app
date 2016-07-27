Template.showSearch.rendered = function(){
  if(this.createdBy==Meteor.userId()){
  
  $('#addTextForm').on('shown.bs.modal', function () {
    $('#title').focus()
  });
  
  
}
Template.showSearch.rendered= function(){
var timelineBlocks = $('.cd-timeline-block'),
    offset = 0.8;

  //hide timeline blocks which are outside the viewport
  hideBlocks(timelineBlocks, offset);

  //on scolling, show/animate timeline blocks when enter the viewport
$(window).on('scroll', function(){
    (!window.requestAnimationFrame) 
      ? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
      : window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
  });

  function hideBlocks(blocks, offset) {
    blocks.each(function(){
      ( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
    });
  }

  function showBlocks(blocks, offset) {
    blocks.each(function(){
      ( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
    });
  }
}
}
Template.showSearch.onCreated(function () {
  Session.set("mapid",{lat:42,lng:-71});
  GoogleMaps.load({ v: '3', key: 'AIzaSyB7-F_RespGrP0zUzQO4AglkouFbTeKp0c', libraries: '' });
  GoogleMaps.ready('naviMap',function(map) {
    var markerCurrent = new google.maps.Marker({
        position: new google.maps.LatLng(Session.get("mapid").lat,Session.get("mapid").lng),
        map:map&&map.instance
      });
    Tracker.autorun(function() {
      map.instance.setCenter(new google.maps.LatLng(Session.get("mapid").lat,Session.get("mapid").lng))
      markerCurrent.setPosition(new google.maps.LatLng(Session.get("mapid").lat,Session.get("mapid").lng));
    });  
});
});
Template.showSearch.helpers({
  
  naviMapOptions: function(map) {
    if (GoogleMaps.loaded()) {
      const l=Session.get("mapid");
      var markerCur= new google.maps.Marker({
        position: new google.maps.LatLng(l.lat,l.lng),
        map:map&&map.instance
      });
      return {
        center: new google.maps.LatLng(l.lat,l.lng),
        marker: new google.maps.Marker({
        position: new google.maps.LatLng(l.lat,l.lng),
        map:map&&map.instance}),
        zoom:15
      };
    }
  },  
});
Template.showSearch.events({
  "click .js-imgsss" : function(){
    console.log("clicked image");
  },
  "submit #textform": function(){
    event.preventDefault();
    const title=$(".js-titletext").val();
    const txtdes=$(".js-textdesc").val();
    const addtext={_id: new Meteor.Collection.ObjectID()._str, title, text:txtdes, type:"text"};
    Trips.update({_id:this._id},{$push:{textedit:addtext}});
    $("#addTextForm").modal('hide');
  },
  "click .js-addstuff":function(event){
    if( $('.cd-stretchy-nav').length > 0 ) {
    var stretchyNavs = $('.cd-stretchy-nav');
    
    stretchyNavs.each(function(){
      var stretchyNav = $(this),
        stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
      event.preventDefault();
        stretchyNav.toggleClass('nav-is-visible');
    });
( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
}
  
  },
    
  "submit #picform":function(){
      event.preventDefault();
      console.log("submittedpic");
    var newpic=Session.get("addpics");
    const pictitle=$(".js-titlepic").val();
    const picdes=$(".js-picdesc").val();
    const addpix={_id: new Meteor.Collection.ObjectID()._str,title:pictitle, text:picdes, type:"picture",pic:newpic};
    Trips.update({_id:this._id},{$push:{textedit:addpix}});
    $("#addPicture").modal('hide');
},
  "submit #mapform":function(){
    event.preventDefault();
    const locit=Session.get("locmap");
    const toloc=$(".js-locit").val();
    const maploc={_id: new Meteor.Collection.ObjectID()._str,location:toloc, map:locit, type:"maploc"};
    Trips.update({_id:this._id},{$push:{textedit:maploc}});
    $("#addMap").modal('hide');
  },
  "click .js-addBanner":function(){
    $("#openBanner").modal('show');
  },
  // "click .js-removeupload":function(){
  //   document.getElementById('uploadbanner').style.display = "none";
  // },
  'change .your-upload-class': function (event, template) {
    console.log("uploading...")
    FS.Utility.eachFile(event, function (file) {
      console.log("each file...");
      var yourFile = new FS.File(file);
      yourFile.creatorId = Meteor.userId(); // todo
      var banner=YourFileCollection.insert(yourFile, function (err, fileObj) {
        console.log("callback for the insert, err: ", err);
        if (!err) {
          console.log("inserted without error");
        }
        else {
          console.log("there was an error", err);
        }
        
      });
      Session.set("bannerimg",banner&&banner._id);
    });
  },
  'click .js-uploadban':function(){
    var banimg=Session.get("bannerimg");
    Trips.update({_id:this._id},{$set:{image:banimg}});
    $("#openBanner").modal('hide');
    // document.getElementById('uploadbanner').style.display = "none";
  },
  'click #likebutton': function(){
    Trips.update({_id:this._id},{$inc:{likes:1}});
  },
  
  // function deletethis(obid){
  //   Trips.update({_id:this._id},{$pull:{textedit:{$elemMatch:{_id:obid}}}});
  // },

});

Template.showSearch.helpers({
  
  isUser:function(){
      if(this.createdBy==Meteor.userId()){

        return true;
      }else{
        return false;}
  },
  checkText:function(type){
      if(type=="text"){
        return true;
      }else{
        return false;
      }
  },
  checkPic:function(type){
    if(type=="picture"){
      return true;
    }else{
      return false;
    }
  },
  savepicref:function(id){
    Session.set("picid",id);
  },
  thispic:function(){
    return YourFileCollection.findOne({_id:Session.get("picid")});
  },
  checkMap:function(type){
    if(type=="maploc"){
      return true;
    }else{
      return false;
    }
  },
  savemapref:function(map){
    Session.set("mapid",map);
  },
  bannerimage:function(){
    return YourFileCollection.findOne({_id:this.image});
  },
  propic:function(){

    var user =UserProfiles.findOne({user:this.createdBy});
    const id= user&&user.propic&&user.propic._id
    return YourFileCollection.findOne({_id:id});

  },
  isNotUser:function(){
      if(this.createdBy!=Meteor.userId()){

        return true;
      }else{
        return false;}
  },
})