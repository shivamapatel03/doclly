import React, { useState, useMemo } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { FolderSidebar } from '../components/workspace/FolderSidebar';
import { DocumentTable } from '../components/workspace/DocumentTable';
import { UploadZone } from '../components/tools/UploadZone';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { DocumentStorage } from '../lib/storage';
import { DocItem, FolderItem } from '../types/document';
import { Search, Upload, FolderPlus } from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const [documents, setDocuments] = useState<DocItem[]>(() => DocumentStorage.getDocuments());
  const [folders, setFolders] = useState<FolderItem[]>(() => DocumentStorage.getFolders());
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const toast = useToast();

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Trash filter
      if (selectedFolderId === 'trash') {
        if (!doc.isTrash) return false;
      } else {
        if (doc.isTrash) return false;
      }

      // Folder filter
      if (selectedFolderId === 'favorites') {
        if (!doc.isFavorite) return false;
      } else if (selectedFolderId !== 'all' && selectedFolderId !== 'trash') {
        if (doc.folderId !== selectedFolderId) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return doc.name.toLowerCase().includes(q);
      }

      return true;
    });
  }, [documents, selectedFolderId, searchQuery]);

  const totalDocsCount = documents.filter((d) => !d.isTrash).length;
  const favoritesCount = documents.filter((d) => d.isFavorite && !d.isTrash).length;
  const trashCount = documents.filter((d) => d.isTrash).length;

  const handleToggleFavorite = (id: string) => {
    const updated = DocumentStorage.toggleFavorite(id);
    setDocuments(updated);
  };

  const handleMoveToTrash = (id: string) => {
    const updated = DocumentStorage.moveToTrash(id);
    setDocuments(updated);
    toast.info('Document moved to trash.');
  };

  const handleRestore = (id: string) => {
    const updated = DocumentStorage.restoreFromTrash(id);
    setDocuments(updated);
    toast.success('Document restored.');
  };

  const handlePermanentDelete = (id: string) => {
    const updated = DocumentStorage.deletePermanently(id);
    setDocuments(updated);
    toast.info('Document permanently deleted.');
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const updated = DocumentStorage.createFolder(newFolderName.trim());
    setFolders(updated);
    setNewFolderName('');
    setIsCreateFolderOpen(false);
    toast.success('Folder created successfully.');
  };

  const handleUploadFiles = (files: File[]) => {
    files.forEach((file) => {
      DocumentStorage.saveDocument({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        folderId: selectedFolderId === 'trash' || selectedFolderId === 'favorites' ? 'all' : selectedFolderId,
      });
    });
    setDocuments(DocumentStorage.getDocuments());
    setIsUploadOpen(false);
    toast.success(`Uploaded ${files.length} document(s) to workspace.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHead
        title="Document Workspace — Doclly"
        description="Organize, manage, search, and run operations on your documents in one clean workspace."
      />

      <Breadcrumb items={[{ label: 'Workspace' }]} />

      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Document Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Manage recent files, folders, favorites, and quick actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FolderPlus className="w-4 h-4" />}
            onClick={() => setIsCreateFolderOpen(true)}
          >
            New Folder
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setIsUploadOpen(true)}
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <FolderSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onCreateFolder={() => setIsCreateFolderOpen(true)}
          totalDocsCount={totalDocsCount}
          favoritesCount={favoritesCount}
          trashCount={trashCount}
        />

        {/* Right Content Pane */}
        <main className="flex-1 w-full space-y-4">
          {/* Search bar & info */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspace files..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
              />
            </div>

            <span className="text-xs text-[#6B7280]">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Documents Table */}
          <DocumentTable
            documents={filteredDocuments}
            onToggleFavorite={handleToggleFavorite}
            onMoveToTrash={handleMoveToTrash}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            isTrashView={selectedFolderId === 'trash'}
          />
        </main>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload to Workspace"
        description="Select files to store and organize in your session."
      >
        <UploadZone onFilesSelected={handleUploadFiles} />
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        title="Create New Folder"
        description="Organize your documents by project or department."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-1">Folder Name</label>
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Legal Contracts 2026"
              className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#111111]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateFolderOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
