import {css} from '@emotion/css';
import {Link} from 'react-router-dom';
import {Layout} from '../layouts/default';
import {useEffect, useRef} from 'react';
import {Spacer} from '../components/Spacer';
import {default as map1} from '../assets/map1';
import {default as map2} from '../assets/map2';
import {default as map3} from '../assets/map3';

const Home = ({}) => {
  const svgDomRef = useRef(null);
  useEffect(() => {
    const svgDom = svgDomRef.current;
    const {xMin, xMax, yMin, yMax} = [...svgDom.children].reduce(
      (acc, elem) => {
        const {x, y, width, height} = elem.getBBox();
        if (!acc.xMin || x < acc.xMin) {
          acc.xMin = x;
        }
        if (!acc.xMax || x + width > acc.xMax) {
          acc.xMax = x + width;
        }
        if (!acc.yMin || y < acc.yMin) {
          acc.yMin = y;
        }
        if (!acc.yMax || y + height > acc.yMax) {
          acc.yMax = y + height;
        }
        return acc;
      },
      {xMin: Infinity, yMin: Infinity, xMax: -Infinity, yMax: -Infinity}
    );

    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

    svgDom.setAttribute('viewBox', viewbox);
  }, []);

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      {[...Array(2)].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <h2>{`HomePage`}</h2>
      {[...Array(1)].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <Layout
        className={css`
          max-width: 60rem;
          width: 100%;
        `}
      >
        <div
          className={css`
            width: 100%;
            border: 1vmin solid rgba(174, 226, 238, 1);
            border-image-slice: 1;
            border-image-source: linear-gradient(
              90deg,
              #eeddae 52%,
              #fad27c 100%
            );
          `}
        >
          <svg
            ref={svgDomRef}
            width={'100%'}
            height={'100%'}
            preserveAspectRatio="xMidYMid meet"
            className={css`
              g:hover {
                opacity: 0.5;
              }
            `}
          >
            <g>
              <Link
                to={'/detail'}
                state={{
                  ...map1,
                  description: `Sunbeams filter between the branches of tall trees, to light up
              the ferns and moss on the ground of Lynn Valley park.`,
                  imageURL: `https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif`,
                }}
              >
                <path stroke={'black'} strokeWidth={1} d={map1.path} />
              </Link>
            </g>
            <g>
              <Link
                to={'/detail'}
                state={{
                  ...map2,
                  description: `Canoeists on Lake Louise are dwarfed by the Rocky Mountains rising
              up beside them.`,
                  imageURL: `https://media.giphy.com/media/3TACspcXhhQPK/giphy.gif`,
                }}
              >
                <path stroke={'black'} strokeWidth={1} d={map2.path} />
              </Link>
            </g>
            <g>
              <Link
                to={'/detail'}
                state={{
                  ...map3,
                  description: `A faded barn with a sagging, lichen-covered roof is the only
              landmark in site, rising above flat golden prairie under bright
              blue sky.`,
                  imageURL: `https://media.giphy.com/media/10VjiVoa9rWC4M/giphy.gif`,
                }}
              >
                <path stroke={'black'} strokeWidth={1} d={map3.path} />
              </Link>
            </g>
          </svg>
        </div>
      </Layout>
    </div>
  );
};

export {Home};
