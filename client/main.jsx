/**
 * @jsx React.DOM
 */

var ImageView = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
    };
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    el.addEventListener("load", this.handleResize);
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    el.removeEventListener("load", this.handleResize);
  },

  handleResize: function(e) {
    var el = this.getDOMNode();
    var imgH = el.naturalHeight;
    var imgW = el.naturalWidth;

    if (imgW/imgH < 1.0) {
      $(el).addClass("portrait");
    } else {
      $(el).addClass("landscape");
    }
  },

  handleDrag: function(e) {
    console.log("image id=" + this.props.data._id);
    e.nativeEvent.dataTransfer.setData("ImageId", this.props.data._id);
  },

  render: function() {
    if (this.props.draggable) {
      return (
        <img src={this.props.data.src} alt={this.props.data.title} title={this.props.data.title} onDragStart={this.handleDrag} />
      );
    } else {
      return (
        <img src={this.props.data.src} alt={this.props.data.title} title={this.props.data.title} />
      );
    }
  }
});

var ThumbnailView = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
      image: Images.findOne(this.props.data.imageId)
    };
  },

  handleRemove: function(e) {
    console.log("removing thumbnail " + this.props.data._id);
    this.props.onDestroy(e, this.props.data);
  },

  render: function() {
    return (
      <li>
        <div className="thumbnailview" key={this.props.key}>
          <ImageView data={this.state.image} draggable="true" />
          <button className="destroy" onClick={this.handleRemove}></button>
        </div>
      </li>
    );
  }
});

var ThumbnailList = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getDefaultProps: function() {
    return {
      msg: "Drop Your Files Anywhere in the Left Pane!"
    };
  },

  getMeteorState: function() {
    return {
    };
  },

  handleRemove: function(e, thumbnail) {
    console.log("removing thumbnail from list " + thumbnail._id);
    this.props.onDestroy(e, thumbnail);
  },

  render: function() {
    var thumbnails = this.props.data.map(function(thumbnail, i) {
      return (
        <ThumbnailView data={thumbnail} key={thumbnail._id} onDestroy={this.handleRemove} />
      );
    }, this);

    return (
      <div className="thumbnaillist">
        <ul>
          {thumbnails}
        </ul>
        <div id="drop-overlay">
          <h1 id="drop-msg">{this.props.msg}</h1>
          <div id="drop-backdrop"></div>
        </div>
      </div>
    );
  }
});

var ThumbnailPane = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
      thumbnails: Thumbnails.find().fetch()
    };
  },

  componentDidMount: function() {
    var self = this;
    $('#thumbnailpane').fileDrop({
      onFileRead: function(fileCollection) {
        $.each(fileCollection, function() {
          console.log("got file: " + this.name);
          console.log("file size: " + this.size);
          console.log("file type: " + this.type);
          self.save(this.data, this.name);
        });
      }
    });
  },

  save: function(blob, name, path) {
    var self = this;
    Meteor.call("saveFile", blob, name, path, function(error, result) {
      if (error) {
        console.error("got error: " + error);
      } else {
        console.log("got saved: " + result);
        self.handleAdd(result);
      }
    });
  },

  handleAdd: function(imageId) {
    thumbnailId = Thumbnails.insert({
        imageId: imageId
    });
    console.log("added thumbnail " + thumbnailId);
    this.setState({thumbnails: Thumbnails.find().fetch()});
  },

  handleRemove: function(e, thumbnail) {
    console.log("removing thumbnail from pane " + thumbnail._id);
    var imageId = thumbnail.imageId;
    this.props.onSync(imageId);
    Thumbnails.remove(thumbnail._id);
    this.setState({thumbnails: Thumbnails.find().fetch()});
  },

  render: function() {
    return (
      <div id="thumbnailpane" onDragOver={this.allowDrop}>
        <ThumbnailList data={this.state.thumbnails} onDestroy={this.handleRemove} ref="thumbnaillist" />
      </div>
    );
  }
});

var TileView = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
      image: Images.findOne(this.props.data.imageId)
    };
  },

  handleRemove: function(e) {
    console.log("removing tile " + this.props.data._id);
    this.props.onDestroy(e, this.props.data);
  },

  render: function() {
    if (this.state.image) {
      return (
        <div className="tileview" key={this.props.key}>
          <ImageView data={this.state.image} />
          <button className="destroy" onClick={this.handleRemove}></button>
        </div>
      );
    } else {
      console.log("no matching image: " + this.props.data.imageId + " for tile " + this.props.data._id);
      return <div>{this.props.data.imageId}</div>;
    }
  }
});

