module.exports = function(app) {
  var me = this;
  var $media = me.$root.find('.media');
  var types = [
    {
      name: 'movies',
      filter: {
        type: 'video',
        series: {
          $exists: false
        }
      }
    }, {
      name: 'series',
      filter: {
        type: 'video',
        series: {
          $exists: true
        }
      }
    }
  ];


  me.route = function(mediaType) {
    if (!mediaType)
      return viewTypes();
    var type = types.filter(function(type) { return type.name == mediaType; })[0];
    if (type)
      viewMedia(type.filter, mediaType);
  }



  function viewTypes() {
    $media.html(types.map(function(type) {
      return $(me.tmpl.type(type)).data(type);
    }))
  }

  function viewMedia(filters, type) {
    $media.html('loading media');
    me.api.get('.json', { filter: JSON.stringify(filters) }, function(response) {
      me.$root.find('.media').html(['<a href="' + app.url + '"><div class="mashmc-list-item"><h2>.. back</h2></div></a>'].concat(response.map(function(item) {
        return $(me.tmpl.media(item)).data(item);
      })));
    });
  }

  

  $media
    /*.on('click', '.media-type', function() {
      var type = $(this).data();
      viewMedia(type.filter);
    })*/
    .on('click', '.mashmc-list-item', function() {
      console.log($(this).data());
    });
}