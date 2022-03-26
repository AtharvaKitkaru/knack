import React, { Component } from "react";
import { connect } from "react-redux";
import SongDisplay from "./SongDisplay";

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
      toast("Artist details fetched");
      this.loadSongDetails().then(() => {
        console.log("Artist's songs fetched");
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
    console.log(songInfoList);
    this.setState({ songs: songInfoList });
  };

  openForm = () => {
    this.setState({ form: true });
  };

  closeForm = () => {
    this.setState({ form: false });
  };

  render() {
    return (
      <div>
        <p>Artist</p>
        <div>
          <div>
            <h1>{this.state.name}</h1>
            <h3> Artist ID : {this.state.artistID} </h3>
            <h3> Popularity : {this.state.popularity} </h3>
          </div>
          <div>
            {this.state.songs.map((item, i) => (
              <SongDisplay
                type={"artist"}
                name={item.name}
                genre={item.genre}
                cost={item.cost}
                likes={item.timesPurchased}
                hash={item.hash}
                key={i}
              />
            ))}
          </div>
          <h1>
            <button onClick={this.openForm}>open form</button>
          </h1>
          <AddSong
            contract={this.props.contract}
            ipfs={this.props.ipfs}
            account={this.props.account}
            form={this.state.form}
            closeForm={this.closeForm}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Artist);
