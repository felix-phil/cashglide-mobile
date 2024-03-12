export interface CountryCode {
  image: string;
  code: string;
  name: string;
  maxLength: number;
  currencyFull: string;
  currencyShort: string;
  pattern: string;
  regex: RegExp;
}

const codes: CountryCode[] = [
  {
    image: "🇳🇬",
    code: "+234",
    name: "nigeria",
    maxLength: 12,
    currencyFull: "nigerian naira",
    currencyShort: "ngn",
    pattern: "### ### ### ####",
    regex: /^(\+?234)?[789][01]\d{8}$/,
  },
  {
    image: "🇬🇭",
    code: "+233",
    name: "ghana",
    maxLength: 10,
    currencyFull: "ghanaian cedi",
    currencyShort: "ghs",
    pattern: "### ## ### ####",
    regex:
      /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|51|21|71|25|30|31|35|36|37|38|39|20|55|59|50|54|57|58)\d{7}$/,
  },
  {
    image: "🇰🇪",
    code: "+254",
    name: "kenya",
    maxLength: 10,
    currencyFull: "kenyan shilling",
    currencyShort: "kes",
    pattern: "### ### ### ###",
    regex: /^(\+254|0)[1][0-9]{8}$/,
  },
  {
    image: "🇹🇿",
    code: "+255",
    name: "tanzania",
    maxLength: 10,
    currencyFull: "tanzanian shilling",
    currencyShort: "tzs",
    regex: /^(\+255|0)[67][123456789]\d{7}$/,
    pattern: "### ### ### ###",
  },
  {
    image: "🇺🇬",
    code: "+256",
    name: "uganda",
    maxLength: 10,
    currencyFull: "ugandan shilling",
    currencyShort: "ugx",
    regex: /^(\+256|0)[7][0125][0-9]{7}$/,
    pattern: "### ### ### ###",
  },
];
export default codes;
