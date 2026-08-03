import React, { useState, useEffect } from 'react';
import { getLatestReport, analyzeProject } from '../../api/aiCopilotApi';

export default function AIInsightsCard({ projectId, onOpenCopilot }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadReport();
    }
  }, [projectId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await getLatestReport(projectId);
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch AI report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReAnalyze = async () => {
    setAnalyzing(true);
    try {
      const freshReport = await analyzeProject(projectId);
      setReport(freshReport);
    } catch (err) {
      console.error('Re-analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const topRisk = report?.risks?.[0];
  const topRecommendation = report?.recommendations?.[0];

  return (
    <div style={styles.cardContainer}>
      {/* Card Header */}
      <div style={styles.header}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.aiBadge}>
            <span>AI COPILOT</span>
          </div>
          <div>
            <h3 style={styles.title}>Project Intelligence & AI Insights</h3>
            <span style={styles.subtext}>
              {report?.generatedAt
                ? `Last Analysis: ${new Date(report.generatedAt).toLocaleTimeString()}`
                : 'Automated Real-Time Telemetry Analysis'}
            </span>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={handleReAnalyze}
            disabled={analyzing}
            style={analyzing ? { ...styles.analyzeBtn, opacity: 0.6 } : styles.analyzeBtn}
          >
            {analyzing ? 'Analyzing...' : 'Re-Analyze'}
          </button>
          <button onClick={onOpenCopilot} style={styles.openCopilotBtn}>
            Ask AI Copilot
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={styles.body}>
        {loading ? (
          <div style={styles.loadingText}>Generating AI Observability Summary...</div>
        ) : (
          <>
            {/* Assessment Narrative */}
            <div style={styles.summaryBox}>
              <div style={styles.assessmentRow}>
                <span style={styles.assessmentLabel}>AI Assessment:</span>
                <span
                  style={
                    report?.overallAssessment?.includes('Critical')
                      ? styles.criticalBadge
                      : styles.healthyBadge
                  }
                >
                  {report?.overallAssessment || 'Healthy'}
                </span>
              </div>
              <p style={styles.summaryParagraph}>
                {report?.summary ||
                  'AI Copilot monitors real-time probe checks, latency metrics, and error rates to deliver grounded telemetry explanations.'}
              </p>
            </div>

            {/* Quick Insights Grid */}
            <div style={styles.insightsGrid}>
              {/* Top Risk */}
              <div style={styles.insightBox}>
                <div style={styles.boxTitle}>
                  <span style={{ color: '#f87171' }}>Top Operational Risk</span>
                  {topRisk?.severity && <span style={styles.sevTag}>{topRisk.severity}</span>}
                </div>
                <div style={styles.boxText}>
                  {topRisk?.risk || 'No critical risk factors detected.'}
                </div>
                {topRisk?.impact && (
                  <div style={styles.boxSubtext}>Impact: {topRisk.impact}</div>
                )}
              </div>

              {/* Top Recommendation */}
              <div style={styles.insightBox}>
                <div style={styles.boxTitle}>
                  <span style={{ color: '#34d399' }}>Priority Recommendation</span>
                  {topRecommendation?.priority && (
                    <span style={styles.prioTag}>{topRecommendation.priority}</span>
                  )}
                </div>
                <div style={styles.boxText}>
                  {topRecommendation?.title || 'Maintain current monitoring baseline.'}
                </div>
                {topRecommendation?.actionItem && (
                  <div style={styles.boxSubtext}>Action: {topRecommendation.actionItem}</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '14px',
    borderBottom: '1px solid #334155'
  },
  headerTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  aiBadge: {
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fff'
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#f8fafc'
  },
  subtext: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  analyzeBtn: {
    padding: '8px 14px',
    background: '#1e293b',
    border: '1px solid #475569',
    color: '#e2e8f0',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer'
  },
  openCopilotBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '12px 0'
  },
  summaryBox: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '14px 16px'
  },
  assessmentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  assessmentLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#94a3b8'
  },
  healthyBadge: {
    padding: '3px 8px',
    background: 'rgba(74, 222, 128, 0.15)',
    color: '#4ade80',
    border: '1px solid #4ade80',
    borderRadius: '10px',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  criticalBadge: {
    padding: '3px 8px',
    background: 'rgba(248, 113, 113, 0.15)',
    color: '#f87171',
    border: '1px solid #f87171',
    borderRadius: '10px',
    fontSize: '0.75rem',
    fontWeight: 600
  },
  summaryParagraph: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#cbd5e1',
    lineHeight: 1.5
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  insightBox: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  boxTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '0.85rem'
  },
  boxText: {
    fontSize: '0.9rem',
    color: '#f8fafc',
    fontWeight: 500
  },
  boxSubtext: {
    fontSize: '0.8rem',
    color: '#94a3b8'
  },
  sevTag: {
    padding: '2px 6px',
    background: '#7f1d1d',
    color: '#fca5a5',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700
  },
  prioTag: {
    padding: '2px 6px',
    background: '#064e3b',
    color: '#6ee7b7',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 700
  }
};
