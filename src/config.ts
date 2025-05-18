interface Config {
  apiUrl: string;
  isDevelopment: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';

// Get API URL from environment variable or fallback to default
const getApiUrl = () => {
  const envApiUrl = process.env.REACT_APP_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  return isDevelopment 
    ? 'http://localhost:5000'
    : 'https://syllabus-app-container.yellowfield-b94f6044.westus2.azurecontainerapps.io';
};

const config: Config = {
  apiUrl: getApiUrl(),
  isDevelopment
};

// Log configuration in development
if (isDevelopment) {
  console.log('API Configuration:', {
    apiUrl: config.apiUrl,
    isDevelopment: config.isDevelopment
  });
}

export default config; 