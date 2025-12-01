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

    // Format for display with period as thousand separator
    const formatWithPeriod = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const displayValue = value ? `Rp ${formatWithPeriod(value)}` : '';

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
