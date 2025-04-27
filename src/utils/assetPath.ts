/**
 * Helper function to get the correct asset path with basePath prefix
 */
export function getAssetPath(path: string): string {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    // If the path already starts with the basePath, return it as is
    if (basePath && path.startsWith(basePath)) {
        return path;
    }

    // Ensure the path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Combine basePath with the path
    return `${basePath}${normalizedPath}`;
} 