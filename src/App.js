import React, { Component } from "react";
import { connect } from "react-redux";
import Auth from "./components/Auth";
import Offline from "./components/Offline";
import Land from "./components/Land";
import Loading from "./components/Loading";

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userExists: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      // check if user authenticated
      this.setState({ loading: false, userExists: false });
    }, 1000);
  }

  render() {
    if (!navigator.onLine) {
      return <Offline />;
    }
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.userExists) {
      return <Land />;
    } else {
      return <Auth />;
    }
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
