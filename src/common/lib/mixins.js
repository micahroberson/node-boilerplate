import colors from './colors';

export const clearfix = {
  ':after': {
    clear: 'both',
    content: '""',
    display: 'table'
  }
};

let baseCreditCardIcon = {
  width: '30px',
  height: '20px',
  verticalAlign: 'middle',
  display: 'inline-block',
  marginRight: '6px',
  backgroundSize: 'cover',
};

export const creditCardIcons = {
  creditCardIconVisa: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/card_visa.svg")}) no-repeat center center`,
  },
  creditCardIconAmericanExpress: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/card_american_express.svg")}) no-repeat center center`,
  },
  creditCardIconMasterCard: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/card_mastercard.svg")}) no-repeat center center`,
  },
  creditCardIconDiscover: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/card_discover.svg")}) no-repeat center center`,
  },
  creditCardIconDefault: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/card_nologo.svg")}) no-repeat center center`,
  },
  creditCardIconApplePay: {
    ...baseCreditCardIcon,
    background: `url(${require("../images/cc_applepay_3x.png")}) no-repeat center center`,
  },
};

export const checkboxStyles = {
  checkboxInput: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
    ':checked + div': {
      display: 'block',
    },
  },
  checkboxLabel: {
    position: 'relative',
    width: 16,
    height: 16,
    display: 'inline-block',
    cursor: 'pointer',
    margin: '3px 8px 0 0',
    border: `1px solid ${colors.black35}`,
    borderRadius: 2,
    verticalAlign: 'middle',
  },
  disabledCheckboxLabel: {
    border: '1px solid transparent',
    cursor: 'default',
  },
  checkboxCheckmark: {
    display: 'none',
    position: 'absolute',
    top: 2,
    left: 5,
    width: 4,
    height: 9,
    transform: 'rotate(45deg)',
    border: `solid ${colors.blackOlive}`,
    borderWidth: '0 2px 2px 0',
    background: 'transparent',
  },
};

export const mediaQueries = {
  mobile: '@media screen and (max-width: 500px)'
};
