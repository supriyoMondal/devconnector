import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

function Login({ login, isAuthenticate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;
  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();

    login(email, password);
  };

  //Redirect if login
  if (isAuthenticate) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Log Into your account !
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            onChange={e => onChange(e)}
            value={email}
            type="email"
            placeholder="Email Address"
            name="email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
            value={password}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
}
const mapStateToProps = state => ({
  isAuthenticate: state.auth.isAuthenticate
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticate: PropTypes.bool
};

export default connect(
  mapStateToProps,
  { login }
)(Login);
