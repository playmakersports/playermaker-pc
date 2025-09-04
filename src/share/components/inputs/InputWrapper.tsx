import * as React from 'react';
import { inputStyle } from '../css/input.css';
import { theme } from '@/style/theme.css.ts';

type InputWrapperStyledProps = {
  title?: string;
  required?: boolean;
  // information?: string;
};

function InputWrapper({ children, ...props }: InputWrapperStyledProps & { children: React.ReactNode }) {
  const { title, required } = props;
  // const informationContents: TooltipProps =
  //   typeof information === 'string'
  //     ? { color: 'white', contents: [{ title: '', description: information }] }
  //     : (information ?? { color: 'white', contents: [{ title: '', description: '' }] });
  // const { onClickOpenTooltip, Tooltip } = useTooltip(informationContents);

  return (
    <div className={inputStyle.wrapper}>
      {title && (
        <div className={inputStyle.baseHeader}>
          <span className="title">{title}</span>
          {/*{information && (*/}
          {/*  <div style={{ position: 'relative', display: 'inline-flex' }}>*/}
          {/*    <Tooltip />*/}
          {/*    <button type="button" className={inputStyle.baseQuestion} onClick={onClickOpenTooltip}>*/}
          {/*      <InfoIcon fill="var(--gray400)" />*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*)}*/}
          {required && <span style={{ color: theme.color.red['500'] }}>*</span>}
        </div>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

export default InputWrapper;
