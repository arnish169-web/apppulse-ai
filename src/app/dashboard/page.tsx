import { redirect } from "next/navigation";
import { createClient } from "@libsql/client";

// Turso DB singleton
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function getSession(sessionId: string) {
  try {
    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { session_id?: string; cancel?: string };
}) {
  let customerEmail = "";
  let plan = "";
  let status = "";

  if (searchParams.cancel) {
    return (
      <div className="min-h-screen bg-[#0B1121] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-gray-400 mb-8">No worries — you can try again anytime.</p>
          <a href="/pricing" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition">
            View Plans
          </a>
        </div>
      </div>
    );
  }

  if (searchParams.session_id) {
    const session = await getSession(searchParams.session_id);
    if (session) {
      customerEmail = session.customer_email || session.customer_details?.email || "";
      const priceId = session.line_items?.data?.[0]?.price?.id;
      const planMap: Record<string, string> = {
        [process.env.STRIPE_PRICE_ID_STARTER || ""]: "Starter",
        [process.env.STRIPE_PRICE_ID_GROWTH || ""]: "Growth",
        [process.env.STRIPE_PRICE_ID_STUDIO || ""]: "Studio",
      };
      plan = planMap[priceId] || "Starter";
      status = session.subscription_status || "active";
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1121] text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-xl">AppPulse AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{customerEmail}</span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-600/30">
            {plan} Plan
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            {status === "trialing" ? "You're on your free trial! 🎉" : "Welcome to AppPulse AI! 🎉"}
          </h1>
          <p className="text-gray-400 text-lg">
            {status === "trialing"
              ? `Your ${plan} trial is active for 30 days. We'll send your first report soon.`
              : `Your ${plan} plan is active. Start monitoring your competitors.`}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold">Subscription</span>
            </div>
            <p className="text-2xl font-bold text-green-400 capitalize">{status === "trialing" ? "Trial Active" : status}</p>
            <p className="text-sm text-gray-500 mt-1">30-day free trial</p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold">Plan</span>
            </div>
            <p className="text-2xl font-bold">{plan}</p>
            <p className="text-sm text-gray-500 mt-1">
              {plan === "Starter" && "10 keywords, 5 competitors"}
              {plan === "Growth" && "25 keywords, 15 competitors"}
              {plan === "Studio" && "Unlimited everything"}
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-semibold">Next Report</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">Soon</p>
            <p className="text-sm text-gray-500 mt-1">First report within 7 days</p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">📊 Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-semibold">We'll scrape the Shopify App Store daily</p>
                <p className="text-sm text-gray-500">Starting this week, our pipeline will collect ranking data for your keywords every 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-semibold">Add your app to the monitor</p>
                <p className="text-sm text-gray-500">Soon you'll have a dashboard to add your app URL and competitors to track.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-semibold">Get weekly ranking reports via email</p>
                <p className="text-sm text-gray-500">We'll email you a digest every week with rank changes, new competitors, and opportunities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">🚀 Coming Soon</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">•</span> Full dashboard with live rankings
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">•</span> Add your app and competitors to track
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">•</span> Keyword rank alerts (email + Slack)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-indigo-400">•</span> Daily snapshots for Growth/Studio
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}// force redeploy
