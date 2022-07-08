import {cx, css} from '@emotion/css';
import cosme from '../assets/cosme.jpg';

const Rect = () => {
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
            d="M741.25,527.5H287.5V73.75h453.75V527.5z M1048.75,631.25h-362.5v362.5h362.5V631.25z M568.75,712.5H287.5
            v281.25h281.25V712.5z M1611.25,326.25H830v260h781.25V326.25z M1611.25,72.5H1067.5v181.25h543.75V72.5z"
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

export {Rect};
