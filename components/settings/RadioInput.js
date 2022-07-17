import React from "react";

const RadioInput = ({
  className,
  name,
  id,
  value,
  hidden = false,
  onLabelHover = () => {},
  labelClassName,
  children,
  ...props
}) => {
  return (
    <>
      <input
        type="radio"
        className={className}
        name={name}
        id={id}
        value={value}
        hidden={hidden}
        {...props}
      />
      <label className={labelClassName} onMouseOver={onLabelHover} htmlFor={id}>
        {children}
      </label>
    </>
  );
};

export default RadioInput;
