import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  AlertCircle,
  FileQuestion,
} from 'lucide-react';

export const GovernanceInsightsView: React.FC = () => {

  const violationCounts = [
    { name: 'Obsolete Product Name (CloudLens)', count: 24, fill: '#9B382B' },
    { name: 'Absolute Security & Reliability', count: 18, fill: '#8C6228' },
    { name: 'Unsubstantiated Superlatives', count: 15, fill: '#73716B' },
    { name: 'Non-Descriptive Link (click here)', count: 12, fill: '#455A64' },
    { name: 'Defamatory Competitor Naming', count: 9, fill: '#5C5B57' },
    { name: 'Corporate Buzzwords & Jargon', count: 8, fill: '#2D5A38' },
  ];

  const disputedRulesData = [
    { rule: 'RULE-002: Banned Superlatives', disputes: 11, clarityScore: 'Low (Refine Text)', owner: 'Legal' },
    { rule: 'RULE-008: Competitor Naming', disputes: 7, clarityScore: 'Medium', owner: 'Legal' },
    { rule: 'RULE-004: Official Tagline', disputes: 5, clarityScore: 'High', owner: 'Brand Lead' },
    { rule: 'RULE-011: Pricing Transparency', disputes: 4, clarityScore: 'High', owner: 'Legal' },
  ];

  const missingEvidenceData = [
    { claimType: 'Extreme Speed (100x / 10x ROI)', occurrences: 14, status: 'No Lab Benchmark' },
    { claimType: 'Zero Telemetry Data Collection', occurrences: 9, status: 'Privacy Policy Conflict' },
    { claimType: 'Instantaneous Ingestion', occurrences: 7, status: 'Requires Citation' },
    { claimType: '100% Cloud Migration Safety', occurrences: 5, status: 'Needs VP Signoff' },
  ];

  const reviewTimeTrends = [
    { week: 'Wk 38', avgHours: 18.4, target: 4.0 },
    { week: 'Wk 39', avgHours: 14.2, target: 4.0 },
    { week: 'Wk 40', avgHours: 12.0, target: 4.0 },
    { week: 'Wk 41', avgHours: 8.5, target: 4.0 },
    { week: 'Wk 42', avgHours: 5.1, target: 4.0 },
    { week: 'Wk 43 (Current)', avgHours: 3.4, target: 4.0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-8 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">
              METRICS // 06
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#171717] border border-[#D8D5CE] px-1.5 py-0.2 bg-[#F7F6F2]">
              HEURISTIC FEEDBACK LOOP
            </span>
          </div>

          <h1 className="font-serif text-3xl text-[#171717]">Governance Insights & Policy Evolution</h1>
          <p className="text-xs text-[#73716B] leading-relaxed">
            BrandGuard closes the organizational learning loop by analyzing recurring creator violations, pinpointing directives with high dispute frequencies, and flagging missing empirical benchmarks before publication bottlenecks occur.
          </p>
        </div>
      </div>

      {/* Governance Feedback Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#9B382B]">
            <AlertCircle className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              Policy Ambiguity: Refine RULE-002 (Superlatives)
            </span>
          </div>
          <p className="text-xs text-[#5C5B57] leading-relaxed">
            <strong className="text-[#171717]">11 disputes recorded</strong> in the past 30 days. Creators report friction delineating between acceptable executive quotes and prohibited marketing superlatives.
          </p>
          <div className="text-[11px] font-mono text-[#171717] bg-[#F7F6F2] p-3 border border-[#D8D5CE]">
            RECOMMENDATION: Introduce explicit verbatim quote carve-out guidance in Directive v1.5.
          </div>
        </div>

        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#8C6228]">
            <FileQuestion className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              Evidence Gap: Multi-Cloud Benchmark Required
            </span>
          </div>
          <p className="text-xs text-[#5C5B57] leading-relaxed">
            <strong className="text-[#171717]">14 drafts arrested</strong> for unverified claims of "100x speed multipliers". The active corpus substantiates only 10x query throughput (TECHVALIDATE-BM-2024).
          </p>
          <div className="text-[11px] font-mono text-[#171717] bg-[#F7F6F2] p-3 border border-[#D8D5CE]">
            RECOMMENDATION: Product Marketing to commission certified 2025 multi-cloud performance study.
          </div>
        </div>
      </div>

      {/* KPI Velocity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-[#D8D5CE] bg-[#FFFFFF] divide-y sm:divide-y-0 sm:divide-x divide-[#D8D5CE]">
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">Average Review Turnaround</p>
          <p className="font-serif text-3xl text-[#171717] mt-1">3.4 Hours</p>
          <p className="text-[11px] font-mono text-[#2D5A38] mt-1">↓ 81% reduction from 18.4h baseline</p>
        </div>
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">Automated Pre-Screen Coverage</p>
          <p className="font-serif text-3xl text-[#171717] mt-1">100%</p>
          <p className="text-[11px] font-mono text-[#73716B] mt-1">All text evaluated before publication</p>
        </div>
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">Post-Approval Hash Tampering</p>
          <p className="font-serif text-3xl text-[#171717] mt-1">0 Released</p>
          <p className="text-[11px] font-mono text-[#2D5A38] mt-1">100% caught by automatic seal listener</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Repeated Violations Chart */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#D8D5CE]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">FREQUENCY ANALYSIS</span>
              <h3 className="font-serif text-xl text-[#171717]">Recurring Rule Infractions</h3>
            </div>
            <span className="text-[11px] font-mono text-[#73716B]">
              LAST 60 DAYS
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationCounts} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#73716B', fontFamily: 'monospace' }} stroke="#D8D5CE" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: '#171717' }} stroke="#D8D5CE" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', color: '#F7F6F2', border: '1px solid #171717', borderRadius: '0px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                  {violationCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Review Bottleneck Time Trend */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF] p-6">
          <div className="flex items-baseline justify-between mb-6 pb-2 border-b border-[#D8D5CE]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">CYCLE VELOCITY</span>
              <h3 className="font-serif text-xl text-[#171717]">Turnaround Duration (Hours)</h3>
            </div>
            <span className="text-[11px] font-mono text-[#2D5A38]">
              −81% LATENCY
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewTimeTrends} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#EAE6DB" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#73716B', fontFamily: 'monospace' }} stroke="#D8D5CE" />
                <YAxis unit="h" tick={{ fontSize: 10, fill: '#73716B', fontFamily: 'monospace' }} stroke="#D8D5CE" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', color: '#F7F6F2', border: '1px solid #171717', borderRadius: '0px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgHours"
                  stroke="#171717"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#171717' }}
                  name="Turnaround Hours"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#2D5A38"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                  name="SLA Target (4h)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables for Unclear Rules and Missing Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unclear Rules Table */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
          <div className="p-5 border-b border-[#D8D5CE] bg-[#F7F6F2]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">DISPUTE INDEX</span>
            <h3 className="font-serif text-xl text-[#171717] mt-0.5">High Dispute Rate Directives</h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFFFF] text-[#73716B] uppercase text-[10px] font-mono border-b border-[#D8D5CE]">
              <tr>
                <th className="py-2.5 px-5">Rule Title</th>
                <th className="py-2.5 px-5">Disputes</th>
                <th className="py-2.5 px-5">Clarity Status</th>
                <th className="py-2.5 px-5">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DB]">
              {disputedRulesData.map((d, i) => (
                <tr key={i} className="hover:bg-[#F7F6F2]/70 transition-colors">
                  <td className="py-3 px-5 font-serif text-sm text-[#171717]">{d.rule}</td>
                  <td className="py-3 px-5 font-mono text-[#8C6228] font-semibold">{d.disputes}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                        d.clarityScore.includes('Low')
                          ? 'border-[#9B382B] text-[#9B382B] bg-[#F6ECEB]'
                          : 'border-[#2D5A38] text-[#2D5A38] bg-[#EEF4EF]'
                      }`}
                    >
                      {d.clarityScore}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-[#73716B]">{d.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Missing Evidence Claims Table */}
        <div className="border border-[#D8D5CE] bg-[#FFFFFF]">
          <div className="p-5 border-b border-[#D8D5CE] bg-[#F7F6F2]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#73716B]">EVIDENCE AUDIT</span>
            <h3 className="font-serif text-xl text-[#171717] mt-0.5">Claims Lacking Certified Provenance</h3>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFFFF] text-[#73716B] uppercase text-[10px] font-mono border-b border-[#D8D5CE]">
              <tr>
                <th className="py-2.5 px-5">Claim Category</th>
                <th className="py-2.5 px-5">Arrested Drafts</th>
                <th className="py-2.5 px-5">Evidence State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DB]">
              {missingEvidenceData.map((m, i) => (
                <tr key={i} className="hover:bg-[#F7F6F2]/70 transition-colors">
                  <td className="py-3 px-5 font-serif text-sm text-[#171717]">{m.claimType}</td>
                  <td className="py-3 px-5 font-mono text-[#9B382B] font-semibold">{m.occurrences}</td>
                  <td className="py-3 px-5 font-mono text-[#73716B] text-[11px]">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};