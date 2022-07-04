const Star = ({size = 100, fillColor = '#f8d448', className}) => {
  return (
    <svg
      stroke={fillColor}
      fill={fillColor}
      strokeWidth={0}
      viewBox="0 0 16 16"
      height={size}
      width={size}
      className={className}
    >
      <path d="M 2.866 14.85 C 2.788 15.294 3.226 15.641 3.612 15.443 L 8.002 13.187 L 12.391 15.443 C 12.777 15.641 13.215 15.294 13.137 14.851 L 12.307 10.121 L 15.829 6.765 C 16.159 6.451 15.989 5.877 15.547 5.815 L 10.649 5.119 L 8.465 0.792 A 0.513 0.513 0 0 0 7.538 0.792 L 5.354 5.12 L 0.456 5.816 C 0.015 5.878 -0.156 6.452 0.173 6.766 L 3.696 10.122 L 2.866 14.852 Z" />
    </svg>
  );
};

export {Star};
