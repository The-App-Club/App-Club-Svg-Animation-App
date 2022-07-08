import {cx, css} from '@emotion/css';
import cosme from '../assets/cosme.jpg';

const Circle = () => {
  return (
    <svg
      x="0px"
      y="0px"
      width="1920px"
      height="1080px"
      viewBox="0 0 1920 1080"
      className={css`
        enable-background: new 0 0 1920 1080;
      `}
    >
      <g>
        <defs>
          <path
            id="mask"
            d="M797.5,383.75c0,118.051-95.699,213.75-213.75,213.75S370,501.801,370,383.75S465.699,170,583.75,170
            S797.5,265.699,797.5,383.75z M1032.656,177.188c-84.655,0-153.281,68.626-153.281,153.281s68.626,153.281,153.281,153.281
            s153.281-68.626,153.281-153.281S1117.311,177.188,1032.656,177.188z M935.781,543.75C866.314,543.75,810,600.064,810,669.531
            s56.314,125.781,125.781,125.781s125.781-56.314,125.781-125.781S1005.248,543.75,935.781,543.75z M1400.859,483.75
            c-131.729,0-238.516,106.787-238.516,238.516s106.787,238.516,238.516,238.516s238.516-106.787,238.516-238.516
            S1532.588,483.75,1400.859,483.75z"
          />
        </defs>
        <clipPath id="clippy">
          <use
            href="#mask"
            className={css`
              overflow: visible;
            `}
          />
        </clipPath>
        <g
          className={css`
            clip-path: url(#clippy);
          `}
        >
          <image
            className={css`
              overflow: visible;
            `}
            width="6067"
            height="4009"
            href={cosme}
            transform="matrix(0.2641 0 0 0.2641 165.655 6.25)"
          ></image>
        </g>
      </g>
    </svg>
  );
};

export {Circle};
