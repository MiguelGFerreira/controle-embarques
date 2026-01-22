import { CloudUploadIcon } from "lucide-react";

type Props = {
    onFiles: (files: FileList | null) => void;
};

export function DropzoneUpload({ onFiles }: Props) {
    return (
        <div
            className="flex items-center justify-center w-full h-64 border border-dashed bg-neutral-300 hover:bg-neutral-200"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
                e.preventDefault();
                onFiles(e.dataTransfer.files);
            }}
        >
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUploadIcon className="mb-3 h-10 w-10" />
                    <p className="mb-2 text-sm">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs">JSON, GEOJSON</p>
                </div>

                <input
                    id="dropzone-file"
                    type="file"
                    multiple
                    hidden
                    onChange={e => onFiles(e.target.files)}
                />
            </label>
        </div>
    );
}
