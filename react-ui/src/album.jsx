import React, { Component } from 'react';
import axios from 'axios';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

class Album extends Component {
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

    this.submitVote = this.submitVote.bind(this);
    this.getAlbumFromDB = this.getAlbumFromDB.bind(this);
    this.pickFive = this.pickFive.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  componentDidMount() {
    this.getAlbumFromDB();
  }

  getAlbumFromDB() {
    axios.get(`${process.env.REACT_APP_BASE_URL}${this.props.match.params.id}`)
      .then(res => {
        if (res.data.hasOwnProperty('photoset')) {
          this.setState({
            album: res.data
          }, 
          () => this.pickFive());
        }
      });
  }

  pickFive() {
    const photos = this.state.album.photoset.photo;
    photos.sort((a, b) => a.votes - b.votes);
    const ten = photos.slice(0, 10);
    let selection = [];
    while (selection.length < 5) {
      const index = Math.floor(Math.random() * ten.length);
      selection.push(ten[index]);
      ten.splice(index, 1);
    }
    this.setState({ selection });
  }

  submitVote(e) {
    e.preventDefault();
    console.log('click')
    const album = this.state.album;
    const selection = this.state.selection;
    let sum;
    selection.forEach((el, index) => {
      let albumIndex = album.photoset.photo.findIndex(photo => photo.id === el.id);
      sum = album.photoset.photo[albumIndex].score * album.photoset.photo[albumIndex].votes + 5 - index;
      album.photoset.photo[albumIndex].votes++;
      album.photoset.photo[albumIndex].score = sum / album.photoset.photo[albumIndex].votes;
    });
    this.setState({ album }, this.updateAlbum);
  }

  updateAlbum() {
    axios.put(`${process.env.REACT_APP_BASE_URL}${this.props.match.params.id}`, this.state.album)
      .then(this.getAlbumFromDB)
      .catch(err => console.error(err));
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      selection: arrayMove(this.state.selection, oldIndex, newIndex)
    }, () => console.log(this.state.selection) );
  }

  render() {
    if(this.state.album.hasOwnProperty('error')) {
      return <div>{this.state.album.error}</div>;
    } else {
      return(
        <SortableList
          name={this.state.album.photoset.title}
          items={this.state.selection}
          onSortEnd={this.onSortEnd}
          axis='xy'
          submitVote={this.submitVote}
        />
      );
    }
  }
}

const SortableItem = SortableElement(({value}) => 
  <div className='albumitem'>
    {value.title}
    <br />
    <img src={`https://farm${value.farm}.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`} alt={value.title}/>
    <br />
    {value.score.toFixed(2)}
  </div>
);

const SortableList = SortableContainer(({items, name, submitVote}) => {
  return(
    <div>
      <div className='top'>
        <h2>{name}</h2>
        <br />
        <input type="button" value='Submit' onClick={submitVote}/>
      </div>
      <div className='albumlist'>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    </div>
  );
});

export default Album;