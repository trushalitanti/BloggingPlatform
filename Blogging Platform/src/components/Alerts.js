import React, { useState, useCallback, useEffect } from 'react'; // Import useState hook

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import Footer from './Footer';
// import { useCommonContext } from './CommonContext';
import { Grid, Typography } from '@mui/material';
import Alert from './Alert';

const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random?wallpapers',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const defaultTheme = createTheme();

const Alerts = () => {
//   const { commonState } = useCommonContext();
  const [alerts, setAlerts] = useState('');
  const [un,setUn]= useState();

useEffect(() => {
    let un = sessionStorage.getItem('username');
    setUn(un)
    fetchAlerts();
  }, [alerts]);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/getAlerts?username=${un}`);
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      const data = await response.json();
      console.log("data " + data);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, [un, setAlerts]);

  const onDelete = useCallback(async () => {
    fetchAlerts();
  }, [fetchAlerts]);


  return (
        <>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                <Grid container spacing={2} style={{ marginTop: '1rem' }}>
                  {alerts && alerts.map((alert) => (
                   <Grid key={alert} item xs={12} md={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                      <Alert alert={alert} onDelete={onDelete} />
                  </Grid>                 
                  ))}
                </Grid>
              </div>
        </>
  );
}

export default Alerts;