import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/getPosts');
      const data = await response.json();
      setPosts(data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/deletePost/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove the post from the UI after successful deletion
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  return (
    <div>
      {isLoading ? (
        <CircularProgress /> // Show loading indicator while fetching data
      ) : (
        <>
          {posts.length === 0 ? (
            <Typography variant="body1">No posts available</Typography>
          ) : (
            <>
              <Typography variant="h4">Post List</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Creator</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {posts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell>{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.creator}</TableCell>
                        <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="secondary" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AllPosts;
