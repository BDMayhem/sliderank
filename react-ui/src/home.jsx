import React, { Component } from 'react';
import axios from 'axios';
import AlbumList from './albumList';
import AlbumForm from './albumForm';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      key: null
    };

    this.loadAlbumsDataFromDB = this.loadAlbumsDataFromDB.bind(this);
    this.handleAlbumSubmit = this.handleAlbumSubmit.bind(this);
  }

  loadAlbumsDataFromDB() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ 
          data: res.data,
          loading: false
        });
      });
  }

  handleAlbumSubmit(owner, photoset, url) {
    this.setState({ loading: true });
    axios.post(this.props.url, {owner, photoset, url})
      .then((res) => {
        console.log(res.data.message);
        this.loadAlbumsDataFromDB();
      })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    this.loadAlbumsDataFromDB();
  }

  render() {
    let list;

    this.state.loading
      ? list = <div>loading</div>
      : list = <AlbumList data={this.state.data}/>;

    return(
      <div>
        <h1>Albums</h1>
        <p>Sample album - https://www.flickr.com/photos/16748348@N00/sets/72157594267407308</p>
        <AlbumForm onAlbumSubmit={this.handleAlbumSubmit}/>
        {list}
      </div>
    );
  }
}

export default Home;