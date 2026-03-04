import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { createCampaign, getCampaignComments, createCampaignComment } from '@/app/actions/campaigns';
import toast from 'react-hot-toast';

interface CampaignComment {
  id: number;
  user_email: string;
  content: string;
  created_at: string;
}

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  // If editing/viewing an existing campaign
  campaignId?: number;
  campaignName?: string;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSuccess, campaignId, campaignName }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'comments'>('info');

  // Form State
  const [formData, setFormData] = useState({
    name: campaignName || '',
    advertiser: '',
    budget: '',
    roas: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comments State
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (campaignId && isOpen && activeTab === 'comments') {
      const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const data = await getCampaignComments(campaignId);
          setComments(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [campaignId, isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const formDataToSubmit = new FormData(form);
      formDataToSubmit.set('budget', formData.budget);
      formDataToSubmit.set('roas', formData.roas);

      await createCampaign(formDataToSubmit);

      onSuccess();
      onClose();
      setFormData({ name: '', advertiser: '', budget: '', roas: '' });
      toast.success('새 캠페인이 추가되었습니다.');
    } catch (error: unknown) {
      console.error('Error creating campaign:', error);
      toast.error(`캠페인 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !campaignId) return;
    try {
      const posted = await createCampaignComment(campaignId, newComment);
      setComments([...comments, posted]);
      setNewComment('');
      toast.success("Comment posted");
    } catch (e) {
      toast.error("Failed to post comment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 border dark:border-white/10 p-0 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {campaignId ? (campaignName || 'Campaign Details') : '새 캠페인 추가'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs (Only if editing an existing campaign) */}
        {campaignId && (
          <div className="flex px-6 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'comments' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <MessageSquare size={16} /> Comments
              {comments.length > 0 && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">{comments.length}</span>}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'info' ? (
            // --- CREATE / EDIT FORM ---
            <form onSubmit={campaignId ? (e) => e.preventDefault() : handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">캠페인명</label>
                <input
                  id="name" name="name" type="text" required disabled={!!campaignId}
                  className="rounded-lg border border-gray-200 dark:border-white/20 bg-transparent dark:text-white px-3 py-2 text-sm focus:border-blue-500 disabled:opacity-50"
                  placeholder="e.g. 2024 S/S Promotion"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {!campaignId && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="advertiser" className="text-sm font-medium text-gray-700 dark:text-gray-300">광고주</label>
                    <input
                      id="advertiser" name="advertiser" type="text" required
                      className="rounded-lg border border-gray-200 dark:border-white/20 bg-transparent dark:text-white px-3 py-2 text-sm focus:border-blue-500"
                      value={formData.advertiser}
                      onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="budget" className="text-sm font-medium text-gray-700 dark:text-gray-300">예산 (KRW)</label>
                      <input
                        id="budget" name="budget" type="number" required
                        className="rounded-lg border border-gray-200 dark:border-white/20 bg-transparent dark:text-white px-3 py-2 text-sm focus:border-blue-500"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="roas" className="text-sm font-medium text-gray-700 dark:text-gray-300">Target ROAS</label>
                      <input
                        id="roas" name="roas" type="number" step="0.1" required
                        className="rounded-lg border border-gray-200 dark:border-white/20 bg-transparent dark:text-white px-3 py-2 text-sm focus:border-blue-500"
                        value={formData.roas}
                        onChange={(e) => setFormData({ ...formData, roas: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
              {!campaignId && (
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold">취소</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 rounded-lg bg-blue-500 text-white py-2.5 text-sm font-semibold">
                    {isSubmitting ? '추가 중...' : '캠페인 추가'}
                  </button>
                </div>
              )}
            </form>
          ) : (
            // --- COMMENTS THREAD ---
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {isLoadingComments ? (
                  <div className="text-center text-gray-500 text-sm py-4">Loading threads...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">No comments yet. Start the discussion!</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-lg text-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-xs">{comment.user_email}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
              {/* Add Comment Input */}
              <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full rounded-xl border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-colors resize-none pr-12"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePostComment();
                    }
                  }}
                />
                <button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="absolute bottom-7 right-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
