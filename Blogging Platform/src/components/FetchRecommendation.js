import OpenAI from "openai";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const fetchSuggestedActivities = async () => {
  try {
    const response = await fetch('http://localhost:5000/suggest-activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch suggested activities: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Activities fetched successfully', data);
    return data;
  } catch (error) {
    console.error('SuggestActivities not fetched:', error);
    return false;
  }
};

const FetchRecommendation = () => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentcoordinate, setcurrentcoordinate] = useState({});
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchSuggestedActivities().then((result) => {
      console.log("result: ", result);
      setCurrentLocation(result.locationData);
      setCurrentWeather(result.weatherData);
      setResponse(result.response);
      setcurrentcoordinate(result.coordinates);
    });
  }, []);

  useEffect(() => {
    if (open && map === null) {
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [open, map]);

  const initializeMap = () => {
    console.log("Current location:", currentLocation);
    if (!currentLocation) {
      console.log("Current location is not available yet.");
      return;
    }

    if (typeof google === 'undefined') {
      return;
    }

    const mapCenter = { lat: currentLocation.latitude, lng: currentLocation.longitude };
    const mapElement = document.getElementById('google-map');
    if (!mapElement) {
      return;
    }

    const mapOptions = {
      center: mapCenter,
      zoom: 10,
    };
    const newMap = new window.google.maps.Map(mapElement, mapOptions);
    setMap(newMap);

    const customMarkerIcon = {
      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      scaledSize: { width: 40, height: 40 }
    };

    new window.google.maps.Marker({
      position: mapCenter,
      map: newMap,
      icon: customMarkerIcon,
      label: {
        text: 'You are Here',
        color: 'darkblue'
      }
    });

    setcoordinates(currentcoordinate, newMap);
  };

  function setcoordinates(coordinates, newMap) {
    const sportsIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png', scaledSize: { width: 40, height: 40 } };
    const restaurantMarkerIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', scaledSize: { width: 40, height: 40 } };
    const ConcertsIcon = { url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png', scaledSize: { width: 40, height: 40 } };

    for (const [category, categoryList] of Object.entries(coordinates)) {
      for (const place of categoryList) {
        const { name, address, location } = place;
        const { lat, lng } = location;

        const mapCenter = { lat: lat, lng: lng };
        let icon = restaurantMarkerIcon;
        if (category === 'sportsEvent') icon = sportsIcon;
        if (category === 'concert') icon = ConcertsIcon;

        new window.google.maps.Marker({
          position: mapCenter,
          map: newMap,
          icon,
          label: {
            text: name,
            color: 'darkblue'
          }
        });
      }
    }
  }

  const handleClick = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMap(null);
    setResponse('');
  };

  const convertCelsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  return (
    <>
      <Button 
        variant="contained" 
        size="medium" 
        color="primary" 
        sx={{ 
          width: '100%', 
          fontWeight: 'bold', 
          backgroundColor: '#1976d2', 
          '&:hover': { backgroundColor: '#115293' }, 
          mb: 2
        }}
        onClick={handleClick}
      >
        Recommended For You
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 3,
          overflowY: 'auto'
        }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            textAlign="center" 
            mb={3}
          >
            Recommended Activities For You
          </Typography>

          {/* Google Maps div */}
          <div
            id="google-map"
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc'
            }}
          ></div>

          {/* Display current location and weather */}
          <Typography variant="h6" gutterBottom>
            Current Location: {currentLocation ? <b>{currentLocation.city}, {currentLocation.country_name}</b> : 'Loading...'}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Current Weather: {currentWeather ? <b>{convertCelsiusToFahrenheit(currentWeather.hourly.apparent_temperature[0]).toFixed(2)}°F</b> : 'Loading...'}
          </Typography>

          {/* Response TextArea */}
          <TextField
            fullWidth
            multiline
            rows={10}
            value={response ? response : "Loading Recommendation..."}
            disabled
            variant="outlined"
            sx={{
              mt: 3,
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              fontSize: '16px',
              width: '100%',
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default FetchRecommendation;

