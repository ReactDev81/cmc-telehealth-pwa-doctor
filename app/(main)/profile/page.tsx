"use client";

import { useState } from "react";
import CustomTabs from "@/components/pages/appoitment/CustomTabs";
import AddressSection from "@/components/pages/profile/addressSection";
import AwardsSection from "@/components/pages/profile/awardsSection";
import CertificatesSection from "@/components/pages/profile/certificatesSection";
import EducationSection from "@/components/pages/profile/educationSection";
import ExperienceSection from "@/components/pages/profile/experienceSection";
import PersonalInfoSection from "@/components/pages/profile/personalInfoSection";
import ProfileHeader from "@/components/pages/profile/profileHeader";
import ReviewsSection from "@/components/pages/profile/reviewsSection";
import SocialLinksSection from "@/components/pages/profile/socialLinksSection";

interface ProfileData {
  email?: string | null;
  bio?: string | null;
  avatar?: string | null;
  doctor_departments?: Array<{
    department_id: string;
    department_name: string;
    role: string;
  }>;
}

interface Address {
  address_line1: string;
  address_line2: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certificate {
  id: number;
  name: string;
  organization: string;
  issue_date: string;
  expiry_date: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  patient: string;
  date: string;
}

interface SocialMedia {
  linkedin: string;
  twitter: string;
  website: string;
}

interface AwardItem {
  award_image?: string;
  title?: string;
  organization?: string;
  year?: number | string;
  description?: string;
}

interface Awards {
  awards_info?: AwardItem[];
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  website?: string;
  [key: string]: string | undefined;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data - replace with actual API calls
  const [profileData] = useState<ProfileData>({
    email: "doctor@example.com",
    bio: "Experienced doctor with 10+ years of practice",
    avatar: null,
    doctor_departments: [
      { department_id: "1", department_name: "Cardiology", role: "Senior Doctor" },
      { department_id: "2", department_name: "Internal Medicine", role: "Consultant" }
    ]
  });

  const [formData, setFormData] = useState({
    first_name: "John",
    last_name: "Doe",
    email: "doctor@example.com",
    bio: "Experienced doctor with 10+ years of practice",
    phone: "+1 234-567-8900",
    license: "MD123456"
  });

  const fullName = `${formData.first_name} ${formData.last_name}`;
  const initials = `${formData.first_name[0]}${formData.last_name[0]}`;
  const primaryDepartment = profileData?.doctor_departments?.[0]?.department_name || "General Practice";
  const primaryRole = profileData?.doctor_departments?.[0]?.role || "Doctor";

  // Mock data for other sections
  const address: Address = {
    address_line1: "123 Medical Center Dr",
    address_line2: "Suite 456",
    area: "Downtown",
    landmark: "Near City Hospital",
    city: "Medical City",
    state: "California",
    country: "United States",
    pincode: "12345"
  };
  const experience: Experience[] = [
    { company: "City Hospital", role: "Senior Doctor", period: "2018-Present" },
    { company: "Medical Center", role: "Doctor", period: "2014-2018" }
  ];
  const education: Education[] = [
    { degree: "MD", institution: "Medical University", year: "2014" },
    { degree: "Bachelor's", institution: "University", year: "2010" }
  ];
  const awards: Awards = {
    awards_info: [
      { title: "Excellence in Medicine 2022", organization: "Medical Association", year: "2022" },
      { title: "Best Doctor Award 2020", organization: "Hospital Board", year: "2020" }
    ]
  };
  const certificates: Certificate[] = [
    { id: 1, name: "Board Certification", organization: "Medical Board", issue_date: "2020", expiry_date: "2025" },
    { id: 2, name: "Advanced Cardiac Life Support", organization: "American Heart Association", issue_date: "2021", expiry_date: "2023" }
  ];
  const socialMedia: SocialLinks = {
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    website: "https://johndoemd.com"
  };
  const reviews: Review[] = [
    { id: 1, rating: 5, comment: "Excellent doctor!", patient: "Patient A", date: "2024-01-15" },
    { id: 2, rating: 4, comment: "Very professional", patient: "Patient B", date: "2024-01-10" }
  ];
  const averageRating = "4.5";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    try {
      // API call to save personal info
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditingPersonal(false);
    } catch (error) {
      console.error("Error saving personal info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPersonalEdit = () => {
    setIsEditingPersonal(false);
    // Reset form data to original values
    setFormData({
      first_name: "John",
      last_name: "Doe",
      email: "doctor@example.com",
      bio: "Experienced doctor with 10+ years of practice",
      phone: "+1 234-567-8900",
      license: "MD123456"
    });
  };

  const tabs = [
    {
      key: "personal",
      label: "Personal Info",
      content: <PersonalInfoSection
        isEditing={isEditingPersonal}
        setIsEditing={setIsEditingPersonal}
        formData={formData}
        profileData={profileData}
        fullName={fullName}
        primaryDepartment={primaryDepartment}
        primaryRole={primaryRole}
        isSaving={isSaving}
        onInputChange={handleInputChange}
        onSave={handleSavePersonalInfo}
        onCancel={handleCancelPersonalEdit}
      />,
    },
    {
      key: "address",
      label: "Address",
      content: <AddressSection address={address} />,
    },
    {
      key: "experience",
      label: "Experience",
      content: <ExperienceSection experience={experience} />,
    },
    {
      key: "education",
      label: "Education",
      content: <EducationSection education={education} />,
    },
    {
      key: "awards",
      label: "Awards",
      content: <AwardsSection awards={awards} />,
    },
    {
      key: "certificates",
      label: "Certificates",
      content: <CertificatesSection certificates={certificates} />,
    },
    {
      key: "social",
      label: "Social Links",
      content: <SocialLinksSection socialMedia={socialMedia} />,
    },
    {
      key: "reviews",
      label: "Reviews",
      content: <ReviewsSection reviews={reviews} averageRating={averageRating} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        fullName={fullName}
        avatar={profileData?.avatar}
        initials={initials}
        department={primaryDepartment}
        role={primaryRole}
        email={profileData?.email}
        phone={formData.phone}
        license={formData.license}
        averageRating={averageRating}
        reviewsCount={reviews.length}
      />
      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabsListClassName="w-full"
      />
    </div>
  );
};

export default ProfilePage;