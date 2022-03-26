import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import artwork from "../assets/knack.png";
import "./Auth.scss";

export class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
    };
  }

  loginUser = (e) => {
    e.preventDefault();
    toast.success("Logged in!");
  };

  registerUser = (e) => {
    e.preventDefault();
    toast.success("Registered");
  };

  render() {
    return (
      <div id="auth" className="app d-flex">
        <div className="col-0 col-md-7 d-flex justify-content-center align-items-center">
          <img src={artwork} alt="artwork" className="w-100" />
        </div>
        <form className="col-12 col-md-5 offset-md- d-flex flex-column justify-content-center p-4">
          <div className="mb-3 d-flex">
            <h1 className="text-white text-" id="knack__heading">
              Knack
            </h1>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Account address"
              onChange={(evt) => this.setState({ username: evt.target.value })}
            />
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <button className="btn btn-dark" onClick={this.registerUser}>
              Register
            </button>
            <button className="btn btn-success" onClick={this.loginUser}>
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
