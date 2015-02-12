if (Images.find().count() === 0) {
  var img0 = Images.insert({
    title: 'red tile',
    src: 'http://thumbs.dreamstime.com/z/glass-tile-color-patterns-12905720.jpg'
  });

  var img1 = Images.insert({
    title: 'black tile',
    src: 'http://www.villalagoontile.com/images/aguayo-tile/caribbean-cement-tile-color.jpg'
  });

  var img2 = Images.insert({
    title: 'white tile',
    src: 'http://thumbs.dreamstime.com/z/blue-green-multi-color-tile-mosaic-12677184.jpg'
  });

  var img3 = Images.insert({
    title: 'blue tile',
    src: 'http://cdn.vectorstock.com/i/composite/57,37/color-tile-vector-505737.jpg'
  });

  var img4 = Images.insert({
    title: 'yellow tile',
    src: 'http://bannontile.com/glass_tile_pallete.jpg'
  });

  var img5 = Images.insert({
    title: 'green tile',
    src: 'http://us.123rf.com/400wm/400/400/kgtoh/kgtoh1001/kgtoh100101897/6188179-retro-tile-color-mosaic-pattern-background-wallpaper-abstract-illustration.jpg'
  });

  var img6 = Images.insert({
    title: 'brown tile',
    src: 'http://www.mosaictilesupplies.com/images/products/detail/Iconic400.jpg'
  });

  var img7 = Images.insert({
    title: 'pink tile',
    src: 'http://www.sciencephotography.com/andy/images/colortile.gif'
  });

  var img8 = Images.insert({
    title: 'aqua tile',
    src: 'http://thumbs1.ebaystatic.com/d/l225/m/myOM1YrNrpAqTqpNlLU9GUw.jpg'
  });

  var img9 = Images.insert({
    title: 'magenta tile',
    src: 'http://www.germes-online.com/direct/dbimage/50311790/Art_Color_Tile.jpg'
  });

  Thumbnails.insert({
    imageId: img0
  });

  Thumbnails.insert({
    imageId: img1
  });

  Thumbnails.insert({
    imageId: img2
  });

  Thumbnails.insert({
    imageId: img3
  });

  Thumbnails.insert({
    imageId: img4
  });

  Thumbnails.insert({
    imageId: img5
  });

  Thumbnails.insert({
    imageId: img6
  });

  Thumbnails.insert({
    imageId: img7
  });

  Thumbnails.insert({
    imageId: img8
  });

  Thumbnails.insert({
    imageId: img9
  });

  Tiles.insert({
    imageId: img5
  });

  Tiles.insert({
    imageId: img0
  });

  Tiles.insert({
    imageId: img8
  });

  Tiles.insert({
    imageId: img4
  });
}
