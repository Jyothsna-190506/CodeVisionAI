import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Project } from '../../types';
import {
  FolderKanban,
  Search,
  Plus,
  Star,
  Copy,
  Trash2,
  FileCode,
  Clock,
  X,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLang, setNewLang] = useState('python');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjectList = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/projects', {
        params: {
          search: search || undefined,
          language: languageFilter || undefined,
          isFavorite: onlyFavorites ? 'true' : undefined,
        },
      });
      if (res.data.success) {
        setProjects(res.data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectList();
  }, [search, languageFilter, onlyFavorites]);

  const handleToggleFavorite = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    try {
      const res = await apiClient.put(`/projects/${project._id}`, {
        isFavorite: !project.isFavorite,
      });
      if (res.data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === project._id ? { ...p, isFavorite: !p.isFavorite } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update favorite', err);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await apiClient.post(`/projects/${id}/duplicate`);
      if (res.data.success) {
        fetchProjectList();
      }
    } catch (err) {
      console.error('Duplicate failed', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this project and all its analyses?')) return;
    try {
      const res = await apiClient.delete(`/projects/${id}`);
      if (res.data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const starterCode =
        newLang === 'python'
          ? `# ${newName}\ndef solve(data):\n    return sum(data)\n\nprint(solve([1, 2, 3, 4]))\n`
          : newLang === 'cpp'
          ? `// ${newName}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello CodeVision" << endl;\n    return 0;\n}\n`
          : `// ${newName}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello CodeVision");\n    }\n}\n`;

      const res = await apiClient.post('/projects', {
        name: newName,
        description: newDesc,
        language: newLang,
        code: starterCode,
        tags: tagsArray,
      });

      if (res.data.success) {
        setIsCreateModalOpen(false);
        setNewName('');
        setNewDesc('');
        setNewTags('');
        navigate(`/editor/${res.data.project._id}`);
      }
    } catch (err) {
      console.error('Create project failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-charcoal flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-terracotta" />
            <span>Projects</span>
          </h1>
          <p className="text-xs text-secondary-text mt-1 font-medium">
            Manage your persistent codebases, analysis history, and optimization records.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl border border-border-pearl bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta shadow-sm"
          >
            <option value="">All Languages</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>

          {/* Favorites toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-800 shadow-sm'
                : 'bg-pearl border-border-pearl text-secondary-text hover:text-charcoal'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-terracotta">
          <div className="w-8 h-8 border-3 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-secondary-text font-bold">Loading projects from database...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-12 rounded-3xl border border-border-pearl bg-white text-center shadow-sm">
          <FileCode className="w-12 h-12 text-secondary-text mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-black text-charcoal">No Projects Found</h3>
          <p className="text-xs text-secondary-text max-w-sm mx-auto mt-1 mb-6">
            Get started by creating a new project or importing existing algorithms to begin analysis.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/editor/${project._id}`)}
              className="p-6 rounded-3xl border border-border-pearl hover:border-terracotta/40 bg-white transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-card text-[10px] uppercase font-mono text-charcoal border border-border-pearl font-bold">
                      {project.language}
                    </span>
                    {project.tags?.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full text-[9px] bg-pearl text-secondary-text font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => handleToggleFavorite(e, project)}
                    className="text-secondary-text hover:text-amber-500 transition-colors p-1"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        project.isFavorite ? 'fill-amber-500 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-base font-black text-charcoal group-hover:text-terracotta transition-colors truncate">
                  {project.name}
                </h3>
                <p className="text-xs text-secondary-text line-clamp-2 mt-1 min-h-[32px] font-normal leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border-pearl">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-secondary-text font-semibold">
                    <span>Quality:</span>
                    <span
                      className={`font-black font-mono ${
                        (project.qualityScore || 85) >= 80 ? 'text-lime-700' : 'text-orange-warm'
                      }`}
                    >
                      {project.qualityScore ? `${project.qualityScore}/100` : 'Not evaluated'}
                    </span>
                  </div>
                  <div className="text-[11px] text-terracotta font-black font-mono">
                    {project.bugCount || 0} bugs
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-secondary-text flex items-center gap-1 font-mono font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDuplicate(e, project._id)}
                      title="Duplicate"
                      className="p-1.5 rounded-lg text-secondary-text hover:text-charcoal hover:bg-secondary-card transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project._id)}
                      title="Delete"
                      className="p-1.5 rounded-lg text-secondary-text hover:text-terracotta hover:bg-secondary-card transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-border-pearl rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute right-5 top-5 text-secondary-text hover:text-charcoal cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-charcoal mb-1">Create New Project</h2>
            <p className="text-xs text-secondary-text mb-6">Initialize a persistent codebase workspace in MongoDB.</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Binary Search Tree / Pathfinding Solver"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Programming Language</label>
                <select
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal font-bold focus:outline-none focus:border-terracotta shadow-sm"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="csharp">C#</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Description (Optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  placeholder="Short description of algorithmic structure"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta resize-none shadow-sm font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="dsa, recursion, sorting"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#D5CEBF] text-xs text-charcoal placeholder-secondary-text focus:outline-none focus:border-terracotta shadow-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-pearl">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-secondary-card hover:bg-border-pearl text-xs font-bold text-charcoal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newName.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-terracotta hover:bg-orange-warm text-white text-xs font-bold shadow-md shadow-terracotta/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Open'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
