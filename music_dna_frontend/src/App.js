import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      userData: {name: '', birthdate: 0, email:''}
    }
  }
  

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
  // Constr.prototype.getMe = function(options, callback) {
  //   var requestData = {
  //     url: _baseUri + '/me'
  //   };
  //   return _checkParamsAndPerformRequest(requestData, options, callback);
  // };

  getUserData(){
    spotifyApi.getMe()
    .then((data) => {
      this.setState({
        userData: {
          name: data.display_name,
          birthdate: data.birthdate,
          email: data.email
        }
      })
    })
  }
  // Constr.prototype.getMyCurrentPlayingTrack = function(options, callback) {
  //   var requestData = {
  //     url: _baseUri + '/me/player/currently-playing'
  //   };
  //   return _checkParamsAndPerformRequest(requestData, options, callback);
  // };

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div> User Name: {this.state.userData.name}</div>
        <div> User Birthdate: {this.state.userData.birthdate}</div>
        <div> User email: {this.state.userData.email}</div>

        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={() => this.getUserData()}>
            Get User Data
          </button>
        }
      </div>
    );
  }
}

export default App;
