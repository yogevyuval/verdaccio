/**
 * @prettier
 * @flow
 */

export interface IProps {
  suggestions: string[];
  value: string;
  onChange: (event: SynthenticEvent) => void;
}
