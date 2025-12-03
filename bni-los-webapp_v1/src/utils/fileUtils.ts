/**
 * Utility functions for file handling
 */

/**
 * Convert a File object to a Base64 string
 * @param file - The File object to convert
 * @returns Promise with Base64 string (without data URL prefix)
 */
export function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/png;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };

        reader.onerror = (error) => {
            reject(new Error(`Failed to convert file to Base64: ${error}`));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Validate file type and size
 * @param file - The File object to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, throws error if invalid
 */
export function validateFile(
    file: File,
    maxSizeMB: number = 5,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
): boolean {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return true;
}
