import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { getOnePost } from "../../actions/post";
import { connect } from "react-redux";
import PostItem from "../posts/PostItem";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
const Post = ({ getOnePost, post: { post, loading }, match }) => {
  useEffect(() => {
    getOnePost(match.params.id);
  }, [getOnePost]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getOnePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getOnePost }
)(Post);
