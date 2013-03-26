$(window).load(init_main);




// var final_items = [];
var ajxchk = 0;
var id_;
var title_;
var secret_;
var server_;
var photoitem = [];
var videoitem = [];
var allitem = [];
var thumbimg;
var bigimg;
var medimg;
var img_item;
var a_item;
var requests = [];
var aRequest;


function init_main() {
    // nav
    $('.nav>li>a').eq(0).click(function(){
        if(!($('.nav-collapse.inner').hasClass('in'))){
            $('nav-drop-back').animate({
                top: 0
              }, 300, function() {
                // Animation complete.
              });
        }

    })






    Galleria.loadTheme('js/galleria.folio.mod.js');

    var playListURL = 'http://gdata.youtube.com/feeds/api/playlists/PLxu9Bk7eE0WzHbajh9ySYsT2SZZn93fVP?v=2&alt=json&max-results=50&callback=?';
    var videoURL = 'http://www.youtube.com/watch?v=';

    $.getJSON(playListURL, function(data) {
        // console.log(data)
            // var cat = data.feed.title.$t;

        $.each(data.feed.entry, function(i, item) {
            var feedTitle = item.title.$t;
            var feedURL = item.link[1].href;
            var fragments = feedURL.split("/");
            var videoID = fragments[fragments.length - 2];
            var url = videoURL + videoID;
            // var title = item.entry;
            var thumb = "http://img.youtube.com/vi/" + videoID + "/default.jpg";

            // video: 'http://www.youtube.com/watch?v=GCZrz8siv4Q',
            // title: 'My second title',
            // description: 'My second description'
            videoitem.push({
                "video" : url,
                "thumb" : thumb,
                "title" : feedTitle
                // "layer" : cat
            });
        });
        // requests.push(aRequest);
        // alert('okyoutube');
        checkcomplete();
    });

    var flickerAPI = "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=2a2ce06c15780ebeb0b706650fc890b2&photoset_id=72157633051512474&format=json";
    // $.getJSON( flickerAPI, function(ps_json) {

    $.ajax({
        url : flickerAPI,
        photoset_id : 72157633051512474,
        dataType : "jsonp",
        type : 'GET',
        jsonpCallback : 'jsonFlickrApi',

        // crossDomain: true,
        // jsonpCallback:'jsonFlickrApi',//<<<
        success : function(data) {
            jsonFlickrApi(data);
        }
        // error: function() { console.log("error"); }
    });
    function jsonFlickrApi(ps_json) {
        // console.log( 'data count:', ps_json.query.results.json.json.length );

        // console.log(ps_json)
        var tmparray = [];
        $.each(ps_json.photoset.photo, function(i, photo) {

            id_ = photo.id;
            title_ = photo.title;
            server_ = photo.server;
            secret_ = photo.secret;

            bigimg = 'http://farm2.staticflickr.com/' + server_ + '/' + id_ + '_' + secret_ + '_b.jpg';
            medimg = 'http://farm2.staticflickr.com/' + server_ + '/' + id_ + '_' + secret_ + '.jpg';

            photoitem.push({
                "thumb" : medimg,
                "image" : bigimg,
                "big" : bigimg,
                "title" : title_
            });

            // img_item = $('<img />').attr('src', thumbimg).attr('data-big', bigimg).attr('data-title', title_);
            // a_item = $('<a class="frodo" />').attr('href', medimg).append(img_item);

        });
        checkcomplete();
    }

}

function checkcomplete() {
    ajxchk++;
    // console.log(ajxchk)
    if (ajxchk == 2) {
        allitem = photoitem.concat(videoitem);

        run_gal();

    }
}

// console.log(requests)
// $.when.apply($, requests).done(console.log('requests'));

function run_gal() {
    $('#galleria').append(a_item);

    // console.log(photoitem);

    // $('#galleria').galleria({
    //     dataSource: photoitem
    // })
    var k = 0;
    Galleria.run('#galleria', {
        dataSource : allitem
    }).ready(function(options) {
        gallery = this;
        gallery.bind("thumbnail", function(e) {
            if (k == 0) {
                gallery.prependChild('thumbnails', '<div class="galleria-image frodo" id="cat-title"><div class="gal-controls photo-filter">images</div><div class="division">|</div><div class="gal-controls filter vid-filter">videos</div></div>');

                $('.photo-filter').click(function() {
                    k = 0;

                    gallery.load(photoitem);
                    // call the play method
                    // setTimeout(function(gallery){
                    // gallery.prependChild('thumbnails', '<div class="galleria-image frodo" id="cat-title"><div class="gal-controls photo-filter">images</div><div class="division">|</div><div class="gal-controls filter vid-filter">videos</div></div>');
                    // alert('ok')
                    // },3000)
                });
                $('.vid-filter').click(function() {
                    k = 0;

                    gallery.load(videoitem);
                });
            }
                            this.$('thumbnails').children().eq(k).css('height',148)

            k++;

        });
            // gallery.$('thumbnails').each(function(){  

            // alert($(this).attr('id'));     

            // }); 
        // gallery.bind("loadstart", function(e) {

        // });

        // function filter_item_create(gallery) {

        // }

    });
}

function init_dim() {

    // if($('#page').hasClass('sub')){
    if (document.body && document.body.offsetWidth) {
        winW = $(window).width();
        winH = $(window).height();
    }
    in_w = winW / 5;
    return in_w;
}
