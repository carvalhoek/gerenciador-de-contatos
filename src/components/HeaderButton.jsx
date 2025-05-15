function HeaderButton(props) {
  return (
    <button
      {...props}
      className="bg-yellow-400 text-blue-600 font-bold px-4 py-2 rounded-md"
    >
      {props.children}
    </button>
  );
}

export default HeaderButton;
