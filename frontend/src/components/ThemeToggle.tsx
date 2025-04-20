import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ThemeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const iconColor = useColorModeValue('orange.500', 'yellow.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Tooltip 
      label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      placement="bottom"
    >
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        color={iconColor}
        bg={bgColor}
        size="md"
        borderRadius="full"
        boxShadow="md"
        _hover={{
          transform: 'scale(1.05)',
          boxShadow: 'lg',
        }}
        _active={{
          transform: 'scale(0.95)',
        }}
        transition="all 0.2s"
      />
    </Tooltip>
  );
};

export default ThemeToggle;
