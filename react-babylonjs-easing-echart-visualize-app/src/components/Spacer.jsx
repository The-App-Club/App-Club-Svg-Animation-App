import {cx, css} from '@emotion/css';

const Spacer = ({height = `1rem`}) => {
  return (
    <div
      className={css`
        height: ${height}px;
      `}
    />
  );
};

export {Spacer};
