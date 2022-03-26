import React, { Component } from "react";
import { connect } from "react-redux";

export class Land extends Component {
  render() {
    return (
      <div>
        <p>homepage</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Land);
