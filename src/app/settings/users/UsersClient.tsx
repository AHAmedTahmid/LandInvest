"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Mail,
  Key,
  Trash2,
  Edit3,
  Copy,
  Check,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  X,
  AlertTriangle,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  Crown,
  ChevronRight,
  Send,
  MoreHorizontal,
  Info,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  fullName: string;
  roleId: string | null;
  roleName: string;
  isOwner: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  status: string;
  lastLoginAt: string | null;
  createdAt?: string;
};

type Role = {
  id: string;
  name: string;
  description?: string;
};

type Invitation = {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleName: string;
  status: string;
  inviteToken: string;
  expiresAt: string;
};

interface UsersClientProps {
  canManage: boolean;
}

export default function UsersClient({ canManage }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [invited, setInvited] = useState<Invitation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusTab, setStatusTab] = useState<"ALL" | "ACTIVE" | "INVITED" | "INACTIVE">("ALL");

  // Notification Toast State
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Modal States
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [directCreateModalOpen, setDirectCreateModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<{ id: string; fullName: string; email: string } | null>(null);
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: "DEACTIVATE" | "ACTIVATE" | "REMOVE";
    user: User;
  } | null>(null);
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form Inputs
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");

  const [directFullName, setDirectFullName] = useState("");
  const [directEmail, setDirectEmail] = useState("");
  const [directPassword, setDirectPassword] = useState("");
  const [directRoleId, setDirectRoleId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/users");
      const d = await res.json();
      if (d.users) setUsers(d.users);
      if (d.invited) setInvited(d.invited);
      if (d.roles) setRoles(d.roles);
    } catch {
      showToast("error", "Failed to load team members");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Set default role when roles load
  useEffect(() => {
    if (roles.length > 0) {
      if (!inviteRoleId) setInviteRoleId(roles[0].id);
      if (!directRoleId) setDirectRoleId(roles[0].id);
    }
  }, [roles]);

  // Generate strong random password
  const generateStrongPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // 1. Send Invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRoleId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, roleId: inviteRoleId }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Failed to issue invitation");
      } else {
        const link = d.inviteLink || `http://localhost:3000/invite/${d.inviteToken}`;
        setCreatedInviteLink(link);
        showToast("success", `Invitation created for ${inviteEmail}`);
        setInviteEmail("");
        loadData(true);
      }
    } catch {
      showToast("error", "Network error sending invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Direct User Creation
  const handleDirectCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directEmail || !directPassword || !directRoleId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: directEmail,
          fullName: directFullName || directEmail,
          password: directPassword,
          roleId: directRoleId,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Failed to create user account");
      } else {
        showToast("success", `Account created successfully for ${directEmail}`);
        setDirectCreateModalOpen(false);
        setDirectFullName("");
        setDirectEmail("");
        setDirectPassword("");
        loadData(true);
      }
    } catch {
      showToast("error", "Network error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Edit User Profile
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${editModalUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editModalUser.fullName,
          email: editModalUser.email,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Failed to update profile");
      } else {
        showToast("success", "User profile updated successfully");
        setEditModalUser(null);
        loadData(true);
      }
    } catch {
      showToast("error", "Network error updating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Inline Role Change
  const handleChangeRole = async (user: User, newRoleId: string) => {
    if (newRoleId === user.roleId) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: newRoleId }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Failed to reassign role");
      } else {
        const assignedRole = roles.find((r) => r.id === newRoleId);
        showToast("success", `${user.fullName} reassigned to ${assignedRole?.name || "new role"}`);
        loadData(true);
      }
    } catch {
      showToast("error", "Network error changing role");
    }
  };

  // 5. Toggle Active / Deactivate
  const handleConfirmToggleActive = async () => {
    if (!confirmModal || !confirmModal.user) return;
    const u = confirmModal.user;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Action failed");
      } else {
        showToast("success", `${u.fullName} is now ${u.isActive ? "deactivated" : "active"}`);
        setConfirmModal(null);
        loadData(true);
      }
    } catch {
      showToast("error", "Network error updating user status");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Delete / Remove User
  const handleConfirmRemove = async () => {
    if (!confirmModal || !confirmModal.user) return;
    const u = confirmModal.user;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Failed to remove user");
      } else {
        showToast("success", `Removed user account for ${u.email}`);
        setConfirmModal(null);
        loadData(true);
      }
    } catch {
      showToast("error", "Network error deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !resetPasswordVal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/users/${resetModalUser.id}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: resetPasswordVal }),
      });
      const d = await res.json();
      if (!res.ok) {
        showToast("error", d.error || "Password reset failed");
      } else {
        showToast("success", `Password reset for ${resetModalUser.email}. User must change on next login.`);
        setResetModalUser(null);
        setResetPasswordVal("");
        loadData(true);
      }
    } catch {
      showToast("error", "Network error resetting password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Lists
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (statusTab === "ACTIVE" && !u.isActive) return false;
      if (statusTab === "INACTIVE" && u.isActive) return false;
      if (statusTab === "INVITED") return false;

      if (roleFilter !== "ALL" && u.roleId !== roleFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roleName.toLowerCase().includes(q)
      );
    });
  }, [users, statusTab, roleFilter, searchQuery]);

  const filteredInvited = useMemo(() => {
    if (statusTab === "ACTIVE" || statusTab === "INACTIVE") return [];
    return invited.filter((i) => {
      if (roleFilter !== "ALL" && i.roleId !== roleFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return i.email.toLowerCase().includes(q) || i.roleName.toLowerCase().includes(q);
    });
  }, [invited, statusTab, roleFilter, searchQuery]);

  // Macro KPIs
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.isActive).length;
  const pendingInvitesCount = invited.length;
  const rolesCount = roles.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team & User Governance</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Access Control
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization members, security role delegations, active sessions, and multi-tenant credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/settings/roles"
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Manage Roles</span>
          </Link>

          {canManage && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCreatedInviteLink(null);
                  setInviteModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Invite Member</span>
              </button>

              <button
                onClick={() => setDirectCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Directly</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 duration-150 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : toast.type === "error"
              ? "bg-red-50 text-red-900 border-red-200"
              : "bg-indigo-50 text-indigo-900 border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : toast.type === "error" ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <Info className="w-4 h-4 text-indigo-600" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MACRO KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Members
            </span>
            <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {totalUsersCount}
            </span>
            <span className="text-xs text-slate-500">registered users</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span>{activeUsersCount} currently active</span>
          </div>
        </div>

        {/* KPI 2: Active Operators */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Operators
            </span>
            <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tracking-tight">
              {activeUsersCount}
            </span>
            <span className="text-xs text-slate-500">authorized</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Full tenant credentials enabled</span>
          </div>
        </div>

        {/* KPI 3: Pending Invitations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Invites
            </span>
            <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700 tracking-tight">
              {pendingInvitesCount}
            </span>
            <span className="text-xs text-slate-500">awaiting onboarding</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span>Valid tokens for 7 days</span>
          </div>
        </div>

        {/* KPI 4: Security Roles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Configured Roles
            </span>
            <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-700 tracking-tight">
              {rolesCount}
            </span>
            <span className="text-xs text-slate-500">RBAC templates</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span>Granular permission boundaries</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER TABS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusTab("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusTab === "ALL"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({users.length + invited.length})
            </button>
            <button
              onClick={() => setStatusTab("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusTab === "ACTIVE"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active ({activeUsersCount})
            </button>
            {pendingInvitesCount > 0 && (
              <button
                onClick={() => setStatusTab("INVITED")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusTab === "INVITED"
                    ? "bg-white text-amber-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Invited ({pendingInvitesCount})
              </button>
            )}
            <button
              onClick={() => setStatusTab("INACTIVE")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusTab === "INACTIVE"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Deactivated ({users.length - activeUsersCount})
            </button>
          </div>

          {/* Role Dropdown Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-slate-700 font-semibold focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-8 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. ACTIVE MEMBERS TABLE */}
      {statusTab !== "INVITED" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Organization Members</h3>
              <p className="text-xs text-slate-500">
                Authorized accounts with credentialed access to this tenant workspace
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredUsers.length} of {users.length} members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Member Profile</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Security Role</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                      Loading team members...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No members found matching your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                              u.isOwner
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {u.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span>{u.fullName}</span>
                              {u.isOwner && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                  <Crown className="w-3 h-3 text-amber-600" />
                                  <span>Owner</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {u.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>

                      {/* Role Dropdown / Badge */}
                      <td className="py-3 px-4">
                        {canManage && !u.isOwner ? (
                          <select
                            value={u.roleId ?? ""}
                            onChange={(e) => handleChangeRole(u, e.target.value)}
                            className="text-xs font-semibold border border-slate-200 rounded-lg px-2 py-1 bg-white hover:border-slate-300 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                            <Shield className="w-3 h-3 text-slate-500" />
                            <span>{u.roleName}</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              u.isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <span>{u.isActive ? "ACTIVE" : "INACTIVE"}</span>
                          </span>

                          {u.mustChangePassword && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              Must Change PW
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3 px-4">
                        {u.lastLoginAt ? (
                          <div>
                            <div className="text-slate-800 font-medium">
                              {new Date(u.lastLoginAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {new Date(u.lastLoginAt).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Never logged in</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {canManage ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {!u.isOwner && (
                              <button
                                onClick={() =>
                                  setEditModalUser({
                                    id: u.id,
                                    fullName: u.fullName,
                                    email: u.email,
                                  })
                                }
                                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Profile"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {!u.isOwner && (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    type: u.isActive ? "DEACTIVATE" : "ACTIVATE",
                                    user: u,
                                  })
                                }
                                className={`p-1.5 rounded-lg transition-colors ${
                                  u.isActive
                                    ? "text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                                    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                }`}
                                title={u.isActive ? "Deactivate User" : "Activate User"}
                              >
                                {u.isActive ? (
                                  <UserX className="w-3.5 h-3.5" />
                                ) : (
                                  <UserCheck className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {!u.isOwner && (
                              <button
                                onClick={() => {
                                  setResetPasswordVal(generateStrongPassword());
                                  setResetModalUser(u);
                                }}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Reset Password"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {!u.isOwner && (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    type: "REMOVE",
                                    user: u,
                                  })
                                }
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Read-Only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. PENDING INVITATIONS TABLE */}
      {(statusTab === "ALL" || statusTab === "INVITED") && invited.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Pending Onboarding Invitations</h3>
              <p className="text-xs text-slate-500">
                Prospective team members who have been issued secure enrollment invitations
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {filteredInvited.length} pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Invited Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Expiration Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Invitation Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvited.map((inv) => {
                  const inviteUrl = `http://localhost:3000/invite/${inv.inviteToken}`;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-amber-600" />
                          <span>{inv.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                          {inv.roleName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(inv.expiresAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                          PENDING ACCEPTANCE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteUrl);
                            showToast("success", `Copied invite link for ${inv.email}`);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>Copy Link</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}

      {/* 1. INVITE MEMBER MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Mail className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Invite New Member</h3>
                  <p className="text-xs text-slate-500">Send an enrollment link valid for 7 days</p>
                </div>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdInviteLink ? (
              <div className="p-6 space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Invitation Generated Successfully</span>
                  </div>
                  <p>Share this secure one-time onboarding link with the member:</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-700 truncate">{createdInviteLink}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdInviteLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg shadow-2xs text-slate-800"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setCreatedInviteLink(null);
                      setInviteModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assign Security Role *
                  </label>
                  <select
                    value={inviteRoleId}
                    onChange={(e) => setInviteRoleId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Generating..." : "Generate Invite"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. DIRECT ACCOUNT CREATION MODAL */}
      {directCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Direct User Creation</h3>
                  <p className="text-xs text-slate-500">Add user immediately with a temporary password</p>
                </div>
              </div>
              <button
                onClick={() => setDirectCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Rafiqul Islam"
                  value={directFullName}
                  onChange={(e) => setDirectFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@domain.com"
                  value={directEmail}
                  onChange={(e) => setDirectEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Temporary Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setDirectPassword(generateStrongPassword())}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={directPassword}
                    onChange={(e) => setDirectPassword(e.target.value)}
                    className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-200 rounded-xl pr-9 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Security Role *
                </label>
                <select
                  value={directRoleId}
                  onChange={(e) => setDirectRoleId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 font-semibold"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                The user will be required to change this temporary password upon first login.
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDirectCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EDIT USER MODAL */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Member Profile</h3>
                  <p className="text-xs text-slate-500">Update display name or primary email</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editModalUser.fullName}
                  onChange={(e) =>
                    setEditModalUser({ ...editModalUser, fullName: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editModalUser.email}
                  onChange={(e) =>
                    setEditModalUser({ ...editModalUser, email: e.target.value })
                  }
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. RESET PASSWORD MODAL */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                  <Key className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Reset User Password</h3>
                  <p className="text-xs text-slate-500">Issue a new temporary password</p>
                </div>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="text-slate-500">Resetting credentials for:</div>
                <div className="font-bold text-slate-900 mt-0.5">{resetModalUser.fullName}</div>
                <div className="font-mono text-slate-400 text-[11px]">{resetModalUser.email}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    New Temporary Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetPasswordVal(generateStrongPassword())}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-200 rounded-xl pr-9 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <p className="font-bold">Important Security Notice:</p>
                <p>
                  The user will be required to change this temporary password immediately upon their next login.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Commit Password Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CONFIRMATION DEACTIVATE / REMOVE MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span
                  className={`p-2.5 rounded-xl ${
                    confirmModal.type === "REMOVE"
                      ? "bg-red-100 text-red-700"
                      : confirmModal.type === "DEACTIVATE"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {confirmModal.type === "REMOVE" ? (
                    <Trash2 className="w-5 h-5" />
                  ) : confirmModal.type === "DEACTIVATE" ? (
                    <UserX className="w-5 h-5" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {confirmModal.type === "REMOVE"
                      ? "Remove Team Member"
                      : confirmModal.type === "DEACTIVATE"
                      ? "Deactivate User"
                      : "Reactivate User"}
                  </h3>
                  <p className="text-xs text-slate-500">Security confirmation required</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {confirmModal.type === "REMOVE" ? (
                  <>
                    Are you sure you want to permanently delete the account for{" "}
                    <strong className="text-slate-900">{confirmModal.user.fullName}</strong> (
                    <span className="font-mono">{confirmModal.user.email}</span>)? All tenant role
                    delegations will be severed immediately.
                  </>
                ) : confirmModal.type === "DEACTIVATE" ? (
                  <>
                    Deactivating <strong className="text-slate-900">{confirmModal.user.fullName}</strong>{" "}
                    will immediately revoke access to the workspace. Account data and historical audit trails
                    will be preserved.
                  </>
                ) : (
                  <>
                    Reactivating <strong className="text-slate-900">{confirmModal.user.fullName}</strong> will
                    restore their access to the workspace under role{" "}
                    <strong className="text-slate-900">{confirmModal.user.roleName}</strong>.
                  </>
                )}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={
                    confirmModal.type === "REMOVE"
                      ? handleConfirmRemove
                      : handleConfirmToggleActive
                  }
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl disabled:opacity-50 ${
                    confirmModal.type === "REMOVE"
                      ? "bg-red-600 hover:bg-red-700"
                      : confirmModal.type === "DEACTIVATE"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {isSubmitting
                    ? "Processing..."
                    : confirmModal.type === "REMOVE"
                    ? "Delete Account"
                    : confirmModal.type === "DEACTIVATE"
                    ? "Deactivate Account"
                    : "Activate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
