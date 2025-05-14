function ConfirmButton(props) {
  return (
    <button {...props} className="bg-blue-600 text-white px-4 py-2 rounded-md">
      {props.children}
    </button>
  );
}

export default ConfirmButton;
