function CancelButton(props) {
  return (
    <button {...props} className="bg-red-600 text-white px-4 py-2 rounded-md">
      {props.children}
    </button>
  );
}

export default CancelButton;
