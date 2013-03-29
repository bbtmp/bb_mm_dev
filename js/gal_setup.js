$(window).load(init_gallery);

// var final_items = [];
var ajxchk = 0;
var id_;
var title_;
var secret_;
var server_;
var photoitem = [];
var videoitem = [];

var gal_state = 'all';
var loaded_gallery;

var allitem = [];
var thumbimg;
var bigimg;
var medimg;
var img_item;
var a_item;
var requests = [];
var aRequest;
var sectionlist = [];
var categ_mode = false;

var categ_thumb = '';
// var active_tag = '';
var active_tag = '';
var active_parent='';

var sectionlist_ac_i = 0;
var active_cur_fotos = 0;
var active_cur_vids = 0;
// var active_cur_youtube_id='';
// var active_cur_title='';
var galleria_item = $('#galleria');

// function mk_c_thumb() {

// }
function mk_c_thumb_info(u_state, counter,loaded_gallery) {
    var tmp_categ_thumb_='';
    var htag='';

            if(!categ_mode){
                htag
            }
            console.log(loaded_gallery.length)
    if(u_state=='initial'){
        tmp_categ_thumb_ = '<div class="galleria-image" id="cat-title">';
        // tmp_categ_thumb_ += '<h1>' + active_tag + '</h1>';

    }
        // console.log(counter)
        // console.log(loaded_gallery[counter-1].title + ' counter:' +counter)
        tmp_categ_thumb_ += '<h2>' + loaded_gallery[counter-1].title + '</h2>';

        tmp_categ_thumb_ += '<span class="gal-categ">' + active_tag + '</span>';

    if (active_parent.length > 0) {
        tmp_categ_thumb_ += '<span class="gal-parent">' + active_parent + '</span>';
    }
    tmp_categ_thumb_ += '<div class="control-container">';
    //         var active_cur_fotos=0;
    // var active_cur_vids=0;
    if (active_cur_fotos > 0) {
        tmp_categ_thumb_ += '<div class="gal-controls photo-filter"><span>' + active_cur_fotos + '</span></div>';
    }
    if (active_cur_fotos > 0 && active_cur_vids > 0) {
        tmp_categ_thumb_ += '<div class="division">|</div>';
    }
    if (active_cur_vids > 0) {
        tmp_categ_thumb_ += '<div class="gal-controls vid-filter"><span>' + active_cur_vids + '</span></div>';
    }
    tmp_categ_thumb_ += '</div>';

    if(u_state=='initial'){
        tmp_categ_thumb_ += '</div>';
    }   
    return tmp_categ_thumb_;
}

function get_active_tag() {
    active_tag = $('.nav li.active').attr('data-tag-id');

    if($('.dropdown-submenu li.active').length){
        active_parent=$('.port-two').attr('data-tag-id');
        // alert(active_parent);
    }
    // alert(active_tag)
    return active_tag;
}

// function SectionList() {
//     for (var i = 0; i < $('#sections li').length; i++) {
//         var tmp_item=$('#sections li').eq(i);
//         var tmp_title=tmp_item.attr('id');
//         var tmp_par_title=tmp_item.attr('data-parent-title');
//         var tmp_fl=tmp_item.attr('data-flickr-id');
//         var tmp_yt=tmp_item.attr('data-youtube-id');

//         if(tmp_item.hasClass('active')){
//             sectionlist_ac_i=i;
//          }
//         sectionlist.push({
//                 "title" : tmp_title,
//                 "parent_title" : tmp_par_title,
//                 "flickr_id" :tmp_fl ,
//                 "youtube_id" : tmp_yt
//             });
//     }

//     // return sectionlist;
// }

function check_mode() {
    if (galleria_item.attr('data-mode') == 'categ') {
        categ_mode = true;
    }
}

function init_gallery() {
    check_mode();
    // get_active_tag();
    Galleria.loadTheme('js/galleria.folio.mod.js');

    init_youtube();
    init_flickr();
}

