/**
 * @prettier
 * @flow
 */

import React from 'react';
import { css } from 'react-emotion';
import TextField from '@material-ui/core/TextField';

import colors from '../../utils/styles/colors';

const TxtField = ({ InputProps, ...other }) => (
  <TextField
    {...other}
    InputProps={{
      ...InputProps,
      classes: {
        input: css`
          && {
            color: ${colors.white};
          }
        `,
        root: css`
          && {
            &:before {
              content: '';
              border: none;
            }
            &:after {
              border-color: ${colors.white};
            }
            &:hover:before {
              content: none;
            }
          }
        `,
      },
    }}
  />
);

export default TxtField;
