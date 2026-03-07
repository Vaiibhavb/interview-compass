/**
 * =============================================
 * User Management Page (Admin Only)
 * CRUD operations for system users
 * =============================================
 */

import { useState } from "react";
import { mockUsers } from "@/data/mockData";
import { User, UserRole } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Shield, Code, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const roleIcons: Record<UserRole, React.ElementType> = {
  admin: Shield,
  technical: Code,
  hr: Briefcase,
};

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  technical: "Tech Interviewer",
  hr: "HR Manager",
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  /** Delete user */
  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User removed" });
  };

  /** Save user (add or edit) */
  const handleSave = (data: Partial<User>) => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u)));
      toast({ title: "User updated" });
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "technical",
      };
      setUsers((prev) => [...prev, newUser]);
      toast({ title: "User added" });
    }
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Manage Users</h1>
        <Button onClick={() => { setEditingUser(null); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* User cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => {
          const Icon = roleIcons[u.role];
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingUser(u); setShowForm(true); }} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {roleLabels[u.role]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {showForm && (
          <UserFormModal
            user={editingUser}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditingUser(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/** User form modal */
const UserFormModal = ({
  user, onSave, onClose,
}: {
  user: User | null;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<UserRole>(user?.role || "technical");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, role });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-foreground">{user ? "Edit User" : "Add User"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Role</Label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="admin">Administrator</option>
              <option value="technical">Technical Interviewer</option>
              <option value="hr">HR Manager</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{user ? "Update" : "Add"} User</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UsersPage;
