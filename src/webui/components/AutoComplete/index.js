/**
 * @prettier
 * @flow
 */

import React from 'react';
import type { Node } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import TxtField from '../TxtField';

import { Wrapper } from './styles';
import { IProps } from './interfaces';

function renderInputComponent(inputProps) {
  const { inputRef = () => {}, ref, startAdornment, ...other } = inputProps;
  return (
    <TxtField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        startAdornment,
      }}
      {...other}
    />
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

const AutoComplete = ({ suggestions, value = '', onChange }: IProps): Node => {
  const autosuggestProps = {
    renderInputComponent,
    suggestions,
    getSuggestionValue,
    renderSuggestion,
  };
  return (
    <Wrapper>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          value,
          onChange,
          placeholder: 'Search packages',
          startAdornment: (
            <InputAdornment position="start">
              <Search style={{ color: 'white' }} />
            </InputAdornment>
          ),
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </Wrapper>
  );
};

export default AutoComplete;
