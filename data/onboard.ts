import React from "react";
import OnboardPicture1 from "../assets/svgs/onboard1.svg";
import OnboardPicture2 from "../assets/svgs/onboard2.svg";
import OnboardPicture3 from "../assets/svgs/onboard3.svg";

export const onboardData = [
  {
    hideMainText: false,
    ImageComponent: OnboardPicture1,
    beforeText: "Welcome to ",
    description:
      "Your personal finance assistant that helps you manage your money on-the-go.",
  },
  {
    hideMainText: false,
    ImageComponent: OnboardPicture2,
    beforeText: "Spend & Save with ",
    description:
      "CashGlide makes it easy to save money for the things that matter most to you.",
  },
  {
    hideMainText: true,
    ImageComponent: OnboardPicture3,
    beforeText: "Bank-Level Security ",
    description:
      "CashGlide uses bank-level security protocols to protect your personal and financial information.",
  },
];
