import { Briefcase, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./sectionHeader";
import { ProfileItemCard } from "./profileItemCard";
import { ActionButtons } from "./actionButtons";

interface ExperienceSectionProps {

  experience?: any; // Marked as any to handle both array of ExperienceItem or object with professional_experience_info
}

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {

  // Handle both flat arrays and nested object structures
  const safeExperience = Array.isArray(experience)
    ? experience
    : Array.isArray(experience?.professional_experience_info)
      ? experience.professional_experience_info
      : [];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Working Experience"
        description="Your professional work history"
      // actionLabel="Add Experience"
      // actionIcon={<Plus className="h-4 w-4 mr-2" />}
      />

      <div className="space-y-4">

        {safeExperience?.map((exp: any, index: number) => (
          <ProfileItemCard
            key={index}
            icon={<Briefcase className="h-6 w-6" />}
            title={exp.designation || exp.title || exp.past_associations || exp.hospital_name || "Unknown"}
            meta={`${exp.start_date || exp.career_start || ''}${exp.end_date ? ` - ${exp.end_date}` : ''}`}
            badge={
              (exp.current || exp.is_current) ? (
                <Badge className="bg-primary/10 text-primary">Current</Badge>
              ) : undefined
            }
            description={exp.description}
          />
        ))}
      </div>
    </div>
  );
}