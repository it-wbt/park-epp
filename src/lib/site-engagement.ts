export type CompanyEvent = {
 id: string;
 title: string;
 startDate: string;
 endDate: string;
 venue: string;
 description: string;
 href: string;
 image?: string;
 booth?: string;
};

// Add confirmed company events here. Dates use YYYY-MM-DD; expired events are hidden.
export const companyEvents: CompanyEvent[] = [];

// International WhatsApp number, digits only including country code.
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
export const whatsappMessage = 'Hello PARK, I would like help with an EPP product requirement.';
