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

export const mediaQueries = {
  mobile: '@media screen and (max-width: 500px)'
};
