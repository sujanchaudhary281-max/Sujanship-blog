import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import api from '../lib/api';
import '../lib/hljs-setup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiLock, FiArrowLeft, FiEdit2, FiTrash2, FiStar, FiLogOut,
  FiPlus, FiSearch, FiX, FiChevronLeft, FiChevronRight,
  FiTag, FiFileText, FiAlertTriangle, FiHome, FiUpload
} from 'react-icons/fi';

/* ─────────────────────── Custom Modal ─────────────────────── */
const Modal = ({ open, onClose, title, children, danger = false }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          {danger && (
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <FiAlertTriangle size={16} className="text-red-500" />
            </div>
          )}
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────── Sidebar Nav ─────────────────────── */
const NAV_ITEMS = [
  { id: 'posts', label: 'Posts', icon: FiFileText },
  { id: 'categories', label: 'Categories', icon: FiTag },
];

/* ─────────────────────── Main Component ─────────────────────── */
const CreatePost = () => {
  const navigate = useNavigate();

  /* ── Auth ── */
  const [auth, setAuth] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  /* ── UI State ── */
  const [activeTab, setActiveTab] = useState('posts');

  /* ── Post Form ── */
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const quillRef = useRef();

  /* ── Posts List ── */
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [totalPosts, setTotalPosts] = useState(0);

  /* ── Categories ── */
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  /* ── Delete Confirm Modal ── */
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, label: '' });

  /* ── Logout Confirm Modal ── */
  const [logoutModal, setLogoutModal] = useState(false);

  /* ── Add Category Delete Modal ── */
  const [deleteCatModal, setDeleteCatModal] = useState({ open: false, id: null, name: '' });

  /* ─────── Auth check ─────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user-info');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed.email === 'mrsujan321@gmail.com') {
        setAuth(true);
        setUserInfo(parsed);
      }
    } catch (err) {
      console.error('Error parsing user-info:', err);
    }
  }, []);

  /* ─────── Fetch categories ─────── */
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await api.get(`/api/categories?t=${Date.now()}`);
      setCategories(res.data?.data ?? []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setCatLoading(false);
    }
  }, []);

  /* ─────── Fetch posts ─────── */
  const fetchPosts = useCallback(async (page = 1) => {
    setLoadingPosts(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (filterCategory !== 'all') params.category = filterCategory;
      if (filterFeatured === 'featured') params.featured = 'true';
      const res = await api.get('/admin/posts', { params });
      setPosts(res.data?.data ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotalPosts(res.data?.total ?? 0);
      setCurrentPage(res.data?.page ?? 1);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }, [search, filterCategory, filterFeatured]);

  useEffect(() => {
    if (auth) {
      fetchCategories();
      fetchPosts(1);
    }
  }, [auth]);

  /* re-fetch when filters change (debounced for search) */
  useEffect(() => {
    if (!auth) return;
    const t = setTimeout(() => fetchPosts(1), 350);
    return () => clearTimeout(t);
  }, [search, filterCategory, filterFeatured, auth]);

  /* ─────── Cover image upload handler ─────── */
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(res.data.url);
      toast.success('Cover image uploaded!');
    } catch (err) {
      console.error('Cover upload failed:', err);
      toast.error(err.response?.data?.message || 'Cover image upload failed.');
    } finally {
      setCoverUploading(false);
    }
  };

  /* ─────── Quill image handler ─────── */
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageUrl = response.data.url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (err) {
        console.error('Image upload failed:', err);
        toast.error(err.response?.data?.message || 'Image upload failed.');
      }
    };
  };

  const modules = useMemo(() => ({
    syntax: true,
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'code-block'],
        [{ align: [] }],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'code-block', 'align',
  ];

  /* ─────── Form helpers ─────── */
  const resetForm = () => {
    setTitle(''); setImage(''); setContent('');
    setCategory(''); setFeatured(false); setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category.trim()) {
      toast.error('Title, content, and category are required.');
      return;
    }
    try {
      if (editingId) {
        const res = await api.put(`/post/${editingId}`, { title, image, content, category, featured });
        if (res.status === 200) { toast.success('Post updated!'); resetForm(); fetchPosts(currentPage); }
        else toast.error('Error updating post.');
      } else {
        const res = await api.post('/create_post', { title, image, content, category, featured });
        if (res.status === 201) { toast.success('Post created!'); resetForm(); fetchPosts(1); }
        else toast.error('Error creating post.');
      }
    } catch (err) {
      console.error('Cannot save:', err);
      toast.error(editingId ? 'Failed to update post.' : 'Failed to create post.');
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setTitle(post.title || '');
    setImage(post.image || '');
    setContent(post.content || '');
    setCategory(post.category || '');
    setFeatured(!!post.featured);
    setActiveTab('posts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─────── Delete post ─────── */
  const confirmDelete = (post) => setDeleteModal({ open: true, id: post._id, label: post.title });
  const handleDelete = async () => {
    const { id } = deleteModal;
    setDeleteModal({ open: false, id: null, label: '' });
    try {
      await api.delete(`/post/${id}`);
      toast.success('Post deleted!');
      if (editingId === id) resetForm();
      fetchPosts(currentPage);
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('Failed to delete post.');
    }
  };

  /* ─────── Toggle featured ─────── */
  const handleToggleFeatured = async (post) => {
    try {
      const res = await api.patch(`/post/${post._id}/featured`);
      toast.success(res.data.featured ? '⭐ Post featured!' : 'Post unfeatured.');
      setPosts(prev => prev.map(p => p._id === post._id ? { ...p, featured: res.data.featured } : p));
    } catch (err) {
      console.error('Toggle featured failed:', err);
      toast.error('Failed to toggle featured.');
    }
  };

  /* ─────── Category actions ─────── */
  const handleAddCategory = async () => {
    if (!newCatName.trim()) { toast.error('Category name is required.'); return; }
    setCatSubmitting(true);
    try {
      await api.post('/api/categories', { name: newCatName.trim() });
      toast.success('Category added!');
      setNewCatName('');
      setShowAddCatModal(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add category.';
      toast.error(msg);
    } finally {
      setCatSubmitting(false);
    }
  };

  const confirmDeleteCat = (cat) => setDeleteCatModal({ open: true, id: cat._id, name: cat.name });
  const handleDeleteCategory = async () => {
    const { id } = deleteCatModal;
    setDeleteCatModal({ open: false, id: null, name: '' });
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success('Category deleted!');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  /* ─────── Logout ─────── */
  const handleLogout = () => {
    localStorage.removeItem('user-info');
    toast.success('Logged out successfully.');
    navigate('/');
  };

  /* ─────── Pagination ─────── */
  const goToPage = (p) => { if (p >= 1 && p <= totalPages) fetchPosts(p); };

  const renderPaginationButtons = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  /* ═══════════════════════════════════════
     ACCESS DENIED SCREEN
  ═══════════════════════════════════════ */
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#E53935]/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#FFC107]/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md w-full text-center animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl
                          bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/60
                          shadow-lg shadow-rose-100/50 mb-6">
            <FiLock size={32} className="text-[#E53935]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Access Denied</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            This panel is restricted to authorized administrators only.
            Please sign in with an approved account to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full
                         bg-gradient-to-r from-[#FFC107] to-[#E53935] text-white font-semibold text-sm
                         hover:shadow-xl hover:shadow-[#E53935]/25 hover:-translate-y-0.5
                         transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full
                         border border-slate-200 text-slate-600 font-semibold text-sm
                         hover:border-[#FFC107]/40 hover:text-[#212121]
                         hover:-translate-y-0.5 transition-all duration-200"
            >
              <FiArrowLeft size={14} /> Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     ADMIN PANEL
  ═══════════════════════════════════════ */
  const categoryNames = categories.map(c => c.name);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold text-slate-900">
              Sujan<span style={{ background: 'linear-gradient(135deg,#FFC107,#E53935)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ship</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${activeTab === item.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
              >
                <item.icon size={14} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right: user + logout */}
          <div className="flex items-center gap-2.5">
            {userInfo?.image && (
              <img src={userInfo.image} alt="avatar" className="w-7 h-7 rounded-full border border-slate-200" />
            )}
            <span className="hidden md:block text-sm text-slate-500 font-medium truncate max-w-[120px]">
              {userInfo?.name}
            </span>
            <button
              onClick={() => setLogoutModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                         border border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600
                         hover:bg-red-50 transition-all duration-150"
            >
              <FiLogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                         border border-slate-200 text-slate-600 hover:border-slate-400
                         transition-all duration-150"
            >
              <FiHome size={14} />
              <span className="hidden sm:inline">Site</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* ══════════════ POSTS TAB ══════════════ */}
        {activeTab === 'posts' && (
          <div className="space-y-6">

            {/* ── Create / Edit Form ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <span className="text-lg">✍️</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {editingId ? 'Edit Post' : 'Create New Post'}
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                  {editingId ? 'Editing' : 'New'}
                </span>
              </div>

              {/* Title */}
              <div className="mb-5">
                <label className="block text-slate-700 font-semibold text-sm mb-2">Title</label>
                <input
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400
                             focus:ring-1 focus:ring-slate-400 bg-slate-50 focus:bg-white text-slate-800 text-sm transition-all"
                  placeholder="Enter the post title"
                />
              </div>

              {/* Cover Image */}
              <div className="mb-5">
                <label className="block text-slate-700 font-semibold text-sm mb-2">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="text" value={image} onChange={e => setImage(e.target.value)}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400
                               focus:ring-1 focus:ring-slate-400 bg-slate-50 focus:bg-white text-slate-800 text-sm transition-all"
                    placeholder="Paste image URL or upload →"
                  />
                  <label
                    className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap cursor-pointer transition-all
                      ${coverUploading
                        ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    <FiUpload size={14} />
                    {coverUploading ? 'Uploading…' : 'Upload'}
                    <input
                      type="file" accept="image/*" className="hidden"
                      disabled={coverUploading}
                      onChange={handleCoverUpload}
                    />
                  </label>
                </div>
                {image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 h-40 relative group">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => setImage('')}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-300 transition-all"
                      title="Remove cover image"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mb-5">
                <label className="block text-slate-700 font-semibold text-sm mb-2">Content</label>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <ReactQuill
                    ref={quillRef} theme="snow" value={content} onChange={setContent}
                    formats={formats} modules={modules}
                    placeholder="Write something amazing..."
                    className="border-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-slate-700 font-semibold text-sm">Category</label>
                  <button
                    type="button"
                    onClick={() => { setNewCatName(''); setShowAddCatModal(true); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold
                               border border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <FiPlus size={12} /> Add Category
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {categoryNames.length > 0 ? categoryNames.map(cat => (
                    <button
                      key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150
                        ${category === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                    >
                      {cat}
                    </button>
                  )) : (
                    <span className="text-xs text-slate-400 italic">No categories yet — type below or add in Categories tab.</span>
                  )}
                </div>
                <input
                  type="text" value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400
                             focus:ring-1 focus:ring-slate-400 bg-slate-50 focus:bg-white text-slate-800 text-sm transition-all"
                  placeholder="Or type a custom category"
                />
              </div>

              {/* Featured toggle */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFeatured(f => !f)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-150
                    ${featured
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}
                >
                  <FiStar size={14} className={featured ? 'fill-amber-400 text-amber-400' : ''} />
                  {featured ? 'Featured' : 'Mark as Featured'}
                </button>
                <span className="text-xs text-slate-400">Featured posts are highlighted on the site.</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  id="create-post-submit"
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white
                             bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800
                             shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  {editingId ? 'Update Post' : 'Publish Article'}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm
                               hover:border-slate-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* ── Manage Posts ── */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Manage Posts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{totalPosts} {totalPosts === 1 ? 'post' : 'posts'} total</p>
                </div>
              </div>

              {/* Search + Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search posts by title…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50
                               focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400
                               text-slate-700 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      <FiX size={13} />
                    </button>
                  )}
                </div>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50
                             focus:outline-none focus:border-slate-400 text-slate-700 cursor-pointer transition-all"
                >
                  <option value="all">All Categories</option>
                  {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Featured filter */}
                <select
                  value={filterFeatured}
                  onChange={e => setFilterFeatured(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50
                             focus:outline-none focus:border-slate-400 text-slate-700 cursor-pointer transition-all"
                >
                  <option value="all">All Posts</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>

              {/* Posts List */}
              {loadingPosts ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl skeleton" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-slate-500 text-sm">No posts found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {posts.map(p => (
                    <div key={p._id} className="flex items-center gap-4 py-4 group">
                      {/* Thumbnail */}
                      <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                        {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                          {p.featured && (
                            <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                              <FiStar size={9} className="fill-amber-400" /> Featured
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                          {p.category}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5 shrink-0">
                        {/* Featured toggle */}
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          title={p.featured ? 'Unfeature' : 'Feature'}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-150
                            ${p.featured
                              ? 'border-amber-300 bg-amber-50 text-amber-500 hover:bg-amber-100'
                              : 'border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                        >
                          <FiStar size={13} className={p.featured ? 'fill-amber-400' : ''} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => startEdit(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                                     border border-slate-200 text-slate-600 hover:border-slate-400
                                     transition-colors duration-150"
                        >
                          <FiEdit2 size={12} /> Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => confirmDelete(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                                     border border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50
                                     transition-colors duration-150"
                        >
                          <FiTrash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-slate-100">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center
                               text-slate-500 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft size={15} />
                  </button>

                  {currentPage > 3 && (
                    <>
                      <button onClick={() => goToPage(1)} className="w-8 h-8 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-slate-400 transition-all">1</button>
                      {currentPage > 4 && <span className="text-slate-400 text-sm">…</span>}
                    </>
                  )}

                  {renderPaginationButtons().map(p => (
                    <button
                      key={p} onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-lg border text-sm font-semibold transition-all
                        ${p === currentPage
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-slate-400 text-sm">…</span>}
                      <button onClick={() => goToPage(totalPages)} className="w-8 h-8 rounded-lg border border-slate-200 text-sm text-slate-600 hover:border-slate-400 transition-all">{totalPages}</button>
                    </>
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center
                               text-slate-500 hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronRight size={15} />
                  </button>

                  <span className="text-xs text-slate-400 ml-2">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ CATEGORIES TAB ══════════════ */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Categories</h2>
                <p className="text-xs text-slate-400 mt-0.5">{categories.length} {categories.length === 1 ? 'category' : 'categories'}</p>
              </div>
              <button
                onClick={() => { setNewCatName(''); setShowAddCatModal(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white
                           bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800
                           shadow-sm hover:shadow-md transition-all duration-200"
              >
                <FiPlus size={14} /> Add Category
              </button>
            </div>

            {catLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
              </div>
            ) : categories.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">🏷️</div>
                <p className="text-slate-500 text-sm">No categories yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <div key={cat._id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <FiTag size={13} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => confirmDeleteCat(cat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                                 border border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50
                                 transition-colors duration-150"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Delete Post Confirm */}
      <Modal open={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null, label: '' })} title="Delete Post" danger>
        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleteModal.label}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setDeleteModal({ open: false, id: null, label: '' })}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Delete Category Confirm */}
      <Modal open={deleteCatModal.open} onClose={() => setDeleteCatModal({ open: false, id: null, name: '' })} title="Delete Category" danger>
        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Are you sure you want to delete the <span className="font-semibold text-slate-800">"{deleteCatModal.name}"</span> category? Posts in this category will not be deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteCategory}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setDeleteCatModal({ open: false, id: null, name: '' })}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Add Category */}
      <Modal open={showAddCatModal} onClose={() => setShowAddCatModal(false)} title="Add New Category">
        <p className="text-slate-500 text-sm mb-4">Enter a name for the new category.</p>
        <input
          type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
          autoFocus
          className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400
                     focus:ring-1 focus:ring-slate-400 bg-slate-50 focus:bg-white text-slate-800 text-sm mb-4 transition-all"
          placeholder="e.g. React, DevOps, AI…"
        />
        <div className="flex gap-3">
          <button
            onClick={handleAddCategory}
            disabled={catSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700
                       text-white text-sm font-semibold disabled:opacity-60 transition-all"
          >
            {catSubmitting ? 'Adding…' : 'Add Category'}
          </button>
          <button
            onClick={() => setShowAddCatModal(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Logout Confirm */}
      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} title="Sign Out" danger>
        <p className="text-slate-600 text-sm mb-5 leading-relaxed">
          Are you sure you want to sign out of the admin panel?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Yes, Sign Out
          </button>
          <button
            onClick={() => setLogoutModal(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default CreatePost;
