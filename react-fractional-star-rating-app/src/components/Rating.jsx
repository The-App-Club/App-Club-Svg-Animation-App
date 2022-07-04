import {css} from '@emotion/css';
import {Star} from './Star';

const Rating = ({value, max}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        position: relative;
      `}
    >
      {[...Array(max)].map((_, index) => {
        return (
          <Star
            key={index}
            size={60}
            className={css`
              path {
                fill: #f8d448;
              }
            `}
          />
        );
      })}

      <div
        className={css`
          background-color: white;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          width: ${100 - percentage}%;
        `}
      />
    </div>
  );
};

export {Rating};
