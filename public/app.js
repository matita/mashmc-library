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

  function viewTypes() {
    $media.html(types.map(function(type) {
      return $(me.tmpl.type(type)).data(type);
    }))
  }

  function viewMedia(filters) {
    $media.html('loading media');
    me.api.get('.json', { filter: JSON.stringify(filters) }, function(response) {
      me.$root.find('.media').html(response.map(function(item) {
        return $(me.tmpl.media(item)).data(item);
      }));
    });
  }

  viewTypes();

  $media
    .on('click', '.media-type', function() {
      var type = $(this).data();
      viewMedia(type.filter);
    })
    .on('click', '.mashmc-list-item', function() {
      console.log($(this).data());
    });
}