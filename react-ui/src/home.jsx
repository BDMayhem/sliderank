import React, { Component } from 'react';
import axios from 'axios';
import AlbumList from './albumList';
import AlbumForm from './albumForm';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.loadAlbumsDataFromDB = this.loadAlbumsDataFromDB.bind(this);
    this.handleAlbumSubmit = this.handleAlbumSubmit.bind(this);
  }

  loadAlbumsDataFromDB() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ data: res.data });
      });
  }

  handleAlbumSubmit(owner, photoset) {
    //check if submitted URL has user name or id
    axios.get(`https://api.flickr.com/services/rest/?method=flickr.people.findByUsername&api_key=478edb7856d5b1f2f7a09634198f5102&username=${owner}&format=json&nojsoncallback=1`)
      .then(res => {
        let checkedOwner;
        //if name, convert to id
        if (res.data.stat === 'ok') {
          checkedOwner = res.data.user.id;
        }  else {
          checkedOwner = owner;
        }
        return axios.get(`https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=478edb7856d5b1f2f7a09634198f5102&photoset_id=${photoset}&user_id=${checkedOwner}&format=json&nojsoncallback=1`);
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
    return(
      <div>
        <h1>This should be a list of albums</h1>
        <AlbumList data={this.state.data} url={this.props.url}/>
        <AlbumForm onAlbumSubmit={this.handleAlbumSubmit}/>
      </div>
    );
  }
}

export default Home;