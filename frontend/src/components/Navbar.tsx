import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useColorModeValue,
  Container,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      position="sticky" 
      top={0} 
      zIndex={10}
      bg={bg} 
      px={4} 
      boxShadow="sm"
      borderBottom="1px"
      borderBottomColor={borderColor}
    >
      <Container maxW="container.lg">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={toggle}
          />
          
          <HStack spacing={8} alignItems="center">
            <Box fontWeight="bold" fontSize="xl">
              <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
                URL Shortener
              </Link>
            </Box>
            <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link as={RouterLink} to="/" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                Home
              </Link>
            </HStack>
          </HStack>
          
          <Box position="relative">
            <ThemeToggle />
          </Box>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <VStack as="nav" spacing={4} align="start">
              <Link as={RouterLink} to="/" px={2} py={1} rounded="md" _hover={{ textDecoration: 'none', bg: useColorModeValue('gray.100', 'gray.700') }}>
                Home
              </Link>
            </VStack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
