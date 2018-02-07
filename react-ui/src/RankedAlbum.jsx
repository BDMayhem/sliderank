import React, { Component } from 'react';
import axios from 'axios';
import { HomeLink } from './HomeLink';

class RankedAlbum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      album: {
        photoset: {
          title: ''
        },
        error: "This isn't an album"
      },
      selection: []
    };

    this.getAlbumFromDB = this.getAlbumFromDB.bind(this);
  }

  componentDidMount() {
    this.getAlbumFromDB();
  }

  getAlbumFromDB() {
    axios.get(`${process.env.REACT_APP_BASE_URL}albums/${this.props.match.params.id}`)
      .then(res => {
        if (res.data.hasOwnProperty('photoset')) {
          this.setState({
            album: res.data
          }, () => console.log(this.state));
        }
      });
  }

  render() {
    if(this.state.album.hasOwnProperty('error')) {
      return <div>{this.state.album.error}</div>;
    } else {
      return (
        <React.Fragment>
          <HomeLink />
          <h1><a href={ this.state.album.photoset.link }>{ this.state.album.photoset.title }</a></h1>
          <div className="album-list">
            { this.state.album.photoset.photo.map((photo) => (
              <figure className='album-item'
                key={ photo._id }
              >
                <a href={ photo.link }>
                  <img className='top-photo' src={ photo.link } alt={ photo.title } />
                </a>
                  <figcaption>
                    <a href=''>
                      { photo.title }
                    </a>
                  </figcaption>
                  <p><strong>SlideRank:</strong> { photo.score }</p>
              </figure>
            ))}
          </div>
        </React.Fragment>
      );
    }
  }
}

export default RankedAlbum;