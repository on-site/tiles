var fs = Npm.require('fs');

Meteor.methods({
  saveFile: function(blob, name, path) {
    path = cleanPath(path);
    name = cleanName(name || 'file');
    var encoding = 'base64';
    var chroot = '../../../../../public/images';
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');
    console.log('The file ' + name + ' is being saved');

    var img = Images.findOne({
      title: name,
      src: 'images/' + name
    });

    console.log('The image ' + img);

    if (img === undefined) {
      // TODO Add file existance checks, etc...
      fs.writeFile(path + name, blob, encoding, function(err) {
        if (err) {
          throw (new Meteor.Error(500, 'Failed to save file.', err));
        } else {
          console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
        }
      });

      img = Images.insert({
        title: title(name),
        src: 'images/' + name
      });
    }

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }

    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }

    function title(str) {
      return str.substring(str.lastIndexOf('/') + 1).split('.')[0];
    }

    return img;
  }
});
