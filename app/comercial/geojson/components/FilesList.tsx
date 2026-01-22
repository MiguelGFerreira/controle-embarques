type Props = {
    files: File[];
};

export function FilesList({ files }: Props) {
    if (files.length === 0) return null;

    return (
        <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
                <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-neutral-100 rounded"
                >
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-neutral-500">
                        {(file.size / 1024).toFixed(2)} KB
                    </span>
                </li>
            ))}
        </ul>
    );
}
