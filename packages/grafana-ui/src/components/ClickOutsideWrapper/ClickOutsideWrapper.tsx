import { PureComponent, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';

export interface Props {
  onClick: () => void;
  /**
   * Used to filter out certain elements besides the wrapper
   */
  onOutsideClick?: (event: SyntheticEvent) => boolean;
}

interface State {
  hasEventListener: boolean;
}

export class ClickOutsideWrapper extends PureComponent<Props, State> {
  state = {
    hasEventListener: false,
  };

  componentDidMount() {
    window.addEventListener('click', this.onOutsideClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onOutsideClick, false);
  }

  onOutsideClick = (event: any) => {
    const { onOutsideClick } = this.props;
    const domNode = ReactDOM.findDOMNode(this) as Element;

    if (onOutsideClick && !onOutsideClick(event)) {
      return;
    }

    if (!domNode || !domNode.contains(event.target)) {
      this.props.onClick();
    }
  };

  render() {
    return this.props.children;
  }
}
