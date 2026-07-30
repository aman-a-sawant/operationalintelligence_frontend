import React, { useState } from 'react';
import { Users, Mail, Plus, Trash2, Send, RefreshCw, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { resendInvitationApi, removeInvitationApi } from '../../../api/projectOnboardingApi';

const mockTeamAssignments = [
  { id: 'tm_1', email: 'owner@company.com', role: 'Owner', department: 'Engineering Leadership', status: 'Accepted' },
  { id: 'tm_2', email: 'admin@company.com', role: 'Admin', department: 'DevOps & Platform Engineering', status: 'Pending' },
  { id: 'tm_3', email: 'sre-lead@company.com', role: 'Member', department: 'Site Reliability Engineering', status: 'Pending' },
  { id: 'tm_4', email: 'qa-lead@company.com', role: 'Member', department: 'Quality Assurance', status: 'Expired' }
];

export default function Step7TeamAssignment({ data = mockTeamAssignments, updateData }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [department, setDepartment] = useState('Engineering');
  const [resendingId, setResendingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleInvite = () => {
    if (!email.trim()) return;
    const newMember = {
      id: `tm_${Date.now()}`,
      email: email.trim(),
      role,
      department,
      status: 'Pending'
    };
    updateData([...data, newMember]);
    setEmail('');
    showToast(`Invitation sent to ${email.trim()}`);
  };

  const handleResend = async (id, memberEmail) => {
    setResendingId(id);
    await resendInvitationApi(id);
    updateData(
      data.map((m) => (m.id === id ? { ...m, status: 'Pending' } : m))
    );
    setResendingId(null);
    showToast(`Resent invitation email to ${memberEmail}`);
  };

  const handleRemove = async (id) => {
    await removeInvitationApi(id);
    updateData(data.filter((m) => m.id !== id));
    showToast('Removed team invitation');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'Accepted':
        return {
          label: 'Accepted',
          cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'Pending':
        return {
          label: 'Pending',
          cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: Clock
        };
      case 'Expired':
        return {
          label: 'Expired',
          cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: AlertTriangle
        };
      case 'Declined':
        return {
          label: 'Declined',
          cls: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: XCircle
        };
      default:
        return {
          label: status,
          cls: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-purple-900/90 border border-purple-400/40 text-purple-200 text-xs font-semibold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Team Invitations</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Invite team members to manage and monitor this project with role-based access permissions.</p>
        </div>

        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono self-start sm:self-auto">
          POST /api/users/invite
        </span>
      </div>

      {/* Invite Member Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Invite New Teammate</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            >
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Department</label>
            <input
              type="text"
              placeholder="e.g. SRE / DevOps"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleInvite}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Invitation Email</span>
        </button>
      </div>

      {/* Team Invitation Table */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">User Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Invitation Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
            {data.map((m) => {
              const chip = getStatusChip(m.status);
              const ChipIcon = chip.icon;
              const isResending = resendingId === m.id;

              return (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>{m.email}</span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      m.role === 'Owner' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      m.role === 'Admin' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {m.role}
                    </span>
                  </td>

                  <td className="p-3 text-slate-400">{m.department || 'Engineering'}</td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${chip.cls}`}>
                      <ChipIcon className="w-3 h-3" />
                      <span>{chip.label}</span>
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {m.status !== 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => handleResend(m.id, m.email)}
                          disabled={isResending}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[10px] font-semibold flex items-center gap-1 transition-colors border border-slate-700"
                        >
                          <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                          <span>Resend Invite</span>
                        </button>
                      )}

                      {m.role !== 'Owner' && (
                        <button
                          type="button"
                          onClick={() => handleRemove(m.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove Invitation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
