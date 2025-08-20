// Utility functions for advanced styling in MUI

/**
 * Hide horizontal scrollbar.
 * Usage: { ...hideScrollX }
 */
export const hideScrollX = {
    msOverflowStyle: 'none', // IE and Edge
    scrollbarWidth: 'none', // Firefox
    overflowX: 'auto', // Enable scrolling
    '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
  };
  
  /**
   * Hide vertical scrollbar.
   * Usage: { ...hideScrollY }
   */
  export const hideScrollY = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    overflowY: 'auto',
    '&::-webkit-scrollbar': { display: 'none' },
  };
  
  /**
   * Apply a text gradient effect.
   * @param {string} color - Gradient color definition (e.g., `to right, #000, #fff`)
   * Usage: { ...textGradient('to right, #000, #fff') }
   */
  export function textGradient(color) {
    return {
      background: `linear-gradient(${color})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      color: 'transparent',
    };
  }
  
  /**
   * Apply a gradient background with optional image.
   * @param {Object} options - Gradient options
   * @param {string} options.color - Gradient color definition
   * @param {string} [options.imgUrl] - Optional background image URL
   * Usage: { ...bgGradient({ color: 'to right, #000, #fff', imgUrl: '/path/to/image.png' }) }
   */
  export function hexToRgbA(hex,opacity=1){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
    }
    throw new Error('Bad Hex');
}

  export function bgGradient({ color, imgUrl }) {
    if (imgUrl) {
      return {
        background: `linear-gradient(${color}), url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      };
    }
    return { background: `linear-gradient(${color})` };
  }
  
  /**
   * Apply a blurred background with optional image.
   * @param {Object} options - Blur background options
   * @param {string} options.color - Background color with alpha channel
   * @param {number} [options.blur=6] - Blur intensity
   * @param {string} [options.imgUrl] - Optional background image URL
   * Usage: { ...bgBlur({ color: 'rgba(0, 0, 0, 0.5)', imgUrl: '/path/to/image.png', blur: 10 }) }
   */
  export function bgBlur({ color, blur = 6, imgUrl }) {
    if (imgUrl) {
      return {
        position: 'relative',
        backgroundImage: `url(${imgUrl})`,
        '&::before': {
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9,
          content: '""',
          width: '100%',
          height: '100%',
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          backgroundColor: color,
        },
      };
    }
    return {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      backgroundColor: color,
    };
  }
  