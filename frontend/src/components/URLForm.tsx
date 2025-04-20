import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { shortenURL, ShortenURLRequest } from '../api/api';

interface URLFormProps {
  onSuccess: (shortUrl: string, shortCode: string) => void;
}

const URLForm: React.FC<URLFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  
  const inputBg = useColorModeValue('white', 'discord.channelsBar');
  const inputBorder = useColorModeValue('react.border', 'discord.sidebar');
  const buttonVariant = useColorModeValue('react', 'discord');

  const validateURL = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('URL is required');
      return;
    }
    
    if (!validateURL(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const payload: ShortenURLRequest = { original_url: url };
      const response = await shortenURL(payload);
      
      toast({
        title: 'URL shortened successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onSuccess(response.short_url, response.short_code);
      setUrl('');
    } catch (err) {
      console.error('Error shortening URL:', err);
      toast({
        title: 'Error shortening URL',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="url">Enter a long URL to shorten</FormLabel>
        <Input
          id="url"
          type="text"
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          bg={inputBg}
          borderColor={inputBorder}
          size="lg"
          _focus={{
            borderColor: useColorModeValue('react.primary', 'discord.primary'),
            boxShadow: useColorModeValue(
              '0 0 0 1px var(--chakra-colors-react-primary)',
              '0 0 0 1px var(--chakra-colors-discord-primary)'
            ),
          }}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Button
        mt={4}
        variant={buttonVariant}
        isLoading={isLoading}
        type="submit"
        width="full"
        size="lg"
      >
        Shorten URL
      </Button>
    </Box>
  );
};

export default URLForm;
