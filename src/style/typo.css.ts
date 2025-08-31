import { styleVariants } from '@vanilla-extract/css';

const fontSize = {
  head1: { fontSize: '6.4rem', lineHeight: '8rem' },
  head2: { fontSize: '5.6rem', lineHeight: '7.2rem' },
  head3: { fontSize: '4.8rem', lineHeight: '6.4rem' },
  head4: { fontSize: '4rem', lineHeight: '5.6rem' },
  head5: { fontSize: '3.2rem', lineHeight: '4rem' },
  head6: { fontSize: '2.4rem', lineHeight: '3.2rem' },
  body1: { fontSize: '2rem', lineHeight: '3rem' },
  body2: { fontSize: '1.8rem', lineHeight: '2.8rem' },
  body3: { fontSize: '1.6rem', lineHeight: '2.4rem' },
  body4: { fontSize: '1.4rem', lineHeight: '2rem' },
  caption1: { fontSize: '1.2rem', lineHeight: '1.8rem' },
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

type FontSizeKey = keyof typeof fontSize;
type FontWeightKey = keyof typeof fontWeight;

function buildFontVariants() {
  const variants: Record<FontSizeKey, Record<FontWeightKey, string>> = {} as never;

  (Object.keys(fontSize) as FontSizeKey[]).forEach(sizeKey => {
    variants[sizeKey] = styleVariants(
      Object.fromEntries(
        (Object.keys(fontWeight) as FontWeightKey[]).map(weightKey => [
          weightKey,
          {
            ...fontSize[sizeKey],
            fontWeight: fontWeight[weightKey],
          },
        ]),
      ),
    );
  });

  return variants;
}

export const fonts = buildFontVariants();
