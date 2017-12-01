import React, { Component } from 'react';

class AlbumForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albumURL: ''
    };
    this.handleAlbumChange = this.handleAlbumChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleAlbumChange(e) {
    e.preventDefault();
    this.setState({
      albumURL: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    const url = this.state.albumURL.trim();
    if (!url) return;

    const urlArr = url.split('/');
    //sometimes flickr refers to albums as 'sets'
    const urlSet = urlArr.indexOf('albums') >= 0 
      ? urlArr[urlArr.indexOf('albums') + 1] 
      : urlArr[urlArr.indexOf('sets') + 1];

    this.props.onAlbumSubmit(urlSet, url);
    
    this.setState({
      albumURL: ''
    });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <h3>Add a Flickr album</h3>
        <input type='text' placeholder='add album' onChange={this.handleAlbumChange}/>
        <input type='submit' value='Submit'/>
      </form>
    );
  }
}
export default AlbumForm;