import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import '@fontsource/inter';
import './styles/index.scss';
import {Reaction} from './components/Reaction';
// import {AiOutlineStar} from 'react-icons/ai'

const App = () => {
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      `}
    >
      <Reaction path="M 23.6 2 C 20.237 2 17.342 4.736 16.001 7.594 C 14.659 4.736 12 2 8.4 2 C 3.763 2 0 5.764 0 10.401 C 0 19.834 9.516 22.307 16.001 31.633 C 22.131 22.365 32 19.533 32 10.401 C 32 5.764 28.237 2 23.6 2 Z" />
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