function init_flickr() {
    // var flickerAPI = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=2a2ce06c15780ebeb0b706650fc890b2&photoset_id='+sectionlist[sectionlist_ac_i].flickr_id+'&format=json';
    var flickerAPI = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2a2ce06c15780ebeb0b706650fc890b2&user_id=93707942@N08&tags=' + get_active_tag() + '&format=json';
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
        // console.log(ps_json);
        // console.log(ps_json)
        var tmparray = [];
        $.each(ps_json.photos.photo, function(i, photo) {

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
        active_cur_fotos = ps_json.photos.photo.length;
                alert('flickr');

        checkcomplete();
    }

}//endfunc

function init_youtube() {
    var playListURL = 'http://gdata.youtube.com/feeds/api/users/fotentainment/uploads?q=' + get_active_tag() + '&alt=json';
    var videoURL = 'http://www.youtube.com/watch?v=';

    $.getJSON(playListURL, function(data) {

        // console.log(playListURL);
        // console.log(data);
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
        active_cur_vids = data.feed.entry.length;
        // requests.push(aRequest);
        checkcomplete();
    });
}

function checkcomplete() {
    ajxchk++;
    if (ajxchk == 1) {
        allitem = fisherYates(photoitem.concat(videoitem));
        run_gal();
    }
}

function fisherYates(myArray) {
    var i = myArray.length, j, tempi, tempj;
    if (i == 0)
        return false;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1 ));
        tempi = myArray[i];
        tempj = myArray[j];
        myArray[i] = tempj;
        myArray[j] = tempi;
    }
    return myArray;
}

// console.log(requests)
// $.when.apply($, requests).done(console.log('requests'));

function run_gal() {
    // $('#galleria').append(a_item);

    // console.log(photoitem);

    // $('#galleria').galleria({
    //     dataSource: photoitem
    // })
    var k = 0;
    var j;
    var item_added = false;

    Galleria.run('#galleria', {
        dataSource : allitem
    }).ready(function(options) {
        // gal_state=allitem;
        // var galtoload=allitem;
        gallery = this;
        loaded_gallery=allitem;
        gallery.bind("thumbnail", function(e) {

// console.log('kstart'+k)
                    // if(!item_added){
                    //     k =-1;
                    //     item_added=true;
                    // }


            // $(thumbnails).prependChild('thumbnails', mk_c_thumb_info('hover'));
            // alert($('.thumbnails').html())

            if (k == 0) {
                if (categ_mode) {

                    gallery.prependChild('thumbnails', mk_c_thumb_info('initial',0,loaded_gallery));

                    // console.log(mk_c_thumb())
                }
                switch(gal_state) {
                    case 'photo':
                        $('.' + gal_state + '-filter').addClass('active');
                        break;
                    case 'vid':
                        $('.' + gal_state + '-filter').addClass('active');
                        break;
                    default:
                        break;
                }

                $('.gal-controls').click(function() {
                    k = 0;
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        gal_state='all';
                            // console.log(allitem)
                            // console.log("allitem"+allitem.length)
                        gallery.load(allitem);

                    } else {

                        if ($(this).hasClass('photo-filter')) {
                            loaded_gallery=photoitem;
                            gal_state = 'photo';
                            gallery.load(photoitem);
                        } else if ($(this).hasClass('vid-filter')) {

                            gal_state = 'vid';
                            loaded_gallery=videoitem;
                            gallery.load(videoitem);
                        }

                    }
                    // call the play method
                    // setTimeout(function(gallery){
                    // gallery.prependChild('thumbnails', '<div class="galleria-image frodo" id="cat-title"><div class="gal-controls photo-filter">images</div><div class="division">|</div><div class="gal-controls filter vid-filter">videos</div></div>');
                    // alert('ok')
                    // },3000)
                });
                // $('.vid-filter').click(function() {
                //     k = 0;

                //     gallery.load(videoitem);
                // });
            }
            this.$('thumbnails').children().eq(k).css('height', 148);

            k++;

            if(categ_mode){
                 j=k;
            }else{
                 j=k-1;
            }
// alert('wha')
var tmp_thmb=gallery.$('thumbnails').children().eq(j);
            tmp_thmb.find('.galleria-plus').html(mk_c_thumb_info('overlay',k,loaded_gallery));

            if(tmp_thmb.find('img').attr('src').substring(11,18)=='youtube'){
                tmp_thmb.append('<div class="play-btn"></div>');
            }


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
