import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Button, Container, Typography, List, ListItem, ListItemText, Paper, Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set up socket connection to Flask server
const socket = io('http://192.168.0.102:5000');

// Create dark theme using MUI's theme customization
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [alerts, setAlerts] = useState([]);

  // Handle receiving new alerts from the server in real time via Socket.IO
  useEffect(() => {
    socket.on('new_alert', (data) => {
      try {
        const alert = JSON.parse(data);  // Parse the received JSON string into an object
        setAlerts((prevAlerts) => [...prevAlerts, alert]);  // Add new alert to the list
        // Show toast notification when a new alert is received
        toast.success('New accident alert received!');
      } catch (error) {
        console.error('Error parsing alert:', error);
      }
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off('new_alert');
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Apply the theme globally */}
      <Container>
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h4" color="primary">
            Accident Alert System
          </Typography>

          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            Recent Alerts
          </Typography>

          <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <List>
              {alerts.map((alert, index) => (
                <ListItem key={index} sx={{ backgroundColor: 'primary.main', mb: 1, borderRadius: 1 }}>
                  <ListItemText
                    primary={<Typography variant="body1">Severity: {alert.severity}</Typography>}
                    secondary={<Typography variant="body2">Location: {alert.location} | Timestamp: {alert.timestamp}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}

export default App;
