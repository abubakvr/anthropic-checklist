export function parseChecklistString(input) {
  try {
    let parsedData;

    // If the input is a string, parse it
    if (typeof input === "string") {
      parsedData = JSON.parse(input);
    } else if (typeof input === "object") {
      // If input is already an object, use it as is
      parsedData = input;
    } else {
      throw new Error("Invalid input type. Expected JSON string or object.");
    }

    // Check if parsedData is an array, if not, wrap it in an array
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else {
      return [parsedData];
    }
  } catch (error) {
    console.error("Failed to parse checklist string:", error.message);
    return [];
  }
}

export function getIpUrl(ipAddress, accessToken) {
  return `https://ipinfo.io/${ipAddress}/json?token=${accessToken}`;
}

/**
 * Generates a random string of specified length.
 * @param {number} length - The length of the random string.
 * @returns {string} - The generated random string.
 */
export function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
