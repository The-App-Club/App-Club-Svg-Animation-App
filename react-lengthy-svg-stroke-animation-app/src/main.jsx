import {createRoot} from 'react-dom/client';
import {cx, css} from '@emotion/css';
import styled from '@emotion/styled';
import {Slider} from '@mui/material';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useId,
  createRef,
} from 'react';
import * as d3 from 'd3';
import gsap, {Power4, Power3, Power2} from 'gsap';
import {samples} from 'culori';
import {default as Lengthy} from 'lengthy-svg';
import {Waver} from './components/Waver';

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const App = () => {
  return (
    <>
      <StyledContainer>
        <StyledRow>
          {[...Array(10).keys()].map((index) => {
            return (
              <Waver
                key={index}
                colorList={['#F3950D', '#F3ED9E', '#F4E185']}
                count={10}
                delay={100 * index}
              />
            );
          })}
        </StyledRow>
        <StyledRow>
          {[...Array(10).keys()].map((index) => {
            return (
              <Waver
                key={index}
                colorList={['#76BA99', '#ADCF9F', '#CED89E']}
                count={10}
                delay={100 * index}
              />
            );
          })}
        </StyledRow>
        <StyledRow>
          {[...Array(10).keys()].map((index) => {
            return (
              <Waver
                key={index}
                colorList={['#FBA1A1', '#FFC4C4', '#FFE7BF']}
                count={10}
                delay={100 * index}
              />
            );
          })}
        </StyledRow>
        <StyledRow>
          {[...Array(10).keys()].map((index) => {
            return (
              <Waver
                key={index}
                colorList={['#FF8243', '#FDA65D', '#FFD07F']}
                count={10}
                delay={100 * index}
              />
            );
          })}
        </StyledRow>
        <StyledRow>
          {[...Array(10).keys()].map((index) => {
            return (
              <Waver
                key={index}
                colorList={['#A6E3E9', '#CBF1F5', '#71C9CE']}
                count={10}
                delay={100 * index}
              />
            );
          })}
        </StyledRow>
      </StyledContainer>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
