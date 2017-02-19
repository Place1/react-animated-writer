import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

class Writer extends React.Component {

  static propTypes = {
    script: PropTypes.arrayOf(PropTypes.func).isRequired,
    loop: PropTypes.bool,
  }

  static write(stringToWrite, duration) {
    return async (instance) => {
      const characters = stringToWrite.split('');
      const delayPerChar = duration / characters.length;
      for (let i in characters) {
        instance.setState({
          word: instance.state.word + characters[i],
        }),
        await sleep(delayPerChar);
      }
    };
  }

  static deleteChars(numberOfChars, duration) {
    return async (instance) => {
      const delayPerChar = duration / numberOfChars;
      for (let i = 0; i < numberOfChars; i++) {
        instance.setState({
          word: instance.state.word.slice(0, instance.state.word.length - 1),
        });
        await sleep(delayPerChar);
      }
    };
  }

  static deleteAll(duration) {
    return async (instance) => {
      const totalChars = instance.state.word.length;
      await Writer.deleteChars(totalChars, duration)(instance);
    };
  }

  static delay(duration) {
    return async () => {
      await sleep(duration);
    };
  }

  constructor(props) {
    super(props)
    this.state = {
      word: '',
    }
  }

  componentDidMount() {
    this.animate();
  }

  async animate() {
    while(this.props.loop) {
      for (let i in this.props.script) {
        await this.props.script[i](this);
      }
    }
  }

  render() {
    const word = this.state.word;

    return (
      <div className="writer">
        <span>&lt;</span>
        <span>{word}</span>
        <span> /&gt;</span>
      </div>
    );
  }
}

function bindInputToState(component, stateKey) {
  return {
    onChange: function(event) {
      component.setState({
        [stateKey]: event.target.value,
      });
    },
    value: component.state[stateKey]
  };
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
