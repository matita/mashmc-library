module.exports = function(app) {
  var me = this;
  var $media = me.$root.find('.media');
  var types = [
    {
      name: 'movies',
      url: 'movies'
    }, {
      name: 'series',
      url: 'series'
    }
  ];


  me.route = function(mediaType, id) {
    console.log('route', arguments);
    if (!mediaType)
      return viewTypes();
    switch(mediaType) {
      case 'movies':
        viewMovies();
        break;
      case 'series':
        if (id)
          viewEpisodes(id);
        else
          viewShows();
        break;
      default:
        viewTypes();
        break;
    }
  }


  function viewMovies() {
    $media.html('loading movies');
    me.api.get('.json', { filter: JSON.stringify({ type: 'video', series: { $exists: false } }) }, function(response) {
      var items = response;
      $media.html(['<a href="' + app.url + '"><div class="mashmc-list-item"><h2>.. back</h2></div></a>'].concat(items.map(function(item) {
        return $(me.tmpl.media(item)).data(item);
      })));
    });
  }


  function viewShows() {
    $media.html('loading series');
    me.api.get('.json', { filter: JSON.stringify({ type: 'video', series: { $exists: true } }) }, function(response) {
      var items = response;
      var series = [];
      items.forEach(function(item) {
        if (series.indexOf(item.series) == -1)
          series.push(item.series);
      });
      $media.html(['<a href="' + app.url + '"><div class="mashmc-list-item"><h2>.. back</h2></div></a>'].concat(series.map(function(name) {
        var item = { name: name, slug: encodeURIComponent(name) };
        return $(me.tmpl.series(item)).data(item);
      })));
    }); 
  }

  function viewEpisodes(showId) {
    var showName = decodeURIComponent(showId);
    $media.html('loading episodes');
    me.api.get('.json', { filter: JSON.stringify({ type: 'video', series: { $exists: true } }) }, function(response) {
      var items = response.filter(function(episode) {
        return episode.series == showName;
      });
      $media.html(['<a href="' + app.url + '/series"><div class="mashmc-list-item"><h2>.. back</h2></div></a>'].concat(items.map(function(item) {
        return $(me.tmpl.media(item)).data(item);
      })));
    }); 
  }


  function viewTypes() {
    $media.html(types.map(function(type) {
      return $(me.tmpl.type(type)).data(type);
    }))
  }

  function viewMedia(filters, type) {
    $media.html('loading media');
    me.api.get('.json', { filter: JSON.stringify(filters) }, function(response) {
      var items = response;
      
      if (type == 'series') {
        var shows = [];
        items.forEach(function(item) {
          var showName = item.series;
          if (shows.indexOf(showName) !== -1)
            return;
          shows.push(showName);
        });
        items = shows.map(function(showName) {
          return { name: showName };
        });
      }
      
      $media.html(['<a href="' + app.url + '"><div class="mashmc-list-item"><h2>.. back</h2></div></a>'].concat(items.map(function(item) {
        return $(me.tmpl.media(item)).data(item);
      })));
    });
  }

  

  $media
    .on('click', '.media-item', function() {
      console.log($(this).data());
    });
}