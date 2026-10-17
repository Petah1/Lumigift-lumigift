import axios from "axios";
import { serverConfig } from "@/server/config";
import { generateOtp, storeOtp } from "@/lib/otp";

const termiiClient = axios.create({
  baseURL: "https://api.ng.termii.com/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Sends a new-device login alert to the user via SMS.
 * Called when a login is detected from an unrecognised device fingerprint.
 *
 * @param phone - E.164-formatted destination phone number.
 * @param options.time - Human-readable timestamp of the login event (UTC string).
 * @param options.country - Country name resolved from the login IP address.
 * @param options.reportUrl - URL the user can visit to report a suspicious login.
 * @returns Resolves when the SMS has been dispatched to Termii.
 * @throws If the Termii API returns a non-2xx response.
 */
export async function sendNewDeviceAlert(
  phone: string,
  { time, country, reportUrl }: { time: string; country: string; reportUrl: string }
): Promise<void> {
  await termiiClient.post("/sms/send", {
    to: phone,
    from: serverConfig.termii.senderId,
    sms:
      `Lumigift: New login detected on your account.\n` +
      `Time: ${time}\nLocation: ${country}\n` +
      `Not you? Report it: ${reportUrl}`,
    type: "plain",
    channel: "generic",
    api_key: serverConfig.termii.apiKey,
  });
}

/**
 * Generates a 6-digit OTP, sends it to the given phone number via SMS,
 * and returns the generated OTP so the caller can persist it.
 *
 * @param phone - E.164-formatted destination phone number.
 * @returns The 6-digit OTP string that was sent.
 * @throws If the Termii API returns a non-2xx response.
 */
export async function sendOtp(phone: string): Promise<string> {
  const otp = generateOtp();
  await storeOtp(phone, otp);

  await termiiClient.post("/sms/send", {
    to: phone,
    from: serverConfig.termii.senderId,
    sms: `Your Lumigift verification code is: ${otp}. Valid for 10 minutes.`,
    type: "plain",
    channel: "generic",
    api_key: serverConfig.termii.apiKey,
  });
  return otp;
}

/**
 * Sends a gift invitation SMS to an unregistered recipient.
 * The invitation includes a link to claim the gift after registering.
 *
 * @param phone - E.164-formatted destination phone number.
 * @param invitationToken - The invitation token for the gift.
 * @param recipientName - The name of the person sending the gift.
 * @returns Resolves when the SMS has been dispatched to Termii.
 * @throws If the Termii API returns a non-2xx response.
 */
export async function sendGiftInvitation(
  phone: string,
  invitationToken: string,
  senderName: string
): Promise<void> {
  const claimLink = `${serverConfig.app.url}/auth/register?invitation=${encodeURIComponent(invitationToken)}`;

  await termiiClient.post("/sms/send", {
    to: phone,
    from: serverConfig.termii.senderId,
    sms:
      `${senderName} sent you a gift on Lumigift! 🎁\n` +
      `Register to claim it: ${claimLink}\n` +
      `Valid for 30 days.`,
    type: "plain",
    channel: "generic",
    api_key: serverConfig.termii.apiKey,
  });
}

/**
 * Sends an upcoming-occasion reminder with a deep link to start a new gift.
 *
 * @param phone - E.164-formatted destination phone number.
 * @param contactName - User-chosen label for the contact (e.g. "Mum").
 * @param label - Occasion label (e.g. "Birthday").
 * @param occasionId - Used to build the deep link and opt-out link.
 */
export async function sendOccasionReminder(
  phone: string,
  contactName: string,
  label: string,
  occasionId: string
): Promise<void> {
  const giftLink = `${serverConfig.app.url}/send?recipientName=${encodeURIComponent(contactName)}&occasion=${encodeURIComponent(occasionId)}`;

  await termiiClient.post("/sms/send", {
    to: phone,
    from: serverConfig.termii.senderId,
    sms:
      `Reminder: ${contactName}'s ${label} is in 7 days! 🎉\n` +
      `Send a Lumigift: ${giftLink}\n` +
      `Manage reminders: ${serverConfig.app.url}/dashboard/occasions`,
    type: "plain",
    channel: "generic",
    api_key: serverConfig.termii.apiKey,
  });
}

/**
 * Notifies a gift sender that the recipient reacted to their gift.
 *
 * @param phone - Sender's E.164-formatted phone number.
 * @param recipientName - Recipient name as entered on the gift.
 * @param emoji - The reaction emoji.
 * @param giftId - Used to link to the sender's gift detail view.
 */
export async function sendGiftReactionNotification(
  phone: string,
  recipientName: string,
  emoji: string,
  giftId: string
): Promise<void> {
  await termiiClient.post("/sms/send", {
    to: phone,
    from: serverConfig.termii.senderId,
    sms:
      `${recipientName} reacted ${emoji} to your Lumigift!\n` +
      `See their note: ${serverConfig.app.url}/gifts/${giftId}`,
    type: "plain",
    channel: "generic",
    api_key: serverConfig.termii.apiKey,
  });
}