var TileList = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
    };
  },

  componentDidMount: function() {
    this.renderTiles();
  },

  componentDidUpdate: function() {
    this.renderTiles();
  },

  componentWillUnmount: function() {
    this.props.data.map(function(tile, i) {
      React.unmountComponentAtNode(this.refs['tile' + tile._id].getDOMNode());
    });
  },

  handleDrop: function() {
    var newOrder = $(this.getDOMNode()).children().get().map(function(child, i) {
      var rv = child.dataset.reactSortablePos;
      child.dataset.reactSortablePos = i;
      return rv;
    });
    this.props.onSort(newOrder);
  },

  handleRemove: function(e, tile) {
    console.log("removing tile from list " + tile._id);
    React.unmountComponentAtNode(this.refs['tile_' + tile._id].getDOMNode());
    this.props.onDestroy(e, tile);
  },

  renderTiles: function() {
    this.props.data.map(function(tile, i) {
      console.log("rendering " + tile._id);
      React.renderComponent(
        <TileView data={tile} key={tile._id} onDestroy={this.handleRemove} />,
        this.refs['tile_' + tile._id].getDOMNode()
      );
    }, this);
  },

  render: function() {
    var tiles = [];

    this.props.data.map(function(tile, i) {
      console.log("adding " + tile._id);
      tiles.push(<li ref={'tile_' + tile._id} key={i} />);
    });

    return (
      <ul>
        {tiles}
      </ul>
    );
  }
});

var TilePane = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
      tiles: Tiles.find().fetch()
    };
  },

  componentDidMount: function() {
    $(this.refs.tilelist.getDOMNode()).sortable().bind("sortupdate", this.handleSort);
  },

  componentDidUpdate: function() {
    console.log("updating");
    $(this.refs.tilelist.getDOMNode()).sortable("destroy");
    $(this.refs.tilelist.getDOMNode()).sortable();
  },

  allowDrop: function(e) {
    e.preventDefault();
  },

  handleSort: function(e, ui) {
    console.log("moved");
    /*
    this.replaceState({tiles: []});
    this.replaceState({tiles: Tiles.find().fetch()});
    */
    this.setState({tiles: Tiles.find().fetch()});
  },

  handleAdd: function(imageId) {
    tileId = Tiles.insert({
        imageId: imageId
    });
    console.log("added tile " + tileId);
    this.setState({tiles: Tiles.find().fetch()});
  },

  syncRemove: function(imageId) {
    Tiles.find({imageId: imageId}).forEach(function(tile) {
      Tiles.remove(tile._id);
    });
    this.setState({tiles: Tiles.find().fetch()});
  },

  handleRemove: function(e, tile) {
    console.log("removing tile from pane " + tile._id);
    Tiles.remove(tile._id);
    this.replaceState({tiles: []});
    this.replaceState({tiles: Tiles.find().fetch()});
    //this.setState({tiles: Tiles.find().fetch()});
  },

  handleDrop: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var imageId = e.nativeEvent.dataTransfer.getData("ImageId");
    if (imageId) {
      console.log("got drop image " + imageId);
      console.log(e.target);
      console.log('drop found ' + e.target.nodeName);
      this.handleAdd(imageId);
    } else {
      console.log("random drop");
    }

    return false;
  },

  render: function() {
    return (
      <div id="tilepane" onDrop={this.handleDrop} onDragOver={this.allowDrop}>
        <div className="tilelist">
          <TileList data={this.state.tiles} onSort={this.handleSort} onDestroy={this.handleRemove} ref="tilelist" />
        </div>
      </div>
    );
  }
});

var TileApp = React.createClass({
  mixins: [ReactMeteor.Mixin],

  getMeteorState: function() {
    return {
    };
  },

  handleSync: function(imageId) {
    this.refs.tilePane.syncRemove(imageId);
  },

  render: function() {
    return (
      <div id="app">
        <ThumbnailPane ref="thumbnailPane" onSync={this.handleSync} />
        <TilePane ref="tilePane" />
      </div>
    );
  }
});

Meteor.startup(function() {
  React.renderComponent(
    <TileApp />,
    document.getElementById("main")
  );
});
