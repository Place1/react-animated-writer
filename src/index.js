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
    words: PropTypes.arrayOf(PropTypes.string).isRequired,
    growTime: PropTypes.number.isRequired,
    shrinkTime: PropTypes.number.isRequired,
    pauseTime: PropTypes.number.isRequired,
    prefix: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      wordIndex: 0,
      charIndex: 0,
    }
  }

  componentDidMount() {
    this.animate();
  }

  async animate() {
    while(true) {
      await this.animateUp();
      await sleep(this.props.pauseTime);
      await this.animateDown();
      await this.setStateAsync({
        wordIndex: (this.state.wordIndex + 1) % this.props.words.length,
      });
    }
  }

  async animateUp() {
    const currentWord = this.curWord();
    for (let i = 0; i <= currentWord.length; i++) {
      await this.setStateAsync({
        charIndex: i,
      });
      await sleep(this.growDelay());
    }
  }

  async animateDown() {
    const currentWord = this.curWord();
    for (let i = currentWord.length; i >= 0; i--) {
      await this.setStateAsync({
        charIndex: i,
      });
      await sleep(this.shrinkDelay());
    }
  }

  curWord() {
    return this.props.words[this.state.wordIndex];
  }

  setStateAsync(newState) {
    return new Promise(resolve => {
      this.setState(newState, resolve)
    });
  }

  growDelay() {
    return this.props.growTime / this.curWord().length;
  }

  shrinkDelay() {
    return this.props.shrinkTime / this.curWord().length;
  }

  render() {
    const word = this.props.words[this.state.wordIndex].slice(0, this.state.charIndex)
    const prefix = this.props.prefix
    const delimiter = prefix ? '-' : '';

    return (
      <div className="writer">
        <span>&lt;</span>
        <span>{prefix}{delimiter}{word}</span>
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

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      pauseTime: 2000,
      growTime: 250,
      shrinkTime: 120,
      prefix: '',
      words: 'eat,sleep,code',
    };
  }

  render() {
    return (
      <div className="page">
        <div className="page__controls">
          <label>
            prefix
            <input type="string" {...bindInputToState(this, 'prefix')} />
          </label>
          <label>
            words (seperate with a commer)
            <input type="string" {...bindInputToState(this, 'words')} />
          </label>
          <label>
            pause time (ms)
            <input type="number" min="0" {...bindInputToState(this, 'pauseTime')} />
          </label>
          <label>
            grow time (ms)
            <input type="number" min="0" {...bindInputToState(this, 'growTime')} />
          </label>
          <label>
            shrink time (ms)
            <input type="number" min="0" {...bindInputToState(this, 'shrinkTime')} />
          </label>
        </div>
        <Writer {...this.state} words={this.state.words.split(',')} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
