import React from "../core/React.js";

function App() {
  return (
    <div>
      234
      <Count count={10} />
      <Count count={20} />
    </div>
  );
}

// const App = (
//   <div>
//     234
//     <Wrap />
//   </div>
// );

function Wrap() {
  return <Count count={10} />;
}

function Count({ count }) {
  function handleClick() {
    console.log(1);
  }
  return <div onClick={handleClick}>Count: {count} </div>;
}

export default App;
