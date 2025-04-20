import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { copyToClipboard } from '../utils/copyToClipboard';

interface ShortenedURLCardProps {
  shortUrl: string;
  shortCode: string;
}

const ShortenedURLCard: React.FC<ShortenedURLCardProps> = ({ shortUrl, shortCode }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  
  const cardBg = useColorModeValue('bgAlt', 'bgAlt');
  const borderColor = useColorModeValue('border', 'border');
  const textColor = useColorModeValue('react.secondary', 'discord.textNormal');
  const analyticsColor = useColorModeValue('react.primary', 'discord.textLink');
  const inputBg = useColorModeValue('react.background', 'discord.channelsBar');
  const buttonVariant = useColorModeValue('react', 'discord');

  const handleCopy = async () => {
    const success = await copyToClipboard(shortUrl);
    
    if (success) {
      setCopied(true);
      toast({
        title: 'URL copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: 'Failed to copy URL',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box 
      p={5} 
      shadow="md" 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={cardBg}
      borderColor={borderColor}
      mt={6}
    >
      <Heading size="md" mb={3} color={textColor}>
        Your Shortened URL
      </Heading>
      
      <InputGroup size="md" mb={4}>
        <Input
          pr="4.5rem"
          value={shortUrl}
          isReadOnly
          bg={inputBg}
          borderColor={borderColor}
        />
        <InputRightElement width="4.5rem">
          <Button 
            h="1.75rem" 
            size="sm" 
            onClick={handleCopy}
            variant={buttonVariant}
            colorScheme={copied ? "green" : undefined}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </InputRightElement>
      </InputGroup>
      
      <Flex justifyContent="space-between" alignItems="center">
        <Link 
          as={RouterLink} 
          to={`/analytics/${shortCode}`}
          color={analyticsColor}
          fontWeight="medium"
        >
          View Analytics
        </Link>
        
        <Button 
          as="a" 
          href={shortUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          size="sm"
          variant="outline"
          colorScheme={useColorModeValue("gray", "whiteAlpha")}
        >
          Visit
        </Button>
      </Flex>
    </Box>
  );
};

export default ShortenedURLCard;
