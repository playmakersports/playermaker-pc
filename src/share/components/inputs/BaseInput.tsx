import * as React from 'react';
import { useImperativeHandle, useRef } from 'react';
import InputWrapper from '@/share/components/inputs/InputWrapper.tsx';
import { inputStyle } from '@/share/components/css/input.css.ts';
import ClearIcon from '@/assets/icons/common/Close20.svg?react';
import { theme } from '@/style/theme.css.ts';

type InputIconType = 'search' | 'email' | 'calendar';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {
  title?: string;
  iconType?: InputIconType;
  error?: boolean;
  delButton?: boolean;
  onButtonClick?: () => void;
  information?: string;
  description?: string;
  suffix?: string;
  large?: boolean;
}

const BaseInput = (props: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const {
    title,
    iconType,
    error = false,
    delButton = false,
    onButtonClick,
    required,
    information,
    description,
    suffix,
    large = false,
    ref,
    ...rest
  } = props;

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

  return (
    <InputWrapper title={title} required={required}>
      {onButtonClick ? (
        <div className={inputStyle.innerBox} onClick={onButtonClick}>
          <input ref={internalRef} className={inputStyle.base} readOnly={true} {...rest} />
        </div>
      ) : (
        <div className={inputStyle.innerBox}>
          <input ref={internalRef} className={inputStyle.base} {...rest} />
          <button type="button" className={inputStyle.innerIcon} onClick={handleClearInputValue}>
            <ClearIcon fill={theme.color.gray['500']} />
          </button>
        </div>
      )}
    </InputWrapper>
  );
};

export default BaseInput;
