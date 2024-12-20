import React, { forwardRef } from 'react';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onFocus: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const DescriptionField = forwardRef<HTMLInputElement, DescriptionFieldProps>(({
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  placeholder,
  disabled
}, ref) => (
  <input
    ref={ref}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyDown={onKeyDown}
    onBlur={onBlur}
    onFocus={onFocus}
    className="input w-full"
    placeholder={placeholder}
    disabled={disabled}
  />
));

DescriptionField.displayName = 'DescriptionField';

export default DescriptionField;