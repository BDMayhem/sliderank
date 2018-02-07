import React, { Component } from 'react';

class CommentList extends Component {
  albumLink(id) {
    return `/album/${id}`;
  }

  rankedLink(id) {
    return `/album/${id}/ranked`
  }

  render() {
    return(
      <div className="album-list">
        { this.props.data.map((album) => (
          <figure className='album-item'
            key={ album._id }
          >
            <a href={ this.albumLink(album._id) }>
              <img className='top-photo' src={ album.photoset.topPhoto } alt={ album.photoset.title } />
            </a>
              <figcaption>
                <a href={ this.albumLink(album._id) }>
                  { album.photoset.title }
                </a>, by { album.photoset.ownername }
              </figcaption>
              <p><a href={ this.rankedLink(album._id) }>View Ranked Images</a></p>
          </figure>
        ))}
      </div>
    );
  }
}

export default CommentList;