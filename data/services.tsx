import NetworkBars from "../assets/svgs/services/network-bars.svg";
import Data from "../assets/svgs/services/data.svg";
import Electricity from "../assets/svgs/services/electricity.svg";
import Internet from "../assets/svgs/services/internet.svg";
import Education from "../assets/svgs/services/education.svg";
import Movies from "../assets/svgs/services/movie.svg";
import TopUp from "../assets/svgs/topup.svg";
import SendSvg from "../assets/svgs/send.svg";
import BankSvg from "../assets/svgs/bank.svg";

export default [
  {
    title: "Airtime",
    iconColor: "#086773",
    background: "#8EDCE633",
    Icon: <NetworkBars />,
  },
  {
    title: "Data",
    iconColor: "#751076",
    background: "#EC9DED",
    Icon: <Data />,
  },
  {
    title: "Electricity",
    iconColor: "#14146F",
    background: "#9191E9",
    Icon: <Electricity />,
  },
  {
    title: "Internet",
    iconColor: "#0E6B45",
    background: "#7BFFC9",
    Icon: <Internet />,
  },
  {
    title: "Education",
    iconColor: "#783410",
    background: "#FAD4C0",
    Icon: <Education />,
  },
  {
    title: "Movies",
    iconColor: "#4F6C11",
    background: "#E1FEA4",
    Icon: <Movies />,
  },
];
export const servicesByType = {
  airtime: {
    title: "Airtime",
    iconColor: "#086773",
    background: "#8EDCE633",
    Icon: <NetworkBars />,
  },
  data: {
    title: "Data",
    iconColor: "#751076",
    background: "#EC9DED",
    Icon: <Data />,
  },
  electricity: {
    title: "Electricity",
    iconColor: "#14146F",
    background: "#9191E9",
    Icon: <Electricity />,
  },
  internet: {
    title: "Internet",
    iconColor: "#0E6B45",
    background: "#7BFFC9",
    Icon: <Internet />,
  },
  education: {
    title: "Education",
    iconColor: "#783410",
    background: "#FAD4C0",
    Icon: <Education />,
  },
  movies: {
    title: "Movies",
    iconColor: "#4F6C11",
    background: "#E1FEA4",
    Icon: <Movies />,
  },
  topup: {
    title: "Top Up",
    iconColor: "#FFFFFF",
    background: "#1877F2",
    Icon: <TopUp />,
  },
  transfer: {
    title: "Money Sent",
    iconColor: "#FFFFFF",
    background: "#FF6600",
    Icon: <SendSvg />,
  },
  bank_transfer: {
    title: "Bank Transfer",
    iconColor: "#FFFFFF",
    background: "#FFFFFF",
    Icon: <BankSvg />,
  },
  merchant_consumption:{
    title: "Merchant Consumption",
    iconColor: "#FFFFFF",
    background: "#1877F2",
    Icon: <SendSvg />,
  }
};
