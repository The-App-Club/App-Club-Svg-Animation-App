import {motion} from 'framer-motion';

const animation = {
  hidden: {
    opacity: 0,
    x: 0,
    y: 60,
  },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  leave: {
    opacity: 0,
    x: 0,
    y: 60,
  },
};

const Layout = ({children, className}) => {
  return (
    <motion.div
      variants={animation}
      initial={'hidden'}
      animate={'enter'}
      exit={'leave'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export {Layout};
