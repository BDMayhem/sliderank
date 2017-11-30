import React, { Component } from 'react';

class CommentList extends Component {
  albumLink(id) {
    return `/album/${id}`;
  }

  render() {
    return(
      <div>
        { this.props.data.map((album) => (
          <figure className='album-link'
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
          </figure>
        ))}
      </div>
    );
  }
}

export default CommentList;