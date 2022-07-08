import {cx, css} from '@emotion/css';
import cosme from '../assets/cosme.jpg';

const Moni = () => {
  return (
    <svg
      x="0px"
      y="0px"
      width="1920px"
      height="1080px"
      viewBox="0 0 1920 1080"
      className={css`
        display: block;
      `}
    >
      <g>
        <defs>
          <path
            id="mask"
            d="
              M328.012,94.488c0,0,51.25-63.75,160-48.75s61.25,200,20,230s-93.75,86.25-103.75,173.75s-106.25,158.75-156.25,42.5S279.262,145.738,328.012,94.488z M1029.262,308.238c-3.75,85,91.25,96.25,3.75,300s135,231.25,316.25,218.75s140-282.5,100-466.25s-220.716-175.686-297.5-157.5C1104.262,214.488,1033.012,223.238,1029.262,308.238z
              M534.262,479.488c-45,38.75,33.75,113.75-40,165s-130,76.25-163.75,126.25s15,186.25,146.25,176.25s108.75,26.25,267.5,68.75s136.25-51.25,110-135s-56.25-68.75-36.25-153.75s37.5-135,0-230s-89.093-53.137-147.5-21.25C628.292,498.788,579.262,440.738,534.262,479.488z
              M701.762,214.488c-53.75,35,10,121.25,92.5,157.5s62.5-65,115-142.5s-61.589-86.489-105-63.75C778.012,179.488,755.512,179.488,701.762,214.488z
              M1521.762,188.238c10,45,66.25,96.25,122.5,13.75s-35.181-148.569-100-83.75C1521.762,140.738,1511.762,143.238,1521.762,188.238z
              M1526.762,984.488c117.5,21.25,51.25-68.75,8.75-137.5s-70.439-3.872-125,65C1391.281,936.264,1409.262,963.238,1526.762,984.488z
            "
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
            width="100%"
            height="100%"
            href={cosme}
          ></image>
        </g>
      </g>
    </svg>
  );
};

export {Moni};
