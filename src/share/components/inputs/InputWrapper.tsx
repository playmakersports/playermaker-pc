import * as React from 'react';

type InputWrapperStyledProps = {
  title?: string;
  required?: boolean;
};

function InputWrapper({ children, ...props }: InputWrapperStyledProps & { children: React.ReactNode }) {
  const { title, required } = props;

  return (
    <div>
      {title && (
        <div className="text-sm font-medium flex px-0.5 mb-1 items-center gap-1 text-gray-500">
          <span className="title">{title}</span>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

export default InputWrapper;
