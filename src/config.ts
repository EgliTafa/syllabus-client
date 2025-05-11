interface Config {
  apiUrl: string;
  isDevelopment: boolean;
}

const isDevelopment = process.env.NODE_ENV === 'development';

const config: Config = {
  apiUrl: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://syllabus-app-container.yellowfield-b94f6044.westus2.azurecontainerapps.io',
  isDevelopment
};

export default config; 