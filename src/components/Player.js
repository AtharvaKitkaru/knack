import React, { Component } from "react";
import { connect } from "react-redux";
import "./Player.scss";

export class Player extends Component {
  render() {
    return (
      <div
        id="player"
        className="d-flex justify-content-center align-items-center"
      >
        <p>Stop</p>
        <p>Seek backward 10s</p>
        <p>Play</p>
        <p>Seek forward 10s</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
