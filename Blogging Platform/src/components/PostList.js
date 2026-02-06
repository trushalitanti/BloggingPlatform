import React, { useState, useEffect } from 'react';
import { Typography, Button, makeStyles, TextField, Divider, InputAdornment } from '@material-ui/core';
import './PostList.css'; // Import CSS file for additional styling
import placeholderImage from './placeholderImage.jpeg';

const useStyles = makeStyles((theme) => ({
  postListContainer: {
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(3),
    backgroundColor: '#f0f0f0',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  postCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(1),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  creatorImage: {
    marginRight: theme.spacing(2),
    borderRadius: '50%',
  },
  postTitle: {
    marginBottom: theme.spacing(1),
  },
  postInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    color: '#666666',
  },
  repliesSection: {
    marginBottom: theme.spacing(2),
  },
  commentContainer: {
    marginLeft: theme.spacing(3),
  },
  comment: {
    marginBottom: theme.spacing(1),
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  placeholderImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  replyInput: {
    width: 'calc(100% - 85px)',
    marginRight: theme.spacing(1),
  },
}));

function PostList() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [un, setUn] = useState("");
  const [prompt, setPrompt] = useState('');
  const [includeStop, setIncludeStop] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState({});

  useEffect(() => {
    let u = sessionStorage.getItem('username');
    setUn(u);
    fetchPosts();
  }, []);

  const handleReplySubmit = async (postId, replyContent) => {
    const date = new Date().toISOString();
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: un,
          content: replyContent,
          date: date
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      await fetchPosts();
      console.log(`Reply submitted successfully for post ${postId}`);
    } catch (error) {
      console.error('Error submitting reply:', error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/getPosts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      console.log(data);
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  // const generateReply = async (postContent) => {
  //   try {
  //     // setPrompt(postContent); // Set the prompt to the current post content
  //     const response = await fetch('http://localhost:8000/api/generate-reply', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         prompt: postContent,
  //         includeStop,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to generate reply');
  //     }
  //     const data = await response.json();
  //     setGeneratedReply(data.reply);
  //   } catch (error) {
  //     console.error('Error generating reply:', error);
  //   }
  // };

  const generateReply = async (postId, postContent) => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: postContent,
          includeStop,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate reply');
      }
      const data = await response.json();
      setGeneratedReplies(prevReplies => ({
        ...prevReplies,
        [postId]: data.reply,
      }));
    } catch (error) {
      console.error('Error generating reply:', error);
    }
  };

  return (
    <div className={classes.postListContainer}>
      <Typography variant="h4" align="center" gutterBottom>Feed</Typography>
      {posts.map(post => (
        <div key={post._id} className={classes.postCard}>
          <div className={classes.postHeader}>
            <img src={post.creatorImage || placeholderImage} alt={post.creator} className={classes.placeholderImage} />
            <div>
              <Typography variant="h6" className={classes.postTitle}>{post._source.title}</Typography>
              <div className={classes.postInfo}>
                <Typography variant="body2" className="post-creator">Creator: {post._source.creator}</Typography>
                <Typography variant="body2" className="post-date">Date: {new Date(post._source.date).toLocaleString()}</Typography>
              </div>
            </div>
          </div>
          <Typography variant="body1" className="post-content">{post._source.content}</Typography>
          <div className={classes.repliesSection}>
                      {post._source.replies.map(reply => (
                        <div key={reply.id} className={`${classes.commentContainer} ${classes.comment}`}>
                          <Typography variant="body2" className="reply-creator">{reply.userId}</Typography>
                          <Typography variant="body1" className="reply-content">{reply.content}</Typography>
                          <Typography variant="caption" className="reply-date">{new Date(reply.date).toLocaleString()}</Typography>
                        </div>
                      ))}
                    </div>
          <Divider />
          <form
            onSubmit={e => {
              e.preventDefault();
              const replyContent = e.target.replyContent.value;
              handleReplySubmit(post._id, replyContent);
              e.target.replyContent.value = '';
            }}
          >
            <TextField
              className={classes.replyInput}
              name="replyContent"
              variant="outlined"
              placeholder="Write a reply..."
              fullWidth
              value={generatedReplies[post._id] || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" color="primary" onClick={() => generateReply(post._id, post._source.content)}>
                      Generate Reply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            <Button style={{ marginTop: '5px' }} type="submit" variant="contained" color="primary">Reply</Button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default PostList;
