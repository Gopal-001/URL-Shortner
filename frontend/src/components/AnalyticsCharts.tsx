import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { URLAnalytics } from '../api/api';

interface AnalyticsChartsProps {
  data: URLAnalytics | null;
  isLoading: boolean;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, isLoading }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  if (isLoading || !data) {
    return (
      <Box>
        <Heading size="md" mb={4}>Loading analytics data...</Heading>
      </Box>
    );
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {/* Total Clicks */}
        <Stat
          px={4}
          py={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <StatLabel fontSize="sm" fontWeight="medium">Total Clicks</StatLabel>
          <StatNumber fontSize="3xl">{data.total_clicks}</StatNumber>
          <StatHelpText>Since {new Date(data.created_at).toLocaleDateString()}</StatHelpText>
        </Stat>
        
        {/* Top Browser */}
        <Stat
          px={4}
          py={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <StatLabel fontSize="sm" fontWeight="medium">Top Browser</StatLabel>
          <StatNumber fontSize="3xl">
            {data.clicks_by_browser.length > 0 
              ? data.clicks_by_browser[0].browser 
              : 'N/A'}
          </StatNumber>
          <StatHelpText>
            {data.clicks_by_browser.length > 0 
              ? `${data.clicks_by_browser[0].count} clicks` 
              : 'No data available'}
          </StatHelpText>
        </Stat>
        
        {/* Top Device */}
        <Stat
          px={4}
          py={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <StatLabel fontSize="sm" fontWeight="medium">Top Device</StatLabel>
          <StatNumber fontSize="3xl">
            {data.clicks_by_device.length > 0 
              ? data.clicks_by_device[0].device 
              : 'N/A'}
          </StatNumber>
          <StatHelpText>
            {data.clicks_by_device.length > 0 
              ? `${data.clicks_by_device[0].count} clicks` 
              : 'No data available'}
          </StatHelpText>
        </Stat>
        
        {/* Top Country */}
        <Stat
          px={4}
          py={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <StatLabel fontSize="sm" fontWeight="medium">Top Country</StatLabel>
          <StatNumber fontSize="3xl">
            {data.clicks_by_country.length > 0 
              ? data.clicks_by_country[0].country 
              : 'N/A'}
          </StatNumber>
          <StatHelpText>
            {data.clicks_by_country.length > 0 
              ? `${data.clicks_by_country[0].count} clicks` 
              : 'No data available'}
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* More detailed charts would go here */}
      <Box
        p={5}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        shadow="sm"
        mb={6}
      >
        <Heading size="md" mb={4}>Clicks Over Time</Heading>
        <Box height="200px" display="flex" alignItems="center" justifyContent="center">
          {/* Placeholder for actual chart component */}
          <Box as="p" color="gray.500">
            Chart visualization will be implemented here
          </Box>
        </Box>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <Heading size="md" mb={4}>Browser Distribution</Heading>
          <Box height="200px" display="flex" alignItems="center" justifyContent="center">
            {/* Placeholder for actual chart component */}
            <Box as="p" color="gray.500">
              Browser chart will be implemented here
            </Box>
          </Box>
        </Box>
        
        <Box
          p={5}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="lg"
          shadow="sm"
        >
          <Heading size="md" mb={4}>Device Distribution</Heading>
          <Box height="200px" display="flex" alignItems="center" justifyContent="center">
            {/* Placeholder for actual chart component */}
            <Box as="p" color="gray.500">
              Device chart will be implemented here
            </Box>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default AnalyticsCharts;
