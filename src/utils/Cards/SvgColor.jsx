import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

const SvgColor = forwardRef(
  ({ src, width = 24, height, className, sx, ...other }, ref) => (
    <Box
      ref={ref}
      component="span"
      className={`mnl__svg__color__root${className ? ` ${className}` : ''}`}
      sx={{
        width,
        height: height || width,
        display: 'inline-flex',
        bgcolor: 'currentColor', // Defaults to current text color
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        flexShrink: 0,
        ...sx,
      }}
      {...other}
    />
  )
);

export default SvgColor;
