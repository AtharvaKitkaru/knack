import React, { Component } from "react";
import { connect } from "react-redux";
import "./Player.scss";

export class Player extends Component {
  render() {
    return (
      <div>
        <p>player</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
