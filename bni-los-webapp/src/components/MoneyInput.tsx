import React from 'react';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: number;
    onChange: (value: number) => void;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChange, className, ...props }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-digit characters
        const rawValue = e.target.value.replace(/\D/g, '');
        const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
        onChange(numericValue);
    };

    // Format for display
    const displayValue = value ? `Rp ${value.toLocaleString('id-ID')}` : '';

    return (
        <input
            {...props}
            type="text"
            value={displayValue}
            onChange={handleChange}
            className={className}
            placeholder="Rp 0"
        />
    );
};
