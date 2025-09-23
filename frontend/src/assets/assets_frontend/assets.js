import appointment_img from "./appointment_img.png";
import header_img from "./header_img.png";
import group_profiles from "./group_profiles.png";
import profile_pic from "./profile_pic.png";
import contact_image from "./contact_image.png";
import about_image from "./about_image.png";
import logo from "./logo.svg";
import dropdown_icon from "./dropdown_icon.svg";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import chats_icon from "./chats_icon.svg";
import verified_icon from "./verified_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import info_icon from "./info_icon.svg";
import upload_icon from "./upload_icon.png";
import stripe_logo from "./stripe_logo.png";
import razorpay_logo from "./razorpay_logo.png";
import doc1 from "./doc1.png";
import doc2 from "./doc2.png";
import doc3 from "./doc3.png";
import doc4 from "./doc4.png";
import doc5 from "./doc5.png";
import doc6 from "./doc6.png";
import doc7 from "./doc7.png";
import doc8 from "./doc8.png";
import doc9 from "./doc9.png";
import doc10 from "./doc10.png";
import doc11 from "./doc11.png";
import doc12 from "./doc12.png";
import doc13 from "./doc13.png";
import doc14 from "./doc14.png";
import doc15 from "./doc15.png";

export const assets = {
  appointment_img,
  header_img,
  group_profiles,
  logo,
  chats_icon,
  verified_icon,
  info_icon,
  profile_pic,
  arrow_icon,
  contact_image,
  about_image,
  menu_icon,
  cross_icon,
  dropdown_icon,
  upload_icon,
  stripe_logo,
  razorpay_logo,
};

export const specialityData = [
  { speciality: "General Physician" },
  { speciality: "Gynecologist" },
  { speciality: "Dermatologist" },
  { speciality: "Pediatrician" },
  { speciality: "Neurologist" },
  { speciality: "Gastroenterologist" },
  { speciality: "Orthopedic" },
  { speciality: "Psychiatrist" },
  { speciality: "Cardiologist" },
  { speciality: "ENT Specialist" },
];

