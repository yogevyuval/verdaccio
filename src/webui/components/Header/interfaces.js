import { SyntheticEvent } from "react";

/**
 * @prettier
 * @flow
 */

export interface IProps {
  username?: string;
  onLogout: Function;
  toggleLoginModal: Function;
  scope: string;
  search: string;
  onSearch: (event: SyntheticEvent) => void;
  packages: string[];
}

export interface IState {
  anchorEl?: any;
  openInfoDialog: boolean;
  registryUrl: string;
  packages: string[];
}
