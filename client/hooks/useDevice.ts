import { useMediaQuery } from '@chakra-ui/react';

const useDevice = () => {
  const isDesktop = useMediaQuery('(min-width: 1160px)');
  const isDesktopHeader = useMediaQuery('(min-width: 1410px)');

  return {
    isDesktop,
    isDesktopHeader,
  };
};

export default useDevice;
