import { handleEnquiry } from '@/lib/enquiry-server';
export async function POST(request: Request) {
  return handleEnquiry(request, {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.ENQUIRY_FROM,
  });
}
