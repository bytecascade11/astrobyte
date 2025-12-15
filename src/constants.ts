import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "Pinterest",
    href: "https://pin.it/1NYS28vrR",
    linkTitle: "Follow on Pinterest",
    icon: IconPinterest,
  },
  {
    name: "GitHub",
    href: "https://github.com/bytecascade11",
    linkTitle: "GitHub Profile",
    icon: IconGitHub,
  },
  {
    name: "Mail",
    href: "mailto:revibyte20@gmail.com",
    linkTitle: "Send an email to ReviByte",
    icon: IconMail,
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VbCkS8A0VycDCCgaii1x",
    linkTitle: "Join WhatsApp Channel",
    icon: IconWhatsapp,
  },
] as const;

// You can leave SHARE_LINKS as is (it's for post sharing buttons) or customize later
export const SHARE_LINKS: Social[] = [
  // ... keep the original or update if needed
] as const;
