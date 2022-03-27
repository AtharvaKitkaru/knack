import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Web3 from "web3";

export class AddSong extends Component {
  constructor(props) {
    super(props);
    this.web3 = new Web3(
      Web3.givenProvider || process.env.REACT_APP_GANACHECLI
    );
    this.state = {
      name: "",
      genre: "",
      cost: "",
      buffer: "",
      hash: "",
      loading: false,
    };
  }

  // storeWithProgress = async (files) => {
  //   // show the root cid as soon as it's ready
  //   const onRootCidReady = (cid) => {
  //     console.log("uploading files with cid:", cid);
  //   };

  //   // when each chunk is stored, update the percentage complete and display
  //   const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  //   let uploaded = 0;

  //   const onStoredChunk = (size) => {
  //     uploaded += size;
  //     const pct = totalSize / uploaded;
  //     console.log(`Uploading... ${pct.toFixed(2)}% complete`);
  //   };

  //   // makeStorageClient returns an authorized Web3.Storage client instance
  //   const client = makeStorageClient();

  //   // client.put will invoke our callbacks during the upload
  //   // and return the root cid when the upload completes
  //   return client.put(files, { onRootCidReady, onStoredChunk });
  // };

  onSubmitClick = (event) => {
    event.preventDefault();

    const fileInput = document.querySelector("#upload");
    if (fileInput.files)
      this.setState({ buffer: fileInput.files, loading: true }, async () => {
        toast("Sending file to Web3.Storage");

        const songHash = await this.props.web3storage.put(this.state.buffer);
        this.setState({ hash: songHash }, async () => {
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
              console.log(this.state);
              window.location.reload();
            });
        });
      });
    else {
      toast.warn("Upload a file");
    }
  };
  render() {
    return (
      <form className="form-group" onSubmit={this.onSubmitClick}>
        <h2>Publish song</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={this.state.name}
            required
            onChange={(x) => {
              this.setState({ name: x.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Genre"
            value={this.state.genre}
            required
            onChange={(x) => {
              this.setState({ genre: x.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Cost in mETH"
            value={this.state.cost}
            required
            onChange={(x) => {
              this.setState({ cost: x.target.value });
            }}
          />
        </div>

        <label htmlFor="upload" className="mb-3">
          {/* <button type="button" className="btn btn-dark"> */}
          Upload
          {/* </button> */}
        </label>
        <input
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          id="upload"
          required
          onChange={this.captureFile}
        ></input>
        <div className="mb-3">
          <button type="submit" className="btn btn-light">
            Publish
          </button>
        </div>
        <div className="mb-4">
          <a
            href="https://www.cryps.info/en/Milliether_to_INR/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversion rates
          </a>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddSong);
