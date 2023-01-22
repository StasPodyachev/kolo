import { Manrope } from '@next/font/google';

const manrope = Manrope({
  weight: '500',
  subsets: ['latin'],
});

const fonts = {
  body: manrope.style.fontFamily,
  heading: manrope.style.fontFamily,
};

export default fonts;
