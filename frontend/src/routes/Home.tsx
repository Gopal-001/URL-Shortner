import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Divider,
  useToast,
} from '@chakra-ui/react';
import URLForm from '../components/URLForm';
import ShortenedURLCard from '../components/ShortenedURLCard';
import RecentURLsList from '../components/RecentURLsList';
import { getRecentURLs, ShortenURLResponse } from '../api/api';

export default function Home() {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [shortCode, setShortCode] = useState<string>('');
  const [recentUrls, setRecentUrls] = useState<ShortenURLResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  const bg = useColorModeValue('bg', 'bg');
  const containerBg = useColorModeValue('bgAlt', 'bgAlt');
  const borderColor = useColorModeValue('border', 'border');
  const headingColor = useColorModeValue('react.secondary', 'white');

  useEffect(() => {
    const fetchRecentUrls = async () => {
      try {
        const data = await getRecentURLs();
        setRecentUrls(data);
      } catch (error) {
        console.error('Error fetching recent URLs:', error);
        toast({
          title: 'Error fetching recent URLs',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUrls();
  }, [toast, shortUrl]); // Refetch when a new URL is shortened

  const handleURLShortened = (newShortUrl: string, newShortCode: string) => {
    setShortUrl(newShortUrl);
    setShortCode(newShortCode);
  };

  return (
    <Box p={0} bg={bg} minH="100vh">
      <Container maxW="container.lg" py={8}>
        <VStack 
          spacing={6} 
          align="stretch" 
          bg={containerBg} 
          p={8} 
          borderRadius="lg" 
          borderWidth="1px"
          borderColor={borderColor}
          shadow="md"
        >
          <Heading as="h1" size="xl" textAlign="center" color={headingColor}>
            URL Shortener
          </Heading>
          <Text textAlign="center" fontSize="lg" color="textMuted">
            Shorten your long URLs into memorable, easy-to-share links
          </Text>
          
          <URLForm onSuccess={handleURLShortened} />
          
          {shortUrl && <ShortenedURLCard shortUrl={shortUrl} shortCode={shortCode} />}
          
          <Divider my={4} borderColor={borderColor} />
          
          <RecentURLsList urls={recentUrls} isLoading={isLoading} />
        </VStack>
      </Container>
    </Box>
  );
}
