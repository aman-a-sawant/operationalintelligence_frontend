import React, { useState, useEffect } from 'react';
import {
  analyzeProject,
  chatWithCopilot,
  runOperationsAgents,
  getLatestReport
} from '../../api/aiCopilotApi';
import './AICopilotDrawer.css';

export default function AICopilotDrawer({ isOpen, onClose, projectId, projectName }) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'summary' | 'health'
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [agentResults, setAgentResults] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your AI Copilot. Ask me anything about project '${projectName || 'Observability Target'}' health, telemetry metrics, failing endpoints, or latency bottlenecks.`,
      evidence: [],
      referencedMetrics: [],
      recommendations: []
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch initial analysis report when drawer opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchReportAndAgents();
    }
  }, [isOpen, projectId]);

  const fetchReportAndAgents = async () => {
    setLoading(true);
    try {
      const [repData, agentData] = await Promise.all([
        getLatestReport(projectId).catch(() => null),
        runOperationsAgents(projectId).catch(() => null)
      ]);
      if (repData) setReport(repData);
      if (agentData) setAgentResults(agentData);
    } catch (err) {
      console.error('Failed to load Copilot data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const newReport = await analyzeProject(projectId);
      const newAgents = await runOperationsAgents(projectId);
      setReport(newReport);
      setAgentResults(newAgents);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = async (questionText) => {
    const q = questionText || inputQuestion;
    if (!q || !q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setChatLoading(true);

    try {
      const response = await chatWithCopilot(projectId, q);
      const aiMsg = {
        sender: 'ai',
        text: response.answer,
        evidence: response.evidence || [],
        referencedMetrics: response.referencedMetrics || [],
        recommendations: response.recommendations || []
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Apologies, I encountered an issue analyzing telemetry data. Please try again.',
          evidence: [],
          referencedMetrics: [],
          recommendations: []
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  const promptSuggestions = [
    'Why is backend health low?',
    'Which endpoint is failing most?',
    'What is causing latency?',
    'What should I fix first?',
    'Show active incidents'
  ];

  return (
    <div className="copilot-overlay">
      <div className="copilot-backdrop" onClick={onClose} />
      <div className="copilot-drawer-container">
        {/* Drawer Header */}
        <div className="copilot-header">
          <div className="copilot-header-title">
            <div className="copilot-ai-badge">
              <span>AI Copilot</span>
            </div>
            <div>
              <h2 className="copilot-title">AI Copilot & Operations Agents</h2>
              <span className="copilot-subtitle">{projectName || 'Project Analytics'}</span>
            </div>
          </div>

          <div className="copilot-header-actions">
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="copilot-analyze-btn"
            >
              {analyzing ? 'Analyzing...' : 'Re-Analyze Project'}
            </button>
            <button onClick={onClose} className="copilot-close-btn">
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="copilot-tab-nav">
          <button
            onClick={() => setActiveTab('chat')}
            className={activeTab === 'chat' ? 'copilot-tab-btn-active' : 'copilot-tab-btn'}
          >
            Copilot Chat
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={activeTab === 'summary' ? 'copilot-tab-btn-active' : 'copilot-tab-btn'}
          >
            Exec Summary
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={activeTab === 'health' ? 'copilot-tab-btn-active' : 'copilot-tab-btn'}
          >
            Failure Analysis Agent
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="copilot-body">
          {loading && (
            <div className="copilot-loading-box">
              <div className="copilot-spinner"></div>
              <p style={{ color: '#94a3b8', marginTop: 12 }}>Gathering operational telemetry & running AI Agents...</p>
            </div>
          )}

          {!loading && (
            <>
              {/* TAB 1: COPILOT CHAT */}
              {activeTab === 'chat' && (
                <div className="copilot-chat-section">
                  <div className="copilot-suggestions-container">
                    <span className="copilot-suggestion-label">Suggested Questions:</span>
                    <div className="copilot-suggestions-list">
                      {promptSuggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="copilot-suggestion-chip"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="copilot-message-list">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={msg.sender === 'user' ? 'copilot-user-msg-row' : 'copilot-ai-msg-row'}
                      >
                        <div className={msg.sender === 'user' ? 'copilot-user-bubble' : 'copilot-ai-bubble'}>
                          <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.85rem' }}>
                            {msg.sender === 'user' ? 'You' : 'AI Copilot'}
                          </div>
                          <p style={{ margin: 0, lineHeight: 1.5 }}>{msg.text}</p>

                          {/* Evidence Items */}
                          {msg.evidence && msg.evidence.length > 0 && (
                            <div className="copilot-evidence-card">
                              <div className="copilot-evidence-title">Grounded Evidence:</div>
                              <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, color: '#cbd5e1' }}>
                                {msg.evidence.map((ev, i) => (
                                  <li key={i} style={{ fontSize: '0.85rem' }}>{ev}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Referenced Metrics Badges */}
                          {msg.referencedMetrics && msg.referencedMetrics.length > 0 && (
                            <div className="copilot-metric-tags-row">
                              {msg.referencedMetrics.map((met, i) => (
                                <span key={i} className="copilot-metric-tag">
                                  {met}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Recommendations */}
                          {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="copilot-rec-card">
                              <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.85rem' }}>Recommended Action:</div>
                              <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, color: '#e2e8f0' }}>
                                {msg.recommendations.map((r, i) => (
                                  <li key={i} style={{ fontSize: '0.85rem' }}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="copilot-ai-msg-row">
                        <div className="copilot-ai-bubble">
                          <div className="copilot-typing-indicator">Analyzing context metrics...</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Box */}
                  <div className="copilot-chat-input-row">
                    <input
                      type="text"
                      placeholder="Ask AI Copilot about health, latency, or recommendations..."
                      value={inputQuestion}
                      onChange={(e) => setInputQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="copilot-chat-input"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={chatLoading || !inputQuestion.trim()}
                      className="copilot-send-btn"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: EXECUTIVE SUMMARY */}
              {activeTab === 'summary' && (
                <div className="copilot-content-section">
                  <div className="copilot-card-header">
                    <h3>Executive Operational Overview</h3>
                    <span className={report?.overallAssessment?.includes('Critical') ? 'copilot-badge-critical' : 'copilot-badge-healthy'}>
                      {report?.overallAssessment || 'Healthy'}
                    </span>
                  </div>

                  <div className="copilot-card">
                    <h4 className="copilot-section-heading">Summary Narrative</h4>
                    <p className="copilot-paragraph">{report?.summary || 'No report generated yet. Click Re-Analyze Project above.'}</p>
                  </div>

                  <div className="copilot-card">
                    <h4 className="copilot-section-heading">Key Empirical Findings</h4>
                    <ul className="copilot-bullet-list">
                      {report?.keyFindings?.map((kf, i) => (
                        <li key={i}>{kf}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="copilot-card">
                    <h4 className="copilot-section-heading">Top Risk Factors</h4>
                    {report?.risks?.map((r, i) => (
                      <div key={i} className="copilot-risk-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <strong style={{ color: '#f87171' }}>{r.risk}</strong>
                          <span className="copilot-badge-critical">{r.severity}</span>
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#cbd5e1' }}>{r.impact}</p>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Proof: {r.evidence}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: FAILURE ANALYSIS AGENT */}
              {activeTab === 'health' && (() => {
                const failureData = agentResults?.failureAgent || report?.agentOutputs?.failureAgent;
                const severity = failureData?.severity || 'Low';

                const getSeverityBadgeClass = (sev) => {
                  switch (sev) {
                    case 'Critical':
                      return 'copilot-badge-critical';
                    case 'High':
                      return 'copilot-badge-high';
                    case 'Medium':
                      return 'copilot-badge-medium';
                    case 'Low':
                    default:
                      return 'copilot-badge-healthy';
                  }
                };

                const summaryText = severity === 'Low' && (!failureData?.summary || failureData.summary.includes('Healthy'))
                  ? 'System operating normally. No significant failure patterns detected.'
                  : (failureData?.summary || failureData?.failureSummary || 'No failure analysis summary generated.');

                const rootCausesList = failureData?.rootCauses || [];
                const businessImpactList = failureData?.businessImpact || [];
                const recsList = failureData?.recommendations || [];

                return (
                  <div className="copilot-content-section">
                    <div className="copilot-agent-header">
                      <div>
                        <h3 style={{ margin: 0 }}>Failure Analysis Agent</h3>
                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                          Agentic Operational Intelligence: Severity, Root Causes, Business Impact & Remediation
                        </span>
                      </div>
                      <div className={getSeverityBadgeClass(severity)}>
                        Severity: {severity}
                      </div>
                    </div>

                    {/* Operational Summary */}
                    <div className="copilot-card">
                      <h4 className="copilot-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Operational Summary
                        {failureData?.isLLMEnhanced && (
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 700, background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
                            color: '#fff', padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.05em'
                          }}>LLM Enhanced</span>
                        )}
                      </h4>
                      <p className="copilot-paragraph">{summaryText}</p>
                    </div>

                    {/* Underlying Root Causes */}
                    <div className="copilot-card">
                      <h4 className="copilot-section-heading">Underlying Root Causes</h4>
                      {rootCausesList.length > 0 && severity !== 'Low' ? (
                        <ul className="copilot-bullet-list">
                          {rootCausesList.map((cause, i) => (
                            <li key={i} style={{ color: severity === 'Critical' ? '#f87171' : severity === 'High' ? '#fb923c' : '#fbbf24' }}>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#4ade80', margin: 0 }}>
                          System operating normally. No significant failure patterns detected.
                        </p>
                      )}
                    </div>

                    {/* Business Impact Analysis */}
                    <div className="copilot-card">
                      <h4 className="copilot-section-heading">Business Impact Analysis</h4>
                      {businessImpactList.length > 0 ? (
                        <ul className="copilot-bullet-list">
                          {businessImpactList.map((impact, i) => (
                            <li key={i} style={{ color: '#cbd5e1' }}>{impact}</li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#94a3b8', margin: 0 }}>Zero business impact detected.</p>
                      )}
                    </div>

                    {/* Prioritized Remediation Actions */}
                    <div className="copilot-card">
                      <h4 className="copilot-section-heading">Prioritized Remediation Actions</h4>
                      {recsList.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {recsList.map((rec, i) => {
                            const prio = typeof rec === 'string' ? 'Medium' : (rec.priority || 'Medium');
                            const act = typeof rec === 'string' ? rec : (rec.action || rec.description || rec.actionItem);
                            const badgeClass = prio === 'High' ? 'copilot-badge-critical' : prio === 'Medium' ? 'copilot-badge-medium' : 'copilot-badge-healthy';
                            return (
                              <div key={i} className="copilot-risk-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <span className={badgeClass}>{prio} Priority</span>
                                </div>
                                <div style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>{act}</div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ color: '#94a3b8', margin: 0 }}>No remediation actions required.</p>
                      )}
                    </div>
                  </div>
                );
              })()}

            </>
          )}
        </div>
      </div>
    </div>
  );
}
