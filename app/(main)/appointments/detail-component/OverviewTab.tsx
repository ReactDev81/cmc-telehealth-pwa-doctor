"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Droplet,
  FileText,
  IndianRupee,
  List,
  Mail,
  MapPin,
  Phone,
  UserCircle,
  Video,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getStatusColor } from "@/src/utils/getStatusColor";
import { Activity } from "lucide-react";

export default function OverviewTab({ appointment }: { appointment: any }) {
  const patient = appointment?.patient || {};
  const doctor = appointment?.doctor || {};
  const schedule = appointment?.schedule || {};
  const payment = appointment?.payment || {};

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4 text-primar" />,
        };

      case "confirmed":
        return {
          icon: <Calendar className="h-4 w-4 text-primar" />,
        };

      case "cancelled":
      case "failed":
        return {
          icon: <XCircle className="h-4 w-4 text-primar" />,
        };

      case "pending":
        return {
          icon: <Clock className="h-4 w-4 text-primar" />,
        };

      default:
        return {
          icon: <Clock className="h-4 w-4 text-primary" />,
        };
    }
  };

  const statusConfig = getStatusConfig(appointment?.status);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="xl:col-span-2 space-y-6">
        {/* Patient Problem */}
        <Card className="overflow-hidden">
          <CardHeader className=" bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">
                Patient Problem / Chief Complaint
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {patient?.problem || patient?.chief_complaint ? (
              <div className="space-y-4">
                {/* Main Complaint */}
                <div className="flex ml-7 gap-3">
                  <div className="flex-1">
                    <p className="text-base font-medium mt-1 text-foreground">
                      {patient?.problem || patient?.chief_complaint}
                    </p>
                  </div>
                </div>

                {/* Additional Details - If available */}
                {(patient?.duration || patient?.severity) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t">
                    {patient?.duration && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Duration
                          </p>
                          <p className="text-sm font-medium mt-0.5">
                            {patient.duration}
                          </p>
                        </div>
                      </div>
                    )}

                    {patient?.severity && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-100">
                          <Activity className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Severity
                          </p>
                          <p className="text-sm font-medium mt-0.5">
                            {patient.severity}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Symptoms List - If available */}
                {patient?.symptoms && patient.symptoms.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <List className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Symptoms
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-11">
                      {patient.symptoms.map(
                        (symptom: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-purple-50 text-purple-700"
                          >
                            {symptom}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-muted/30">
                <p className="text-muted-foreground">
                  No problem/complaint recorded
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">
                Contact Information
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
                {/* Icon */}
                <div className="p-2 rounded-lg bg-gray-200">
                  <Mail className="h-4 w-4 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Email Address
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 cursor-pointer">
                    <p className="text-sm font-medium text-foreground">
                      {patient?.email || "Not provided"}
                    </p>

                    {patient?.email && (
                      <button
                        className="opacity-0  group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          navigator.clipboard.writeText(patient.email)
                        }
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
                {/* Icon */}
                <div className="p-2 rounded-lg bg-gray-200">
                  <Phone className="h-4 w-4 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Phone Number
                  </p>

                  <div className="flex items-center gap-2 mt-0.5 cursor-pointer">
                    <p className="text-sm font-medium text-foreground">
                      {patient?.phone || "Not provided"}
                    </p>

                    {patient?.phone && (
                      <button
                        className="opacity-0  group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          navigator.clipboard.writeText(patient.phone)
                        }
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Blood Group & Gender - Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Blood Group */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="p-2 rounded-lg bg-gray-200">
                    <Droplet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Blood Group
                    </p>
                    <p className="text-sm font-semibold mt-0.5">
                      {patient?.blood_group || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age & DOB - If available */}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Info */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={doctor?.avatar} />
                <AvatarFallback>{doctor?.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold">{doctor?.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {doctor?.department}
                </p>
                <p className="text-sm">{doctor?.years_experience}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">
        {/* Contact Info */}
    

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IndianRupee className="h-4 w-4" />
              Payment Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Consultation Fee</span>
              <span>{payment?.consultation_fee_formatted}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Admin Fee</span>
              <span>{payment?.admin_fee_formatted}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>{payment?.discount_formatted}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{payment?.total_formatted}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge className={getStatusColor("payment", payment?.status)}>
                {payment?.status_label}
              </Badge>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="uppercase">{payment?.payment_method}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