export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Richard James",
    image: doc1,
    speciality: "General Physician",
    degree: "MBBS, MD (General Medicine)",
    experience: "4 Years",
    about:
      "Dr. Richard James specializes in preventive care, early diagnosis, and personalized treatment plans. Studied MBBS at Harvard Medical School and completed MD at Johns Hopkins University. Previously worked at St. Mary Hospital, London, and Royal Health Clinic.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc2",
    name: "Dr. Emily Larson",
    image: doc2,
    speciality: "Gynecologist",
    degree: "MBBS, MD (Obstetrics & Gynecology)",
    experience: "3 Years",
    about:
      "Dr. Emily Larson focuses on women’s health, reproductive care, and patient-centered treatments. Studied MBBS at University of Oxford and MD at King’s College London. Previously worked at Queen Elizabeth Hospital, London.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc3",
    name: "Dr. Arjun Mehta",
    image: doc3,
    speciality: "Gastroenterologist",
    degree: "MBBS, MD (Gastroenterology)",
    experience: "3 Years",
    about:
      "Dr. Arjun Mehta specializes in diagnosing and treating digestive system disorders with patient-focused care. Studied MBBS at AIIMS, New Delhi, and MD at All India Institute of Medical Sciences. Previously worked at Apollo Hospital, Delhi.",
    fees: 50,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc4",
    name: "Dr. Christopher Lee",
    image: doc4,
    speciality: "Pediatrician",
    degree: "MBBS, MD (Pediatrics)",
    experience: "2 Years",
    about:
      "Dr. Christopher Lee delivers compassionate care for children, focusing on growth and development. Studied MBBS at University College London and MD in Pediatrics at Great Ormond Street Hospital. Previously worked at London Children’s Hospital.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc5",
    name: "Dr. Jennifer Garcia",
    image: doc5,
    speciality: "Cardiologist",
    degree: "MBBS, MD (Cardiology), DM (Cardiology)",
    experience: "6 Years",
    about:
      "Dr. Jennifer Garcia specializes in heart health, cardiac diagnostics, and interventional cardiology. Completed MBBS at Stanford University, MD at UCLA, and DM at Cleveland Clinic. Previously worked at HeartCare Hospital and Royal Cardiac Institute.",
    fees: 100,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc6",
    name: "Dr. Andrew Williams",
    image: doc6,
    speciality: "Orthopedic",
    degree: "MBBS, MS (Orthopedics)",
    experience: "5 Years",
    about:
      "Dr. Andrew Williams treats bone, joint, and spine conditions with advanced orthopedic care. Studied MBBS at University of Toronto and MS in Orthopedics at McGill University. Previously worked at Toronto General Hospital.",
    fees: 70,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc7",
    name: "Dr. Christopher Davis",
    image: doc7,
    speciality: "General Physician",
    degree: "MBBS, MD (General Medicine)",
    experience: "4 Years",
    about:
      "Dr. Christopher Davis focuses on holistic preventive care, routine checkups, and patient wellness. Studied MBBS at University of Edinburgh and MD at King’s College London. Previously worked at Royal London Hospital.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc8",
    name: "Dr. Timothy White",
    image: doc8,
    speciality: "ENT Specialist",
    degree: "MBBS, MS (ENT)",
    experience: "3 Years",
    about:
      "Dr. Timothy White specializes in treating ear, nose, and throat conditions. Studied MBBS at University of Manchester and MS in ENT at University of Birmingham. Previously worked at St. Thomas Hospital, London.",
    fees: 65,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc9",
    name: "Dr. Ava Mitchell",
    image: doc9,
    speciality: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "2 Years",
    about:
      "Dr. Ava Mitchell provides advanced dermatological treatments and patient education on skin care. Studied MBBS at University of Melbourne and MD in Dermatology at Royal Melbourne Hospital. Previously worked at SkinCare Clinic, London.",
    fees: 35,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc10",
    name: "Dr. Jeffrey King",
    image: doc10,
    speciality: "Pediatrician",
    degree: "MBBS, MD (Pediatrics)",
    experience: "2 Years",
    about:
      "Dr. Jeffrey King ensures child health with regular checkups, vaccinations, and growth monitoring. Studied MBBS at University of Sydney and MD in Pediatrics at Royal Children’s Hospital. Previously worked at Sydney Children’s Clinic.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc11",
    name: "Dr. Zoe Kelly",
    image: doc11,
    speciality: "Neurologist",
    degree: "MBBS, MD (Neurology)",
    experience: "4 Years",
    about:
      "Dr. Zoe Kelly specializes in neurological disorders, patient evaluation, and long-term care management. Studied MBBS at University of Toronto and MD in Neurology at Johns Hopkins University. Previously worked at Toronto Neuro Institute.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc12",
    name: "Dr. Patrick Harris",
    image: doc12,
    speciality: "Psychiatrist",
    degree: "MBBS, MD (Psychiatry)",
    experience: "5 Years",
    about:
      "Dr. Patrick Harris provides therapy and treatment for mental health and psychiatric conditions. Studied MBBS at AIIMS, New Delhi and MD in Psychiatry at National Institute of Mental Health and Neurosciences. Previously worked at MindCare Clinic, London.",
    fees: 80,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc13",
    name: "Dr. Chloe Evans",
    image: doc13,
    speciality: "Orthopedic",
    degree: "MBBS, MS (Orthopedics)",
    experience: "3 Years",
    about:
      "Dr. Chloe Evans provides expert care in bone, joint, and spine conditions, focusing on mobility and long-term recovery. Studied MBBS at University of Edinburgh and MS in Orthopedics at University of Glasgow. Previously worked at Royal Orthopedic Hospital, London.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc14",
    name: "Dr. Ryan Martinez",
    image: doc14,
    speciality: "Gynecologist",
    degree: "MBBS, MD (Obstetrics & Gynecology)",
    experience: "3 Years",
    about:
      "Dr. Ryan Martinez provides personalized care in women’s health and reproductive treatments. Studied MBBS at University of Oxford and MD in Gynecology at University College London. Previously worked at Chelsea & Westminster Hospital.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    _id: "doc15",
    name: "Dr. Amelia Hill",
    image: doc15,
    speciality: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "1 Year",
    about:
      "Dr. Amelia Hill specializes in skin treatments, cosmetic care, and patient-focused dermatology services. Studied MBBS at University of Melbourne and MD in Dermatology at Royal Melbourne Hospital. Previously worked at ClearSkin Clinic, London.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
];
