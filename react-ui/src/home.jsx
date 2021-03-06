import React, { Component } from 'react';
import axios from 'axios';
import AlbumList from './albumList';
import AlbumForm from './albumForm';
import {HomeLink} from './HomeLink';

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

  handleAlbumSubmit(photoset, url) {
    this.setState({ loading: true });
    axios.post(this.props.url, {photoset, url})
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
      <React.Fragment>
        <HomeLink />
        <h1>SlideRank</h1>
        <div style={{textAlign: 'center'}}>
          <span className='site-desc'>Rank all the images in a Flickr album, 5 at a time</span>
          <p>Sample album - https://www.flickr.com/photos/16748348@N00/sets/72157594267407308</p>
          <AlbumForm onAlbumSubmit={this.handleAlbumSubmit}/>
        </div>
        {list}
      </React.Fragment>
    );
  }
}

export default Home;