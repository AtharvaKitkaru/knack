import React, { Component } from "react";
import { connect } from "react-redux";
import Player from "./Player";
import "./Land.scss";

export class Land extends Component {
  render() {
    return (
      <div className="app" id="Land">
        <header className="d-flex justify-content-between">
          <h1>Knack</h1>
          <div className="rounded-circle" style={{ width: "3rem" }}>
            <img
              src="https://api.multiavatar.com/Binx Bond.png"
              alt="Avatar"
              className="img-fluid w-100"
            />
          </div>
        </header>
        <main>
          <p>Recommendations</p>
        </main>
        <Player />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Land);
