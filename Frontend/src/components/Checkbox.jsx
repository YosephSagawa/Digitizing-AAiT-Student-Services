import React from "react";

const Checkbox = (props) => {
  return (
    <input
      type="checkbox"
      checked={props.value}
      onChange={() => {
        props.setValue(!props.value);
      }}
    ></input>
  );
};

export default Checkbox;
