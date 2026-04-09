import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function MuiNumberfield({ label = 'Number', min = 0, max = 100, step = 1, state, setState }) {
  const [internalValue, setInternalValue] = useState(state != null ? String(state) : String(min ?? ''));

  // Sync internal value when external state changes
  React.useEffect(() => {
    if (state != null) {
      setInternalValue(String(state));
    }
  }, [state]);

  const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? null : n;
  };

  const clamp = (n) => {
    if (n === null) return null;
    if (n < min) return min;
    if (n > max) return max;
    return n;
  };

  const updateValue = (newVal) => {
    setInternalValue(newVal);
    if (setState && typeof setState === 'function') {
      const num = toNumber(newVal);
      if (num !== null) {
        setState(clamp(num));
      }
    }
  };

  const handleIncrement = () => {
    const cur = toNumber(internalValue) ?? min;
    const next = clamp(cur + step) ?? min;
    const nextStr = String(next);
    setInternalValue(nextStr);
    if (setState && typeof setState === 'function') {
      setState(next);
    }
  };

  const handleDecrement = () => {
    const cur = toNumber(internalValue) ?? min;
    const next = clamp(cur - step) ?? min;
    const nextStr = String(next);
    setInternalValue(nextStr);
    if (setState && typeof setState === 'function') {
      setState(next);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (!setState || typeof setState !== 'function') {
      return;
    }

    if (newValue === '' || newValue === '-' || newValue === '.') {
      return;
    }

    const num = toNumber(newValue);
    if (num !== null && num >= min && num <= max) {
      setState(num);
    }
  };

  const handleBlur = () => {
    // check and clamp only when user leaves the field
    const num = toNumber(internalValue);
    if (num === null || internalValue === '' || internalValue === '-' || internalValue === '.') {
      const fallback = String(min);
      setInternalValue(fallback);
      if (setState && typeof setState === 'function') {
        setState(min);
      }
      return;
    }
    const clamped = clamp(num);
    const clampedStr = String(clamped);
    setInternalValue(clampedStr);
    if (setState && typeof setState === 'function') {
      setState(clamped);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <TextField
        label={label}
        type="text"
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        size="small"
        sx={{ width: '100px' }}
      />
      
    </Box>
  );
}