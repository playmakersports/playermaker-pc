import * as React from 'react';
import { useImperativeHandle, useRef } from 'react';
import InputWrapper from '@/share/components/inputs/InputWrapper.tsx';
import ClearIcon from '@/assets/icons/common/Close20.svg?react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {
  title?: string;
  iconType?: 'search' | 'email' | 'calendar';
  error?: boolean;
  delButton?: boolean;
  onButtonClick?: () => void;
  information?: string;
  description?: string;
  suffix?: string;
  large?: boolean;
}

const BaseInput = (props: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const { title, onButtonClick, ref, ...rest } = props;

  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

  const handleClearInputValue = () => {
    if (internalRef.current) {
      internalRef.current.value = '';

      const event = new Event('input', { bubbles: true });
      internalRef.current.dispatchEvent(event);
      internalRef.current.focus();
      if (props.onChange) {
        props.onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const innerBoxClass =
    'input-inner-box relative flex items-center w-full h-10 px-3 gap-2 rounded-lg border border-gray-200';
  const baseClass =
    'text-base font-normal w-full text-gray-700 border-none placeholder:text-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed';

  return (
    <InputWrapper title={title} required={props.required}>
      {onButtonClick ? (
        <div className={innerBoxClass} onClick={onButtonClick}>
          <input ref={internalRef} className={baseClass} readOnly={true} {...rest} />
        </div>
      ) : (
        <div className={innerBoxClass}>
          <input ref={internalRef} className={baseClass} {...rest} />
          <button
            type="button"
            className="input-inner-icon shrink-0 p-[1px] flex items-center justify-center size-6"
            onClick={handleClearInputValue}
          >
            <ClearIcon fill="var(--color-gray-500)" />
          </button>
        </div>
      )}
    </InputWrapper>
  );
};

export default BaseInput;
