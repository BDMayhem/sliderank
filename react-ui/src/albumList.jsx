import React, { Component } from 'react';

class CommentList extends Component {
  albumLink(id) {
    return `/album/${id}`;
  }

  render() {
    return(
      <div>
        <ul>
          { this.props.data.map((album) => (
            <li
              key={ album._id }
            >
              <a href={ this.albumLink(album._id) }>
                { album.photoset.title }
              </a>, an album by { album.photoset.ownername }
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default CommentList;