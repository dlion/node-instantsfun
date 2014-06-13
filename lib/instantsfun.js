var request = require('request'),
    cheerio = require('cheerio');

module.exports = (function(request, cheerio) {
  var list = [],
      SITE = 'http://instantsfun.es';

  return {
    /**
     * Retrieve All songs
     */
    getAllList: function(cb) {
      if(list.length === 0) {
        request.get(SITE, function (err, resp) {
          if(!err) {
            var $ = cheerio.load(resp.body);

            $('.thePosts > ul > li').each(function(i, elem) {
              var title = $(this).find('.entry-title > a').attr('title'),
                  song  = $(this).find("#instant_buttons > audio > source").filter(function(i, el) {
                            //Only mp3 files
                            return $(this).attr("type") === "audio/mpeg";
                          }).attr("src");
              list.push({title: title, song: SITE+song});
            });
            return cb(list);
          } else {
            throw new Error("Request Error: "+err);
          }
        });
      } else {
        return cb(list);
      }
    }
  };
}(request, cheerio));
