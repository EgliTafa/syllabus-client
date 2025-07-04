import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { router } from './app/router';
import { ThemedApp } from './ThemedApp';

function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

export default App;
