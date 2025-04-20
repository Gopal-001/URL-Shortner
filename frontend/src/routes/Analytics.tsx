import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { getURLAnalytics, URLAnalytics as URLAnalyticsType } from '../api/api';
import AnalyticsCharts from '../components/AnalyticsCharts';

export default function Analytics() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [data, setData] = useState<URLAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  const bg = useColorModeValue('bg', 'bg');
  const containerBg = useColorModeValue('bgAlt', 'bgAlt');
  const borderColor = useColorModeValue('border', 'border');
  const headingColor = useColorModeValue('react.secondary', 'white');
  const linkColor = useColorModeValue('react.primary', 'discord.textLink');
  const buttonVariant = useColorModeValue('react', 'discord');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!shortCode) return;
      
      try {
        setIsLoading(true);
        const analyticsData = await getURLAnalytics(shortCode);
        setData(analyticsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load analytics data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortCode, toast]);

  return (
    <Box p={0} bg={bg} minH="100vh">
      <Container maxW="container.xl" py={8}>
        <Box 
          bg={containerBg} 
          p={8} 
          borderRadius="lg" 
          borderWidth="1px"
          borderColor={borderColor}
          shadow="md"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h2" size="lg" color={headingColor}>
              Analytics for: {shortCode}
            </Heading>
            <Button 
              as={RouterLink} 
              to="/" 
              variant={buttonVariant}
              size="sm"
            >
              Back to Home
            </Button>
          </Flex>
          
          {isLoading ? (
            <Box>
              <Skeleton height="100px" mb={4} />
              <Skeleton height="200px" mb={4} />
              <Skeleton height="200px" />
            </Box>
          ) : error ? (
            <Text color="discord.red">{error}</Text>
          ) : data ? (
            <Box>
              <Flex mb={6} alignItems="center">
                <Text fontWeight="bold" mr={2} color="textMuted">Original URL:</Text>
                <Link href={data.original_url} color={linkColor} isExternal>
                  {data.original_url}
                </Link>
              </Flex>
              
              <AnalyticsCharts data={data} isLoading={isLoading} />
            </Box>
          ) : (
            <Text color="textMuted">No data available for this URL.</Text>
          )}
        </Box>
      </Container>
    </Box>
  );
}
