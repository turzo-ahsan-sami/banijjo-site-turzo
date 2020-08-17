import React from "react";
import Autosuggest from "react-autosuggest";

function getSuggestions(value) {}

function renderSuggestion(suggestion) {
  return <span>{suggestion.name}</span>;
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

class MyAutosuggest extends React.Component {
  state = {
    value: "",
    suggestions: []
  };

  onChange = (_, { newValue }) => {
    const { id, onChange } = this.props;

    this.setState({
      value: newValue
    });

    onChange(id, newValue);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { id, placeholder } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        id={id}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default MyAutosuggest;
