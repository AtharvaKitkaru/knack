import React, { Component } from "react";
import { connect } from "react-redux";

export class SongDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, audio: "", hash: "" };
  }

  componentDidMount() {
    this.loadSong();
  }

  buySong = async () => {
    const contractInstance = await this.props.contract.deployed();
    await contractInstance.buySong(this.props.songID, {
      from: this.props.account,
      value: this.props.cost,
    });
  };

  loadSong = async () => {
    let audio_src = "https://ipfs.infura.io/ipfs/" + this.props.hash;
    this.setState({ audio: new Audio(audio_src) });
  };

  playSong = async () => {
    console.log(this.state.audio);
    if (this.state.audio) {
      this.setState({ playing: true });
      this.state.audio.play();
    }
  };

  pauseSong = async () => {
    console.log(this.state.audio);
    if (this.state.audio) {
      this.setState({ playing: false });
      this.state.audio.pause();
    }
  };

  render() {
    if (this.props.type === "artist")
      return (
        <div className="">
          <p>{this.props.name}</p>
          <p>{this.props.genre}</p>
          <p>{this.props.cost / 10000000000000000}</p>
          <p>{this.props.likes}</p>
        </div>
      );
    else if (this.props.type === "listener")
      return (
        <div style={!this.state.playing ? styles.card : styles.cardHiglight}>
          <p>{this.props.name}</p>
          <p>{this.props.genre}</p>
          <p>{this.props.artist}</p>
          {this.state.playing ? (
            <button onClick={this.pauseSong}>pause</button>
          ) : (
            <button onClick={this.playSong}>play</button>
          )}
        </div>
      );
    else
      return (
        <div>
          <p>{this.props.name}</p>
          <p>{this.props.genre}</p>
          <p>{this.props.artist}</p>
          <p>{this.props.cost / 1000000000000000}</p>
          <button className="btn btn-lg" onClick={this.buySong}>
            buy song
          </button>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SongDisplay);
