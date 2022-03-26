import React, { Component } from "react";
import { connect } from "react-redux";

export class Listener extends Component {
  render() {
    return (
      <div>
        <p>listener</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Listener);
