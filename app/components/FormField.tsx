export default function FormField({ field, value, onChange, maxLength, onBlur }: any) {
    const commomProps = {
        id: field.key,
        name: field.key,
        value: value || '',
        onChange,
    };

    switch (field.type) {
        case 'date':
            return <input type="date" maxLength={maxLength} onBlur={onBlur} {...commomProps} />;
        case 'text':
            return <input type="text" maxLength={maxLength} {...commomProps} />;
        case 'select':
            return (
                <select {...commomProps}>
                    {field.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        default:
            return null;
    }
}