import {createRoot} from 'react-dom/client';
import './styles/index.scss';
import {css} from '@emotion/css';
import * as BABYLON from 'babylonjs';
import {Graph} from './components/Graph';

const {
  SineEase,
  BackEase,
  BounceEase,
  BezierCurveEase,
  CircleEase,
  CubicEase,
  ElasticEase,
  ExponentialEase,
  PowerEase,
  QuadraticEase,
  QuarticEase,
  QuinticEase,
} = BABYLON;

const App = () => {
  return (
    <>
      <div
        className={css`
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 1rem;
          min-height: 100vh;
          width: 100%;
          padding: 5rem 10rem;
          .div1 {
            grid-area: 1 / 1 / 4 / 3;
          }
          .div2 {
            grid-area: 3 / 3 / 4 / 4;
          }
          .div3 {
            grid-area: 3 / 4 / 4 / 5;
          }
          .div4 {
            grid-area: 1 / 3 / 3 / 5;
          }
          .area {
            min-height: initial;
          }

          @media (max-width: 1200px) {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            gap: 1rem;
            width: 100%;
            padding: 1.5rem;
            .area {
              min-height: 50vh;
            }
            .div1 {
              grid-area: 1 / 1 / 2 / 2;
            }
            .div2 {
              grid-area: 1 / 2 / 2 / 3;
            }
            .div3 {
              grid-area: 2 / 1 / 3 / 2;
            }
            .div4 {
              grid-area: 2 / 2 / 3 / 3;
            }
          }

          @media (max-width: 768px) and (orientation: portrait) {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
            gap: 1rem;
            width: 100%;
            padding: 1rem;
            .area {
              min-height: 50vh;
            }
            .div1 {
              grid-area: 1 / 1 / 2 / 2;
            }
            .div2 {
              grid-area: 2 / 1 / 3 / 2;
            }
            .div3 {
              grid-area: 3 / 1 / 4 / 2;
            }
            .div4 {
              grid-area: 4 / 1 / 5 / 2;
            }
          }
        `}
      >
        <div className="area div1">
          <Graph
            title="SineEase"
            easeInstance={() => {
              const ease = new SineEase();
              ease.setEasingMode(SineEase.EASINGMODE_EASEOUT);
              return ease;
            }}
          />
        </div>
        <div className="area div2">
          <Graph
            title="ExponentialEase"
            easeInstance={() => {
              const ease = new ExponentialEase();
              ease.setEasingMode(ExponentialEase.EASINGMODE_EASEINOUT);
              return ease;
            }}
          />
        </div>
        <div className="area div3">
          <Graph
            title="BezierCurveEase"
            easeInstance={() => {
              return new BezierCurveEase();
            }}
          />
        </div>
        <div className="area div4">
          <Graph
            title="PowerEase"
            easeInstance={() => {
              const ease = new PowerEase();
              ease.setEasingMode(PowerEase.EASINGMODE_EASEINOUT);
              return ease;
            }}
          />
        </div>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
