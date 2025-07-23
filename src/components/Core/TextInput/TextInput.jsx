import React from "react";

const TextInput = React.forwardRef((props, ref) => (
  <>
    <label for={props.label} class="block mb-1 text-sm text-gray-700 font-geist-sans">
      {props.label}
    </label>
    <input
      type={props.type}
      id={props.label}
      class="bg-gray-100 border-0 font-geist-sans text-gray-900 text-sm rounded-md block w-full p-2.5 h-12"
      placeholder={props.placeholder}
      required
      onChange={props.onChange}
      autoComplete={props.autoComplete ? props.autoComplete : 'off'}
      ref={props.inputRef}
    />
  </>
));

export default TextInput;
