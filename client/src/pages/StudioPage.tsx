import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FolderKanban,
  Palette,
  Newspaper,
  ShoppingBag,
  Mail,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ImageOff,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ProjectRow {
  id: string;
  title: string;
  category: string | null;
  status: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  featured_order: number | null;
  created_at: string;
}

interface ArtworkRow {
  id: string;
  title: string;
  series: string | null;
  image_url: string | null;
  description: string | null;
  price: number | null;
  sold: boolean | null;
  published: boolean | null;
  created_at: string;
}

interface BlogPostRow {
  id: string;
  title: string;
  category: string | null;
  status: string | null;
  read_time: string | null;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

interface ProductRow {
  id: string;
  name: string;
  price: number | null;
  category: string | null;
  badge: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

interface InquiryRow {
  id: string;
  name: string;
  email: string;
  inquiry_type: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
}

type PanelKey = 'projects' | 'artworks' | 'blog_posts' | 'products' | 'inquiries';

type FormState = Record<string, string>;

interface DeleteTarget {
  table: 'projects' | 'artworks' | 'blog_posts' | 'products';
  id: string;
  label: string;
}

// ============================================================================
// SHARED HELPERS
// ============================================================================

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncate(text: string | null | undefined, len = 80): string {
  if (!text) return '';
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

const emptyProjectForm: FormState = {
  title: '',
  category: '',
  status: 'draft',
  year: '',
  description: '',
  image_url: '',
  link_url: '',
};

const emptyArtworkForm: FormState = {
  title: '',
  series: '',
  image_url: '',
  description: '',
  price: '',
  sold: 'false',
  published: 'true',
};

const emptyBlogForm: FormState = {
  title: '',
  category: '',
  status: 'draft',
  read_time: '',
  excerpt: '',
  content: '',
  image_url: '',
};

const emptyProductForm: FormState = {
  name: '',
  price: '',
  category: '',
  badge: '',
  description: '',
  image_url: '',
};

// ============================================================================
// GENERIC PIECES
// ============================================================================

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center border border-dashed border-[hsl(var(--border))] rounded-xl">
      <AlertCircle className="w-8 h-8 text-red-500" />
      <p className="text-sm text-[hsl(var(--muted-foreground))]">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center border border-dashed border-[hsl(var(--border))] rounded-xl">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">{message}</p>
    </div>
  );
}

function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

function GridSkeleton({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  const colClass = cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-56 w-full rounded-xl" />
      ))}
    </div>
  );
}

