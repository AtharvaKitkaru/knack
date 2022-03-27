import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import AddSong from "./AddSong";
import Player from "./Player";
import SongDisplay from "./SongDisplay";
import "./Artist.scss";
import Web3 from "web3";

export class Artist extends Component {
  constructor(props) {
    super(props);
    this.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_GANACHECLI
    );
    this.state = {
      name: "",
      artistID: "",
      popularity: 0,
      songIDs: [],
      songs: [],
      query: "",
      form: false,
    };
  }

  componentDidMount() {
    this.loadArtistDetails().then(() => {
      this.loadSongDetails().then(() => {
        // toast.success(`Welcome ${this.state.name}! 🎤`);
      });
    });
  }

  loadArtistDetails = async () => {
    const contractInstance = await this.props.contract.deployed();
    const artistDetails = await contractInstance.getArtistDetails({
      from: this.props.account,
    });
    let songList = [];
    for (let i = 0; i < artistDetails[2].length; i++) {
      songList.push(artistDetails[2][i].toString());
    }
    this.setState({
      name: artistDetails[0].toString(),
      artistID: artistDetails[1].toString(),
      songIDs: songList,
    });
  };

  loadSongDetails = async () => {
    const contractInstance = await this.props.contract.deployed();
    let songInfoList = [];
    for (let i = 0; i < this.state.songIDs.length; i++) {
      let songDetails = await contractInstance.getSongDetails(
        this.state.songIDs[i],
        { from: this.props.account }
      );
      songInfoList.push({
        name: songDetails[0],
        genre: songDetails[2],
        hash: songDetails[3],
        cost: songDetails[4].toString(),
        timesPurchased: songDetails[5].toString(),
      });
      this.state.popularity += parseInt(songDetails[5].toString());
    }
    // console.log(songInfoList);
    this.setState({ songs: songInfoList });
  };

  render() {
    return (
      <div id="artist" className="app d-flex flex-column container-fluid">
        <header>
          <h1>Knack</h1>
        </header>
        <main className="d-flex flex-grow-1">
          {/* <div className="col">
            <p>analytics</p>
          </div> */}
          <div className="col">
            <input
              type="search"
              name="query"
              id="query"
              className="form-control w-50 text-center"
              placeholder="Search a published song"
              onChange={(e) => this.setState({ query: e.target.value })}
            />

            {this.state.songs
              .filter((song) => {
                let name = song.name.toLowerCase();
                let query = this.state.query.toLowerCase();
                return name.includes(query);
              })
              .map((song) => (
                <div className="song" key={song.hash}>
                  <p>{song.name}</p>
                  <p>{song.genre}</p>
                  <p>{this.web3.utils.fromWei(song.cost, "milliether")}</p>
                  <p>{song.timesPurchased}</p>
                </div>
              ))}
          </div>
          <div className="col-3">
            <AddSong
              username={this.props.username}
              contract={this.props.contract}
              account={this.props.account}
              web3storage={this.props.web3storage}
              type={this.props.type}
            />
          </div>
        </main>
        <footer>
          <Player />
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
