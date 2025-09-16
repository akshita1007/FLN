import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { bgGradient, hexToRgbA } from '../Theme/themes';
import SvgColor from './SvgColor';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Colors } from '../Theme/Colors';
import cardbg from "../../Assets/bg/bg3.png";

export function CardWidget({
  icon,
  title,
  total,
  chart,
  percent,
  color = Colors.primary,
  sx,
  ...other
}) {
  const renderTrending = (
    <Box
      sx={{
        top: 16,
        gap: 0.1,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
       
      }}
    >
      {percent < 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {percent}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        // ...bgGradient({color:`90deg, ${hexToRgbA(color.light,0.48)}, ${hexToRgbA(color.light,0.70)}`,}),
        p: 3,
        zIndex:0,
        boxShadow: 'none',
        position: 'relative',
        borderRadius:'9px',
        color: `${Colors.extra.e2}`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ width: 40, height: 40, mb: 2 }}>{icon}</Box>

      {percent&&renderTrending}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: "start",
          marginLeft:"auto"
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: "auto" }}>
          <Box sx={{ typography: 'subtitle2',textAlign:"end" }}>{title}</Box>
          <Box sx={{ typography: 'h4',textAlign:"end" }}>{total}</Box>
        </Box>

      </Box>

      <SvgColor
        src={cardbg}
        sx={{
            top: 0,
            left: -20,
            width: 240,
            zIndex: -1,
            height: 130,
            opacity: 0.2,
            position: 'absolute',
            color: `${Colors.common.white}`,
        }}
      />
    </Card>
  );
}
