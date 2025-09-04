import NumberFlow, { NumberFlowElement } from '@number-flow/react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { numberFlowStyle } from '@/share/components/css/input.css.ts';

type Props = Partial<Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>> & {
  width?: string | number | 'flexible';
};
export const NumberFlowInput = (props: Props & { ref?: React.Ref<HTMLInputElement> }) => {
  const { width = 'flexible', value = 0, min = 0, ref, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const flowRef = useRef<NumberFlowElement>(null);
  const [flexibleWidth, setFlexibleWidth] = useState(0);
  const [animated, setAnimated] = useState(true);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget: el }) => {
    setAnimated(false);
    let next;
    if (el.value === '') {
      next = 0;
    } else {
      next = el.valueAsNumber;
    }
    el.value = String(next);
  };
  const handleInputBlur = () => {
    setAnimated(true);
  };
  useEffect(() => {
    if (flowRef.current) {
      setFlexibleWidth(flowRef.current.clientWidth);
    }
  }, [value]);

  const calFlexibleWidth = () => {
    if (rest.style?.padding && typeof rest.style.padding === 'string') {
      const padding = rest.style.padding?.split(' ')[1].split('px')[0];
      return flexibleWidth + 1 + Number(padding) * 2;
    }
    if (
      (rest.style?.paddingRight && typeof rest.style.paddingRight === 'string') ||
      (rest.style?.paddingLeft && typeof rest.style.paddingLeft === 'string')
    ) {
      const paddingRight = (rest.style.paddingRight as string)?.split('px')[0];
      const paddingLeft = (rest.style.paddingLeft as string)?.split('px')[0];
      return flexibleWidth + 1 + Number(paddingRight) + Number(paddingLeft);
    }
    return flexibleWidth;
  };

  return (
    <div
      className={numberFlowStyle.flowContainer}
      style={{
        width: width === 'flexible' ? `${calFlexibleWidth()}px` : width,
      }}
    >
      <input
        ref={inputRef}
        className={numberFlowStyle.flowInternal}
        style={{
          fontKerning: 'none',
        }}
        type="number"
        autoComplete="off"
        inputMode="numeric"
        step={1}
        value={value}
        onInput={handleInput}
        onBlur={handleInputBlur}
        min={min}
        {...rest}
      />
      <NumberFlow
        ref={flowRef}
        value={Number(value)}
        locales="en-US"
        format={{ useGrouping: false }}
        aria-hidden="true"
        animated={animated}
        style={{ pointerEvents: 'none' }}
        willChange
      />
    </div>
  );
};
NumberFlowInput.displayName = 'NumberFlowInput';
