# demo

```
class Writer extends React.Component {
  // implementation...
}

function App() {
  const delayTime = 2000;
  const writeTime = 250;
  const deleteTime = 180;
  const script = [
    Writer.write('welcome-', writeTime),
    Writer.write('eat', writeTime),
    Writer.delay(delayTime),
    Writer.deleteChars(3, deleteTime),
    Writer.write('sleep', writeTime),
    Writer.delay(delayTime),
    Writer.deleteChars(5, deleteTime),
    Writer.write('code', writeTime),
    Writer.delay(delayTime),
    Writer.deleteAll(300),
  ];

  return (
    <div className="page">
      <Writer script={script} loop={true} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

```