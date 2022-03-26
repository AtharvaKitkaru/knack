import React, { Component } from "react";
import { connect } from "react-redux";

export class AddSong extends Component {
  constructor(props) {
    super(props);
    this.web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    this.state = {
      name: "",
      genre: "",
      cost: "",
      buffer: "",
      hash: "",
      loading: false,
    };
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsArrayBuffer(file);
    file_reader.onloadend = () => {
      this.setState({ buffer: Buffer.from(file_reader.result) });
    };
  };

  onSubmitClick = async (event) => {
    event.preventDefault();
    if (this.state.buffer) {
      this.setState({ loading: true });
      const file = await this.props.ipfs.add(this.state.buffer);
      const songHash = file["path"];
      this.setState({ hash: songHash });
      const contractInstance = await this.props.contract.deployed();
      await contractInstance
        .addSong(
          this.state.name,
          this.state.genre,
          this.state.hash,
          this.web3.utils.toWei(this.state.cost, "milliether"),
          { from: this.props.account }
        )
        .then(() => {
          this.setState({ loading: false });
          this.props.closeForm();
          window.location.reload();
        });
    }
  };
  render() {
    return (
      <form>
        <h2>add song</h2>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={this.state.name}
            required
            onChange={(x) => {
              this.setState({ name: x.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Genre"
            value={this.state.genre}
            required
            onChange={(x) => {
              this.setState({ genre: x.target.value });
            }}
          />
          <input
            type="number"
            placeholder="Cost"
            value={this.state.cost}
            required
            onChange={(x) => {
              this.setState({ cost: x.target.value });
            }}
          />
          <label htmlFor="upload">upload</label>
          <input
            type="file"
            style={{ display: "none" }}
            id="upload"
            required
            onChange={this.captureFile}
          ></input>
        </div>
        <input type="submit" onClick={this.onSubmitClick} value="Publish" />
      </form>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddSong);
