import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";

// SpecialityData
export interface SpecialityProps {
  id: string;
  department: {
    name: string;
    icon: string;
  };
}

// available doctors
export interface AvailableDoctorsProps {
  id?: string;
  avatar: ImageSourcePropType;
  consultation_type: string;
  consultation_fee: string;
  name: string;
  speciality?: { name: string; role?: string; order?: number }[];
  departments?: { name: string; role?: string; order?: number }[];
  rating: number;
  years_experience: number;
}

// advertisements
export interface AdvertisementProps {
  id: string;
  image: string;
  link: Href;
}

// Testimonials
export interface TestimonialProps {
  patient_id: string;
  doctor_id?: string;
  patient_name: string;
  title: string;
  content: string;
  rating: number;
  is_active?: boolean;
  is_featured?: boolean;
  slug?: string;
  patient_image: string | ImageSourcePropType;
  total_reviews: string;
  patient_age: string;
  doctor_name: string;
  patient_location?: string;
  days_ago?: string;
  created_at?: string;
}

export interface PatientHomeResponse {
  data: {
    available_doctors: AvailableDoctorsProps[];
    advertisements?: AdvertisementProps[];
    patient_reviews?: TestimonialProps[];
    speciality_symptoms?: SpecialityProps[];
  };
}