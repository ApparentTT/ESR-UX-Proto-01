/**
 * The Share menu's copy, the same on every page that has one (property detail, news articles). Client feedback
 * round 2: Copy link, Email, LinkedIn, X, LINE, WeChat; WeChat opens a "Share on WeChat" panel with a QR code
 * placeholder.
 */
import type { ShareCopy } from "@/components/sections/property/ShareMenu";

export const SHARE_COPY: ShareCopy = {
  share: "Share",
  copy: "Copy link",
  copied: "Link copied",
  email: "Email",
  linkedin: "LinkedIn",
  x: "X",
  line: "LINE",
  wechat: "WeChat",
  wechatTitle: "Share on WeChat",
  wechatBody: "Scan with WeChat to share this page.",
  wechatQr: "QR code for this page (placeholder)",
  back: "Back",
  close: "Close",
};
