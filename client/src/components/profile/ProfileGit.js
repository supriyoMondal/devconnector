import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const ProfileGit = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos]);
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1 ">Github Repos</h2>
      {repos === null ? (
        <Spinner />
      ) : (
        repos.map(repo => (
          <div key={repo._id} className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferre"
                >
                  {repo.name}{" "}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Start : {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Wtchers : {repo.watchers_count}
                </li>
                <li className="badge badge-light">
                  Forks : {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  repos: state.profile.repos
});

ProfileGit.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  { getGithubRepos }
)(ProfileGit);
