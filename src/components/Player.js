import React, { Component } from "react";
import { connect } from "react-redux";

export class Player extends Component {
  render() {
    return (
      <div id="player">
        <p>player</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
