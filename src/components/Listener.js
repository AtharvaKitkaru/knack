import React, { Component } from "react";
import { connect } from "react-redux";
import Loading from "./Loading";
import SongDisplay from "./SongDisplay";

export class Listener extends Component {
  constructor(props) {
    super(props);
    this.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_GANACHECLI
    );
    this.state = {
      name: "",
      listenerID: "",
      store: [],
      library: [],
      songsMapping: {},
      supportArtistUsername: "",
      donation: "",
    };
  }

  componentDidMount() {
    this.loadStore().then(() => {
      console.log("Loaded Store");
      this.loadListenerDetails().then(() => {
        console.log("Loaded Listener's Details");
        this.loadSongDetails().then(() => {
          console.log("Loaded Songs");
        });
      });
    });
  }

  loadStore = async () => {
    const contractInstance = await this.props.contract.deployed();
    const count = await contractInstance.getNumSongs({
      from: this.props.account,
    });
    let mapping = {};
    for (let i = 1; i < parseInt(count.toString()) + 1; i++) {
      mapping[i] = 0;
    }
    this.setState({ songsMapping: mapping });
  };

  loadListenerDetails = async () => {
    const contractInstance = await this.props.contract.deployed();
    const listenerDetails = await contractInstance.getListenerDetails({
      from: this.props.account,
    });
    let mapping = this.state.songsMapping;
    for (let i = 0; i < listenerDetails[2].length; i++) {
      mapping[parseInt(listenerDetails[2][i].toString())] = 1;
    }
    this.setState({
      name: listenerDetails[0].toString(),
      listenerID: listenerDetails[1].toString(),
      songsMapping: mapping,
    });
  };

  loadSongDetails = async () => {
    const contractInstance = await this.props.contract.deployed();
    let n = Object.keys(this.state.songsMapping).length;
    let newSongs = [];
    let purchasedSongs = [];

    for (let i = 1; i < n + 1; i++) {
      let songDetails = await contractInstance.getSongDetails(i, {
        from: this.props.account,
      });
      if (this.state.songsMapping[i] === 1) {
        purchasedSongs.push({
          name: songDetails[0],
          artist: songDetails[1],
          genre: songDetails[2],
          hash: songDetails[3],
          cost: songDetails[4].toString(),
          songID: i,
        });
      } else {
        newSongs.push({
          name: songDetails[0],
          artist: songDetails[1],
          genre: songDetails[2],
          hash: songDetails[3],
          cost: songDetails[4].toString(),
          songID: i,
        });
      }
    }

    this.setState({
      library: purchasedSongs,
      store: newSongs,
    });
  };

  onSubmitClick = async (event) => {
    event.preventDefault();
    if (this.state.supportArtistUsername) {
      const contractInstance = await this.props.contract.deployed();
      await contractInstance
        .donateArtist(this.state.supportArtistUsername, {
          from: this.props.account,
          value: this.web3.utils.toWei(this.state.donation, "milliether"),
        })
        .then(() => {
          window.location.reload();
        });
    }
    console.log("Submitted");
  };

  render() {
    if (this.state.ID === "") {
      return <Loading />;
    } else {
      return (
        <div style={styles.main}>
          <div style={styles.info}>
            <h2>{this.state.name}</h2>
            <h3> listener ID : {this.state.listenerID} </h3>
          </div>
          <div style={styles.area}>
            <div style={styles.library}>
              <h3 style={{ textAlign: "center" }}>Library</h3>
              {this.state.library.map((item, i) => (
                <SongDisplay
                  type={"listener"}
                  name={item.name}
                  artist={item.artist}
                  genre={item.genre}
                  hash={item.hash}
                  songID={item.songID}
                  key={i}
                />
              ))}
            </div>
            <div style={styles.store}>
              <h3 style={{ textAlign: "center" }}>Store</h3>
              {this.state.store.map((item, i) => (
                <SongDisplay
                  contract={this.props.contract}
                  ipfs={this.props.ipfs}
                  account={this.props.account}
                  type={"shop"}
                  name={item.name}
                  artist={item.artist}
                  genre={item.genre}
                  cost={item.cost}
                  hash={item.hash}
                  songID={item.songID}
                  key={i}
                />
              ))}
            </div>
          </div>
          <div>
            <form>
              <div style={styles.form}>
                <h3 style={{ textAlign: "center" }}>Sponsor Artist</h3>
                <input
                  type="text"
                  placeholder="Artist Username"
                  style={styles.textInput}
                  value={this.state.supportArtistUsername}
                  required
                  onChange={(x) => {
                    this.setState({ supportArtistUsername: x.target.value });
                  }}
                />
                <input
                  type="text"
                  placeholder="Amount"
                  style={styles.textInput}
                  value={this.state.donation}
                  required
                  onChange={(x) => {
                    this.setState({ donation: x.target.value });
                  }}
                />
                <input
                  type="submit"
                  onClick={this.onSubmitClick}
                  style={styles.button}
                  value="Donate"
                />
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Listener);
