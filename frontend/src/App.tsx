import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Home from './routes/Home';
import Analytics from './routes/Analytics';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics/:shortCode" element={<Analytics />} />
      </Routes>
    </Box>
  );
}
