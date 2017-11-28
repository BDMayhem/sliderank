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
    
    axios.get(`${process.env.REACT_APP_BASE_URL}env`)
      .then(res => {
        this.setState({
          key: res.data.key
        })
      })
  }

  handleAlbumSubmit(owner, photoset) {
    //check if submitted URL has user name or id
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=${this.state.key}&username=${owner}&format=json&nojsoncallback=1`)
      .then(res => {
        let checkedOwner;
        //if name, convert to id
        if (res.data.stat === 'ok') {
          checkedOwner = res.data.user.id;
        }  else {
          checkedOwner = owner;
        }
        return axios.get(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${this.state.key}&photoset_id=${photoset}&user_id=${checkedOwner}&format=json&nojsoncallback=1`);
      })
      .then(res => {
        res.data.photoset.photo.forEach((photo) => {
          photo.score = 0;
          photo.votes = 0;
        });
        res.data.stat === 'ok'
          ? axios.post(this.props.url, res.data)
            .then(() => {
              this.loadAlbumsDataFromDB();
            })
            .catch(err => console.error(err))
          : console.log('flash nope');
      });
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
        {list}
        <h2>Add a Flickr album</h2>
        <AlbumForm onAlbumSubmit={this.handleAlbumSubmit}/>
      </div>
    );
  }
}

export default Home;