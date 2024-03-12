import { ImagePickerAsset } from "expo-image-picker";
import codes from "../data/country-codes";
export const hexToRGB = (hex: string, alpha: number) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};
export const numberWithSpaces = (
  value: string,
  pattern = "### ### ### ####"
) => {
  let number = value;
  if (number.startsWith("+")) number = number.replace("+", "");
  var i = 0,
    phone = number.toString();
  return pattern.replace(/#/g, (_) => phone[i++] || "");
};

export const validationRegexes = {
  email: /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-z_]{5,}$/,
};

export const isEmailOrPhoneNumber = (
  value: string
): "email" | "phone" | "unknown" => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex =
    /^(\+?\d{1,3})?[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;

  if (emailRegex.test(value)) {
    return "email";
  } else if (phoneRegex.test(value)) {
    return "phone";
  } else {
    return "unknown";
  }
};
export const getErrorString = (error: any) => {
  if (typeof error === "object") {
    if ("data" in error) {
      if ("errors" in error.data) {
        if (Array.isArray(error.data.errors)) {
          const errorsArray = error.data.errors;
          return errorsArray[0].message || "Something went wrong";
        }
      }
    } else if ("error" in error) {
      return error.error || "Something went wrong";
    } else {
      return error?.message || "Something went wrong";
    }
  } else {
    return "Something went wrong";
  }
};

export const splitNumberAndCode = (phone: string) => {
  const code = codes.find((code) => phone.startsWith(code.code));
  if (code) {
    return { number: phone.replace(code.code, ""), code: code.code };
  }
  return { number: "", code: "+234" };
};
export const getCodeObjectByCountryCode = (countryCode: string) => {
  return codes.find((code) => code.code === countryCode);
};

export const formatStringToMMDDYYY = (input: string) => {
  const formatted = input
    .replace(/\D/g, "") // Remove non-numeric characters
    .replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3") // Add hyphens
    .substr(0, 10); // Limit to 10 characters (dd-mm-yyyy)

  return formatted;
};
export const formatToNumberLocalString = (text: string) => {
  const numericValue = text.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");

  const wholePart = parts[0] ? parseInt(parts[0], 10) : 0;
  const formattedWholePart = wholePart.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  let formattedValue = formattedWholePart;
  if (parts.length > 1) {
    formattedValue += "." + parts[1];
  }
  return formattedValue;
};

export const formatLocaleStringToNumber = (
  localeString: string,
  locale = "en-NG"
) => {
  const cleanedString = localeString.replace(/[^\d.,-]/g, "").replace(/,/g, "");

  const parts = cleanedString.split(".");
  if (parts.length > 2) {
    throw new Error("Invalid currency format");
  }

  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  const isNegative = localeString.includes("-");

  const numericString =
    (isNegative ? "-" : "") + integerPart + "." + decimalPart;

  const numericValue = parseFloat(numericString);

  return isNaN(numericValue) ? 0 : numericValue;
};

export function formatATMCardNumber(cardNumber: string) {
  const cleanedNumber = cardNumber.replace(/\D/g, "");

  const groups = [];
  for (let i = 0; i < cleanedNumber.length; i += 4) {
    groups.push(cleanedNumber.slice(i, i + 4));
  }

  const formattedNumber = groups.join(" ");

  return formattedNumber;
}
export const cardValidator = {
  isValidCardNumber: (cardNumber: string) => {
    // Remove spaces and non-numeric characters
    const cleanedCardNumber = cardNumber.replace(/\D/g, "");

    // Check if the card number is empty or doesn't contain only digits
    if (!cleanedCardNumber.match(/^\d+$/)) {
      return false;
    }

    // Convert the card number string to an array of digits
    const cardDigits = cleanedCardNumber.split("").map(Number);

    // Apply the Luhn algorithm
    let sum = 0;
    let double = false;

    for (let i = cardDigits.length - 1; i >= 0; i--) {
      let digit = cardDigits[i];

      if (double) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      double = !double;
    }

    return sum % 10 === 0;
  },
  formatCardNumber: (text: string) => {
    // Remove non-numeric characters from the input
    const cleanedText = text.replace(/\D/g, "");

    // Split the input into groups of 4 digits
    const groups = [];
    for (let i = 0; i < cleanedText.length; i += 4) {
      groups.push(cleanedText.slice(i, i + 4));
    }

    // Join the groups with spaces
    const formattedCardNumber = groups.join(" ");
    return formattedCardNumber;
  },
  getCardType: (partialCardNumber: string) => {
    // Remove non-numeric characters
    const cleanedNumber = partialCardNumber.replace(/\D/g, "");

    // Check the first few digits to determine the card type
    const cardType = {
      "cc-visa": /^4/,
      "cc-mastercard": /^5[1-5]/,
      "credit-card": /^506[0-2]/,
    };

    for (const [type, pattern] of Object.entries(cardType)) {
      if (pattern.test(cleanedNumber)) {
        return type as keyof typeof cardType;
      }
    }

    // If no card type is detected, return 'Unknown' or handle it as needed
    return "credit-card";
  },
  formatExpiry: (text: string) => {
    // Remove non-numeric characters
    const cleanedText = text.replace(/\D/g, "");
    // Add a slash '/' between the month and year if not already present
    if (cleanedText.length >= 2 && cleanedText.charAt(2) !== "/") {
      return cleanedText.slice(0, 2) + "/" + cleanedText.slice(2);
    } else {
      return cleanedText;
    }
  },
  isValidExpiry: (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return false; // Expiry date does not match MM/YY format
    }

    const [month, year] = expiry.split("/").map((part) => parseInt(part, 10));

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expiry date is in the past
    }

    return true; // Expiry date is valid
  },
  isValidCVV: (cvv: string) => {
    // Remove non-numeric characters
    const cleanedCVV = cvv.replace(/\D/g, "");

    // Check if the cleaned CVV consists of exactly 3 or 4 numeric digits
    return /^[0-9]{3,4}$/.test(cleanedCVV);
  },
  maskCardNumber: (cardNumber: string) => {
    // Split the card number into groups of 4 digits
    const cardNumberGroups = cardNumber.split(" ");

    // Mask the digits in the first 4 groups
    const maskedGroups = cardNumberGroups
      .slice(0, 4)
      .map((group) => group.replace(/\d/g, "*"));

    // Concatenate the masked groups with the remaining unmasked groups
    const maskedCardNumber = maskedGroups.join(" ") + cardNumber.slice(4 * 4);

    return maskedCardNumber;
  },
};
export const greetByTime = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return greeting;
};
export const capitalize = (str: string) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export const formatImageForUpload = (image: ImagePickerAsset) => {
  const localUri = image.uri;
  const filename = image.fileName || localUri.split("/").pop() || "image.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const filetype = match ? `image/${match[1]}` : "image/jpg";

  return { uri:localUri, name:filename, type:filetype };
};