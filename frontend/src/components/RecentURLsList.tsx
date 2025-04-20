import React from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Button,
  useColorModeValue,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ShortenURLResponse } from '../api/api';
import { copyToClipboard } from '../utils/copyToClipboard';

interface RecentURLsListProps {
  urls: ShortenURLResponse[];
  isLoading: boolean;
}

const RecentURLsList: React.FC<RecentURLsListProps> = ({ urls, isLoading }) => {
  const tableBg = useColorModeValue('bgAlt', 'bgAlt');
  const borderColor = useColorModeValue('border', 'border');
  const hoverBg = useColorModeValue('react.background', 'discord.channelsBar');
  const headingColor = useColorModeValue('react.secondary', 'discord.textNormal');
  const textColor = useColorModeValue('react.text', 'discord.textNormal');
  const linkColor = useColorModeValue('react.primary', 'discord.textLink');
  const buttonVariant = useColorModeValue('react', 'discord');
  
  if (isLoading) {
    return (
      <Box mt={8}>
        <Heading size="md" mb={4} color={headingColor}>Recent URLs</Heading>
        <Skeleton height="200px" />
      </Box>
    );
  }
  
  if (urls.length === 0) {
    return (
      <Box mt={8}>
        <Heading size="md" mb={4} color={headingColor}>Recent URLs</Heading>
        <Text color="textMuted">No URLs have been shortened yet.</Text>
      </Box>
    );
  }

  const handleCopy = async (url: string) => {
    await copyToClipboard(url);
  };

  return (
    <Box mt={8}>
      <Heading size="md" mb={4} color={headingColor}>Recent URLs</Heading>
      <Box overflowX="auto">
        <Table variant="simple" bg={tableBg} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
          <Thead>
            <Tr>
              <Th color={textColor}>Original URL</Th>
              <Th color={textColor}>Short URL</Th>
              <Th color={textColor}>Created</Th>
              <Th color={textColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {urls.map((url) => (
              <Tr key={url.short_code} _hover={{ bg: hoverBg }}>
                <Td isTruncated maxW="300px" color={textColor}>
                  <Link href={url.original_url} isExternal color={linkColor}>
                    {url.original_url}
                  </Link>
                </Td>
                <Td color={textColor}>
                  <Link href={url.short_url} isExternal color={linkColor}>
                    {url.short_url}
                  </Link>
                </Td>
                <Td color={textColor}>{new Date(url.created_at).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    size="sm"
                    variant={buttonVariant}
                    mr={2}
                    onClick={() => handleCopy(url.short_url)}
                  >
                    Copy
                  </Button>
                  <Button
                    as={RouterLink}
                    to={`/analytics/${url.short_code}`}
                    size="sm"
                    variant={buttonVariant === 'discord' ? 'outline' : buttonVariant}
                    colorScheme={buttonVariant === 'discord' ? undefined : 'teal'}
                  >
                    Analytics
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default RecentURLsList;
