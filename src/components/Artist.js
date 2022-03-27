import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import AddSong from "./AddSong";
import Player from "./Player";
import SongDisplay from "./SongDisplay";
import "./Artist.scss";

export class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      artistID: "",
      popularity: 0,
      songIDs: [],
      songs: [],
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
            <p>search</p>
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