/** Debounced-on-blur image preview. Fetches/validates only when the input loses focus. */
function ImageUrlField({
  value,
  onChange,
  label = 'Image URL',
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [previewSrc, setPreviewSrc] = useState<string>(value || '');
  const [previewError, setPreviewError] = useState(false);

  // Keep an initial preview in sync when switching records (e.g. entering edit mode)
  useEffect(() => {
    setPreviewSrc(value || '');
    setPreviewError(false);
  }, [value]);

  const commitPreview = useCallback(() => {
    setPreviewError(false);
    setPreviewSrc(value || '');
  }, [value]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder="https://example.com/image.jpg"
        onChange={(e) => onChange(e.target.value)}
        onBlur={commitPreview}
      />
      {previewSrc ? (
        <div className="mt-2 w-full h-40 rounded-lg overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--muted))] flex items-center justify-center">
          {previewError ? (
            <div className="flex flex-col items-center gap-1 text-[hsl(var(--muted-foreground))]">
              <ImageOff className="w-6 h-6" />
              <span className="text-xs">Couldn't load image</span>
            </div>
          ) : (
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreviewError(true)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

// ============================================================================
// SIDEBAR
// ============================================================================

const SIDEBAR_ITEMS: { key: PanelKey; label: string; icon: typeof FolderKanban }[] = [
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'artworks', label: 'Artworks', icon: Palette },
  { key: 'blog_posts', label: 'Blog Posts', icon: Newspaper },
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'inquiries', label: 'Inquiries', icon: Mail },
];

// ============================================================================
// MAIN PAGE
// ============================================================================

export function StudioPage() {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState<PanelKey>('projects');
  const [unreadInquiries, setUnreadInquiries] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'unread');
      if (!cancelled) setUnreadInquiries(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [activePanel]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-black gradient-text-fire">Studio</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-2">
          Manage projects, artworks, blog posts, products, and inquiries.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {SIDEBAR_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activePanel === key
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {key === 'inquiries' && unreadInquiries > 0 && (
                  <Badge className="bg-red-500 text-white hover:bg-red-500">{unreadInquiries}</Badge>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Panel content */}
        <div className="flex-1 min-w-0">
          {activePanel === 'projects' && <ProjectsPanel toast={toast} />}
          {activePanel === 'artworks' && <ArtworksPanel toast={toast} />}
          {activePanel === 'blog_posts' && <BlogPostsPanel toast={toast} />}
          {activePanel === 'products' && <ProductsPanel toast={toast} />}
          {activePanel === 'inquiries' && (
            <InquiriesPanel toast={toast} onCountChange={setUnreadInquiries} />
          )}
        </div>
      </div>
    </div>
  );
}

type ToastFn = ReturnType<typeof useToast>['toast'];

// ============================================================================
// PROJECTS PANEL
// ============================================================================

function ProjectsPanel({ toast }: { toast: ToastFn }) {
  const [tab, setTab] = useState<'manage' | 'new'>('manage');
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyProjectForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setRows((data as ProjectRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (row: ProjectRow) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? '',
      category: row.category ?? '',
      status: row.status ?? 'draft',
      year: row.year ?? '',
      description: row.description ?? '',
      image_url: row.image_url ?? '',
      link_url: row.link_url ?? '',
    });
    setTab('new');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProjectForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category || null,
      status: form.status || null,
      year: form.year || null,
      description: form.description || null,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
    };

    if (editingId) {
      const { error: err } = await supabase.from('projects').update(payload).eq('id', editingId);
      setSaving(false);
      if (err) {
        toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Updated successfully ✓' });
      resetForm();
      setTab('manage');
      load();
    } else {
      const { error: err } = await supabase.from('projects').insert(payload);
      setSaving(false);
      if (err) {
        toast({ title: 'Create failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Project published ✓' });
      resetForm();
      setTab('manage');
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: 'Deleted' });
    setDeleteTarget(null);
  };

  return (
    <PanelShell
      title="Projects"
      tab={tab}
      setTab={(t) => {
        setTab(t);
        if (t === 'new' && !editingId) resetForm();
      }}
      newLabel={editingId ? 'Edit Project' : 'New'}
    >
      <TabsContent value="manage" className="mt-4">
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : rows.length === 0 ? (
          <EmptyState message="No projects yet" />
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <Card key={row.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold truncate">{row.title}</h3>
                      {row.category && <Badge variant="secondary">{row.category}</Badge>}
                      {row.status && (
                        <Badge variant={row.status === 'published' ? 'default' : 'outline'}>
                          {row.status}
                        </Badge>
                      )}
                      {row.year && <Badge variant="outline">{row.year}</Badge>}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Created {formatDate(row.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit →
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget({ table: 'projects', id: row.id, label: row.title })}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="new" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Project' : 'New Project'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the details for this project.' : 'Add a new project to your portfolio.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="p-title">Title</Label>
                <Input
                  id="p-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="p-category">Category</Label>
                  <Input
                    id="p-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                  >
                    <SelectTrigger id="p-status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p-year">Year</Label>
                  <Input
                    id="p-year"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-description">Description</Label>
                <Textarea
                  id="p-description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <ImageUrlField
                value={form.image_url}
                onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
              />
              <div className="space-y-2">
                <Label htmlFor="p-link">Link URL</Label>
                <Input
                  id="p-link"
                  value={form.link_url}
                  onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Save Changes' : 'Publish'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setTab('manage');
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        label={deleteTarget?.label}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </PanelShell>
  );
}

// ============================================================================
// ARTWORKS PANEL
// ============================================================================

function ArtworksPanel({ toast }: { toast: ToastFn }) {
  const [tab, setTab] = useState<'manage' | 'new'>('manage');
  const [rows, setRows] = useState<ArtworkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyArtworkForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setRows((data as ArtworkRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (row: ArtworkRow) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? '',
      series: row.series ?? '',
      image_url: row.image_url ?? '',
      description: row.description ?? '',
      price: row.price != null ? String(row.price) : '',
      sold: row.sold ? 'true' : 'false',
      published: row.published === false ? 'false' : 'true',
    });
    setTab('new');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyArtworkForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      series: form.series || null,
      image_url: form.image_url || null,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      sold: form.sold === 'true',
      published: form.published === 'true',
    };

    if (editingId) {
      const { error: err } = await supabase.from('artworks').update(payload).eq('id', editingId);
      setSaving(false);
      if (err) {
        toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Updated successfully ✓' });
      resetForm();
      setTab('manage');
      load();
    } else {
      const { error: err } = await supabase.from('artworks').insert(payload);
      setSaving(false);
      if (err) {
        toast({ title: 'Create failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Artwork posted ✓' });
      resetForm();
      setTab('manage');
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await supabase.from('artworks').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: 'Deleted' });
    setDeleteTarget(null);
  };

  return (
    <PanelShell
      title="Artworks"
      tab={tab}
      setTab={(t) => {
        setTab(t);
        if (t === 'new' && !editingId) resetForm();
      }}
      newLabel={editingId ? 'Edit Artwork' : 'New'}
    >
      <TabsContent value="manage" className="mt-4">
        {loading ? (
          <GridSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : rows.length === 0 ? (
          <EmptyState message="No artworks yet" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((row) => (
              <Card key={row.id} className="overflow-hidden">
                <div className="aspect-square w-full bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden">
                  {row.image_url ? (
                    <img src={row.image_url} alt={row.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  )}
                </div>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold truncate">{row.title}</h3>
                    <Badge variant={row.sold ? 'destructive' : 'default'}>
                      {row.sold ? 'Sold' : 'Available'}
                    </Badge>
                  </div>
                  {row.series && <Badge variant="secondary">{row.series}</Badge>}
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget({ table: 'artworks', id: row.id, label: row.title })}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="new" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Artwork' : 'Post Artwork'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="a-title">Title</Label>
                <Input
                  id="a-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="a-series">Series</Label>
                  <Input
                    id="a-series"
                    value={form.series}
                    onChange={(e) => setForm((f) => ({ ...f, series: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-price">Price</Label>
                  <Input
                    id="a-price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-description">Description</Label>
                <Textarea
                  id="a-description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <ImageUrlField
                value={form.image_url}
                onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="a-sold">Sold</Label>
                  <Select value={form.sold} onValueChange={(v) => setForm((f) => ({ ...f, sold: v }))}>
                    <SelectTrigger id="a-sold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Available</SelectItem>
                      <SelectItem value="true">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="a-published">Published</Label>
                  <Select
                    value={form.published}
                    onValueChange={(v) => setForm((f) => ({ ...f, published: v }))}
                  >
                    <SelectTrigger id="a-published">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Published</SelectItem>
                      <SelectItem value="false">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Save Changes' : 'Post Artwork'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setTab('manage');
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        label={deleteTarget?.label}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </PanelShell>
  );
}

// ============================================================================
// BLOG POSTS PANEL
// ============================================================================

function BlogPostsPanel({ toast }: { toast: ToastFn }) {
  const [tab, setTab] = useState<'manage' | 'new'>('manage');
  const [rows, setRows] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyBlogForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setRows((data as BlogPostRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (row: BlogPostRow) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? '',
      category: row.category ?? '',
      status: row.status ?? 'draft',
      read_time: row.read_time ?? '',
      excerpt: row.excerpt ?? '',
      content: row.content ?? '',
      image_url: row.image_url ?? '',
    });
    setTab('new');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyBlogForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category || null,
      status: form.status || null,
      read_time: form.read_time || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      image_url: form.image_url || null,
    };

    if (editingId) {
      const { error: err } = await supabase.from('blog_posts').update(payload).eq('id', editingId);
      setSaving(false);
      if (err) {
        toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Updated successfully ✓' });
      resetForm();
      setTab('manage');
      load();
    } else {
      const { error: err } = await supabase.from('blog_posts').insert(payload);
      setSaving(false);
      if (err) {
        toast({ title: 'Create failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Post published ✓' });
      resetForm();
      setTab('manage');
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await supabase.from('blog_posts').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: 'Deleted' });
    setDeleteTarget(null);
  };

  return (
    <PanelShell
      title="Blog Posts"
      tab={tab}
      setTab={(t) => {
        setTab(t);
        if (t === 'new' && !editingId) resetForm();
      }}
      newLabel={editingId ? 'Edit Post' : 'New'}
    >
      <TabsContent value="manage" className="mt-4">
        {loading ? (
          <ListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : rows.length === 0 ? (
          <EmptyState message="No blog posts yet" />
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <Card key={row.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold truncate">{row.title}</h3>
                      {row.category && <Badge variant="secondary">{row.category}</Badge>}
                      {row.status && (
                        <Badge variant={row.status === 'published' ? 'default' : 'outline'}>
                          {row.status}
                        </Badge>
                      )}
                      {row.read_time && <Badge variant="outline">{row.read_time}</Badge>}
                    </div>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Created {formatDate(row.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit →
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget({ table: 'blog_posts', id: row.id, label: row.title })}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="new" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Blog Post' : 'New Blog Post'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="b-title">Title</Label>
                <Input
                  id="b-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="b-category">Category</Label>
                  <Input
                    id="b-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                  >
                    <SelectTrigger id="b-status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="b-read-time">Read Time</Label>
                  <Input
                    id="b-read-time"
                    placeholder="5 min read"
                    value={form.read_time}
                    onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-excerpt">Excerpt</Label>
                <Textarea
                  id="b-excerpt"
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="b-content">Content</Label>
                <Textarea
                  id="b-content"
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </div>
              <ImageUrlField
                value={form.image_url}
                onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
              />
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Save Changes' : 'Post'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setTab('manage');
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        label={deleteTarget?.label}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </PanelShell>
  );
}

// ============================================================================
// PRODUCTS PANEL
// ============================================================================

function ProductsPanel({ toast }: { toast: ToastFn }) {
  const [tab, setTab] = useState<'manage' | 'new'>('manage');
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyProductForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setRows((data as ProductRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setForm({
      name: row.name ?? '',
      price: row.price != null ? String(row.price) : '',
      category: row.category ?? '',
      badge: row.badge ?? '',
      description: row.description ?? '',
      image_url: row.image_url ?? '',
    });
    setTab('new');
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProductForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      price: form.price ? Number(form.price) : null,
      category: form.category || null,
      badge: form.badge || null,
      description: form.description || null,
      image_url: form.image_url || null,
    };

    if (editingId) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editingId);
      setSaving(false);
      if (err) {
        toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Updated successfully ✓' });
      resetForm();
      setTab('manage');
      load();
    } else {
      const { error: err } = await supabase.from('products').insert(payload);
      setSaving(false);
      if (err) {
        toast({ title: 'Create failed', description: err.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Product added ✓' });
      resetForm();
      setTab('manage');
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: err } = await supabase.from('products').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast({ title: 'Deleted' });
    setDeleteTarget(null);
  };

  return (
    <PanelShell
      title="Products"
      tab={tab}
      setTab={(t) => {
        setTab(t);
        if (t === 'new' && !editingId) resetForm();
      }}
      newLabel={editingId ? 'Edit Product' : 'New'}
    >
      <TabsContent value="manage" className="mt-4">
        {loading ? (
          <GridSkeleton count={8} cols={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : rows.length === 0 ? (
          <EmptyState message="No products yet" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rows.map((row) => (
              <Card key={row.id} className="overflow-hidden">
                <div className="aspect-square w-full bg-[hsl(var(--muted))] flex items-center justify-center overflow-hidden">
                  {row.image_url ? (
                    <img src={row.image_url} alt={row.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  )}
                </div>
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-semibold truncate">{row.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">
                      {row.price != null ? `$${row.price}` : '—'}
                    </span>
                    {row.category && <Badge variant="secondary">{row.category}</Badge>}
                    {row.badge && <Badge variant="outline">{row.badge}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteTarget({ table: 'products', id: row.id, label: row.name })}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="new" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Product' : 'Add Product'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pr-name">Name</Label>
                <Input
                  id="pr-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pr-price">Price</Label>
                  <Input
                    id="pr-price"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pr-category">Category</Label>
                  <Input
                    id="pr-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pr-badge">Badge</Label>
                  <Input
                    id="pr-badge"
                    placeholder="New, Bestseller…"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pr-description">Description</Label>
                <Textarea
                  id="pr-description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <ImageUrlField
                value={form.image_url}
                onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
              />
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Save Changes' : 'Add Product'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    resetForm();
                    setTab('manage');
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <DeleteConfirmDialog
        open={!!deleteTarget}
        label={deleteTarget?.label}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </PanelShell>
  );
}

// ============================================================================
// INQUIRIES PANEL (read-only + status actions)
// ============================================================================

function InquiriesPanel({
  toast,
  onCountChange,
}: {
  toast: ToastFn;
  onCountChange: (n: number) => void;
}) {
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      const list = (data as InquiryRow[]) || [];
      setRows(list);
      onCountChange(list.filter((r) => r.status === 'unread' || !r.status).length);
    }
    setLoading(false);
  }, [onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: 'read' | 'archived') => {
    setUpdatingId(id);
    const { error: err } = await supabase.from('inquiries').update({ status }).eq('id', id);
    setUpdatingId(null);
    if (err) {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
      return;
    }
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r));
      onCountChange(next.filter((r) => r.status === 'unread' || !r.status).length);
      return next;
    });
    toast({ title: status === 'read' ? 'Marked as read' : 'Archived' });
  };

  const statusVariant = (status: string | null) => {
    if (status === 'read') return 'secondary' as const;
    if (status === 'archived') return 'outline' as const;
    return 'default' as const;
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold">Inquiries</h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Messages submitted through your contact and inquiry forms.
        </p>
      </div>

      {loading ? (
        <ListSkeleton count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 ? (
        <EmptyState message="No inquiries yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium whitespace-nowrap">{row.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.inquiry_type || '—'}</TableCell>
                  <TableCell className="max-w-xs">{truncate(row.message, 80)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{row.status || 'unread'}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(row.created_at)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === row.id || row.status === 'read'}
                        onClick={() => updateStatus(row.id, 'read')}
                      >
                        Mark as Read
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={updatingId === row.id || row.status === 'archived'}
                        onClick={() => updateStatus(row.id, 'archived')}
                      >
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SHARED PANEL SHELL (tabs wrapper)
// ============================================================================

function PanelShell({
  title,
  tab,
  setTab,
  newLabel,
  children,
}: {
  title: string;
  tab: 'manage' | 'new';
  setTab: (t: 'manage' | 'new') => void;
  newLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'manage' | 'new')}>
        <TabsList>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="new">{newLabel}</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}

// ============================================================================
// SHARED DELETE CONFIRM DIALOG
// ============================================================================

function DeleteConfirmDialog({
  open,
  label,
  deleting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  label?: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label || 'this entry'}?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={deleting}>
            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default StudioPage;
