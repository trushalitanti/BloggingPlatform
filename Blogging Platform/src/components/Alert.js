import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const Alert = ({ alert, onDelete }) => {
  const [un, setUn] = useState('');

  useEffect(() => {
    let un = sessionStorage.getItem("username");
    setUn(un);
  }, []);

  const handleDeleteAlert = async () => {
    try {
      const response = await fetch(`http://localhost:8080/deleteAlert?userName=${un}&topic=${alert.username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      onDelete();

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDeleteAlert();
  };

  return (
    <Grid item xs={12} md={12}>
      <Card sx={{ display: 'flex' }}>
        <CardContent>
          <Typography component="h6" variant="h6">
            {alert.alert}
          </Typography>
        </CardContent>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '16px' }}>
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: '8px' }}>
              Mark as Read
            </Button>
          </form>
        </Grid>
      </Card>
    </Grid>
  );
};

Alert.propTypes = {
  alert: PropTypes.shape({
    username: PropTypes.string.isRequired,
    alert: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Alert;
