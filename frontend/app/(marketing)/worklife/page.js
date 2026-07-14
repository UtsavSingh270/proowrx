import WorkLifeClient from "./WorkLifeClient";
import { serverWorkLife } from '../../../lib/serverApi';

export const metadata = {
  title: "WorkLife@Proowrx | Company Culture",
  description:
    "Explore life at Proowrx through office events, team celebrations, employee culture and behind-the-scenes videos.",

  alternates: {
    canonical: "/worklife",
  },

  openGraph: {
    title: "Life Inside Proowrx",
    description:
      "Explore our company culture through photos and videos.",
    images: [
      "/images/worklife-cover.jpg",
    ],
  },

  twitter: {
    card: "summary_large_image",
  },
};

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({
"@context":"https://schema.org",
"@type":"ImageGallery",
name:"WorkLife@Proowrx"
})
}}
/>

export default async function Page() {
  const items = await serverWorkLife.getAll().catch(() => []);

  return <WorkLifeClient initialItems={items} />;
}
