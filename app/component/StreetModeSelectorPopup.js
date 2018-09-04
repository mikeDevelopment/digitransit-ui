import cx from 'classnames';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import ComponentUsageExample from './ComponentUsageExample';
import Icon from './Icon';
import ToggleButton from './ToggleButton';
import { isKeyboardSelectionEvent } from '../util/browser';

class StreetModeSelectorPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.isOpen,
      selectedStreetMode:
        this.props.selectedStreetMode ||
        this.props.streetModeConfigs.find(c => c.defaultValue).name,
    };
  }

  getStreetModeSelectButtons() {
    const { streetModeConfigs } = this.props;
    const { selectedStreetMode } = this.state;

    if (!streetModeConfigs.length) {
      return null;
    }

    return streetModeConfigs.map(streetMode => {
      const { exclusive, icon, name } = streetMode;
      const isSelected = name === selectedStreetMode;
      const labelId = `street-mode-${name.toLowerCase()}`;
      return (
        <ToggleButton
          checkedClass="selected"
          key={name}
          icon={icon}
          label={labelId}
          onBtnClick={() => this.selectStreetMode(name, exclusive)}
          onKeyDown={e =>
            isKeyboardSelectionEvent(e) &&
            this.selectStreetMode(name, exclusive, true)
          }
          buttonRef={ref => {
            if (ref && isSelected) {
              this.selectedStreetModeButton = ref;
            }
          }}
          showButtonTitle
          state={isSelected}
        />
      );
    });
  }

  openDialog(applyFocus = false) {
    this.setState(
      {
        isOpen: true,
      },
      () => {
        if (this.selectedStreetModeButton && applyFocus) {
          this.selectedStreetModeButton.focus();
        }
      },
    );
  }

  closeDialog(applyFocus = false) {
    this.setState(
      {
        isOpen: false,
      },
      () => {
        if (this.toggleStreetModeSelectorButton && applyFocus) {
          this.toggleStreetModeSelectorButton.focus();
        }
      },
    );
  }

  selectStreetMode(streetMode, isExclusive, applyFocus = false) {
    this.setState(
      {
        selectedStreetMode: streetMode,
      },
      () => {
        this.props.selectStreetMode(streetMode.toUpperCase(), isExclusive);
        this.closeDialog(applyFocus);
      },
    );
  }

  render() {
    const { openingDirection, streetModeConfigs } = this.props;
    const { intl } = this.context;
    const { isOpen, selectedStreetMode } = this.state;

    return (
      <div className="street-mode-selector-popup-container">
        {isOpen ? (
          <div
            className={cx('street-mode-selector-popup-options', {
              'direction-up': openingDirection === 'up',
            })}
          >
            <div className="street-mode-selector-popup-header">
              <span className="h4">
                {intl.formatMessage({
                  id: 'main-mode',
                  defaultMessage: "I'm travelling by",
                })}
              </span>
              <button
                className="clear-input"
                onClick={() => this.closeDialog()}
                onKeyDown={e =>
                  isKeyboardSelectionEvent(e) && this.closeDialog(true)
                }
              >
                <Icon img="icon-icon_close" />
              </button>
            </div>
            <div className="street-mode-selector-popup-buttons">
              {this.getStreetModeSelectButtons()}
            </div>
          </div>
        ) : (
          <div
            className="street-mode-selector-popup-toggle"
            onClick={() => this.openDialog()}
            onKeyDown={e =>
              isKeyboardSelectionEvent(e) && this.openDialog(true)
            }
            ref={ref => {
              this.toggleStreetModeSelectorButton = ref;
            }}
            role="button"
            tabIndex="0"
          >
            <Icon
              img={`icon-icon_${
                find(streetModeConfigs, sm => sm.name === selectedStreetMode)
                  .icon
              }`}
            />
          </div>
        )}
      </div>
    );
  }
}

StreetModeSelectorPopup.propTypes = {
  isOpen: PropTypes.bool,
  openingDirection: PropTypes.oneOf(['up', 'down']),
  selectStreetMode: PropTypes.func.isRequired,
  selectedStreetMode: PropTypes.string,
  streetModeConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      defaultValue: PropTypes.bool.isRequired,
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

StreetModeSelectorPopup.defaultProps = {
  isOpen: false,
  openingDirection: 'down',
  selectedStreetMode: undefined,
  streetModeConfigs: [],
};

StreetModeSelectorPopup.contextTypes = {
  intl: intlShape.isRequired,
};

StreetModeSelectorPopup.description = (
  <ComponentUsageExample>
    <StreetModeSelectorPopup
      isOpen
      selectStreetMode={() => {}}
      streetModeConfigs={[
        {
          defaultValue: true,
          icon: 'public_transport',
          name: 'PUBLIC_TRANSPORT',
        },
        {
          defaultValue: false,
          icon: 'walk',
          name: 'WALK',
        },
        {
          defaultValue: false,
          icon: 'biking',
          name: 'BICYCLE',
        },
        {
          defaultValue: false,
          icon: 'car-withoutBox',
          name: 'CAR_PARK',
        },
      ]}
    />
  </ComponentUsageExample>
);

export default StreetModeSelectorPopup;
