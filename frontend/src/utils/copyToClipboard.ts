/**
 * Utility function to copy text to clipboard
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to boolean indicating success
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
};
